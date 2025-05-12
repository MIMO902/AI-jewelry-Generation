import { Router } from 'express';
import express from 'express'
import { spawn } from 'child_process';
import {
  generate,
  save_image,
  saveddesigns,
  delete_saved_design,
  test_authentication,
  editImage,
} from "../controllers/generated_img.controller.js";
import image from "../models/image.model.js";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import formidable from 'formidable';

ffmpeg.setFfmpegPath("C:/Users/youssef/Downloads/ffmpeg-7.1-essentials_build/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe");


const router = Router();

router.post("/transcribe", async (req, res) => {
  try {
    console.log("🔔 Received transcription request");

    if (!req.files || !req.files.audio) {
      console.log("⚠️ No audio file uploaded");
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioFile = req.files.audio;
    const uploadPath = `./uploads/${Date.now()}_${audioFile.name}`;
    
    // Save file
    await audioFile.mv(uploadPath);
    console.log("✅ Audio saved at:", uploadPath);

    const pythonScript = 'services/transcribe.py';
    console.log("🐍 Running Python script:", pythonScript);

    const pythonProcess = spawn('python', [pythonScript, uploadPath]);

    let transcription = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      console.log("📥 Python output:", data.toString());
      transcription += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error("❌ Python error:", data.toString());
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      console.log("🧾 Python process exited with code:", code);

      // Cleanup
      fs.unlink(uploadPath, () => {
        console.log("🧹 Deleted temp file:", uploadPath);
      });

      if (code === 0 && transcription.trim() !== "") {
        console.log("✅ Transcription success:", transcription.trim());
        res.json({ transcript: transcription.trim() });
      } else {
        console.error("❌ Transcription failed. Output:", transcription, "Error:", errorOutput);
        res.status(500).json({ transcript: "", error: "No text transcribed", debug: errorOutput });
      }
    });

  } catch (err) {
    console.error("💥 Server error during transcription:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




router.post('/save_image/:id', save_image);
router.get('/Home', function (req, res) {
  console.log('🟢 Rendering Home Page...');
  res.render('pages/Home', {
    title: "Home",
    generated_images: null,
    user: req.session.user || ""
  });
});
router.get("/inpainted-home", async (req, res) => {
  const imageId = req.session.newImageId;
  req.session.newImageId = null;

  if (!imageId) {
    return res.render("pages/home", {
      title: "home - edited",
      generated_images: [],
      user: req.session.user === undefined ? "" : req.session.user,
    });
  }

  try {
    const images =[]
    images.push(await image.findById(imageId));
    console.log(images[0])
    res.render("pages/home", {
      title: "home - edited",
      generated_images: images,
      user: req.session.user === undefined ? "" : req.session.user,
    });
  } catch (err) {
    console.error("❌ Failed to load image by ID:", err);
    res.status(500).send("Image fetch error");
  }
});
router.post("/inpaint", editImage); // No multer


router.get('/SavedImages/:id', saveddesigns);
router.post('/del_saved_design/:id', delete_saved_design);
router.post('/generate', generate);
router.get('/auth', test_authentication);

export default router;
