// Event Model
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
*
*Création des validateurs !
*
**/
var EventSchema = new Schema({
	subject: {type: String, required: true},
	categoryId: {type: Schema.Types.ObjectId, ref: 'Category'},
	description: {type: String, required:true},
	imgurl: {type: String},
	date: {type: Date, required: true},
	space: {type: Number, required: true},
	restrictions: String,
	userId: [{type: Schema.Types.ObjectId, ref: 'User'}], //Participants à l'événements (tableau)
	placeId: {type: Schema.Types.ObjectId, ref: 'Place'}
});

/*Subjects
Economie et politique
Science et médecine
Nature et découvertes
Culture, Art et Histoire
Technologie et jeux vidéos
Divertissement et société
*/

mongoose.model('Event', EventSchema);

/*
{"subject":"Nature et découvertes","date":"2016-07-17","hour":"20","space":"4","restrictions":"aucune","placeId":"5784e99a689f5b4014f2eb5b"}
*/