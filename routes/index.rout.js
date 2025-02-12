import { Router } from 'express';
import {
  signup,
  validation,
  login,
  checkUN,
  checkEmail,
} from "../controllers/user.controller.js";

const router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/Login',{errors:[], user: (req.session.user === undefined ? "" : req.session.user)});
});
router.get('/Signup', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/Signup',{errors:[], user: (req.session.user === undefined ? "" : req.session.user)});
});


router.post('/login-action', login);
router.post('/signup-action', validation, signup);
router.post('/checkUN',checkUN);
router.post('/checkEmail', checkEmail);
export default router;