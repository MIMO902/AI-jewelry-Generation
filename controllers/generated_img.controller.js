import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import axios from "axios";
import fs from "fs";
import image from "../models/image.model.js";
import save_design from "../models/saved_design.model.js";
import User from "../models/user.model.js";
import StegCloak from 'stegcloak';
import crypto from 'crypto';
import translate from 'google-translate-api-x';
import sizeOf from 'image-size';

// function generateKeys() {
//   const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
//       modulusLength: 2048, // Secure key length
//       publicKeyEncoding: {
//           type: "spki",
//           format: "pem",
//       },
//       privateKeyEncoding: {
//           type: "pkcs8",
//           format: "pem",
//       },
//   });

//   // Save the keys to files
//   fs.writeFileSync("private.pem", privateKey);
//   fs.writeFileSync("public.pem", publicKey);

//   console.log("✅ RSA Key Pair Generated Successfully!");
// }

//generateKeys();
function signImage(base64Image) {
  const privateKey = fs.readFileSync("./private.pem", "utf8");

  // const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const sign = crypto.createSign("SHA256");
  sign.update(Buffer.from(base64Image, "base64"));
  sign.end();

  return sign.sign(privateKey, "base64");
}

const SD_API_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img";

async function translateText(text) {
  try {
    const res = await translate(text, { to: 'en' });
    return res.text;
  } catch (error) {
    console.error("Translation error:", error.message);
    throw new Error("Translation failed");
  }
}
const generate = async (req, res) => {
  const prompt = req.body.prompt;
  const translated = await translateText(prompt)
  console.log(translated)
  console.log(prompt);
  try {
    const requestData = {
      prompt: translated,
      negative_prompt: "blurry, distorted, low quality, unrealistic",
      sampler_name: "Euler a",
      steps: 30, // Reduced steps to avoid OOM error
      cfg_scale: 7.5,
      width: 768,
      height: 1024,
      batch_size: 1, // Generating images sequentially to save VRAM
      restore_faces: false,
      tiling: false,
      override_settings: {
        sd_model_checkpoint: "jewelry_v10.safetensors",
      },
      enable_hr: false,
      hr_scale: 2,
      hr_upscaler: "ESRGAN_4x",
      script_args: ["<lora:j_gem_sdxl:0.8>"],
    };

    // const imagePaths = [];
    const images = [];
    const views = [];
    console.log(req.session.user);
    for (let i = 0; i < 1; i++) {
      const response = await axios.post(SD_API_URL, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      const imageBase64 = response.data.images[0];
      // // Apply watermark
      // const watermarkedImage = applyWatermark(imagePath);
      // const watermarkedPath = `./public/img/watermarked_${Date.now()}_${i + 1}.png`;
      // fs.writeFileSync(watermarkedPath, Buffer.from(watermarkedImage, "base64"));
      const watermarked = await addWatermark(imageBase64);
      // Generate digital signature
      const signature = await signImage(watermarked);
      // // Apply watermark
      // const watermarkedPath = await addWatermark(imagePath);
      const image = await add_image(req, signature, watermarked, prompt);
      // imagePaths.push(watermarkedPath);
      // console.log(image)
      images.push(image);
    }
    res.render("pages/home", {
      title: "home - generated",
      generated_images: images,
      user: req.session.user === undefined ? "" : req.session.user,
    });
  } catch (error) {
    console.error("Error generating jewelry images:", error);
    res.status(500).json({ error: "Failed to generate images" });
  }
};



const addWatermark = async (base64Image) => {
  try {
    let base64Data = base64Image;

    // Strip data URI if it exists
    const dataUriMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (dataUriMatch) {
      base64Data = dataUriMatch[2];
    }

    const imageBuffer = Buffer.from(base64Data, "base64");

    // Get image dimensions
    const { width, height } = await sharp(imageBuffer).metadata();
    if (!width || !height) throw new Error("Invalid image dimensions");

    // Watermark SVG (repeated, rotated text)
    const watermarkSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <style>
          .wm-text {
            fill: rgba(0, 0, 0, 0.2);
            font-size: 30px;
            font-family: Arial, sans-serif;
          }
        </style>
        <g transform="rotate(-45 ${width / 2} ${height / 2})">
          ${Array.from({ length: Math.ceil(height / 100) }, (_, y) =>
      Array.from({ length: Math.ceil(width / 200) }, (_, x) => {
        const xPos = x * 200;
        const yPos = y * 100;
        return `<text x="${xPos}" y="${yPos}" class="wm-text">JewelryJiin</text>`;
      }).join("")
    ).join("")}
        </g>
      </svg>
    `;

    // Apply watermark
    const outputBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(watermarkSvg),
          top: 0,
          left: 0,
          blend: "over",
        },
      ])
      .png()
      .toBuffer();

    // Return plain base64 string (no data URI prefix)
    return outputBuffer.toString("base64");
  } catch (err) {
    console.error("Watermarking error:", err);
    return base64Image.replace(/^data:(image\/[a-zA-Z+]+);base64,/, "");
  }
};

const add_image = async (req, sign, inputImage, Prompt) => {
  const Image = new image({
    userId: req.session.user._id,
    imageData: inputImage,
    prompt: Prompt,
    signature: sign,
    isSaved: false,
    wieght: 0,
    price: 0,
    rate: 10,
  });
  await Image.save().catch((err) => {
    console.log(err);
  });
  console.log("image added succesfully");
  return Image;
};
const save_image = async (req, res) => {
  console.log("i am in the save fun");

  if (!req.session.user) {
    return res.redirect("/");
  }


  try {
    const existingImage = await image.findOne({ _id: req.params.id });
    const exsistingsave = await save_design.findOne({
      userid: req.session.user._id,
      imageid: req.params.id,
    });

    if (!exsistingsave) {
      console.log("Sending image to CLIP for analysis...");
      console.log(existingImage.prompt)

      // Send image to CLIP inside Stable Diffusion
      const clipResponse = await axios.post("http://localhost:7860/sdapi/v1/interrogate", {
        image: existingImage.imageData,
        model: "clip", // Or "deepdanbooru" if you want tags
      });

      const description = clipResponse.data.caption || "No description available";
      console.log("CLIP result:", description);

      // Save the image with description
      const wish = new save_design({
        userid: req.session.user._id,
        imageid: req.params.id,
      });

      await wish.save();
      existingImage.description = description;
      const { totalPrice, totalWeight, breakdown } = await calculateTotalPrice(description);

      existingImage.description = JSON.stringify(breakdown);
      existingImage.wieght = totalWeight;
      existingImage.price = totalPrice;

      // (Optional) Store breakdown in another field or JSON string
      // existingImage.materialBreakdown = JSON.stringify(analysis.breakdown);

      await existingImage.save();
      console.log("Design saved with CLIP description:", description);
    }
  } catch (err) {
    console.error("Error saving image:", err);
    res.status(500).send("Internal Server Error");
  }
};

const saveddesigns = async (req, res) => {
  console.log(req.session.user);
  var query = { _id: req.params.id };
  const arr = [];
  User.find(query)
    .then((result1) => {
      save_design
        .find({ userid: req.params.id })
        .then(async (result) => {
          console.log(result);
          if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
              const saveddesign = await image.findOne({
                _id: result[i].imageid,
              });
              arr[i] = saveddesign;
              // await saveAndUnlinkImage(saveddesign.imageData,saveddesign.id)
            }
          }
          res.render("pages/savedimages", {
            saved: arr,
            user: req.session.user === undefined ? "" : req.session.user,
          });
        })
        .catch((err1) => {
          console.log(err1);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
const delete_saved_design = async (req, res) => {
  console.log("i am inside delete function");
  const now = await save_design.findOne({
    imageid: req.params.id,
    userid: req.session.user._id,
  });
  save_design
    .findByIdAndDelete(now.id)
    .then((result) => {
      res.redirect(req.session.user.type === "admin" ? "/admin/viewsaved" : "/user/Home");
    })
    .catch((err) => {
      console.log(err);
    });
};

const test_authentication = async (req, res) => {
  try {
    // Load public key for signature verification
    const publicKey = fs.readFileSync("./public.pem", "utf8");

    // Read the suspected image and convert it to base64
    const imagePath = "C:/Users/youssef/Desktop/AI-jewelry-Generation/public/img/watermarked_1740487942497_1.png";
    const suspectedBase64 = fs.readFileSync(imagePath, "base64");

    // //Initialize StegCloak
    // const stegcloak = new StegCloak(true, false);

    // // Extract the hidden watermark message
    // let extractedMessage;
    // try {
    //   extractedMessage = stegcloak.reveal(suspectedBase64, "Mimo_9021");
    //   console.log("Extracted Watermark:", extractedMessage);
    // } catch (err) {
    //   console.error("❌ Error extracting watermark:", err.message);
    //   return res.status(400).json({ success: false, message: "Failed to extract watermark" });
    // }

    // Search the database for a matching image
    const existingImage = await image.findOne({ imageData: suspectedBase64 });

    if (!existingImage) {
      console.log("❌ No matching image found in the database.");
      return res.status(404).json({ success: false, message: "Image not found in database" });
    }

    console.log("✅ Found a matching image in the database!");

    // Verify the digital signature
    const verify = crypto.createVerify("SHA256");
    verify.update(Buffer.from(suspectedBase64, "base64"));
    verify.end();

    const isValid = verify.verify(publicKey, existingImage.signature, "base64");
    if (isValid) {
      console.log("✅ Signature is valid! The image is authentic and belongs to you.");
      return res.json({ success: true, message: "Image is authentic and belongs to you" });
    } else {
      console.log("❌ Signature is invalid! The image may have been altered.");
      return res.status(400).json({ success: false, message: "Signature verification failed" });
    }
  } catch (error) {
    console.error("❌ Error during authentication:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const editImage = async (req, res) => {
  try {
    console.log("✅ /user/inpaint hit");

    // Validate uploaded files and prompt
    const imageFile = req.files?.image;
    const maskFile = req.files?.mask;
    const prompt = (req.body.prompt || "").trim();

    if (!imageFile || !maskFile || !prompt) {
      return res.status(400).json({ success: false, error: "Missing image, mask, or prompt" });
    }

    const imageBuffer = imageFile.data;
    const maskBuffer = maskFile.data;

    // Validate image dimensions
    let iw, ih, mw, mh;
    try {
      ({ width: iw, height: ih } = await sizeOf(imageBuffer));
      ({ width: mw, height: mh } = await sizeOf(maskBuffer));
    } catch (err) {
      return res.status(400).json({ success: false, error: "Invalid image or mask format" });
    }

    if (iw !== 768 || ih !== 1024 || mw !== 768 || mh !== 1024) {
      return res.status(400).json({
        success: false,
        error: `Images must be 768x1024. Got image ${iw}x${ih}, mask ${mw}x${mh}`
      });
    }

    // Build SD img2img payload
    const payload = {
      prompt: `${prompt}, jewelry, high quality, 8k`,
      negative_prompt: "blurry, low quality, deformed, text, watermark, bad anatomy",
      init_images: [`data:image/png;base64,${imageBuffer.toString("base64")}`],
      mask: `data:image/png;base64,${maskBuffer.toString("base64")}`,
      sampler_name: "Euler a",
      inpainting_mask_invert: 0,
      inpainting_fill: 1,
      steps: 30,
      cfg_scale: 7.5,
      denoising_strength: 0.9,
      width: 768,
      height: 1024,
      override_settings: {
        sd_model_checkpoint: "model.safetensors"
      }
    };

    console.log("✅ Sending request to Stable Diffusion...");

    const response = await axios.post("http://127.0.0.1:7860/sdapi/v1/img2img", payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.data?.images?.[0]) {
      throw new Error("Stable Diffusion did not return an image");
    }

    console.log("✅ Image edited successfully");

    // Post-process: watermark, sign, save
    const base64Image = response.data.images[0];
    const watermarked = await addWatermark(base64Image);
    const signature = await signImage(watermarked);
    const savedImage = await add_image(req, signature, watermarked, prompt);
    req.session.newImageId = savedImage._id;
    req.session.save(err => {
      if (err) {
        console.error("❌ Session save error:", err);
        return res.status(500).send("Session error");
      }
      res.redirect("/user/inpainted-home");
    });

  } catch (error) {
    const sdError = error?.response?.data || {};
    console.error("🔥 SD ERROR:", sdError);
    console.error("🔥 Full Error:", error.message);

    res.status(500).json({
      success: false,
      error: sdError?.error || error.message || "Inpainting failed"
    });
  }
};



const detectMaterials = (description) => {
  const materials = {
    metals: [],
    gemstones: [],
    others: [],
  };

  // Possible metals
  const metalTypes = ["gold", "silver", "platinum", "rose gold", "white gold"];
  metalTypes.forEach((metal) => {
    if (description.toLowerCase().includes(metal)) {
      materials.metals.push(metal);
    }
  });
  if (materials.metals.length === 0) {
    materials.metals.push("silver");
  }

  // Possible gemstones
  const gemstoneTypes = [
    "diamond",
    "ruby",
    "sapphire",
    "emerald",
    "opal",
    "topaz",
    "amethyst",
    "garnet",
    "peridot",
    "tourmaline",
  ];
  gemstoneTypes.forEach((gem) => {
    if (description.toLowerCase().includes(gem)) {
      materials.gemstones.push(gem);
    }
  });

  // Other materials like pearls
  if (description.toLowerCase().includes("pearl")) {
    materials.others.push("pearl");
  }

  return materials;
};
const fetchMetalPrices = async () => {
  try {
    const response = await fetch("https://api.metals.live/v1/spot");
    const data = await response.json(); // data is an array of objects

    // Extract prices from array
    const priceMap = {};
    data.forEach(item => {
      const key = Object.keys(item)[0];
      priceMap[key] = item[key];
    });

    return {
      gold: priceMap.gold ? priceMap.gold / 31.1 : 70, // Convert per ounce to per gram
      silver: priceMap.silver ? priceMap.silver / 31.1 : 1,
      platinum: priceMap.platinum ? priceMap.platinum / 31.1 : 30,
    };
  } catch (error) {
    console.error("Metal price API failed, using fallback.");
    return { gold: 70, silver: 1, platinum: 30 }; // fallback values
  }
};

const gemstonePrices = {
  diamond: 10000, // $ per carat
  ruby: 1500,
  sapphire: 1200,
  emerald: 1800,
  opal: 500,
  topaz: 300,
  amethyst: 200,
};
const estimateJewelryWeight = (description) => {
  let weight = 0;
  let type = "ring";

  if (/ring/i.test(description)) {
    type = "ring";
    weight = 3 + Math.random() * 7; // 3-10g
  } else if (/necklace|chain/i.test(description)) {
    type = "necklace";
    weight = 15 + Math.random() * 15; // 15-30g
  } else if (/bracelet/i.test(description)) {
    type = "bracelet";
    weight = 10 + Math.random() * 10; // 10-20g
  } else if (/earring/i.test(description)) {
    type = "earring";
    weight = 1 + Math.random() * 5; // 1-6g
  }

  if (/thick|chunky/i.test(description)) {
    weight *= 1.5; // Increase weight for bigger designs
  }

  return { baseWeight: Number(weight.toFixed(2)), type };
};
const estimateStoneWeight = (description) => {
  let stoneWeight = 0;
  description = description.toLowerCase();

  if (/stones?/.test(description)) stoneWeight += 1;
  if (/center stone|middle stone|centerpiece|main stone/.test(description)) stoneWeight += 2;
  if (/diamond(s)?|gemstone(s)?/.test(description)) stoneWeight += 2;
  if (/halo/.test(description)) stoneWeight += 1;
  if (/band around|encrusted/.test(description)) stoneWeight += 0.5;
  if (/pav[ée]|cluster|multi-stone|multiple stones|side stones/.test(description)) stoneWeight += 1.5;

  if (/massive|large|big/.test(description)) stoneWeight *= 1.3;
  if (/tiny|delicate|small/.test(description)) stoneWeight *= 0.7;

  const match = description.match(/(\d+)\s+(diamonds?|stones?|gemstones?)/);
  if (match) {
    const count = parseInt(match[1]);
    stoneWeight += count * 0.3;
  }

  if (stoneWeight === 0 && /diamond|stone|gem/.test(description)) {
    stoneWeight = 0.2;
  }

  return Number(stoneWeight.toFixed(2));
};

const calculateTotalPrice = async (description) => {
  const metals = await fetchMetalPrices();
  const detectedMaterials = detectMaterials(description);
  const { baseWeight, type } = estimateJewelryWeight(description);
  const stoneWeight = estimateStoneWeight(description);
  console.log(metals)
  console.log(detectedMaterials)
  console.log(baseWeight)
  console.log(type)
  console.log(stoneWeight)
  let totalPrice = 0;
  let totalWeight = baseWeight + stoneWeight; // Sum metal & stones
  const breakdown = {};

  // Metals Pricing
  detectedMaterials.metals.forEach((metal) => {
    let metalPrice = metals[metal] || 70; // Fallback price
    let metalTotal = baseWeight * metalPrice;
    breakdown[metal] = { weight: baseWeight, pricePerGram: metalPrice, total: metalTotal };
    totalPrice += metalTotal;
  });

  console.log(totalPrice)
  // Gemstones Pricing
  detectedMaterials.gemstones.forEach((gem) => {
    let gemPrice = gemstonePrices[gem] || 1000; // Default if missing
    let gemTotal = stoneWeight * gemPrice;
    breakdown[gem] = { weight: stoneWeight, pricePerCarat: gemPrice, total: gemTotal };
    totalPrice += gemTotal;
  });
  console.log(totalPrice)
  if (type == "earring") {
    totalPrice = totalPrice * 2;
  }

  return { totalPrice, totalWeight, breakdown };
};




export { generate, save_image, saveddesigns, delete_saved_design, test_authentication, editImage };
