import { spawn } from 'child_process';
import path from 'path';

exports.transcribeAudio = (req, res) => {
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

    const pythonProcess = spawn('python', [
        path.join(__dirname, '..', 'services', 'transcribe.py'),
        filePath
    ]);

    let result = '';
    pythonProcess.stdout.on('data', data => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', data => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', code => {
        if (code === 0) {
            res.json({ transcript: result });
        } else {
            res.status(500).send('Error transcribing audio');
        }
    });
};
