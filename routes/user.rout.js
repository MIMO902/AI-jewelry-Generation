import { Router } from 'express';
import {
  generate,
  save_image,
} from "../controllers/generated_img.controller.js";

const router = Router();

router.get('/Home', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/Home',{ title:"Home",generated_images: null,user: (req.session.user === undefined ? "" : req.session.user)});
});

router.get('/SavedImages', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/SavedImages',{ user: (req.session.user === undefined ? "" : req.session.user)});
});
router.get('/Signout', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/Login',{errors:[], user: (req.session.user === undefined ? "" : req.session.user)});
});
router.post('/save_image/:id',save_image);
router.post('/generate',generate);

export default router;