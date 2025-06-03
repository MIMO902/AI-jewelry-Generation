import { Router } from 'express';
import { spawn } from 'child_process';
import { exec } from "child_process";
import {
  generate,
  saveddesigns,
  delete_saved_design,
  test_authentication,
  editImage,
} from "../controllers/generated_img.controller.js";
import {save_image} from "../controllers/imageSave.controller.js"
import image from "../models/image.model.js";
import fs from "fs";
import path from "path";

import { generateDepthMap } from "../controllers/3d.controller.js";


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


// router.post("/generate-depth", generateDepthMap);

router.post("/generate-mesh", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const uploaded = req.files.image;
    const timestamp = Date.now();
    const inputPath = `uploads/${timestamp}_input.png`;
    const depthPath = `public/depth/${timestamp}_depth.png`;
    const meshPath = `public/models/${timestamp}_mesh.obj`;

    // Save uploaded image
    await uploaded.mv(inputPath);

    // Run Python script using spawn
    const python = spawn('python', [
      'services/image_to_mesh.py',
      inputPath,
      depthPath,
      meshPath,
    ], {
      stdio: 'inherit' // Shows live Python output in your server logs
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Python exited with code ${code}`);
        return res.status(500).json({ success: false, error: "Mesh generation failed." });
      }

      return res.json({ success: true, meshFile: `/models/${timestamp}_mesh.obj` });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});



router.post('/save_image/:id', save_image);
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


router.get('/SavedImages', saveddesigns);
router.post('/del_saved_design/:id', delete_saved_design);
router.post('/generate', generate);
router.get('/auth', test_authentication);

export default router;
