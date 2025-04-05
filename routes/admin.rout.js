import { Router } from 'express';
import User from '../models/user.model.js';
import {
  getalluser,
  makeAdmin,
  viewimages,
  deleteimg,
  viewsaved
}from '../controllers/admin.controller.js'
const router = Router();

router.use((req, res, next) => {
  if (req.session.user !== undefined && req.session.user.type === 'admin') {
      next();
  }
  else {
      res.render('pages/err', { err: 'You are not an Admin',user: (req.session.user === undefined ? "" : req.session.user) })
  }
});

router.get('/', getalluser);
router.get('/delimg/:id',deleteimg);
// router.get('/editprop/:id',getprop)
router.get('/deleteuser/:id', (req, res, next) => {
  console.log(req.params.id)
  User.findByIdAndDelete(req.params.id)
    .then(result => {
      res.redirect('/admin/viewusers');
    })
    .catch(err => {
      console.log(err);
    });
});

// router.get('/adding', function (req, res, next) {
//   console.log('index.js: GET /');
//   res.render('pages/addpropirty', {errors:[], user: (req.session.user === undefined ? "" : req.session.user) });
// });

router.get('/viewusers', function (req, res, next) {
  const query={"type":'user'};
  User.find(query).then(result => {
    console.log(result);
    res.render('pages/AdminUsers', { Users: result, user: (req.session.user === undefined ? "" : req.session.user) });
  });
});

router.get('/viewadmins', (req, res) => {
  const query={"type":'admin'};
  User.find(query).then(result=>{
    console.log(result);
    res.render('pages/admins',{ admins : result ,user: (req.session.user === undefined ? "" : req.session.user) })
  })
});


router.post("/makeadmin/:id", makeAdmin);
router.post('/makeuser/:id',(req,res,next)=>{
  User.findByIdAndUpdate(req.params.id, { type: 'user' })
      .then(result => {
          res.redirect('/admin/viewadmins');
      })
      .catch(err => {
          console.log(err);
      });
})
// router.post('/addpropirty', addprop);
// router.post('/editproperty/:id',edit)
router.get('/images',viewimages);
router.get('/viewsaved',viewsaved)


export default router;
