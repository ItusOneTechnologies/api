var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ReportSchema = new Schema({
             type: { type: String, required: true },
       jobsite_id: { type: ObjectId, required: true },
      data_legend: Array,
         data_set: Array,
       statistics: Array,
  recommendations: Array
});

module.exports = mongoose.model('Report', ReportSchema, 'reports');
