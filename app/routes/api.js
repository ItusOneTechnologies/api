var User       = require('../models/user.js');
var Company    = require('../models/company.js');
var Jobsite    = require('../models/jobsite.js');
var Report     = require('../models/report.js');
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
          message: 'Authentication failed: no user found',
            error: err
        });
      } else if (user) {
        // check if the password matches
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
            message: 'Token granted',
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
    res.json({
      success: true,
      message: 'Okay',
        error: null
    });
  });

  // more route for our API will happen here
  apiRouter.route('/users')
    // create a user (access at post)
    .post(function (req, res) {
      //create a new instance of the user model
      var user = new User();

      // set the information
      user.company_id = req.body.company_id;
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
            res.json({
              success: false,
              message: 'An error occurred.',
                error: err
            });
            return;
          }
        }
        res.json({
          success: true,
          message: 'User created!',
            error: null
        });
      });
    })
    // get users by company_id
    .get(function (req, res) {
      // if req.query exists
      if (req.query.company_id) {
        User.find({
          company_id: req.query.company_id
        }, function (err, users) {
          if (err) {
            res.json({
              success: false,
              message: 'An error occurred.',
                error: err
            });
            return;
          }

          res.json({
            success: true,
            message: 'Success.',
               user: users,
              error: null
             });
        });
      } else if (req.query.jobsite_id) {
        User.find({
          jobsite_id: req.query.jobsite_id
        }, function (err, users) {
          if (err) {
            res.json({
              success: false,
              message: 'An error occurred.',
                error: err
            });
            return;
          }

          res.json({
            success: true,
            message: 'Success',
               user: users,
              error: null
          });
        });
      } else {
        res.json({
          success: false,
          message: 'Not properly configured GET. Use Query.',
            error: null
        });
      }
    });

  apiRouter.route('/users/:user_id')
    // get the user with that id
    .get(function (req, res) {
      User.findById(req.params.user_id, function (err, user) {
        if (err) {
          // res.send(err)
          res.json({
            success: false,
            message: 'An error occured.',
              error: err
          });
          return;
        }

        res.json({
          success: true,
          message: 'okay',
             user: user,
            error: null
          });
      });
    })
    // update the user with this id
    .put(function (req, res) {
      // user our user model to find the user we want
      User.findById(req.params.user_id, function (err, user) {
        if (err) {
          res.json({
            success: false,
            message: 'An error occurred.',
              error: err
          });
        }

        // update the users info only if its new
        console.log(req.body);
        if (req.body.name) { user.name = req.body.name; }
        if (req.body.username) {
          user.username = req.body.username
        }
        if (req.body.password) { user.password = req.body.password }
        if (req.body.jobsite_id) { user.jobsite_id = req.body.jobsite_id; }

        user.save(function (err) {
          if (err) {
            if (err.code == 11000) {
              return res.json({
                success: false,
                message: 'That username is in use already',
                  error: null
              });
            } else {
              return res.send(err);
            }
          }
          res.json({
            success: true,
            message: 'User updated',
              error: null
          });
        });
      });
    })
    .delete(function (req, res) {
      User.remove({
        _id: req.params.user_id
      }, function (err, user) {
        if (err)  {
          res.json({
            success: false,
            message: 'An error occurred.',
              error: err
          });
          return;
        }

        res.json({
          success: true,
          message: 'Successfully deleted',
            error: null
        });
      });
    });

  apiRouter.route('/users/:company_id')

    // get all users with that company_id
    .get(function (req, res) {
      User.find({
        company_id: req.params.company_id
      }, function (err, users) {
        if (err) {
          res.json({
            success: false,
            message: 'An error occurred.',
              error: err
          });
          return;
        }

        res.json({
          success: true,
          message: 'Success.',
             user: users,
            error: null
          });
      });
    });

  apiRouter.route('/users/:jobsite_id')
    .get(function (req, res) {
      User.find({
        jobsite_id: req.params.jobsite_id
      }, function (err, users) {
        if (err) {
          res.json({
            success: false,
            message: 'An error occurred',
              error: err
          });
          return;
        }
        res.json({
          success: true,
          message: 'Success.',
             user: users,
            error: null
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
      if (err) {
        res.json({
          success: false,
          message: 'An error occured.',
            error: err
        });
        return;
      }

      res.json({
        success: true,
        message: 'okay',
           user: user,
          error: null
      });
    });
  });

  apiRouter.route('/companies')
    // create a company at POST http://localhost:8080/api/companies
    .post(function (req, res) {
      // create a new instance of the company model
      var company = new Company();

      // set the information
      company.name = req.body.name;
      company.location.push({
        address : req.body.address,
           city : req.body.city,
          state : req.body.state
      });

      // save the company and check for errors
      company.save(function (err) {
        if (err) {
          res.json({
            success: false,
            message: 'An error occurred.',
              error: err
          });
          return;
        }
        res.json({
          success: true,
          message: 'Company created',
            error: null
        });
      });
    })
    .get(function (req, res) {
      Company.find(function (err, companies) {
        if (err) {
          res.json({
            success: false,
            message: 'An error occurred.',
              error: err
          });
          return;
        }
        res.json(companies);
      });
    });

    apiRouter.route('/companies/:company_id')
      // get the company with that id
      .get(function (req, res) {
        Company.findById(req.params.company_id, function (err, company) {
          if (err) {
            res.json({
              success: false,
              message: 'An error occurred',
                error: err
            });
            return;
          }

          res.json({
            success: true,
            message: 'Success',
            company: company,
              error: null
          });
        });
      })
      // update the company with this id
      .put(function (req, res) {
        Company.findById(req.params.company_id, function (err, company) {
          if (err) {
            res.json({
              success: false,
              message: 'An error occured.',
                error: err
            });
            return;
          }

          // only do this if the company exists
          if (company) {
            // only update the company if there is new information
            if (req.body.name) { company.name = req.body.name; }
            if (req.body.location) {
              for (var i = 0; i < company.location.length; i++) {
                if (req.body.location[i]) {
                  if (req.body.location[i].address) {
                    company.location[i].address = req.body.location[i].address;
                  }
                  if (req.body.location[i].city) {
                    company.location[i].city = req.body.location[i].city;
                  }
                  if (req.body.location[i].state) {
                    company.location[i].state = req.body.location[i].state;
                  }
                }
              }
            }
            // must use update to specific update the array in location
            Company.update({ _id: company._id }, company, function (err) {
              if (err) {
                res.json({
                  success: false,
                  message: 'An error occurred.',
                    error: err
                });
                return;
              }

              res.json({
                message: 'Company updated.'
              });
            });
          } else {
            res.json({
              success: false,
              message: 'Nothing was sent to server.',
                error: err
            });
            return;
          }
        });
      })
      .delete( function (req, res) {
        Company.remove({
          _id: req.params.company_id
        }, function (err, company) {
          if (err) {
            res.json({
              success: false,
              message: 'An error occurred.',
                error: err
            });
            return;
          }

          res.json({
            message: 'Successfully deleted'
          });
        });
      });
  apiRouter.route('/companies/:company_id/locations')
    // API to update locations in a company
    .put(function (req, res) {
      Company.findById(req.params.company_id, function (err, company) {
        if (err) {
          res.json({
            success: false,
            message: 'An error occurred.',
              error: err
          });
          return;
        }

        if (company) {
          // only update the company.location if the index is passed to avoid
          // updating attempting to update 'undefined'
          if (req.body.index != undefined) {
            company.location.push({ index : req.body.index });
            if (req.body.address) {
              company.location[req.body.index].address = req.body.address;
            } else {
              res.json({
                success: false,
                message: 'Address is needed to create a location',
                  error: null
              });
            }
            if (req.body.city) {
              company.location[req.body.index].city = req.body.city;
            } else {
              res.json({
                success: false,
                message: 'City is needed to create a location',
                  error: null
              });
            }
            if (req.body.state) {
              company.location[req.body.index].state = req.body.state;
            } else {
              res.json({
                success: false,
                message: 'State is needed to create a location',
                  error: null
              });
            }
            company.save(function (err) {
              if (err) {
                res.json({
                  success: false,
                  message: 'An error occurred.',
                    error: err
                });
                return;
              }

              res.json({
                success: true,
                message: 'Company Updated',
                  error: null
              });
            });
          }
        } else {
          res.json({
            success: false,
            message: 'Nothing to update. Please enter all fields',
              error: null
          });
          return;
        }
      });
    })
    .delete(function (req, res) {
      // find the company,
      // remove the location by the index
      // reset index on each element so it is correct
      Company.findOne({ _id: req.params.company_id }, function (err, company) {
        // check that index is < length as it will correspond to index of
        // element in array, it cannot be == length
        if (req.query.index < company.location.length) {
          var locations = company.location;
          locations.splice(req.query.index, 1);
          for (var i = 0; i < locations.length; i++) {
            locations[i].index = i;
          }
          Company.update({ _id: company._id }, { $set : { location: locations }}, function (err) {
            if (err) {
              return res.json({
                success: false,
                message: 'An error occurred.',
                  error: err
              });
            }

            res.json({
                success: true,
                message: 'Locations updated',
              locations: locations,
                  error: null
            });
          });
        } else {
          res.json({
            success: false,
            message: 'The index request is out of range',
              error: null
          });
          return;
        }
      });
    });

  apiRouter.route('/jobsites')

    // create a new jobsite
    .post(function (req, res) {
      var jobsite = new Jobsite();

      // need to add error checking on front end,
      // and here to be sure no errors occur in
      // the process of adding a company
      jobsite.name = req.body.name;
      if (req.body.location) {
        jobsite.location = {
          address : req.body.location.address,
             city : req.body.location.city,
            state : req.body.location.state
        };
      } else {
        jobsite.location = {
          address : req.body.address,
             city : req.body.city,
            state : req.body.state
        };
      }
      jobsite.company_id = req.body.company_id;

      jobsite.save(function (err) {
        if (err) {
          res.json({
            success: false,
            message: 'An error occurred.',
              error: err
          });
          return;
        }

        res.json({
          success: true,
          message: 'Jobsite added to your company',
            error: err
        });
      });
    })
    // get jobsites for the company
    .get(function (req, res) {
      if (req.query.company_id) {
        Jobsite.find({
          company_id: req.query.company_id
        }, function (err, jobsites) {
          if (err) {
            res.json({
              success: false,
              message: 'An error occurred.',
                error: err
            });
            return;
          }

          res.json({
            success: true,
            message: 'Success.',
            jobsite: jobsites,
              error: null
          });
        });
      } else {
        res.json({
          success: false,
          message: 'Not properly configured GET. Use Query.',
            error: null
        });
      }
    });

  apiRouter.route('/jobsites/:jobsite_id')

    .get(function (req, res) {
      Jobsite.findById(req.params.jobsite_id, function (err, jobsite) {
        if (err) {
          res.json({
            success: false,
            message: 'An error occurred.',
              error: err
          });
          return;
        }

        res.json({
          success: true,
          message: 'Success.',
          jobsite: jobsite,
            error: null
        });
      });
    })

    // API to update jobsite
    .put(function (req, res) {
      var query = { _id: req.params.jobsite_id };

      Jobsite.findById(req.params.jobsite_id, function (err, jobsite) {
        if (err) {
          res.json({
            success: false,
            message: 'An error occurred.',
              error: err
          });
          return;
        }

        if (req.body.name) { jobsite.name = req.body.name; }
        // formatted with if - else statements to handle location
        // being send in request as either individual properties or
        // as an object with those properties
        if (!jobsite.location) {
          // if no jobsite.location object, initialize
          jobsite.location = {};
        }
        if (req.body.address) {
          jobsite.location.address = req.body.address;
        } else if (req.body.location.address) {
          jobsite.location.address = req.body.location.address;
        }
        if (req.body.city) {
          jobsite.location.city = req.body.city;
        } else if (req.body.location.city) {
          jobsite.location.city = req.body.location.city;
        }
        if (req.body.state) {
          jobsite.location.state = req.body.state;
        } else if (req.body.location.state) {
          jobsite.location.state = req.body.location.state;
        }

        Jobsite.update({ _id: jobsite._id }, jobsite, function (err) {
          if (err) {
            res.json({
              success: false,
              message: 'An error occured',
                error: err
            });
            return;
          }

          res.json({
            success: true,
            message: 'Jobsite updated.',
            jobsite: jobsite,
            error: null
          });
        });
      });
    })
    .delete(function (req, res) {
      Jobsite.findById(req.params.jobsite_id)
        .remove()
        .exec(function (err, data) {
          if (err) {
            return res.json({
              success: false,
              message: 'An error occured',
                error: err
            });
          }

          res.json({
            success: true,
            message: 'Successfully deleted.',
            error: null
          });
        });
    });

  apiRouter.route('/reports')

    .get(function (req, res) {
      if  (req.query.jobsite_id && req.query.type) {
        Report.find({
          jobsite_id: req.query.jobsite_id,
                type: req.query.type
        }, function (err, report) {
          if (err) {
            res.json({
              success: false,
              message: 'An error occurred.',
                error: err
            });
            return;
          }
          if (report.length) {
            res.json({
              success: true,
              message: 'Report retrieved',
               report: report,
                error: null
            });
          } else {
            res.json({
              success: false,
              message: 'There are no reports matching those criteria.',
               report: null,
                error: null
            });
          }
        });
      } else if (req.query.jobsite_id) {
        Report.find({
          jobsite_id: req.query.jobsite_id
        }, function (err, report) {
          if (err) {
            res.json({
              success: false,
              message: 'An error occurred.',
                error: err
            });
            return;
          }
          if (report.length) {
            res.json({
              success: true,
              message: 'Report retrieved',
               report: report,
                error: null
            });
        } else {
            res.json({
              success: false,
              message: 'There are no reports matching those criteria.',
               report: null,
                error: null
            });
          }
        });
      } else {
        res.json({
          success: false,
          message: 'Improperly configured GET. Use a query.',
            error: null
        });
      }
    });

  return apiRouter;
};
