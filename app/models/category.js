// Event Model
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
*
*Création des validateurs !
*
**/
var CategorySchema = new Schema({
	name: {type: String, required: true},
	catLogoUrl: {type: String}
});

mongoose.model('Category', CategorySchema);