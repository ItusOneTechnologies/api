var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var JobsiteSchema = new Schema({
        name: { type: String, required: true },
    location: { type: Object, required: true },
  company_id: ObjectId
});

module.exports = mongoose.model('Jobsite', JobsiteSchema);
