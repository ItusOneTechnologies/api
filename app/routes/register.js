var Company = require('../models/company.js');
var User    = require('../models/user.js');
var config  = require('../../config.js');
var jwt     = require('jsonwebtoken');

module.exports = function (app, express) {
  var registerRouter = express.Router();

  registerRouter.get('/', function (req, res) {
    res.json({
      message: "Register route works"
    });
  });
  registerRouter.route('/company')

    .post(function (req, res) {
      var company = new Company();
      console.log(req.body);

      company.name = req.body.name;
      company.address = req.body.address;
      company.city = req.body.city;
      company.state = req.body.state;

      company.save(function (err, company) {
        if (err) {
          if (err.code === 11000) {
            return res.json({
              success: false,
              message: 'A user with that username already exists.'
            });
          } else {
            return res.send(err);
          }
        }
        res.json({
          company_id: company.id,
             message: 'Company registered.'
        });
      });
    });

  registerRouter.route('/user')
    .post(function (req, res) {
      var user = new User();

      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;
      user.company_id = req.body.company_id;

      user.save( function (err, user) {
        if (err) {
          // duplicate entries
          if (err.code == 11000) {
            return res.json({
              success: false,
              message: 'A user with that username already exists.'
            });
          } else {
            return res.send(err);
          }
        }
        res.json({
          success: true,
          message: 'User registered.'
        });
      });
    });

  return registerRouter;
};
