# JewelryJinn – AI Jewelry Design Platform

Graduation project (Misr International University, 2025). JewelryJinn lets users design jewelry with AI: describe a piece in text or by voice, generate it, customize it, save it, and find similar real products online.

## Features

- **Text-to-jewelry generation** – prompts are sent to a Stable Diffusion WebUI API running a jewelry-tuned checkpoint
- **Arabic and English prompts** – prompts are auto-translated to English before generation
- **Voice prompts** – speech is transcribed with Whisper
- **Prompt enhancement** – OpenAI API refines user descriptions
- **Design understanding** – CLIP generates a description of every saved design, used to match it to similar products
- **Image authenticity** – generated images are watermarked and signed with RSA (SHA-256) so the platform can verify its own designs
- **3D preview (experimental)** – depth estimation and image-to-mesh services
- **Accounts and admin** – signup/login with hashed passwords, saved designs, and an admin dashboard for users and images

## Tech stack

| Layer | Tools |
|---|---|
| Backend | Node.js, Express (MVC), EJS, MongoDB / Mongoose, Socket.io |
| AI services | Stable Diffusion WebUI API, OpenAI API (GPT-3.5), Whisper, CLIP (Python) |
| Image processing | sharp, steganography watermarking, Node `crypto` (RSA signing) |
| Admin client | React, Vite, Tailwind CSS (`/client`) |
| Mobile | Flutter UI prototype – see [mobile_jewelryJinn](https://github.com/MIMO902/mobile_jewelryJinn) |

## Project structure

```
controllers/   request handlers (users, generation, saved images, admin, audio, 3D)
models/        Mongoose models
routes/        Express routes
views/         EJS pages
Services/      Python AI services + OpenAI helper
client/        React admin dashboard
start-all.js   starts Stable Diffusion + the Node app together
```

## Running locally

```bash
npm install
# create .env with your MongoDB URI and OPENAI_API_KEY
# generate an RSA key pair (private.pem / public.pem) in the project root – see generateKeys() in controllers/generated_img.controller.js
npm run dev
```

Image generation needs a local [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) running with `--api` on port 7860.

> Key files (`*.pem`) and `.env` are git-ignored and must never be committed.

## Team

Built by a team of four for our graduation project.
**My part (Mostafa Abdelwahab):** project setup, user authentication (signup/login backend and user model), the image watermarking and RSA signing/verification feature, and saved-images pages.

Teammates: [@youssefsaleh1](https://github.com/youssefsaleh1), [@enani26](https://github.com/enani26), [@mohamed0tamer](https://github.com/mohamed0tamer)
