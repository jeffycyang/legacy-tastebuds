'use strict';

angular.module('angular.oauth.facebook', [])

.directive('facebookLogin', function() {
  var 
    template = [
      '<div class="pure-button button-info">',
        '<i class="fa fa-facebook"></i>',
        '<span> Login with Facebook</span>',
      '</div>'
    ].join('');

  function initFacebook(appId) {
    FB.init({ appId: appId, status: true, cookie: false, xfbml: true });
  }
  
  function fbRoot() {
    var root = document.createElement('div');
    root.id = 'fb-root';
    root.className = 'hide';
    var e = document.createElement('script');
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    e.async = true;
    root.appendChild(e);
    return root;
  }

  function login(scope) {
    FB.login(function(response) {
      if ( response.status === 'connected' && response.authResponse ) {
        FB.api('/me', function(response) { scope.$emit('facebookAuthenticated', response); });
      }
    }, { scope: 'email' });
  }

  return {
    restrict: 'E',
    replace: true,
    template: template,
    scope: { appId: '=' },
    link: function(scope, element) {
      // init facebook
      element.append([fbRoot()]);
      window.fbAsyncInit = function() {  initFacebook(scope.appId); };
      // login
      element.on('click', function() { login(scope); });
    }
  };
}).

