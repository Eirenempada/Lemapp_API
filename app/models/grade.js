var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GradeSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  grade: Number,
  placeId: {type: Schema.Types.ObjectId, ref: 'Place'},
});

GradeSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Grade', GradeSchema);
