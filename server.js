require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('_helpers/db');
// const { authUser, authRole } = require('./basicAuth')
const ROLE = require('_middleware/admin');
const passport = require('passport')

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)
app.use(passport.initialize())

const errorHandler = require('_middleware/error-handler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/results', require('./results/results.controller'));
app.use('/processing', require('./processing/processing.controller'));


app.get('/Main', checkAuthenticated, (req, res) => {
  res.render('frontend/leket-app/src/Prediction.jsx')
})

// app.get('/Login', checkNotAuthenticated, (req, res) => {
//   res.render('Login.ejs')
// })

app.post('/Login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/Main',
  failureRedirect: '/Login',
  failureFlash: true
}))

// app.get('/admin', authUser, authRole(ROLE.admin), (req, res) => {
//     res.send('Admin Page')
//   })

//Main Page
// app.get('/main', authUser, authRole(ROLE.admin), (req, res) => {
//     res.send('Admin Page')
// })

// global error handler
app.use(errorHandler);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/Login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/Main')
  }
  next()
}


// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));