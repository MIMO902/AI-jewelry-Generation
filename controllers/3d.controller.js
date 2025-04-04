// import ort from "onnxruntime-node";
// import fs from "fs";

// async function estimateDepth(imageTensor) {
//     const session = await ort.InferenceSession.create("depth_anything_v2.onnx");
//     const results = await session.run({ input: imageTensor });
//     return results.output.data;  // Adjust output key
// }

// estimateDepth