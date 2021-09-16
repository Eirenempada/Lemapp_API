var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Event = mongoose.model('Event');

module.exports = function (app) {
  app.use('/api/events', router);
};

/**
*
* Il faudrait faire une fonction find events vu que je l'utilise souvent ça serait plus simple.
*
*
**/

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
*.............Advanced functions..............*
*---------------------------------------------*
*/

/**
* !!! FONCTION A TERMINER !!!
* AJOUTER VERIFICATION ET ALGORITMES
* Add a user to the event /:id/adduser?userId=id
**/
router.put('/:id/adduser', checkUser, function (req, res, next) {

  Event.findById({_id: req.params.id}, function(err, event) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!event) {
      res.status(404).send('Event not found');
      return;
    }
 

    if (req.body.userId){
      if(event.userId == undefined){
        event.userId = [];
      }
      event.userId.push(req.body.userId);
    }

    console.log('opération réussie');
    console.log(event);

    event.save(function(err, updatedEvent) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(updatedEvent);
    });
  });
});

/**
* !!! FONCTION A TERMINER !!!
* AJOUTER VERIFICATION ET ALGORITMES
* Remove a user to the event
**/
router.put('/:id/removeuser', checkUser, function (req, res, next) {

  Event.findById({_id: req.params.id}, function(err, event) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!event) {
      res.status(404).send('Event not found');
      return;
    } 

    if (req.body.userId){
      var userIndex = event.userId.indexOf(req.body.userId);
      console.log(userIndex);
      if(userIndex != -1){
        event.userId.splice(userIndex);
      }
      else{
        res.status(500).send(err);
        return;
      }
    }

    event.save(function(err, updatedEvent) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(updatedEvent);
    });
  });
});

/**
* Retrives a list of events in function of given's param
**/
router.get('/', function (req, res, next) {
  var criteria = {};

  //Filter by subject; ?subject={String}
  if(req.query.subject) {
    criteria.subject = req.query.subject;
  }

  var today = Date.now();
  console.log('today is ' + today);
  
    //criteria.date = {"date" : { $gte : new Date(today)}};
  

  if(req.query.place) {
    criteria.place = req.query.place;
  }

  //filtre par zone géographique
  var coordX =req.query.coordX;
  coordY = req.query.coordY;
  radius = req.query.rad;

  if (coordX && coordY && radius){
    criteria.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(coordX),parseFloat(coordY)]
        },
        $maxDistance: parseInt(radius, 10)
      }
    }
  }
  

  Event.find(criteria, function (err, events) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(events);
  }).populate('placeId').populate('categoryId');
});

/*
*---------------------------------------------*
*....................CRUD.....................*
*---------------------------------------------*
*/

/**
* Create a new event
**/
router.post('/', function (req, res, next) {
  var event = new Event(req.body);

  event.save(function (err, createdEvent) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(createdEvent);
  });
});

/**
* Retrives a list of events
**/
router.get('/', function (req, res, next) {
  Event.find({"date" : { $gte : new ISODate(Date.Now())}},function (err, events) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(events);
  }).populate('placeId').populate('categoryId');
});

/**
* Retrives a specific event
**/
router.get('/:id', function (req, res, next) {

  Event.find({_id: req.params.id}, function(err, event) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send(event);
  }).populate('placeId').populate('categoryId');
});

/**
* Updates a specific event
**/
router.put('/:id', function (req, res, next) {

  var eventId = req.params.id;

  Event.findById(eventId, function(err, event) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!event) {
      res.status(404).send('Event not found');
      return;
    } 

    if (req.body.subject){
      event.subject = req.body.subject;
    }
    if (req.body.categoryId){
      event.categoryId = req.body.categoryId;
    }
    if (req.body.description){
      event.description = req.body.description;
    }
    if (req.body.imgurl){
      event.imgurl = req.body.imgurl;
    }
    if (req.body.date){
      event.date = req.body.date;
    }
    if (req.body.space){
      event.space = req.body.space;
    }
    if (req.body.restriction){
      event.restriction = req.body.restriction;
    }
    if (req.body.userId){
      event.userId = req.body.userId;
    }
    if (req.body.placeId){
      event.placeId = req.body.placeId;
    }

    event.save(function(err, updatedEvent) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(updatedEvent);
    });
  });
});

/**
* Deletes a specific event
**/
router.delete('/:id', function (req, res, next) {

  var eventId = req.params.id;

  Event.remove({
    _id: eventId
  }, function(err, data) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    console.log('Deleted ' + data + ' documents');
    res.sendStatus(204);
  });
});