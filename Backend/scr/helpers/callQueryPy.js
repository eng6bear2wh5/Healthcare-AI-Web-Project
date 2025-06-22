const path = require("path");
const { spawn } = require("child_process");

exports.callQueryPy = (command, argsList, timeout = 120000) => {
  return new Promise((resolve, reject) => {
    const pythonExecutable = "python"; // Or 'python3', or full path if needed
    const scriptPath = path.join(__dirname, "../../query.py"); // Assumes query.py is in the same root directory

    const allArgs = [scriptPath, command, ...argsList];
    console.log(`Executing: ${pythonExecutable} ${allArgs.join(" ")}`); // Enable debugging

    const pythonProcess = spawn(pythonExecutable, allArgs);

    // Set timeout
    const timeoutId = setTimeout(() => {
      pythonProcess.kill();
      reject(new Error(`Python script timeout after ${timeout}ms`));
    }, timeout);

    let stdoutData = "";
    let stderrData = "";

    pythonProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      const errStr = data.toString();
      stderrData += errStr;
      console.error(`Python STDERR: ${errStr}`); // Log Python errors immediately
    });

    pythonProcess.on("close", (code) => {
      clearTimeout(timeoutId); // Clear timeout when process completes

      console.log(`Python process closed with code: ${code}`);
      console.log(`STDOUT length: ${stdoutData.length}`);
      console.log(`STDERR length: ${stderrData.length}`);

      if (stdoutData.trim() === "" && code !== 0) {
        // No stdout, but an error code
        return reject(
          new Error(
            `Python script exited with code ${code} and no stdout. STDERR: ${stderrData.substring(0, 500)}`
          )
        );
      }

      try {
        // Log raw output for debugging
        console.log(`Raw Python STDOUT: ${stdoutData.substring(0, 200)}...`);

        // Attempt to parse stdout even if there was an error code, as query.py might output JSON errors
        const result = JSON.parse(stdoutData);

        console.log(`Parsed result keys: ${Object.keys(result).join(", ")}`);

        if (result.error && code !== 0) {
          // If Python sent a JSON error and exited with error
          return reject(
            new Error(
              `Python script error (from JSON): ${result.error}. Exit code: ${code}. STDERR: ${stderrData.substring(0, 300)}`
            )
          );
        }
        if (result.error && code === 0) {
          // Application level error but script ran successfully
          console.warn(
            `Python script reported an application error: ${result.error}`
          );
          // Depending on how you want to handle it, you might resolve or reject
          // For consistency, we'll pass it as a successful call returning an error object
        }
        if (code !== 0 && !result.error) {
          // Error code, but no JSON error from Python, means something else went wrong
          return reject(
            new Error(
              `Python script exited with code ${code}. STDOUT: ${stdoutData.substring(0, 300)}. STDERR: ${stderrData.substring(0, 300)}`
            )
          );
        }
        resolve(result);
      } catch (error) {
        console.error(
          "Failed to parse JSON from Python stdout. Raw data:",
          stdoutData
        );
        console.error("STDERR data was:", stderrData);
        reject(
          new Error(
            `Failed to parse JSON response from Python (Exit code ${code}): ${error.message}. Raw output: ${stdoutData.substring(0, 500)}. STDERR: ${stderrData.substring(0, 500)}`
          )
        );
      }
    });

    pythonProcess.on("error", (error) => {
      clearTimeout(timeoutId); // Clear timeout on error
      console.error(`Failed to start Python process: ${error.message}`);
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
};
