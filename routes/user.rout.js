import { Router } from 'express';
import {
  generate,
} from "../controllers/generated_img.controller.js";

const router = Router();

router.get('/Home', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/Home',{ user: (req.session.user === undefined ? "" : req.session.user)});
});

router.get('/SavedImages', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/SavedImages',{ user: (req.session.user === undefined ? "" : req.session.user)});
});
router.get('/Signout', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/Login',{errors:[], user: (req.session.user === undefined ? "" : req.session.user)});
});

router.post('/generate',generate);

export default router;