angular.module('tastebuds', [
  'ui.router',
  'angular.oauth.facebook'
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('upload', {
      url: '/upload',
      templateUrl: '../views/upload-page.html',
    })
    .state('home', {
      url: '/',
      templateUrl: '../views/landing-page.html',
    })
    .state('feed', {
      url: '/feed',
      templateUrl: '../views/feed.html',
    })
    .state('profile', {
      url: '/profile',
      templateUrl: '../views/user-profile.html',
    })
    .state('profile.postList', {
      url: '/post-list',
      templateUrl: '../views/post-list.html',
      controller: function($scope) {
        $scope.dogs = ['fuck', 'poop', 'shit'];
      }
    })
    .state('profile.eatList', {
      url: '/want-to-try',
      templateUrl: '../views/want-to-try.html'
    })
    .state('wantToTry', {
      url: '/wantToTry',
      templateUrl: '../views/want-to-try.html'
    });
})

//jeff adds facebook oauth
.controller('AuthCtrl', function($scope, $http) {
  $scope.name = '';
  $scope.id;
  $scope.picture;
  $scope.$on('facebookAuthenticated', function(e, userInfo) {
    // console.log("userINFO "+userInfo.name);
    $scope.$evalAsync(function() {
      $scope.name = userInfo.name;
      $scope.id = userInfo.id;
      $http({
        method: 'GET',
        url: '/users/'+userInfo.id
      }).then(function successCallback(response) {
        console.log("successful get response "+JSON.stringify(response));
        $scope.picture = decodeURIComponent(response.data.profile_picture);
      }, function errorCallback(response) {
        console.log("failed to retrieve user");
      });
    });
  });
})

.controller('landingController', function($scope, $http) {
  $scope.message = 'lol the landingController works.';
})

.controller('feedController', function($scope, $http) {
  $scope.username = 'Zack Lee';
  var postPicture = $http({
    method: 'GET',
    url: '/posts'
  }).then(function(response) {
    // when the response is available
    if (response.image) {
      console.log($scope.image);
      $scope.image = response.data.image;
    }

  }, function errorCallback(error) {
    // or server returns response with an error status.
    //run error
    if (error) {
      console.log('feedController error!');
    }


  });

})

.controller('profileController', function($scope, $http) {
    $scope.profile = {
        username: 'users.username',
        posts: [],
        wantToEat: []
    };
    
    //jeff's edit
    // $scope.getUserInfo = $http.get({
    //     method: 'GET',
    //     url: '/users/' + $scope.id
    // }).then(function(data){
    //     console.log("user data "+data);
    // });
    //

    $scope.getPosts = $http.get({
        method: 'GET',
        url: '/posts'
    }).then(function(posts) {
        return posts;
    });
    $scope.getEats = $http.get({
        method: 'GET',
        // can this url be directed at the getEats row in the posts table?
        url: '/posts'
    }).then(function(eat) {
        wantToEat.push(eat);
    });
})

.factory('uploadFactory', function($http) {
  return {
    sendData: function() {
      return $http({
        url: '/posts',
        method: "POST",
        data: {
          'username': 'username',
          'picture': 'picture url',
          'comment': 'user\'s comment',
          'reccomendation': true
        }
      });
    }

  };
})

.controller('uploadController', function($scope, $http, uploadFactory) {
  var self = this;
  self.bullshit = 'ricky';
  self.postData = function() {
    console.log('postData fires');
    uploadFactory.sendData()
    .then(function(res) {
      console.log(res.data);
    });
  };
});
