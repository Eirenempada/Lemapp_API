// Event Model
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
*
*Création des validateurs !
*
**/
var PlaceSchema = new Schema({
	name: {type: String, required: true},
	address: {type: String, required: true},
	location: {type: {type: String}, coordinates: [Number, Number]},
	type: {type: String, required: true}, //bar/lounge/restaurant/café
	logo: {type: String, required: true}, //img URL
	description: {type: String, required: true},
	banner: {type: String, required: true}, //img URL
	middlepirce: {type: String, required: true},
	leadingproduct: {type: String, required: true},
	contact: {type: String, required: true}
});

mongoose.model('Place', PlaceSchema);

/*
46.210316, 6.144116
{"name":"Les Brasseurs","address":"Place de Cornavin 20, 1201 Genève","location":{"coordinates":["46.210316","6.144116"]},"type":"restaurant","logo":"unURL","description":"L’histoire des Brasseurs remonte à 1997, quand 4 amis aux connaissances et aptitudes complémentaires décident de créer des microbrasseries en Suisse romande. Le concept est simple : produire sur place, sous les yeux des clients, des bières à l’ancienne, à haute fermentation, dans un cadre spécialement crée à cet effet. Les BRASSEURS mettent l’accent sur l’amour du métier de brasseur et du produit artisanal, des bières aux saveurs nostalgiques et porteuses de convivialité !","banner":"uneUrl","middlepirce": "4","leadingproduct":"La bière bonne","contact":"Gerard Montford"}
id: 5784e99a689f5b4014f2eb5b
*/