import path from "path";
import fs from "fs";
import { spawn } from "child_process";

export const generateDepthMap = (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ success: false, message: "No image uploaded" });
  }

  const img = req.files.image;
  const tempPath = path.join("uploads", Date.now() + "_input.png");
  const depthPath = path.join("public", "depth", Date.now() + "_depth.png");

  img.mv(tempPath, (err) => {
    if (err) {
      console.error("❌ File move error:", err);
      return res.status(500).json({ success: false, message: "Upload failed" });
    }

    const process = spawn("python", ["services/depth_estimator.py", tempPath, depthPath]);

    process.on("close", (code) => {
      fs.unlinkSync(tempPath); // clean up

      if (code === 0) {
        res.json({ success: true, depthMap: depthPath });
      } else {
        res.status(500).json({ success: false, message: "Depth estimation failed" });
      }
    });
  });
};
