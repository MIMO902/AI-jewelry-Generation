import { Router } from 'express';
import UserController from "../controllers/user.controller.js";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import multer from 'multer';

const upload = multer({ dest: "uploads/" });
const router = Router();


router.post("/predict", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileStream = fs.createReadStream(req.file.path);
        const response = await axios.post("http://127.0.0.2:8000/predict/", 
            fileStream, 
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        fs.unlinkSync(req.file.path);  // Delete temp file after upload

        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to process image" });
    }
});

router.get('/', (req, res) => {
    res.render('pages/Login', { errors: [], user: req.session.user || "" });
});

router.get('/Signup', (req, res) => {
    res.render('pages/Signup', { errors: [], user: req.session.user || "" });
});

router.get('/Signout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.post('/login-action', UserController.login.bind(UserController));
router.post('/signup-action', UserController.validation, UserController.signup.bind(UserController));
router.post('/checkUN', UserController.checkUN.bind(UserController));
router.post('/checkEmail', UserController.checkEmail.bind(UserController));

export default router;
