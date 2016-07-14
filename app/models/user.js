// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var bcrypt   = require('bcrypt-nodejs');

// user Schema
var UserSchema = new Schema({
        name: String,
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false },
  company_id: ObjectId
});

// has the password before the user is saved
UserSchema.pre("save", function(next) {
  var user = this;

  // has the password only if the password is changed or if the user is new
  if (!user.isModified('password')) return next();

  // generate the hash
  bcrypt.hash(user.password, null, null, function (err, hash) {
    if (err) return next(err);

    // change the password to the hashed version
    user.password = hash;
    next();
  });
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function (password) {
  var user = this;
  bcrypt.hash(password, null, null, function (err, hash) {
    if (err) return next(err);

    return password = hash;
  });
  console.log(password);

  return bcrypt.compareSync(password, user.password);
};

// return the model
module.exports = mongoose.model('User', UserSchema);
