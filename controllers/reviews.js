const Property = require('../property');
const Review = require('../reviews');


module.exports.createReview = async (req, res) => {
    const property = await Property.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    property.reviews.push(review)
    await review.save()
    await property.save()
    req.flash('success', 'created a new review')
    res.redirect(`/property/${property._id}`)

}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Property.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'successfully deleted a review')
    res.redirect(`/property/${id}`);
}