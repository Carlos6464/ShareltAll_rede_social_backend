const express = require("express");
const { insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto, likePhoto, commentPhoto, searchPhotos, disLikePhoto } = require("../controllers/PhotoController");
const router = express.Router();

const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require("../middlewares/imageUpload");
const { photoInsertValiadtion, updatePhotoValidation, commentPhotoValidation } = require("../middlewares/photoValidation");




router.post('/', authGuard, imageUpload.single("image"), photoInsertValiadtion(), validate, insertPhoto);
router.delete('/:id', authGuard, deletePhoto);
router.get('/', authGuard, getAllPhotos);
router.get('/users/:id', authGuard, getUserPhotos);
router.get('/search', authGuard, searchPhotos);

router.get('/:id', getPhotoById);
router.put('/:id', authGuard, updatePhotoValidation(), validate, updatePhoto);
router.put('/like/:id', authGuard, likePhoto);
router.put('/dislike/:id', authGuard, disLikePhoto);
router.put('/comment/:id', authGuard, commentPhotoValidation(), validate, commentPhoto);



module.exports = router;