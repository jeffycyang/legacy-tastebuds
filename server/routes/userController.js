/* We start by bringing in our Users collection and our individual User model
 */

var Users = require('../collections/users');
var User = require('../models/userModel');

/* In create(), we are making a new user.
 */

exports.createUser = function(req, res) {
  var newUser = req.body;
  console.log(req.body);
  User.forge({
    //jeff's edit
    username: newUser.name,
    password: newUser.facebook_id,
    name: newUser.name,
    facebook_id: newUser.facebook_id,
    profile_picture: newUser.profile_picture
    //
  }).save()
    .then(function(postedModel) {
      res.status(200).json(postedModel);
    })
    .catch(function(error) {
      console.log(error);
      res.send('An error occurred');
    });
};

/* In get(), we are displaying a single user.
 */

exports.getUser = function(req, res) {
  var userId = req.params.id;

  //change to facebook_id?
  User.forge({
    //id: userId
    facebook_id: userId
  }).fetch()
    .then(function(resultingUser) {
      if (resultingUser == undefined) {
        // no such result
        res.status(404).json({
          error: "User not found."
        });
      } else {
        res.status(200).json(resultingUser);
      }
    });
};


/* In delete(), we are deleting a single user.
 */

exports.deleteUser = function(req, res) {
  var userId = req.params.id;

  User.forge({
    id: userId
  }).fetch({
    require: true
  }).then(function(user) {
    user.destroy()
      .then(function() {
        res.status(200).json({
          message: "User deleted"
        })
      })
      .catch(function(error) {
        console.log(error);
        res.send('An error occurred');
      });
  });
};
