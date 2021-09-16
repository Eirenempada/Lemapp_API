var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  jwt = require('jwt-simple'),
  passport = require('passport'),
  config = require('../../config/config');

module.exports = function (app) {
  app.use('/api/users', router);
};
/*
*---------------------------------------------*
*.............Advanced functions..............*
*---------------------------------------------*
*/

/**
* Fonction de login
**/
router.post('/register', function (req, res, next){
  console.log('On entre dans la fonction');
   if (!req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Merci de fourtnir un email ou un mot de passe'});
  } else {
    console.log('C est bon, on construit l utilisateur');
    console.log('avec les infos' + JSON.stringify(req.body));
    var newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      sexe: req.body.sexe,
      dob: req.body.dob,
      email: req.body.email,
      password: req.body.password,
      category: req.body.category
    });
    console.log(JSON.stringify('Le nouvel utilisateur qui va être sauvé: ' + newUser));
    // save the user
    newUser.save(function(err) {
      console.log('On le sauve');
      if (err) {
        return res.json({success: false, msg: 'Email déjà utilisé.'});
      }
      res.json({success: true, msg: 'Merci de vous connecter avec vos nouveaux identifiants.'});
    });
  }
});

router.post('/login', function (req, res, next) {
  console.log('login; user email: ' + req.body.email);
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Login: Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          console.log('TEEEEST PUTAIN DE MERDE');
          console.log(user);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token, user: user});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});


/*
*
* Protection des routes suivantes
*


router.all('*', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      email: decoded.email
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Route: Authentication failed. User not found.'});
        } else {
          next();
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

*/
/*
*---------------------------------------------*
*....................CRUD.....................*
*---------------------------------------------*
*/

/**
* Creates a new user
**/
router.post('/', function (req, res, next) {
  var user = new User(req.body);

  user.save(function (err, createdUser) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(createdUser);
  });
});

/**
* Retrives a list of users
**/
router.get('/', function (req, res, next) {
  User.find(function (err, users) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(users);
  });
});

/**
* Retrives a specific user
**/
router.get('/:id', function (req, res, next) {
  User.find({_id: req.params.id}, function(err, user) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send(user);
  });
});

/**
* Udaptes a specific user
**/
router.put('/:id', function (req, res, next) {

  var userId = req.params.id;

  User.findById(userId, function(err, user) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!user) {
      res.status(404).send('User not found');
      return;
    } 

    if (req.body.firstname){
      user.firstname = req.body.firstname;
    }
    if (req.body.namelast){
      user.lastname = req.body.lastname;
    }
    if (req.body.sexe){
      user.sexe = req.body.sexe;
    }
    if (req.body.dob){
      user.dob = req.body.dob;
    }
    if (req.body.email){
      user.email = req.body.email;
    }
    if (req.body.passowrd){
      user.password = req.body.passowrd;
    }
    if (req.body.area){
      user.area = req.body.area;
    }
    if (req.body.roles){
      user.roles = req.body.roles;
    }
    if (req.body.penality){
      user.penality = req.body.penality;
    }

    user.save(function(err, updatedUser) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(updatedUser);
    });
  });
});

/**
* Delete a specific user
**/
router.delete('/:id', function (req, res, next) {

  var userId = req.params.id;

  User.remove({
    _id: userId
  }, function(err, data) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    console.log('Deleted ' + data + ' documents');
    res.sendStatus(204);
  });
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};


