var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CommentSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  text: String,
  placeId: {type: Schema.Types.ObjectId, ref: 'Place'}
});

CommentSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Comment', CommentSchema);
