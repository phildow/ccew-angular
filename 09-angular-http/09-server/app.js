var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

// Set up example data and routes for a blog post resource

var posts = [
  {
    _id: 0,
    author: 'Mr. T.',
    title: 'I pity the fool!',
    content: "Mr. T has the greatest hair in the world. You can't deny it, it's been proven by science, fool!"
  },
  {
    _id: 1,
    author: 'Gandolf',
    title: 'You shall not pass',
    content: "'Good Morning!' said Bilbo, and he meant it. The sun was shining, and the grass was very green. But Gandalf looked at him from under long bushy eyebrows that stuck out further than the brim of his shady hat."
  },
  {
    _id: 2,
    author: 'Nietzsche',
    title: 'The abysss',
    content: 'Whoever fights monsters should see to it that in the process he does not become a monster. And if you gaze long enough into an abyss, the abyss will gaze back into you.'
  }
];

var router = express.Router();

router.get('/api/v1/posts/search', function(req, res) {
  var text = req.query.text;
  var regex = new RegExp(text, 'i');
  var results = posts.filter(function(el) { 
    return  regex.test(el.author)  ||    
            regex.test(el.title)   ||
            regex.test(el.content) ;
  });
  res.json(results);
});

router.get('/api/v1/posts', function(req, res) {
  res.json(posts);
});

router.post('/api/v1/posts', function(req, res) {
  var postId = Math.max.apply(null, posts.map(function(el) { return el._id; })) + 1;
  req.body._id = postId;
  posts.push(req.body);
  res.json(req.body);
});

router.get('/api/v1/posts/:id', function(req, res) {
  var matches = posts.filter(function(el) { return el._id == req.params.id; });
  if (matches.length == 0) {
    res.status(404).json({err:404});
  } else {
    res.json(matches[0]);
  }
});

router.put('/api/v1/posts/:id', function(req, res) {
  var index = -1;
  for ( var i = 0; i < posts.length; i++ ) {
    if (posts[i]._id == req.params.id); {
      index = i; break;
    }
  }
  if (index == -1) {
    res.status(404).json({err:404});
  } else {
    posts[index] = req.body;
    res.json(posts[index]);
  }
});

router.delete('/api/v1/posts/:id', function(req, res) {
  var matches = posts.filter(function(el) { return el._id == req.params.id; });
  if (matches.length == 0) {
    res.status(404);
  } else {
    posts = posts.filter(function(el) { return el._id != req.params.id; });
    res.json({msg: 'Deleted'});
  }
});

app.use(router);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
