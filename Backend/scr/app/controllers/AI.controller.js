const { spawn } = require("child_process");
const fs = require("fs");
const { callQueryPy } = require("../../helpers/callQueryPy");
const userModel = require("../models/user");
const userInfoModel = require("../models/UserInfo");
const metricModel = require("../models/HealthMetric");
const medicalHistoryModel = require("../models/MedicalHistory");

exports.predictDisease = (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, error: "No file" });

  const python = spawn("python", ["predict.py", req.file.path]);
  let result = "";
  python.stdout.on("data", (data) => (result += data.toString()));
  python.stderr.on("data", (data) =>
    console.error("Python error:", data.toString())
  );
  python.on("close", (code) => {
    fs.unlinkSync(req.file.path); // dọn file
    if (code !== 0)
      return res.status(500).json({ success: false, error: "Predict error" });
    try {
      res.json(JSON.parse(result));
    } catch {
      res.status(500).json({ success: false, error: "Parse error" });
    }
  });
};

exports.askToChatbot = async (req, res) => {
  const currentUsername = req.user.name;
  try {
    const { question } = req.body;
    if (!question) {
      console.warn(`${new Date().toISOString()} - WARN - /ask: No question provided by ${currentUsername}`);
      return res.status(400).json({ error: "No question provided" });
    }

    console.log(`${new Date().toISOString()} - INFO - /ask: User ${currentUsername} asked: "${String(req.body.question).substring(0, 50)}..."`);

    const scriptArgs = [
      '--question', req.body.question,
      '--user', currentUsername
    ];

    const resultFromPython = await callQueryPy('ask', scriptArgs);
    res.json(resultFromPython);

  } catch (error) {
    console.error(`${new Date().toISOString()} - ERROR - /ask endpoint error for user ${currentUsername}: ${error.message}`, error.stack);
    res.status(500).json({ error: error.message || "An error occurred while processing your question." });
  }
};

exports.uploadToChatbot = async (req, res) => {
  const currentUsername = req.user.name; // Make sure client sends userId in FormData

  const imageFile = req.file; // Uploaded file data (path is in imageFile.path)
  const textQuestion = req.body.question || ''; // Optional text question from FormData

  let tempImagePath = null;
  try {
    const scriptArgs = ['--user', currentUsername];

    if (imageFile) {
      tempImagePath = imageFile.path;
      scriptArgs.push('--image_path', tempImagePath);
      console.log(`${new Date().toISOString()} - INFO - /upload: User ${currentUsername} uploaded image '${tempImagePath}'.`);
    } else {
      console.log(`${new Date().toISOString()} - INFO - /upload: No image file uploaded by ${currentUsername}. Processing text question if any.`);
    }

    if (textQuestion) {
      scriptArgs.push('--question', textQuestion);
      // Ensure the console log here reflects the new currentUsername
      console.log(`${new Date().toISOString()} - INFO - /upload: User ${currentUsername} with text question: "${String(textQuestion).substring(0, 50)}..."`);
    }

    if (!imageFile && !textQuestion) {
      return res.status(400).json({ error: "No image file provided and no text question." });
    }

    const resultFromPython = await callQueryPy('upload', scriptArgs);
    res.json(resultFromPython);

  } catch (error) {
    console.error(`${new Date().toISOString()} - ERROR - /upload endpoint error for user ${currentUsername}: ${error.message}`, error.stack);
    res.status(500).json({ error: error.message || "An error occurred while processing your upload." });
  } finally {
    if (tempImagePath) {
      fs.unlink(tempImagePath, err => {
        if (err) console.error(`Failed to delete temp image ${tempImagePath}:`, err);
      });
    }
  }
}

exports.convertFileToText = async (req, res) => {
  // 1. Kiểm tra file upload
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded.' });
  }

  // 2. Gọi một tiến trình Python duy nhất
  // Script này sẽ tự làm cả OCR và trích xuất thông tin
  const py = spawn('python', ["ocr.py", req.file.path]);

  let resultString = '';
  let errorString = '';

  // 3. Lấy kết quả JSON từ stdout của Python
  py.stdout.on('data', (data) => {
    resultString += data.toString();
  });

  // Lấy log lỗi (nếu có) từ stderr của Python
  py.stderr.on('data', (data) => {
    errorString += data.toString();
  });

  // 4. Xử lý khi tiến trình Python kết thúc
  py.on('close', async (code) => {
    // Luôn xoá file tạm sau khi xử lý xong
    fs.unlinkSync(req.file.path);

    // Ghi lại log lỗi từ Python nếu có, rất hữu ích để debug
    if (errorString) {
      console.error(`Python stderr: ${errorString}`);
    }

    // Nếu tiến trình Python thoát với lỗi hoặc không có kết quả
    if (code !== 0 || !resultString) {
      console.error(`Python process exited with code ${code}.`);
      return res.status(500).json({
        success: false,
        error: 'An internal error occurred during document processing.',
        details: errorString
      });
    }

    // 5. Parse kết quả JSON và gửi về cho client
    try {
      const result = JSON.parse(resultString);

      // Kiểm tra cờ 'success' mà script Python trả về
      if (!result.success) {
        console.error('Python script reported an error:', result.error);
        return res.status(500).json({ success: false, error: result.error });
      }

      // console.log(result.extracted_data);

      await updateDataToDatabase(result.extracted_data, req.user.id);

      // Nếu mọi thứ thành công
      res.json({
        success: true,
        extracted_data: result.extracted_data,
        raw_text: result.raw_text,
      });

    } catch (e) {
      console.error('Failed to parse JSON from Python script:', e.message);
      // console.error('Raw output was:', resultString); // In ra output lỗi để debug
      res.status(500).json({ success: false, error: 'Failed to parse response from processing service.' });
    }
  });
};

const updateDataToDatabase = async (data, id) => {
  const personal_profile = data.personal_profile;

  const bodyUser = {
    name: personal_profile.full_name,
  };

  const bodyInfo = {
    sex: personal_profile.gender,
    birth_date: personal_profile.birth_date,
    blood_type: personal_profile.blood_type,
    height: personal_profile.height,
    weight: personal_profile.weight,
    diet_type: personal_profile.diet_description,
    activity_level: personal_profile.activity_level_description,
    daily_routine: personal_profile.daily_routine_description || "",
  };

  const medical_condition = data.medical_conditions;

  const bodyMedicalHistory = {
    disease_name: "",
    diagnosis_date: new Date().toISOString(), // chuyển sang chuỗi ISO
    notes: "",
    drugs: "",
  };

  medical_condition.map(mh => {
    bodyMedicalHistory.disease_name += mh.disease_name + "\n";
    bodyMedicalHistory.notes += mh.notes + "\n";
    bodyMedicalHistory.drugs += mh.drugs + "\n";
  });

  const health_metrics = data.health_metrics;

  const weekly_data = [{
    week: 1,
    bmi: health_metrics.bmi,
    blood_pressure: {
      systolic: health_metrics.blood_pressure.systolic,
      diastolic: health_metrics.blood_pressure.diastolic,
    },
    heart_rate: health_metrics.heart_rate,
    blood_glucose: health_metrics.blood_glucose,
    body_fat: health_metrics.body_fat,
    cholesterol: {
      ldl: health_metrics.cholesterol.ldl,
      hdl: health_metrics.cholesterol.hdl,
    },
    liver_enzymes: {
      sgpt: health_metrics.liver_enzymes.sgpt,
      sgot: health_metrics.liver_enzymes.sgot,
    },
    kidney_index: {
      creatinine: health_metrics.kidney_index.creatinine,
      eGFR: health_metrics.kidney_index.eGFR,
    },
  }];

  const bodyMetrics = { weekly_data };

  try {
    await userModel.findByIdAndUpdate(id, bodyUser, { new: true, upsert: true, setDefaultsOnInsert: true }).lean();
    await metricModel.findOneAndUpdate(
      { user_id: id },
      { ...bodyMetrics, user_id: id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    await userInfoModel.findOneAndUpdate(
      { user_id: id },
      { ...bodyInfo, user_id: id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    await medicalHistoryModel.findOneAndUpdate(
      { user_id: id },
      bodyMedicalHistory,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    // res.json(user);
  } catch (err) {
    console.error("Database update failed:", err);
    throw err; // hoặc trả về false để bên trên biết
  }
}
