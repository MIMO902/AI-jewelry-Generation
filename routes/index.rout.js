import { Router } from 'express';
import UserController from "../controllers/user.controller.js";
import User from "../models/user.model.js";


const router = Router();


router.get('/Signout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
router.post('/login-action', UserController.login.bind(UserController));
router.post('/signup-action', UserController.validation, UserController.signup.bind(UserController));
router.post('/check-username', async (req, res) => {
  try {
    console.log("Username check request body:", req.body);
    const user = await User.findOne({ username: req.body.username });
    res.json({ exists: !!user });
  } catch (error) {
    console.error("Error in /check-username:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/check-email', async (req, res) => {
  try {
    const email = await User.findOne({ email: req.body.email });
    res.json({ exists: !!email });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
