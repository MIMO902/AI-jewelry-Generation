import { Router } from 'express';
import {
  generate,
  save_image,
  saveddesigns,
  delete_saved_design,
} from "../controllers/generated_img.controller.js";
import image from '../models/image.model.js'
import save_design from '../models/saved_design.model.js'

const router = Router();

router.post('/save_image/:id',save_image);
router.get('/Home', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/Home',{ title:"Home",generated_images: null,user: (req.session.user === undefined ? "" : req.session.user)});
});

router.get('/SavedImages/:id', saveddesigns);
router.get('/Signout', function (req, res, next) {
  console.log('index.js: GET /');
  console.log(req.session.user)
  req.session.destroy();
  res.redirect('/')
});
router.post('/del_saved_design/:id',delete_saved_design)
router.post('/generate',generate);

export default router;