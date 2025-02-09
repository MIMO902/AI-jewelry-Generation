import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";

const watermark = async (req, res) => {
  try {

      const inputImage = "./public/img/th.jpg";
      const watermarkPath = "./public/img/img4.jpg"; // Ensure this file exists
      const outputPath = `./public/img/watermarked_${Date.now()}.jpg`;

      const imageBuffer = await sharp(inputImage).toFormat("png").toBuffer();
      // Read and process the watermark
      const watermark = await sharp(watermarkPath)
          .resize(50) // Adjust watermark size
          .png()
          .toBuffer();
    
    
      console.log("ana hna yaba")
      // Add watermark to the uploaded image
      await sharp(imageBuffer)
          .composite([{ input: watermark, gravity: "southeast" }]) // Position watermark
          .toFile(outputPath);

      res.json({ message: "Watermark added!", image: `/uploads/${path.basename(outputPath)}` });
  } catch (error) {
      res.status(500).json({ error: "Failed to process image", details: error.message });
  }
};

export {
  watermark,
};