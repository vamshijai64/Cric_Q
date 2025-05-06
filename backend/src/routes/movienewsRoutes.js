const express = require('express');
const router = express.Router();
const movienewsController = require('../controllers/movienewsController');
// const upload=require('../middlewares/uploadMiddleware')



router.post('/addmovienews',movienewsController.addMovieNews);

router.get('/:id',movienewsController.getMovieNewsById);
router.get('/latest', movienewsController.getLatestMovieNews);
router.put('/update/:id',movienewsController.updateMovieNewsById);
router.get('/',movienewsController.getMovieNews);

module.exports = router;


