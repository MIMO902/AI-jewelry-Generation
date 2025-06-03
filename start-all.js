// start-all.js
import { spawn } from "child_process";
import path from "path";

function startService(name, cmd, args, cwd) {
  const proc = spawn(cmd, args, { cwd, shell: true });

  proc.stdout.on("data", data => console.log(`[${name}] ${data}`));
  proc.stderr.on("data", data => console.error(`[${name} ERROR] ${data}`));
  proc.on("exit", code => console.log(`[${name}] exited with code ${code}`));
}

// // 1. Start Stable Diffusion (WebUI)
startService("SD", "python", ["launch.py", "--api"], "D:/stable-diffusion-webui");

// // 2. Start CLIP similarity server
// startService("CLIP", "python", ["services/clip_server.py"], process.cwd());

// 3. Start your Node.js app
startService("NodeApp", "npm", ["run", "dev"], process.cwd());