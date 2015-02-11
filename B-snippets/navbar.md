## Creating a Navbar

HTML

```html
<div class="collapse navbar-collapse" ng-controller="headerController">
    <ul class="nav navbar-nav">
        <li ng-class="{ active: isActive('home')}"><a href="/">Home</a></li>
        <li ng-class="{ active: isActive('dogs')}"><a href="/dogs">Dogs</a></li>
        <li ng-class="{ active: isActive('cats')}"><a href="/cats">Cats</a></li>
    </ul>
</div>
<div ng-view></div>
```

UI Router States

```js
angular.module('pinyingApp').config(
  ['$stateProvider', '$urlRouterProvider', '$locationProvider', 
  function($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('home', { ... } })
    .state('dogs', { ... } })
    .state('cats', { ... } });

  $urlRouterProvider.otherwise('/vocabulary');
  $locationProvider.html5Mode(true);
}]);
```

Header Controller

```js
angular.module('myApp').controller('headerController', 
  ['$scope', '$state', function($scope, $state) {
  
  $scope.isActive = function(name) {
    var regex = RegExp('^'+name);
    return $state.current.name.match(regex);
  }
}]);
```

Or just use `ui-sref-active`:

```html
<ul class="nav navbar-nav">
  <li ui-sref-active="active"><a ui-sref="vocabulary">Dictionaries and Vocabulary</a></li>
  <li ui-sref-active="active"><a ui-sref="method">Learn the Method</a></li>
  <li ui-sref-active="active"><a ui-sref="videos">Instructional Videos</a></li>
</ul>
```