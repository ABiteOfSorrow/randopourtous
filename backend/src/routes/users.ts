import express from 'express';
import UserController from '../controllers/user';

let router = express.Router();


/* GET users listing. */
router.get('/', function (req, res) {
  res.json({ result: false, error: 'Please use a correct route.' });
});

router.post('/sign-up', UserController.signup );

router.post('/sign-in', UserController.signin );

router.get('/my-data', UserController.getMyData );

router.post('/edit-profile', UserController.editProfile );

router.get('/search-people', UserController.searchPeople );

router.post('/add-friend', UserController.addFriend );

router.get('/user/:id', UserController.getUserById );

module.exports = router;
