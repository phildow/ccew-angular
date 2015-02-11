User Authentication and Access Control
====

Using Passport ...

Download and install the express-session, passport, and passport-local modules:

```
npm install express-session --save
npm install passport --save
npm install passport-local --save
```

## The User Model

```js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
  email:        {type: String, required: true, trim: true, index: true},
  name:         {type: String, trim: true},
  password:     {type: String, required: true},
  roles:        {type: [String], required: true, default: ['user']}
});

// instance methods

schema.methods.isValidPassword = function(password) {
  //return bcrypt.compareSync(password, this.password);
  return password === this.password;
};

schema.methods.hasRole = function(role) {
  if ( this.roles.indexOf('admin') !== -1 ) {
    // admin has all access
    return true;
  } else {
    return ( this.roles.indexOf(role) !== -1 );
  }
};

// remove the password from the json output

if (!schema.options.toJSON) schema.options.toJSON = {};

schema.options.toJSON.transform = function(user) {
  var obj = user.toJSON({transform: false});
  delete obj.password;
  return obj;
};

// export

var User = mongoose.model('users', schema);
module.exports = User;
```

## Configure Passport

In the main application file require in the dependencies.

Require session dependencies:

```js
var express = require('express');
var session = require('express-session');
```

Require passport dependencies:

```js
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
```

Require user model:

```js
var User = require('./model/user');
```

First set up user serialization and deserialization. These are the functions passport will call to convert a user id associated with the session cookie into an actual user object that will be available to your routes and middleware:

```js
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
```

Set up what passport calls a strategy. Passport supports multiple types of authentication, or "stategies", such as facebook, twitter, oauth and username-password authentication. The strategy will be used when the user attempts to log into the application.

We configure passport to use one of the strategies, namely the local strategy for basic username and password authentication:

```js
passport.use(new LocalStrategy({ 
    usernameField: 'email',
    passwordField: 'password'
  }, 
  function(email, password, done) {
    User.findOne({email: email}, function(err, user) {
      if (err) {
        return done(err);
      } else if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      } else if (!user.isValidPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      } else {
        return done(null, user);
      }
    });
  }
));
```

At this point passport is configured.

Set up the express application to store session data via session middleware. Express will associate the session cookie with an in memory representation of some data, in our case, data that passport will provide. 

```js
app.use(cookieParser());

app.use(session({
  secret: 'secret code',
  resave: false,
  saveUninitialized: true
}));
```

Add the passport middleware:

```js
app.use(passport.initialize());
app.use(passport.session());
```

## Authenticating Users

We'll use passport's local authentication strategy when a user signs in. In our case we will return the user data if a user successfully signs in:

```js
router.post('/session/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    } else if (!user) {
      res.status(400).json({
        err: 400, 
        msg: 'Incorrect Username or Password'
      });
    } else {
      req.login(user, function(err) {
        if (err) { 
          return next(err); 
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
});
```

Implement logout as well

```js
router.post('/session/logout', function(req, res) {
  req.logout();
  res.json({status:200, msg: 'Logged Out'});
});
```

**req.login** and **req.logout**

The `req.login` and `req.logout` methods are provided by passport and establish the session, which uses cookies. For this to work we have to implement those serialization and deserialization methods shown above.

## Access Control

**req.user** and **req.isAuthenticated**

Once we are serializing and deserializing users the passport middleware adds the `req.user` property to all our request objects.

Passport provides the `req.isAuthenticated` method to check if a user is logged in. Typically our applications will want to provide a more granular level of accesss control, giving some logged in users access to some parts of the site and some logged in users access to other parts of the site.

The classic example is the difference between a normal user and an administrator. Both kinds of users must be logged in, but an administrator has access to admin sections whereas a normal user does not.

```js
exports.hasRole = function(role) {
  return function(req, res, next) {
    if (!req.isAuthenticated() || !req.user.hasRole(role)) {
      res.status(401).json({ err: 401, msg: 'Unauthorized' });
    } else {
      next();
    }
  };
};
```

We can now use that function as middleware in our routes. We'll insert a call to the hasRole function in between our route path and its handler, like so:

```js
router.get('/user/section', role('user'), function(req, res) {
  // ...
});

router.get('/user/admin', role('admin'), function(req, res) {
  // ...
});
```

The hasRole function returns middleware, which recall is any function that has the following signature and either issues a response such as `res.json()` or calls `next()`:

```
function(req, res, next) {
  // respond: res.status().json()
  // pass: next()
}
```

Our hasRole middle users the passport method `req.isAuthenticated` to check if the user is logged in and then checks the role required for this route against's the roles set for this user in the database.

If the user is not logged in or is not allowed in this part of the page our middleware returns the 401 Unauthorized HTTP status code. Otherwise it calls `next()`, which passes control to the route handler.

