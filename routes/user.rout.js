import { Router } from 'express';
import {
  generate,
  save_image,
  saveddesigns,
  delete_saved_design,
  test_authentication,
  editImage,
} from "../controllers/generated_img.controller.js";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath("C:/Users/youssef/Downloads/ffmpeg-7.1-essentials_build/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe");

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  console.log("🟢 Received transcription request...");

  if (!req.file) {
      console.error("🔴 No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
  }

  const inputFile = req.file.path;
  const wavFile = `${inputFile}.wav`;

  console.log(`📂 Processing file: ${inputFile}`);

  try {
      await convertToWav(inputFile, wavFile);
      console.log(`✅ Converted to WAV: ${wavFile}`);

      const transcript = await transcribeAudio(wavFile);
      console.log(`📝 Transcription result: ${transcript}`);

      res.json({ transcript });

  } catch (error) {
      console.error("🔴 Server Error:", error);
      res.status(500).json({ error: `Server error: ${error.message}`, details: error.stack });
  }
});


// Convert webm to wav using ffmpeg
function convertToWav(input, output) {
    return new Promise((resolve, reject) => {
        exec(`ffmpeg -i "${input}" -acodec pcm_s16le -ar 16000 "${output}"`, (error, stdout, stderr) => {
            if (error) {
                console.error("🔴 FFmpeg Error:", error);
                console.error("⚠️ FFmpeg stderr:", stderr);
                return reject(error);
            }
            console.log("✅ FFmpeg stdout:", stdout);
            resolve();
        });
    });
}

// Transcribe using Whisper.cpp
function transcribeAudio(audioFile) {
    return new Promise((resolve, reject) => {
        const outputFile = audioFile.replace(".wav", ".txt");

        exec(`whisper.cpp/main -m whisper.cpp/models/ggml-base.en.bin -f "${audioFile}" --output_text`, (error, stdout, stderr) => {
            if (error) {
                console.error("🔴 Whisper Error:", error);
                console.error("⚠️ Whisper stderr:", stderr);
                return reject(error);
            }
            console.log("✅ Whisper stdout:", stdout);

            if (!fs.existsSync(outputFile)) {
                console.error("🔴 Error: Whisper output file not found");
                return reject(new Error("Whisper output file not found"));
            }

            const transcript = fs.readFileSync(outputFile, "utf8").trim();
            resolve(transcript);
        });
    });
}

router.post('/save_image/:id', save_image);
router.get('/Home', function (req, res) {
    console.log('🟢 Rendering Home Page...');
    res.render('pages/Home', {
        title: "Home",
        generated_images: null,
        user: req.session.user || ""
    });
});
router.post("/apply_edit", editImage);
router.get('/SavedImages/:id', saveddesigns);
router.post('/del_saved_design/:id', delete_saved_design);
router.post('/generate', generate);
router.get('/auth', test_authentication);

export default router;
