const { propertySchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Property = require('./property');
const Review = require('./reviews');

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateProperty = (req, res, next) => {
    const { error } = propertySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property.author.equals(req.user._id)) {
        req.flash('error', 'you do not own that')
        return res.redirect(`/property/${id}`)
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in')
        return res.redirect('/login')
    }
    next()

}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you do not own that')
        return res.redirect(`/property/${id}`)
    }
    next();
}