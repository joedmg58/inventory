if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const db = require('./db');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const PORT = 5000;

const initializePassport = require('./modules/passport-config');
initializePassport(passport, db.getUserByEmail, db.getUserById);

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


//Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Routes
app.get('/', checkAuthenticated, (req, res) => {
    // res.render('index.ejs', {name: req.user.name});
    res.render('home.ejs', {title: 'KA Demo Inventory - Home', name: req.user.name})
});

app.get('/inventory', checkAuthenticated, (req, res) => {
    res.render('inventory.ejs', {title: 'KA Demo Inventory - Inventory', name: req.user.name})
});

app.get('/items', checkAuthenticated, (req, res) => {
    res.render('items.ejs', {title: 'KA Demo Inventory - Items', name: req.user.name})
});

app.get('/attributes', checkAuthenticated, (req, res) => {
    res.render('attributes.ejs', {title: 'KA Demo Inventory - Attibutes', name: req.user.name})
});

app.get('/users', checkAuthenticated, (req, res) => {
    db.getUserAll( (error, users) => {
        if (error) console.log(error);
        res.render('users.ejs', {title: 'KA Demo Inventory - Users', name: req.user.name, data: users})
    } );
});

app.get('/help', checkAuthenticated, (req, res) => {
    res.render('help.ejs', {title: 'KA Demo Inventory - Help', name: req.user.name})
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }
        const dbUser = db.addUser(user);
        if (dbUser) res.redirect('/login');
    } catch (error) {
        res.redirect('/register');
    }
});

app.delete('/logout', (req, res, next) => {
    req.logOut( err => {
        if (err) return next(err);
        res.redirect('/login');
    });
})

//API Routes
app.get('/api/users', checkAuthenticated, (req, res) => {
    db.getUserAll( (error, users) => {
        if (error) return res.status(500).json({error: error});
        res.status(200).json({data: users});
    } );
});

app.post('/api/users', checkAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }
        const dbUser = db.addUser(user);
        if (dbUser) res.status(200).json({message: 'User created succesfully.', data: dbUser});
    } catch (error) {
        res.status(500).json({message: 'Error creating user.'});
    }

    res.status(200).json({data: userId});
});

//Static route
app.use(express.static(path.join(__dirname, 'public')));

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/');
    next();
}

app.listen( PORT, () => {
    console.log('KA Demo Inventory. Kirisun Americas 2023.');
    console.log(`Server listening at port ${PORT}`);
});