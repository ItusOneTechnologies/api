// grab the packages that are needed for the company mondel
var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CompanySchema = new Schema({
          name: { type: String, required: true },
       address: { type: String, required: true },
          city: { type: String, required: true },
         state: { type: String, required: true },
  worksites_id: ObjectId
});

// return the model
module.exports = mongoose.model('Company', CompanySchema);
