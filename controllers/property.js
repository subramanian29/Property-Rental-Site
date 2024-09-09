
const Property = require('../property');
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
    const propertys = await Property.find({});

    console.log(propertys)
    res.render('campgrounds/index', { propertys })
}

module.exports.renderNewForm = (req, res) => {

    res.render('campgrounds/new');
}

module.exports.createProperty = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const property = new Property(req.body.property);
    property.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    property.author = req.user._id;
    await property.save();
    console.log(property)
    req.flash('success', 'successfully made a new place')
    res.redirect(`/property/${property._id}`)
}

module.exports.showProperty = async (req, res,) => {
    const property = await Property.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: "author"
            }
        })
        .populate('author')

    if (!property) {
        req.flash('error', 'cannot find requested camp')
        res.redirect('/property')
    }
    res.render('campgrounds/show', { property });
}

module.exports.renderEditForm = async (req, res) => {

    const { id } = req.params;
    const property = await Property.findById(id)
    if (!property) {
        req.flash('error', 'cannot find requested camp')
        res.redirect('/property')
    }

    res.render('campgrounds/edit', { property });
}

module.exports.updateProperty = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const property = await Property.findByIdAndUpdate(id, { ...req.body.property });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    await property.save()
    property.images.push(...imgs)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await property.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(property)
    }
    req.flash('success', 'successfully updated a place')
    res.redirect(`/property/${property._id}`)
}

module.exports.deleteProperty = async (req, res) => {

    const { id } = req.params;

    await Property.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted a camp')
    res.redirect('/property');
}