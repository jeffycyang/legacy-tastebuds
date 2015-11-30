'use strict';

angular.module('angular.oauth.facebook', [])

.directive('facebookLogin', function($http) {
  var 
    template = [
      '<div class="pure-button button-info" onclick="FB.logout()">',
        '<i class="fa fa-facebook"></i>',
        // '<span> Login with Facebook</span>',
        '<span id="status"></span>',  
      '</div>'
    ].join('');

  function initFacebook(appId) {
    FB.init({ appId: appId, cookie: true, xfbml: true, version: 'v2.5' });
  }
  
  function fbRoot() {
    var root = document.createElement('div');
    root.id = 'fb-root';
    root.className = 'hide';
    var e = document.createElement('script');
    e.src = document.location.protocol + '//connect.facebook.net/en_US/sdk.js';
    e.async = true;
    root.appendChild(e);
    return root;
  }

  function login(scope) {
    FB.login(function(response) {
      if ( response.status === 'connected' && response.authResponse ) {
        testAPI();
        FB.api('/me', function(response) { 
          console.log("RES "+JSON.stringify(response));
          scope.$emit('facebookAuthenticated', response); 
        });
        // testAPI();
      }
    }, { scope: 'email' });

  }

  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    //console.log(response.authResponse.accessToken);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = ' Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = ' Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me?fields=id,name,email,picture.type(large)', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        ' Thanks for logging in, ' + response.name + '!';
      console.log(response);
      console.log(response.picture.data.url);

      $http({
        method: 'POST',
        url: '/users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: { name: response.name,
                facebook_id: response.id,
                profile_picture: encodeURIComponent(response.picture.data.url)
              }
      }).success(function(data){
        console.log("successfully posted to database");
      });

      $http({
        method: 'GET',
        url: '/users/'+response.id
      }).then(function successCallback(response) {
          console.log("successful get response "+JSON.stringify(response));
          // console.log("scope profile "+$scope.profile.username);
          // $scope.profile.username = response.name;
      }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });

      window.top.location = "#/profile";
    });

  }

  return {
    restrict: 'E',
    replace: true,
    template: template,
    scope: { appId: '=' },
    link: function(scope, element) {
      // init facebook
      element.append([fbRoot()]);
      window.fbAsyncInit = function() {  
        initFacebook(scope.appId);

        FB.getLoginStatus(function(response) {
          statusChangeCallback(response);
          // scope.$emit('facebookAuthenticated', response);
          if ( response.status === 'connected' && response.authResponse ) {
            FB.api('/me', function(response) { 
              console.log("RES "+JSON.stringify(response));
              scope.$emit('facebookAuthenticated', response); 
            });
          }
        });

        FB.Event.subscribe("auth.logout", function(response) {
          console.log(response.status);
          if(response.status==='unknown'){
            window.location = '#/';
            document.getElementById('status').innerHTML = ' Please log ' + 'into Facebook.';
          }
        });

      };
      // login
      element.on('click', function() { 
        login(scope); 
      });
    }
  };
})

