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
/////////////
.factory('AuthFac', function($http){
  var data = {};
  data.name;
  data.id;
  data.picture;
  data.userInfo;
  data.getPicture;

  angular.element('[ng-controller=AuthCtrl]').scope().$on('facebookAuthenticated', function(e, userInfo) {
    angular.element('[ng-controller=AuthCtrl]').scope().$evalAsync(function() {
      data.name = userInfo.name;
      data.id = userInfo.id;

      console.log("GOD "+data.name+" "+data.id);

      data.getPicture = function(){
        return $http({
          method: 'GET',
          url: '/users/'+userInfo.id
        }).then(function successCallback(response) {
          console.log("successful get response "+JSON.stringify(response));
          data.picture = decodeURIComponent(response.data.profile_picture);
          console.log("i got your picture "+data.picture );
        }, function errorCallback(response) {
          console.log("failed to retrieve user");
        });
      }
      data.getPicture();

      // $http({
      //   method: 'GET',
      //   url: '/users/'+userInfo.id
      // }).then(function successCallback(response) {
      //   console.log("successful get response "+JSON.stringify(response));
      //   data.picture = decodeURIComponent(response.data.profile_picture);
      // }, function errorCallback(response) {
      //   console.log("failed to retrieve user");
      // });
    });
  });

  return data;
})

//////////
.controller('AuthCtrl', function($scope, $http, AuthFac) {
  $scope.name=AuthFac.name;
  $scope.id=AuthFac.id;
  $scope.picture=AuthFac.picture;
  // $scope.$on('facebookAuthenticated', function(e, userInfo) {
  //   // console.log("userINFO "+userInfo.name);
  //   $scope.$evalAsync(function() {
  //     $scope.name = userInfo.name;
  //     $scope.id = userInfo.id;
  //     console.log("i'm here "+userInfo.id);
  //     $http({
  //       method: 'GET',
  //       url: '/users/'+userInfo.id
  //     }).then(function successCallback(response) {
  //       console.log("successful get response "+JSON.stringify(response));
  //       $scope.picture = decodeURIComponent(response.data.profile_picture);
  //     }, function errorCallback(response) {
  //       console.log("failed to retrieve user");
  //     });
  //   });
  // });
})

.controller('landingController', function($scope) {
  $scope.message = 'lol the landingController works.';
})

.controller('feedController', function($scope, $http) {

  $http.get('/posts').success(function(data){
    $scope.allposts = data;
    var newImg = $('<img class="postImage">');
    newImg.attr('src', $scope.allposts[$scope.allposts.length-1].image);
    newImg.appendTo('.post li').last();
  })
  .error(function(error){
    console.log('ERROR: ' + error)
  });
  $scope.wantToTry = function(post) {
    console.log("SECTION: " + JSON.stringify(post))
    $scope.post =post;
    var data = {
      user_id: $scope.post.user_id,
      post_id: $scope.post.id
    }
    console.log(data)
    $http.post('/want_to_trys', data).success(function(data, status){
      console.log("SUCCESS: " + data);
    });
  }
})

.controller('profileController', function($scope, $http, AuthFac) {
    // $http.get('/users/:id').success(function(data){
    // $http.get('/users/1').success(function(data){
      console.log("SCOPE: " + AuthFac.id+" "+AuthFac.name+" "+AuthFac.picture);
    $scope.name = AuthFac.name;
    $scope.id = AuthFac.id;
    $scope.picture = AuthFac.picture;

    $scope.$evalAsync(function() {
      $scope.name = AuthFac.name;
      $scope.id = AuthFac.id;
      $scope.picture = AuthFac.picture;
    });

    var slice = $scope.id.slice(0,6);
    var idInt = parseInt(slice);

    $http.get('/users/'+idInt).success(function(data){
      console.log("PROFILE: " + data)
       $scope.userProfile = data;
    })
    .error(function(error){
       console.log('ERROR: ' + error);
    });

    // $http.get('/posts/user/1').success(function(data){
    $http.get('/posts/user/'+$scope.id).success(function(data){
       $scope.userPosts = data.data;
       console.log("inside user post", $scope.userPosts
        )
    })
    .error(function(error){
      // console.log('ERROR: ' + error);
    });
})

.controller('uploadController', function($scope, $http, AuthFac) {
    $('.recc .btn').click(function(){
      $scope.eat = true;
    })
    $('.recc .btn.red').click(function(){
      $scope.eat = false;
    })
    console.log($scope.eat);

  $scope.submit = function(){
    console.log("INSIDE SUBMIT")
    var imgVar= $(".upload-file").prop('files')[0]['name'];
    $scope.imgTag ="assets/"+imgVar;
    console.log("IMGTAG: "+ $scope.imgTag);
    console.log("SCOPE: " + AuthFac.id)
    var slice = AuthFac.id.slice(0,6);
    console.log("SLICE ONE: "+ slice);
    var idInt = parseInt(slice);
    console.log("INT: "+ idInt);

    var data = {
     location: $scope.location,
     user_id: idInt,
     restaurant_id: $scope.restaurant_id,
     post_image: $scope.imgTag,
     comment: $scope.comment,
     eat: $scope.eat
    }

    console.log("HERERREEEEEE");
    $http.post('/posts', data).success(function(data, status){
      console.log('data2: ', data);
    })
  }
})

.controller('wantToTryController', function($scope, $http){
  var array;
  $http.get('/want_to_trys/user/1').success(function(data){
    console.log("BLA" + JSON.stringify(data));
    array = data.data;
    console.log(JSON.stringify(array[0]));
  });
  $scope.wantToTryUser =[];
  setTimeout(function(){
   array.forEach(function(single){
     $http.get('/posts/'+single.post_id).success(function(data){
       console.log("BOOOO ",data);
       $scope.wantToTryUser.push(data);
     })
   })

  },1000);

});













