import axios from "axios";

const metalTypes = ["gold", "silver", "platinum", "rose gold", "white gold"];
const gemstoneTypes = [
  "diamond", "ruby", "sapphire", "emerald", "opal",
  "topaz", "amethyst", "garnet", "peridot", "tourmaline"
];
const otherTypes = ["pearl"];

// Fuzzy matches for implied gemstones
const fuzzyGemstoneMap = {
  "stone": { to: "diamond", confidence: 0.3 },
  "center stone": { to: "diamond", confidence: 0.4 },
  "large stone": { to: "diamond", confidence: 0.4 },
  "crystal": { to: "sapphire", confidence: 0.4 },
  "gem": { to: "amethyst", confidence: 0.3 },
  "gemstone": { to: "diamond", confidence: 0.5 }
};

function scoreMaterialsByIncludes(source, materialList) {
  const scoreMap = {};
  const text = source.toLowerCase();
  materialList.forEach((mat) => {
    if (text.includes(mat)) scoreMap[mat] = 1.0;
  });
  return scoreMap;
}

async function getCLIPSimilarities(text, labels) {
  try {
    const response = await axios.post("http://localhost:5005/clip-similarity", {
      text,
      labels
    });
    return response.data; // { gold: 0.84, diamond: 0.72, ... }
  } catch (err) {
    console.warn("⚠️ CLIP similarity failed, falling back to includes()");
    return null;
  }
}

export async function detectWeightedMaterials(prompt, clipCaption) {
  const materials = {
    metals: {},
    gemstones: {},
    others: {},
  };

  const allMaterials = [...metalTypes, ...gemstoneTypes, ...otherTypes];
  const clipScores = await getCLIPSimilarities(clipCaption, allMaterials);

  const promptScores = scoreMaterialsByIncludes(prompt, allMaterials);
  const fallbackClipScores = scoreMaterialsByIncludes(clipCaption, allMaterials);

  for (const mat of allMaterials) {
    const clipScore = clipScores?.[mat] ?? fallbackClipScores[mat] ?? 0;
    const promptScore = promptScores[mat] ?? 0;
    const combined = (clipScore * 0.7) + (promptScore * 0.3);
    if (combined < 0.2) continue;

    if (metalTypes.includes(mat)) {
      materials.metals[mat] = Number(combined.toFixed(2));
    } else if (gemstoneTypes.includes(mat)) {
      materials.gemstones[mat] = Number(combined.toFixed(2));
    } else if (otherTypes.includes(mat)) {
      materials.others[mat] = Number(combined.toFixed(2));
    }
  }

  // Fuzzy fallback for vague terms
  const combinedText = `${prompt} ${clipCaption}`.toLowerCase();
  for (const [term, { to, confidence }] of Object.entries(fuzzyGemstoneMap)) {
    if (confidence >= 0.2 && combinedText.includes(term) && !materials.gemstones[to]) {
      materials.gemstones[to] = confidence;
    }
  }

  if (Object.keys(materials.metals).length === 0) {
    materials.metals["silver"] = 0.3;
  }

  return materials;
}
