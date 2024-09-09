if (process.env.NODE_ENV !== "productions") {
    require('dotenv').config();
}
//  mongo atlas user password - aBbJ37qTLpqZLA49
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./user')
//this is mongoatlas db 
// const dbUrl = process.env.DB_URL
//mongoose.connect(dbUrl)

const dbUrl = 'mongodb://127.0.0.1:27017/renthouse'
mongoose.connect(dbUrl);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on('error', function (e) {
    console.log('session store error', e)
})
const userRoutes = require('./routes/user')
const propertyRoutes = require('./routes/property');
const reviewRoutes = require('./routes/reviews');

const app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
const sessionConfig = {
    store,
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(flash())
app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})


app.use('/', userRoutes);
app.use("/property", propertyRoutes);
app.use("/property/:id/reviews", reviewRoutes)



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})



