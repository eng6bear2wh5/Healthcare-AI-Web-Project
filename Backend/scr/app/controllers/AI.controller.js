<<<<<<< HEAD
const { spawn } = require("child_process");
const fs = require("fs");

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
=======
const { spawn } = require("child_process");
const fs = require("fs");
const { callQueryPy } = require("../../helpers/callQueryPy");
const user = require("../models/user");

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
      fs.unlink(tempImagePath)
        .catch(err => console.error(`Failed to delete temp image ${tempImagePath}:`, err));
    }
  }
}
>>>>>>> a03675c (add elastic remote and AI chatbot)
