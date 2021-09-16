var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Grade = mongoose.model('Grade'),
  User = mongoose.model('User'),
  Place = mongoose.model('Place');


module.exports = function (app) {
  app.use('/api/grades', router);
};

/*
*---------------------------------------------*
*....................CHECK....................*
*---------------------------------------------*
*/

/**
 * Middleware qui vérifie l'existence d'un user
 */
function checkUser(req, res, next) {
  if (!req.body.userId) {
    // If no user ID is given, return an error.
    res.status(400).send('User ID is required');
    return;
  } else if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
    // If the user ID is not a valid MongoDB ID, no need to execute a query, return an error directly.
    res.status(400).send('No user with ID ' + req.body.userId);
    return;
  }
  next();
}
/**
*vérifie l'existence d'une place
*/
function checkPlace(req, res, next) {
  if (!req.body.placeId) {
    // If no place ID is given, return an error.
    res.status(400).send('Place ID is required');
    return;
  } else if (!mongoose.Types.ObjectId.isValid(req.body.place)) {
    // If the place ID is not a valid MongoDB ID, no need to execute a query, return an error directly.
    res.status(400).send('No place with ID ' + req.body.place);
    return;
  }
  next();
}

/*
*---------------------------------------------*
*....................CRUD.....................*
*---------------------------------------------*
*/

/**
* Create a new grade
**/
router.post('/', checkUser, function (req, res, next) {
  
  var grade = new Grade(req.body);

  grade.save(function (err, createdGrade) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(createdGrade);
  });

});

/**
* Retrives a list of grades
**/
router.get('/', function (req, res, next) {

  Grade.find(function (err, grades) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(grades);
  });

});

/**
* Retrives a specific grade
**/
router.get('/:id', function (req, res, next) {

  Grade.find({_id: req.params.id}, function(err, grade) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send(grade);
  }).populate(user);

});

/**
* Updates a specific grade
**/
router.put('/:id', function (req, res, next) {

  var gradeId = req.params.id;

  Grade.findById(gradeId, function(err, grade) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!grade) {
      res.status(404).send('Grade not found');
      return;
    } 

    if (req.body.userId){
      grade.userId = req.body.userId;
    }
    if (req.body.grade){
      grade.grade = req.body.grade;
    }
    if (req.body.placeId){
      grade.placeId = req.body.placeId;
    }

    grade.save(function(err, updatedGrade) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(updatedGrade);
    });
  });
});

/**
* Deletes a specific grade
**/
router.delete('/:id', function (req, res, next) {

  var gradeId = req.params.id;

  Grade.remove({
    _id: gradeId
  }, function(err, data) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    console.log('Deleted ' + data + ' documents');
    res.sendStatus(204);
  });
});