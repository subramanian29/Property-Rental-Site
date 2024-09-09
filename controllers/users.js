const User = require('../user')

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'welcome to yelp camp')
            res.redirect('/property')
        })

    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/property')
    }
}

module.exports.renderlogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcomeback')
    const redirectUrl = res.locals.returnTo || '/property';
    console.log(redirectUrl)
    res.redirect(redirectUrl)

}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'goodbye')
        res.redirect('/property')
    })
}