// User Model
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');

/**
*
*Création des validateurs !
*
**/
var UserSchema = new Schema({
	firstname: {type: String},
	lastname: {type: String},
	sexe: {type: Boolean}, //False = Homme, True = femme
	dob: {type: Date}, //Date de naissance; définir une date min valable
	email: {type: String, unique: true, required: true}, 
	password: {type: String, required: true}, //Mot de passe qui sera hashé
    favsCat: [{type: Schema.Types.ObjectId, ref: 'Category'}],
	area: {type: String}, //La région de l'utilisateur
	roles: {type: Boolean, required: true, default: false}, //Si false, utilisateur normal, si true propriétaire d'établissement
 	penality: {type: Number, require: true, default: 0}, //Défini le niveau de pénalité de l'utilisateur
});

UserSchema.pre('save', function (next) {
    console.log('Mais avant ça...');
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

mongoose.model('User', UserSchema);
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);