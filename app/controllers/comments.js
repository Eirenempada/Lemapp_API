var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  User = mongoose.model('User'),
  Place = mongoose.model('Place');


module.exports = function (app) {
  app.use('/api/comments', router);
};

/*
*---------------------------------------------*
*....................CHECK....................*
*---------------------------------------------*
*/
/**
 * Check if user exists
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
* Check if place exists
**/
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
* Creates a new comment
**/
router.post('/', function (req, res, next) {
  var comment = new Comment(req.body);

  comment.save(function (err, createdComment) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(createdComment);
  });
});

/**
* Retrives a list of comments
**/
router.get('/', function (req, res, next) {
  Comment.find(function (err, comments) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(comments);
  }).populate('userId', 'name');
});

/**
* Retrives a specific comment
**/
router.get('/:id', function (req, res, next) {

  Comment.find({_id: req.params.id}, function(err, comment) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send(comment);
  });
});

/**
* Udaptes a specific comment
**/
router.put('/:id', function (req, res, next) {

  var commentId = req.params.id;

  Comment.findById(commentId, function(err, comment) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!comment) {
      res.status(404).send('Comment not found');
      return;
    } 

    if (req.body.userId){
      comment.userId = req.body.userId;
    }
    if (req.body.text){
      comment.text = req.body.text;
    }
    if (req.body.placeId){
      comment.placeId = req.body.placeId;
    }

    comment.save(function(err, updatedComment) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(updatedComment);
    });
  });
});

/**
* Deletes a specific comment
**/
router.delete('/:id', function (req, res, next) {

  var commentId = req.params.id;

  Comment.remove({
    _id: commentId
  }, function(err, data) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    console.log('Deleted ' + data + ' documents');
    res.sendStatus(204);
  });
});


