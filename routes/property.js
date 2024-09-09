const express = require('express');
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync');
const property = require('../controllers/property')
const { storage } = require('../cloudinary')


const { isLoggedIn, isAuthor, validateProperty } = require('../middleware')
const multer = require('multer')
const upload = multer({ storage })
router.route('/')
    .get(catchAsync(property.index))
    .post(isLoggedIn, upload.array('image'), validateProperty, catchAsync(property.createProperty))

router.get('/new', isLoggedIn,
    property.renderNewForm)

router.route('/:id')
    .get(catchAsync(property.showProperty))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateProperty, catchAsync(property.updateProperty))
    .delete(isLoggedIn, isAuthor, catchAsync(property.deleteProperty))



router.get('/:id/edit', isLoggedIn, isAuthor,
    catchAsync(property.renderEditForm))



module.exports = router