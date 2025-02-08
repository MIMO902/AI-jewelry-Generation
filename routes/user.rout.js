import { Router } from 'express';
import {
  watermark,
} from "../controllers/generated_img.controller.js";

const router = Router();

router.get('/Home', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/Home',{ user: (req.session.user === undefined ? "" : req.session.user)});
});

router.post('/watermark',watermark);

export default router;