import { Router } from 'express';

const router = Router();

router.get('/Home', function (req, res, next) {
  console.log('index.js: GET /');
  res.render('pages/Home',{ user: (req.session.user === undefined ? "" : req.session.user)});
});

export default router;