
// import { exec } from "child_process";
// import fs from "fs";
// //import vosk from "vosk";

// const voskModelPath = "C:/Users/youssef/Desktop/vosk_model/vosk-model-en-us-0.22"; // Update the path
// const model = new vosk.Model(voskModelPath);

// function transcribeWithVosk(audioPath) {
//   return new Promise((resolve, reject) => {
//     const audio = fs.readFileSync(audioPath);
//     const recognizer = new vosk.Recognizer({ model: model, sampleRate: 16000 });

//     recognizer.acceptWaveform(audio);
//     const result = recognizer.finalResult();
//     recognizer.free();

//     resolve(JSON.parse(result).text);
//   });
// }

const audioToText = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No audio uploaded" });

  const audioPath = req.file.path;

  try {
    const transcript = await transcribeWithVosk(audioPath);
    res.json({ transcript });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  } finally {
    fs.unlinkSync(audioPath); // Clean up
  }
};

export {audioToText};