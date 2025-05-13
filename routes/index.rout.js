import { Router } from 'express';
import UserController from "../controllers/user.controller.js";


const router = Router();


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
