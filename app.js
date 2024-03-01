const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const engineMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundsRoutes = require('./routes/camp')
const reviewsRoutes = require('./routes/review')
const usersRoutes = require('./routes/users')

const { isLoggedIn } = require('./middleware');

mongoose.connect('mongodb://localhost:27017/camp-insight')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"))
db.once("open", () => {
    console.log("Database Connected");
})

const app = express();

app.engine('ejs', engineMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'))

const sessionConfig = {
    name: 'session',
    secret:'thisisprivatetilltheend',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', usersRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/support', (req, res) => {
    res.render('sections/support');
});

app.get('/spark', isLoggedIn, (req, res) => {
    res.render('sections/spark');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong' } = err;
    res.status(statusCode).render('error', { err }); });

app.listen(3000, () => {
    console.log(`Server listening. Pages:\n - http://localhost:${3000}`);
});
