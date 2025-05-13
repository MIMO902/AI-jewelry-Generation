import axios from "axios";
import image from "../models/image.model.js";
import save_design from "../models/saved_design.model.js";
import { detectWeightedMaterials } from "../utils/materialAnalyzer.js";
import nlp from "compromise";

// Fallback gemstone prices ($/carat)
const gemstonePrices = {
  diamond: 10000, ruby: 1500, sapphire: 1200, emerald: 1800,
  opal: 500, topaz: 300, amethyst: 200
};

function detectJewelryType(text) {
    const lower = text.toLowerCase();
  
    if (lower.includes("necklace") || lower.includes("chain")) return "necklace";
    if (lower.includes("bracelet")) return "bracelet";
    if (lower.includes("earring")) return "earring";
    if (lower.includes("ring")) return "ring";
    if (lower.includes("choker")) return "necklace";
    if (lower.includes("bangle")) return "bracelet";
    if (lower.includes("stud") || lower.includes("hoop")) return "earring";
  
    return "ring";
  }
  

  const adjectiveWeights = {
    "chunky": 1.5,
    "massive": 1.4,
    "heavy": 1.3,
    "thick": 1.3,
    "solid": 1.2,
    "large": 1.2,
    "delicate": 0.8,
    "tiny": 0.75,
    "thin": 0.7,
    "light": 0.7
  };
  
  function estimateJewelryWeight(promptPlusCaption) {
    const type = detectJewelryType(promptPlusCaption);
    const doc = nlp(promptPlusCaption);
    const adjectives = doc.adjectives().out("array");
  
    let base = 5;
    switch (type) {
      case "necklace":
        base = 15 + Math.random() * 10;
        break;
      case "bracelet":
        base = 10 + Math.random() * 5;
        break;
      case "earring":
        base = 2 + Math.random() * 2;
        break;
      default: // ring
        base = 3 + Math.random() * 4;
    }
  
    // Apply weight modifiers from adjectives
    adjectives.forEach((adj) => {
      const mod = adjectiveWeights[adj.toLowerCase()];
      if (mod) base *= mod;
    });
  
    return { baseWeight: Number(base.toFixed(2)), type };
  }

function estimateStoneWeight(desc) {
  const text = desc.toLowerCase();
  let weight = 0;

  if (/stone|center|gem|halo/.test(text)) weight += 1.5;
  if (/cluster|multiple/.test(text)) weight += 1;
  if (/tiny|delicate/.test(text)) weight *= 0.7;
  if (/large|massive/.test(text)) weight *= 1.3;

  return Number((weight || 0.2).toFixed(2));
}

async function fetchMetalPrices() {
  try {
    const response = await fetch("https://api.metals.live/v1/spot");
    const data = await response.json();
    const priceMap = {};
    data.forEach(item => {
      const key = Object.keys(item)[0];
      priceMap[key] = item[key];
    });
    return {
      gold: priceMap.gold / 31.1 || 70,
      silver: priceMap.silver / 31.1 || 1,
      platinum: priceMap.platinum / 31.1 || 30
    };
  } catch (e) {
    console.warn("⚠️ Metal API failed. Using fallback.");
    return { gold: 70, silver: 1, platinum: 30 };
  }
}

async function calculateTotalPrice(prompt, clipCaption) {
  const metalPrices = await fetchMetalPrices();
  const detected = await detectWeightedMaterials(prompt, clipCaption);
  const { baseWeight, type } = estimateJewelryWeight(`${prompt} ${clipCaption}`);
  const stoneWeight = estimateStoneWeight(clipCaption);

  let totalPrice = 0;
  let totalWeight = baseWeight + stoneWeight;
  const breakdown = {};

  for (const [metal, confidence] of Object.entries(detected.metals)) {
    const pricePerGram = metalPrices[metal] || 70;
    const weight = baseWeight * confidence;
    const total = weight * pricePerGram;
    breakdown[metal] = { type: "metal", weight, pricePerGram, total, confidence };
    totalPrice += total;
  }

  for (const [gem, confidence] of Object.entries(detected.gemstones)) {
    const pricePerCarat = gemstonePrices[gem] || 1000;
    const carat = stoneWeight * confidence;
    const total = carat * pricePerCarat;
    breakdown[gem] = { type: "gemstone", weight: carat, pricePerCarat, total, confidence };
    totalPrice += total;
  }

  if (type === "earring") totalPrice *= 2;

  return { totalPrice, totalWeight, breakdown };
}

export const save_image = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect("/");

    const imageId = req.params.id;
    const img = await image.findById(imageId);
    const exists = await save_design.findOne({
      userid: req.session.user._id,
      imageid: imageId
    });

    if (exists) return res.redirect("/user/Home");

    const clipRes = await axios.post("http://localhost:7860/sdapi/v1/interrogate", {
      image: img.imageData,
      model: "clip"
    });

    const clipCaption = clipRes.data.caption || "no caption";
    const { totalPrice, totalWeight, breakdown } = await calculateTotalPrice(img.prompt, clipCaption);

    img.description = JSON.stringify(breakdown);
    img.wieght = totalWeight;
    img.price = totalPrice;
    await img.save();

    const wish = new save_design({
      userid: req.session.user._id,
      imageid: imageId,
    });
    await wish.save();

    console.log("✅ Image saved with hybrid-CLIP pricing.");
    res.redirect("/user/Home");
  } catch (err) {
    console.error("❌ Save failed:", err);
    res.status(500).send("Internal error");
  }
};
