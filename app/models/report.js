var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ReportSchema = new Schema({
         type: { type: String, required: true },
   jobsite_id: { type: ObjectId, required: true },
  data_legend: { type: Array, required: true },
     data_set: { type: Array, required: true }
});

module.exports = mongoose.model('Report', ReportSchema);
