import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import axios from "axios";
import fs from "fs";

const  SD_API_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img";

const generate = async (req, res) => {
  const prompt = req.body.prompt;
  console.log(prompt);
  try {
      const requestData = {
          prompt: prompt,
          negative_prompt: "blurry, distorted, low quality, unrealistic",
          sampler_name: "Euler a",
          steps: 30,  // Reduced steps to avoid OOM error
          cfg_scale: 7.5,
          width: 768,
          height: 1024,
          batch_size: 1, // Generating images sequentially to save VRAM
          restore_faces: false,
          tiling: false,
          override_settings: {
              sd_model_checkpoint: "jewelry_v10.safetensors"
          },
          enable_hr: false,
          hr_scale: 2,
          hr_upscaler: "ESRGAN_4x",
          script_args: ["<lora:j_gem_sdxl:0.8>"],
      };

      const imagePaths = [];
      for (let i = 0; i < 3; i++) {
          const response = await axios.post(SD_API_URL, requestData, {
              headers: { "Content-Type": "application/json" },
          });
          
          const imageBase64 = response.data.images[0];
          const imagePath = `./public/img/jewelry_${Date.now()}_${i + 1}.png`;
          fs.writeFileSync(imagePath, Buffer.from(imageBase64, "base64"));
          
          // Apply watermark
          const watermarkedPath = await addWatermark(imagePath);
          imagePaths.push(watermarkedPath);
      }

      res.json({ success: true, generated_images: imagePaths });
  } catch (error) {
      console.error("Error generating jewelry images:", error);
      res.status(500).json({ error: "Failed to generate images" });
  }
};

const addWatermark = async (inputImage) => {
  try {
      const watermarkPath = "./public/img/img4.jpg"; // Ensure this file exists
      const outputPath = `./public/img/watermarked_${path.basename(inputImage)}`;

      const watermark = await sharp(watermarkPath)
          .resize(200) // Adjust watermark size
          .png()
          .toBuffer();

      await sharp(inputImage)
          .composite([{ input: watermark, gravity: "southeast" }])
          .toFile(outputPath);
          
      await fs.unlinkSync(inputImagePath);

      return outputPath;
  } catch (error) {
      console.error("Failed to apply watermark:", error);
      return inputImage; // If watermarking fails, return the original image
  }
};

export {
  generate,
};