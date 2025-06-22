const { spawn } = require("child_process");
const fs = require("fs");
const { callQueryPy } = require("../../helpers/callQueryPy");
const userModel = require("../models/user");
const userInfoModel = require("../models/UserInfo");
const metricModel = require("../models/HealthMetric");
const medicalHistoryModel = require("../models/MedicalHistory");
const PersonalTracker = require("../models/PersonalTracker");
const Prescription = require("../models/Prescription");

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
  const currentUserId = req.user.id;

  try {
    const { question } = req.body;
    if (!question) {
      console.warn(
        `${new Date().toISOString()} - WARN - /ask: No question provided by ${currentUsername}`
      );
      return res.status(400).json({ error: "No question provided" });
    }

    console.log(
      `${new Date().toISOString()} - INFO - /ask: User ${currentUsername} asked: "${String(req.body.question).substring(0, 50)}..."`
    );

    // Lấy thông tin cá nhân hóa của user
    let userProfileData = {};

    try {
      // 1. Lấy thông tin Personal Tracker
      const personalTrackers = await PersonalTracker.find({
        user_id: currentUserId,
      }).lean();
      if (personalTrackers && personalTrackers.length > 0) {
        userProfileData.personalTracker = personalTrackers;
        console.log(
          `${new Date().toISOString()} - INFO - /ask: Found ${personalTrackers.length} personal tracker records for user ${currentUsername}`
        );
      }

      // 2. Lấy thông tin UserInfo (cơ bản)
      const userInfo = await userInfoModel
        .findOne({ user_id: currentUserId })
        .lean();
      if (userInfo) {
        userProfileData.userInfo = userInfo;
        console.log(
          `${new Date().toISOString()} - INFO - /ask: Found user info for user ${currentUsername}`
        );
      }

      // 3. Lấy lịch sử bệnh án
      const medicalHistory = await medicalHistoryModel
        .findOne({ user_id: currentUserId })
        .lean();
      if (medicalHistory) {
        userProfileData.medicalHistory = medicalHistory;
        console.log(
          `${new Date().toISOString()} - INFO - /ask: Found medical history for user ${currentUsername}`
        );
      }

      // 4. Lấy chỉ số sức khỏe
      const healthMetrics = await metricModel
        .findOne({ user_id: currentUserId })
        .lean();
      if (healthMetrics) {
        userProfileData.healthMetrics = healthMetrics;
        console.log(
          `${new Date().toISOString()} - INFO - /ask: Found health metrics for user ${currentUsername}`
        );
      }

      // 5. Lấy đơn thuốc gần nhất
      const prescriptions = await Prescription.find({ user_id: currentUserId })
        .sort({ prescribed_date: -1 })
        .limit(3)
        .lean();
      if (prescriptions && prescriptions.length > 0) {
        userProfileData.prescriptions = prescriptions;
        console.log(
          `${new Date().toISOString()} - INFO - /ask: Found ${prescriptions.length} prescriptions for user ${currentUsername}`
        );
      }
    } catch (profileError) {
      console.warn(
        `${new Date().toISOString()} - WARN - /ask: Could not fetch complete user profile for user ${currentUsername}:`,
        profileError.message
      );
    }

    const scriptArgs = [
      "--question",
      req.body.question,
      "--user",
      currentUsername,
    ];

    // Thêm thông tin cá nhân hóa nếu có (chuyển thành JSON string)
    if (Object.keys(userProfileData).length > 0) {
      scriptArgs.push("--user_profile", JSON.stringify(userProfileData));
    }

    const resultFromPython = await callQueryPy("ask", scriptArgs);
    res.json(resultFromPython);
  } catch (error) {
    console.error(
      `${new Date().toISOString()} - ERROR - /ask endpoint error for user ${currentUsername}: ${error.message}`,
      error.stack
    );
    res
      .status(500)
      .json({
        error:
          error.message || "An error occurred while processing your question.",
      });
  }
};

exports.uploadToChatbot = async (req, res) => {
  const currentUsername = req.user.name;
  const currentUserId = req.user.id;

  const imageFile = req.file;
  const textQuestion = req.body.question || "";

  let tempImagePath = null;
  try {
    // Lấy thông tin cá nhân hóa của user
    let userProfileData = {};

    try {
      // 1. Lấy thông tin Personal Tracker
      const personalTrackers = await PersonalTracker.find({
        user_id: currentUserId,
      }).lean();
      if (personalTrackers && personalTrackers.length > 0) {
        userProfileData.personalTracker = personalTrackers;
        console.log(
          `${new Date().toISOString()} - INFO - /upload: Found ${personalTrackers.length} personal tracker records for user ${currentUsername}`
        );
      }

      // 2. Lấy thông tin UserInfo (cơ bản)
      const userInfo = await userInfoModel
        .findOne({ user_id: currentUserId })
        .lean();
      if (userInfo) {
        userProfileData.userInfo = userInfo;
        console.log(
          `${new Date().toISOString()} - INFO - /upload: Found user info for user ${currentUsername}`
        );
      }

      // 3. Lấy lịch sử bệnh án
      const medicalHistory = await medicalHistoryModel
        .findOne({ user_id: currentUserId })
        .lean();
      if (medicalHistory) {
        userProfileData.medicalHistory = medicalHistory;
        console.log(
          `${new Date().toISOString()} - INFO - /upload: Found medical history for user ${currentUsername}`
        );
      }

      // 4. Lấy chỉ số sức khỏe
      const healthMetrics = await metricModel
        .findOne({ user_id: currentUserId })
        .lean();
      if (healthMetrics) {
        userProfileData.healthMetrics = healthMetrics;
        console.log(
          `${new Date().toISOString()} - INFO - /upload: Found health metrics for user ${currentUsername}`
        );
      }

      // 5. Lấy đơn thuốc gần nhất
      const prescriptions = await Prescription.find({ user_id: currentUserId })
        .sort({ prescribed_date: -1 })
        .limit(3)
        .lean();
      if (prescriptions && prescriptions.length > 0) {
        userProfileData.prescriptions = prescriptions;
        console.log(
          `${new Date().toISOString()} - INFO - /upload: Found ${prescriptions.length} prescriptions for user ${currentUsername}`
        );
      }
    } catch (profileError) {
      console.warn(
        `${new Date().toISOString()} - WARN - /upload: Could not fetch complete user profile for user ${currentUsername}:`,
        profileError.message
      );
    }

    const scriptArgs = ["--user", currentUsername];

    if (imageFile) {
      tempImagePath = imageFile.path;
      scriptArgs.push("--image_path", tempImagePath);
      console.log(
        `${new Date().toISOString()} - INFO - /upload: User ${currentUsername} uploaded image '${tempImagePath}'.`
      );
    } else {
      console.log(
        `${new Date().toISOString()} - INFO - /upload: No image file uploaded by ${currentUsername}. Processing text question if any.`
      );
    }

    if (textQuestion) {
      scriptArgs.push("--question", textQuestion);
      console.log(
        `${new Date().toISOString()} - INFO - /upload: User ${currentUsername} with text question: "${String(textQuestion).substring(0, 50)}..."`
      );
    }

    // Thêm thông tin cá nhân hóa nếu có (chuyển thành JSON string)
    if (Object.keys(userProfileData).length > 0) {
      scriptArgs.push("--user_profile", JSON.stringify(userProfileData));
    }

    if (!imageFile && !textQuestion) {
      return res
        .status(400)
        .json({ error: "No image file provided and no text question." });
    }

    const resultFromPython = await callQueryPy("upload", scriptArgs);
    res.json(resultFromPython);
  } catch (error) {
    console.error(
      `${new Date().toISOString()} - ERROR - /upload endpoint error for user ${currentUsername}: ${error.message}`,
      error.stack
    );
    res
      .status(500)
      .json({
        error:
          error.message || "An error occurred while processing your upload.",
      });
  } finally {
    if (tempImagePath) {
      fs.unlink(tempImagePath, (err) => {
        if (err)
          console.error(`Failed to delete temp image ${tempImagePath}:`, err);
      });
    }
  }
};

exports.convertFileToText = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded." });
  }

  const py = spawn("python", ["ocr.py", req.file.path]);

  let resultString = "";
  let errorString = "";

  py.stdout.on("data", (data) => {
    resultString += data.toString();
  });

  py.stderr.on("data", (data) => {
    errorString += data.toString();
  });

  py.on("close", async (code) => {
    fs.unlinkSync(req.file.path);

    if (errorString) {
      console.error(`Python stderr: ${errorString}`);
    }

    if (code !== 0 || !resultString) {
      console.error(`Python process exited with code ${code}.`);
      return res.status(500).json({
        success: false,
        error: "An internal error occurred during document processing.",
        details: errorString,
      });
    }

    try {
      const result = JSON.parse(resultString);

      if (!result.success) {
        console.error("Python script reported an error:", result.error);
        return res.status(500).json({ success: false, error: result.error });
      }

      await updateDataToDatabase(result.extracted_data, req.user.id);

      res.json({
        success: true,
        extracted_data: result.extracted_data,
        raw_text: result.raw_text,
      });
    } catch (e) {
      console.error("Failed to parse JSON from Python script:", e.message);
      res
        .status(500)
        .json({
          success: false,
          error: "Failed to parse response from processing service.",
        });
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
    diagnosis_date: new Date().toISOString(),
    notes: "",
    drugs: "",
  };

  medical_condition.map((mh) => {
    bodyMedicalHistory.disease_name += mh.disease_name + "\n";
    bodyMedicalHistory.notes += mh.notes + "\n";
    bodyMedicalHistory.drugs += mh.drugs + "\n";
  });

  const health_metrics = data.health_metrics;

  const weekly_data = [
    {
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
    },
  ];

  const bodyMetrics = { weekly_data };

  try {
    await userModel
      .findByIdAndUpdate(id, bodyUser, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      })
      .lean();
    await metricModel
      .findOneAndUpdate(
        { user_id: id },
        { ...bodyMetrics, user_id: id },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      .lean();
    await userInfoModel
      .findOneAndUpdate(
        { user_id: id },
        { ...bodyInfo, user_id: id },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      .lean();
    await medicalHistoryModel
      .findOneAndUpdate({ user_id: id }, bodyMedicalHistory, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      })
      .lean();
  } catch (err) {
    console.error("Database update failed:", err);
    throw err;
  }
};
