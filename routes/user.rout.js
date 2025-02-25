import { Router } from 'express';
import {
  generate,
  save_image,
  saveddesigns,
  delete_saved_design,
  test_authentication,
} from "../controllers/generated_img.controller.js";
import {audioToText} from "../controllers/audio.js"
import image from '../models/image.model.js'
import save_design from '../models/saved_design.model.js'
import multer from "multer";


const upload = multer({ dest: "uploads/" });
const router = Router();

router.post('/save_image/:id',save_image);
router.get('/Home', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/Home',{ title:"Home",generated_images: null,user: (req.session.user === undefined ? "" : req.session.user)});
});

router.get('/SavedImages/:id', saveddesigns);

router.post('/del_saved_design/:id',delete_saved_design)
router.post('/generate',generate);
router.post('/transcribe',upload.single("audio"),audioToText)
router.get('/auth',test_authentication)


export default router;