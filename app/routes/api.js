var User       = require('../models/user.js');
var Company    = require('../models/company.js');
var config     = require('../../config.js');
var jwt        = require('jsonwebtoken');

module.exports = function (app, express){

  var apiRouter = express.Router();
  // route for authenticating users
  apiRouter.post('/authenticate', function (req, res) {
    // find the user
    console.log(req.body.username);
    // select the name, username, and password explicity
    User.findOne({
      username: req.body.username
    }).select('name username password').exec(function (err, user) {
      if (err) throw err;

      // no user with that username was found
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed: no user found'
        });
      } else if (user) {
        // check if the password matches
        console.log(user.password)
        console.log(req.body.password);
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Invalid username or password'
          });
        } else {
          // if user was found and password was correct
          // create a token
          var token = jwt.sign({
            name: user.name,
            username: user.username
          }, config.secret, {
            expiresIn: '24h'
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token',
            token: token
          });
        }
      }
    });
  });

  // middleware to use for all users
  apiRouter.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //decode token
    if (token) {
      //verifies secret and checks exp
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          console.log(decoded);
          next();
        }
      });
    } else {
      // if there is no token
      // return an HTTP response of 403 (access forbidden) and an error message
      return res.status(403).send({
        success: false,
        message: 'No token provided'
      });
    }
  });

  // test route to make sure everything is working
  // accessed at GET http://localhost:8080/api
  apiRouter.get('/', function (req, res) {
    res.json({ message: 'hooray! Welcome to our api' });
  });

  // more route for our API will happen here
  apiRouter.route('/users')
    // create a user (access at post)
    .post(function (req, res) {
      //create a new instance of the user model
      var user = new User();

      // set the information
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      // save the user and check for errors
      user.save(function (err) {
        if (err) {
          // duplicate entry
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
          message: 'User created!'
        });
      });
    })
    .get(function (req, res) {
      User.find(function (err, users) {
        if (err) res.send(err);
        res.json(users);
      });
    });

  apiRouter.route('/users/:user_id')
    // get the user with that id
    .get(function (req, res) {
      User.findById(req.params.user_id, function (err, user) {
        if (err) res.send(err);

        res.json(user);
      });
    })
    // update the user with this id
    .put(function (req, res) {
      // user our user model to find the user we want
      User.findById(req.params.user_id, function (err, user) {
        if (err) res.send(err);

        // update the users info only if its new
        console.log(req.body);
        if (req.body.name) { user.name = req.body.name; }
        if (req.body.username) {
          user.username = req.body.username
        }
        if (req.body.password) { user.password = req.body.password }

        user.save(function (err) {
          if (err) {
            if (err.code == 11000) {
              return res.json({
                success: false,
                message: 'That username is in use already'
              });
            } else {
              return res.send(err);
            }
          }
          res.json({
            message: 'User updated'
          });
        });
      });
    })
    .delete(function (req, res) {
      User.remove({
        _id: req.params.user_id
      }, function (err, user) {
        if (err) return res.send(err);

        res.json({
          message: 'Successfully deleted'
        });
      });
    });

  // api endpoint to get user information
  apiRouter.get('/me', function (req, res) {
    console.log('req.params');
    console.log(req.decoded);
    User.findOne({
      username: req.decoded.username
    }, function (err, user) {
      if (err) return err;

      res.send(user);
    });
  });

  apiRouter.route('/companies')
    // create a company at POST http://localhost:8080/api/companies
    .post(function (req, res) {
      // create a new instance of the company model
      var company = new Company();

      // set the information
      company.name = req.body.name;
      company.address = req.body.address;
      company.city = req.body.city;
      company.state = req.body.state;

      // save the company and check for errors
      company.save(function (err) {
        if (err) {
          return res.send(err);
        }
        res.json({
          message: 'Company created'
        });
      });
    })
    .get(function (req, res) {
      Company.find(function (err, companies) {
        if (err) res.send(err);
        res.json(companies);
      });
    });

    apiRouter.route('/companies/:company_id')
      // get the company with that id
      .get(function (req, res) {
        Company.findById(req.params.company_id, function (err, company) {
          if (err) res.send(err);

          res.json(company);
        });
      })
      // update the company with this id
      .put(function (req, res) {
        Company.findById(req.params.company_id, function (err, company) {
          if (err) res.send(err);

          console.log(req.body);
          // only update the company if there is new information
          if (req.body.name) { company.name = req.body.name; }
          if (req.body.address) { company.address = req.body.address; }
          if (req.body.city) { company.city = req.body.city; }
          if (req.body.state) { company.state = req.body.state; }

          company.save(function (err) {
            if (err) return res.send(err);

            res.json({
              message: 'Company Updated'
            });
          });
        });
      })
      .delete( function (req, res) {
        Company.remove({
          _id: req.params.company_id
        }, function (err, company) {
          if (err) return res.send(err);

          res.json({
            message: 'Successfully deleted'
          });
        });
      });

  return apiRouter;
};
