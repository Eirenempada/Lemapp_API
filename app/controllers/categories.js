var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Category = mongoose.model('Category');


module.exports = function (app) {
  app.use('/api/categories', router);
};

/*
*---------------------------------------------*
*....................CRUD.....................*
*---------------------------------------------*
*/

/**
* Creates a new category
**/
router.post('/', function (req, res, next) {
  var category = new Category(req.body);

  category.save(function (err, createdCategory) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(createdCategory);
  });
});

/**
* Retrives a list of comments
**/
router.get('/', function (req, res, next) {
  Category.find(function (err, categories) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(categories);
  })
});

/**
* Retrives a specific category
**/
router.get('/:id', function (req, res, next) {

  Category.find({_id: req.params.id}, function(err, category) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send(category);
  });
});

/**
* Udaptes a specific category
**/
router.put('/:id', function (req, res, next) {

  var categoryId = req.params.id;

  Category.findById(categoryId, function(err, category) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!category) {
      res.status(404).send('Category not found');
      return;
    } 

    if (req.body.name){
      category.name = req.body.name;
    }
    if (req.body.catLogoUrl){
      category.catLogoUrl = req.body.catLogoUrl;
    }

    category.save(function(err, updatedCategory) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(updatedCategory);
    });
  });
});

/**
* Deletes a specific category
**/
router.delete('/:id', function (req, res, next) {

  var categoryId = req.params.id;

  Category.remove({
    _id: categoryId
  }, function(err, data) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    console.log('Deleted ' + data + ' documents');
    res.sendStatus(204);
  });
});


