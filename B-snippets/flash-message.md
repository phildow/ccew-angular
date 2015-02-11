
## Flash Message

**JavaScript**

Create a separate module and add the flash service to it:

```js
angular.module('flash',[]);

angular.module('flash').service('flash', ['$rootScope', function($rootScope) {
  this.current = {show: false};
  this.queue = [];

  var self = this;
  $rootScope.$on('$stateChangeSuccess', function() {
    self.current = self.queue.shift() || {show: false};
  });
  
  this.success = 'alert alert-dismissable alert-success',
  this.info =    'alert alert-dismissable alert-info',
  this.warning = 'alert alert-dismissable alert-warning',
  this.danger =  'alert alert-dismissable alert-danger',

  this.set = function(type, title, msg) {
    this.queue.push({
      type: type,
      title: title,
      message: msg,
      show: true
    });
  };
}]);
```

Inject this module into any other module whose controller's require access to the flash:

```js

```

**HTML**

Embedd a flash div into your html wherever a flash may appear. Often this will go in *index.html* so that it appears everywhere in your application but you may want to place the flash differently at different routes.

```html
<div ng-class="flash.current.type" ng-show="flash.current.show">
  <button type="button" class="close" data-dismiss="alert">×</button>
  <h4>{{flash.current.title}}</h4>
  <p>{{flash.current.message}}</p>
</div>
```

## Directive

Alternatively we could create a directive that contains the html instead of having to copy/paste the html anywhere we want the flash to appear.

**JavaScript**

Include the service above and add the following directive:

```js
angular.module('flash').directive('flash', function() {
  return {
    restrict: 'EA',
    scope: {
      flash: '='
    },
    template: 
    '<div ng-class="flash.current.type" ng-show="flash.current.show"> \
     <button type="button" class="close" data-dismiss="alert">×</button> \
     <h4>{{flash.current.title}}</h4> \
     <p>{{flash.current.message}}</p> \
     </div>'
  };
});
```

**HTML**

Then embed the flash into the page like so:

```html
<div flash="flash"></div>
```

The flash data is still being pulled out of the scoped flash object.