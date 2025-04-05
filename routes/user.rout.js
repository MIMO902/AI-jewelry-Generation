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
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import formidable from 'formidable';

ffmpeg.setFfmpegPath("C:/Users/youssef/Downloads/ffmpeg-7.1-essentials_build/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe");


const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Define the folder where files will be saved
      cb(null, 'uploads/'); // Make sure 'uploads' exists or create it
    },
    filename: (req, file, cb) => {
      // Define the filename (you can customize it here)
      cb(null, Date.now() + path.extname(file.originalname)); // Add file extension
    }
  });
  
  // Initialize multer with the storage configuration
  const upload = multer({ storage: storage });

//   router.post('/transcribe', async (req, res) => {
//     // Create a new Formidable instance (Updated for v2.x)
//     const form = new formidable.Formidable({
//       uploadDir:'../uploads',  // Directory to save the uploaded file
//       keepExtensions: true,  // Keep the file extension
//     });
  
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error("Error parsing form:", err);
//         return res.status(400).json({ error: "File upload failed." });
//       }
  
//       // Extract the file path of the uploaded audio file
//       const audioPath = files.audio[0].filepath;
//       console.log("File received at:", audioPath);
  
//       try {
//         // Run the Python script for transcription
//         const pythonScript = '../Services/transcribe.py';
//         const pythonProcess = spawn('python', [pythonScript, audioPath]);
  
//         let transcription = '';
//         let errorOutput = '';
  
//         pythonProcess.stdout.on('data', (data) => {
//           transcription += data.toString();
//         });
  
//         pythonProcess.stderr.on('data', (data) => {
//           errorOutput += data.toString();
//         });
  
//         pythonProcess.on('close', (code) => {
//           if (code === 0) {
//             res.json({ transcription: transcription.trim() });
//           } else {
//             console.error('Python error output:', errorOutput);
//             res.status(500).json({ error: 'Transcription failed.', details: errorOutput });
//           }
//         });
//       } catch (error) {
//         console.error('Error processing transcription:', error);
//         res.status(500).json({ error: 'Server error occurred.' });
//       }
//     });
//   });

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
