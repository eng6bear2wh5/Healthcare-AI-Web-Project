const path = require('path');
const { spawn } = require('child_process');

exports.callQueryPy = (command, argsList) => {
    return new Promise((resolve, reject) => {
        const pythonExecutable = 'python'; // Or 'python3', or full path if needed
        const scriptPath = path.join(__dirname, '../../query.py');// Assumes query.py is in the same root directory

        const allArgs = [scriptPath, command, ...argsList];
        // console.log(`Executing: ${pythonExecutable} ${allArgs.join(' ')}`); // For debugging

        const pythonProcess = spawn(pythonExecutable, allArgs);

        let stdoutData = '';
        let stderrData = '';

        pythonProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            const errStr = data.toString();
            stderrData += errStr;
            console.error(`Python STDERR: ${errStr}`); // Log Python errors immediately
        });

        pythonProcess.on('close', (code) => {


            if (stdoutData.trim() === '' && code !== 0) { // No stdout, but an error code
                 return reject(new Error(`Python script exited with code ${code} and no stdout. STDERR: ${stderrData.substring(0, 500)}`));
            }
            
            try {
                // Attempt to parse stdout even if there was an error code, as query.py might output JSON errors
                const result = JSON.parse(stdoutData);
                if (result.error && code !== 0) { // If Python sent a JSON error and exited with error
                    return reject(new Error(`Python script error (from JSON): ${result.error}. Exit code: ${code}. STDERR: ${stderrData.substring(0,300)}`));
                }
                if (result.error && code === 0) { // Application level error but script ran successfully
                    console.warn(`Python script reported an application error: ${result.error}`);
                    // Depending on how you want to handle it, you might resolve or reject
                    // For consistency, we'll pass it as a successful call returning an error object
                }
                 if (code !== 0 && !result.error) { // Error code, but no JSON error from Python, means something else went wrong
                    return reject(new Error(`Python script exited with code ${code}. STDOUT: ${stdoutData.substring(0,300)}. STDERR: ${stderrData.substring(0,300)}`));
                }
                resolve(result);
            } catch (error) {
                console.error("Failed to parse JSON from Python stdout. Raw data:", stdoutData);
                console.error("STDERR data was:", stderrData);
                reject(new Error(`Failed to parse JSON response from Python (Exit code ${code}): ${error.message}. Raw output: ${stdoutData.substring(0, 500)}. STDERR: ${stderrData.substring(0,500)}`));
            }
        });

        pythonProcess.on('error', (error) => {
            console.error(`Failed to start Python process: ${error.message}`);
            reject(new Error(`Failed to start Python process: ${error.message}`));
        });
    });
}