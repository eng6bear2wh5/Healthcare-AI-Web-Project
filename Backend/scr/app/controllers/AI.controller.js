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
