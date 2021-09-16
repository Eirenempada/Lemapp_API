var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Place = mongoose.model('Place'),
  Comment = mongoose.model('Comment');

module.exports = function (app) {
  app.use('/api/places', router);
};

/*
*---------------------------------------------*
*.............Advanced functions..............*
*---------------------------------------------*
*/


/*
*---------------------------------------------*
*....................CRUD.....................*
*---------------------------------------------*
*/

/**
* Creates a new place
**/
router.post('/', function (req, res, next) {
  var place = new Place(req.body);

  place.save(function (err, createdPlace) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(createdPlace);
  });
});

/**
* Retrives a list of places
**/
router.get('/', function (req, res, next) {
  Place.find(function (err, places) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send(places);
  });
});


/**
* Retrives a specific place (with comments)
**/
router.get('/:id', function (req, res, next) {
  Place.find({_id: req.params.id}, function(err, place) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send(place);
  });

});

/**
* Udaptes a specific place
**/
router.put('/:id', function (req, res, next) {

  var placeId = req.params.id;

  Place.findById(placeId, function(err, place) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!place) {
      res.status(404).send('Place not found');
      return;
    } 

    if (req.body.name){
      place.name = req.body.name;
    }
    if (req.body.address){
      place.address = req.body.adress;
    }
    if (req.body.location){
      place.location = req.body.location;
    }
    if (req.body.type){
      place.type = req.body.type;
    }
    if (req.body.logo){
      place.logo = req.body.logo;
    }
    if (req.body.description){
      place.description = req.body.description;
    }
    if (req.body.banner){
      place.banner = req.body.banner;
    }
    if (req.body.middlepirce){
      place.middlepirce = req.body.middlepirce;
    }
    if (req.body.leadingproduct){
      place.leadingproduct = req.body.leadingproduct;
    }
    if (req.body.contact){
      place.contact = req.body.contact;
    }

    place.save(function(err, updatedUser) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(updatedUser);
    });
  });
});

/**
* Delete a specific place
**/
router.delete('/:id', function (req, res, next) {

  var placeId = req.params.id;

  User.remove({
    _id: placeId
  }, function(err, data) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    console.log('Deleted ' + data + ' documents');
    res.sendStatus(204);
  });
});