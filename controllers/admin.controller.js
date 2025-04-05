import image from "../models/image.model.js";
import User from "../models/user.model.js";
import save_design from "../models/saved_design.model.js";
const getalluser = async (req, res, next) => {
  const images = await image.find().sort({ value: -1 }).limit(5);
  User.find().then(result => {
    res.render('pages/adminHeader', { Users: result, Image: images, user: (req.session.user === undefined ? "" : req.session.user) });
  }).catch(err => {
    console.log(err);
  });

}

const makeAdmin = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found');
      res.send('User not found');
      return;
    }

    // Update the user's role to "admin"
    user.type = 'admin';

    // Save the updated user
    await user.save();

    console.log('User is now an admin');
    res.redirect('/admin/viewusers');
  } catch (error) {
    console.log(error);
    res.send('An error occurred');
  }
};
const viewimages = async (req, res, next) => {
  image.find().then(result => {
    res.render('pages/adminUnits', { Image: result, user: (req.session.user === undefined ? "" : req.session.user) })
  })
}
const deleteimg = async (req, res, next) => {
  image.findByIdAndDelete(req.params.id)
    .then(result => {
      res.redirect('/admin/images');
    })
    .catch(err => {
      console.log(err);
    });
}
const viewsaved = async (req, res, next) => {
  try {
    const allsaved = await save_design.find();

    // Map over allsaved and fetch image and user data
    const savedWithDetails = await Promise.all(
      allsaved.map(async (s) => {
        const img = await image.findById(s.imageid);
        const user = await User.findById(s.userid);

        return {
          design: s,
          image: img,
          username: user?.username || 'Unknown User'
        };
      })
    );
    res.render('pages/savedimagesadmin', { Image: savedWithDetails, user: (req.session.user === undefined ? "" : req.session.user) })

  } catch (err) {
    console.error(err);
    next(err);
  }
};

export { getalluser, makeAdmin, viewimages, deleteimg, viewsaved }