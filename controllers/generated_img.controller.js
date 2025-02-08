import sharp from "sharp";

const watermark = async (req, res) => {
  try {

      const inputImage = "../public/img/th.jpg";
      const watermarkPath = "../public/img/th.jpg"; // Ensure this file exists
      const outputPath = `../public/img/watermarked_${Date.now()}.jpg`;

      // Read and process the watermark
      const watermark = await sharp(watermarkPath)
          .resize(100) // Adjust watermark size
          .png()
          .toBuffer();

      // Add watermark to the uploaded image
      await sharp(inputImage.data)
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