Angular Services
======

Angular offers a number of built-in services that we can take advantage of in our application. Some of these provide essential functionality that we'll rely on in almost any complex angular product. Of special interest will be the $http service, which makes network calls to an api server dead simple. 

We'll learn about the $http service in our next lesson. Today we'll learn why we use services, look at some of the builtin services, learn about promises and more about events, and learn how to build our own services.

## What is a Service?

First we should understand what a service is. Recall what was said earlier about controllers: the function of a controller is to set up the scope. Anything that is not directly related to setting up the scope should not go in a controller. Where does it go? A service.

A service, then, is modular code which delievers behavior that is required by controllers (and as it turns out, other services). Often this will be code that is re-used from many places in the application. Many controllers will consume a sevice, and services may consume other services.

A prime example of a service is networking code. I don't want to have to rewrite the same networking code every time I make a call to a server api. Instead that code is abstracted out and compartmentalized into a service. Application components can then consume the service where needed, leveraging dependency injection, and keep their code much simpler.

As another example we might abstract our networking code even further. API code often shares similar features such as relative paths on the server, the type and nature of the request, serialization and so on. We might write an api service that consumes the networking service to abstract away the details of talking to our particular server. Controllers can then consume the api service and make very straightforward calls to it to get and send data to the server.

Angular allows us to build a number of types of services and provides a number of builtin services. We will always leverage services in our application by way of dependency injection.

## Angular Service: $timeout

Set up a basic html document with directives for an application module and controller so we can test a few services:

```html
<!doctype html>
<html lang="en" ng-app="myApp">
  <head>
    <title>Angular</title>
  </head>
  <body ng-controller="myController">
    <h3>Text</h3>
    <p>{{text}}</p>
    
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.28/angular.min.js"></script>
    <script type="text/javascript">
      // code here
    </script>
  </body>
</html>
```

Angular's $timeout is one of the simplest services to use and is just a wrapper for javascript's setTimeout, which executes a function after a delay specified in milliseconds. Create the controller with the $timeout service injected into it and call $timeout with the following syntax:

```
$timeout( function, delay )
```

Angular code: 

```js
angular.module('myApp', []).controller('myController', 
  ['$scope', '$timeout', function($scope, $timeout) {

  $scope.text = "Before timeout delay";
  
  $timeout(function() {
    $scope.text = "Two seconds later";
  }, 2000);

}]);
```

Refresh the page, and after two seconds the text updates.

## Introducing Promises

The timeout service returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), an advanced construct used with asynchronous code that we'll discuss in more detail in our next lesson. For now let's just understand that an [angular promise object](https://docs.angularjs.org/api/ng/service/$q) has a `then` function which takes two callbacks as arguments, one that is called when the asynchronous code *resolves* and is successfully executed, and the other when there is an error.

Let's capture the promise object returned by $timeout and show the user whether the promise resolved or not. First add another template binding to the html:

```html
<h3>Text</h3>
<p>{{text}}</p>

<h3>Promise Resolved</h3>
<p>{{resolved}}</p>
```

Then call the promise like so with the additional code:

```js
// capture the promise in a variable

var promise = $timeout(function() {
  $scope.text = "Two seconds later";
}, 2000);

// call then on it: be careful with this syntax!

promise.then(
  function() {
    $scope.resolved = "Resolved!";
  },
  function() {
    $scope.resolved = "Cancelled";
  });
```

Pay special attention to the `then` syntax, which takes two functions:

```
promise.then( function, function )
```

and looks like:

```js
promise.then( function() { ... } , function() { ... } );
```

Notice especially that the callback functions aren't executed immediately. They are executed only after the promise resolves or fails to resolve, that is, only when the original anonymous function passed to $timeout executes or fails to execute after the delay.

We can really see the power in javascript's treatment of functions as values. Because a function is a value it can be stored in a variable and used later, even after an asynchronous delay in our code. This allows application code to be informed when an event occurs that was scheduled earlier by some other part of the application.

If the use of functions as arguments to other functions seems confusing you may want to review the material on functional programming in lesson 04-07.

Let's wrap up the section on $timeout by giving the user the option of scheduling and canceling a timeout. Add two buttons to the interface and bind the ng-click event on them to functions we'll add to the scope:

```html
<button ng-click="scheduleTimeout()">Schedule Timeout</button>
<button ng-click="cancelTimeout()">Cancel Timeout</button>

<h3>Text</h3>
<p>{{text}}</p>
```

Let's set up the scope with these two functions. The code won't change much. Mostly we're just moving functionality to the scope. We can cancel the timeout by calling `$timeout.cancel` with the captured promise object:

```js
angular.module('myApp', []).controller('myController', 
  ['$scope', '$timeout', function($scope, $timeout) {

  $scope.text = "Before timeout delay";
  var promise;

  $scope.scheduleTimeout = function() {
    promise = $timeout(function() {
      $scope.text = "Two seconds later";
    }, 2000);

    promise.then(
      function() {
        $scope.resolved = "Resolved!";
      },
      function() {
        $scope.resolved = "Cancelled";
      });
  };

  $scope.cancelTimeout = function() {
    if (promise) {
      $timeout.cancel(promise);
    }
  };
  
}]);
```

The previous code goes in the `$scope.scheduleTimeout` function. Our new `$scope.cancelTimeout` function just checks if the promise exists and if it does cancels it, which causes the second callback passed to `promise.then` to be called.

Refresh the page and try it out. Alltogether our code looks like:

```html
<!DOCTYPE html>
<html lang="en" ng-app="myApp">
  <head>
    <title>Angular</title>
  </head>
  <body ng-controller="myController">
    
    <button ng-click="scheduleTimeout()">Schedule Timeout</button>
    <button ng-click="cancelTimeout()">Cancel Timeout</button>

    <h3>Text</h3>
    <p>{{text}}</p>

    <h3>Promise Resolved</h3>
    <p>{{resolved}}</p>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.28/angular.min.js"></script>
    <script type="text/javascript">

      angular.module('myApp', []).controller('myController', 
        ['$scope', '$timeout', function($scope, $timeout) {

        $scope.text = "Before timeout delay";
        var promise;

        $scope.scheduleTimeout = function() {
          promise = $timeout(function() {
            $scope.text = "Two seconds later";
          }, 2000);

          promise.then(
            function() {
              $scope.resolved = "Resolved!";
            },
            function() {
              $scope.resolved = "Cancelled";
            });
        };

        $scope.cancelTimeout = function() {
          if (promise) {
            $timeout.cancel(promise);
          }
        };

      }]);
    </script>
  </body>
</html>
```

## Events on $scope

Before we discuss our next service I'd like to introduce you to scope events. We saw when we transitioned from jquery to angular that our own javascript objects as well as the dom can emit events. In angular the scope is an object, and it emits custom change events any time a model value on it changes.

We can watch for these events and associate event handlers with them. We will often do this for the same reason we did it in jquery: to isolate code that responds to changes to a single block rather than writing it wherever we make the change.

To watch for changes on the $scope object call the `$scope.$watch` method, naming the model you want to watch and providing a callback function that is executed when its value changes. The callback function may take two parameters, which will be the new value and the old value. The syntax looks like:

```
$scope.$watch('model name', function(newVal, oldVal) {...})
```

Let's add to our promises example above. We'll add an event handler that is called anytime the text value changes on the scope:

```js
angular.module('myApp', []).controller('myController', 
  ['$scope', '$timeout', function($scope, $timeout) {

  $scope.text = "Before timeout delay";
  var promise;
  
  $scope.$watch('text', function(newVal, oldVal) {
    if (newVal === oldVal) {
      return;
    }
    console.log(newVal, oldVal);
  });
   
  ...
```

All we're doing is logging the new and old values. Our callback will be called when text changes, which in our application occurs after the setTimeout timer successfully executes.

Our code also initialize the text to a value, and because of how angular works the callback will be executed once the controller is fully loaded and with that initial value. For that reason we first check if the two values are the same and exit the event handler if they are.

Refresh the application and schedule a timeout to see the change.

**Watching Arrays and Objects**

Angular also offers `$scope.$watchGroup` and `$scope.$watchCollection` to watch for changes to an array of variables and to watch for changes to a single array's objects or to an object's properties, respectively.

## Broadcasting and Emiting Events

While watching for model events in a controller that is already responsible for those model values can be useful, the real value of angular's scope events comes when controllers that aren't otherwise aware of one another need to know when something changes in one of them.

Events can be communicated across controllers by *broadcasting* and *emitting* them on the scope. And it turns out that we can broadcast and emit our own custom events. We will use this ability to communicate between nested controllers.

Consider the following page with nested controllers:

```html
<!DOCTYPE html>
<html lang="en" ng-app="myApp">
  <head>
    <title>Angular</title>
  </head>
  <body>
    
    <div ng-controller="parentController">
      
      <h3>Parent</h3>
      <button ng-click="parentClick()">Click Me</button>

      <div ng-controller="childController">

        <h3>Child</h3>
        <button ng-click="childClick()">Click Me</button>
      
      </div>

    </div>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.28/angular.min.js"></script>
    <script type="text/javascript">
      angular.module('myApp', [])
        .controller('parentController', ['$scope', function($scope) {
          $scope.parentClick = function() {
            console.log('parent click');
          };
        }])
        .controller('childController', ['$scope', function($scope) {
          $scope.childClick = function() {
            console.log('child click');
          };
        }]);
    </script>
  </body>
</html>
```

We've got two controllers with the child controller nested inside the parent controller. Each controller manages a simple view. Each has a button with click event handlers on the scope, which is injected into the controller. Confirm it by clicking the buttons and watching the console.

Although the two controllers are nested they don't otherwise know about one another. We'd like to keep it this way to avoid strong coupling between application components.

But what if we want the parent controller to know when the child's button is clicked or vice versa? Imagine instead of button clicks an event is taking place that is local to that controller but has a wider impact on other parts of the application. Other parts of the application need to know that something local to one part of the page took place.

Nested controllers can communicate with one another by way of events. Parent controllers can *broadcast* events which will be delivered down the scope chain to child controllers nested inside them, and child controllers can *emit* events which will be carried up the scope chain to the controllers they are contained in.

When it comes to events, broadcasts go down and emits go up.

**Broadcasting**

Let's broadcast an event from the parent controller down to the child when its button is clicked. All we need to do is call `$broadcast` on the scope with a custom name for the event and any optional arguments we'd like to pass to the event's handlers. The syntax is:

```
$scope.$broadcast( 'name', [args, ...] )
```

Modify the parentClick function so that it looks like:

```js
$scope.parentClick = function() {
  console.log('parent click');
  $scope.$broadcast('parent:click', 'button click in the parent');
};
```

Remember that all we really need is the name and that additional arguments are optional and can be any data the event would like to communicate.

The child controller can then listen for events using the `$scope.$on` function, which takes the event name and an event handler. The first parameter to the handler will always be the event object itself. Additional parameters will contain the optional arguments provided in $broadcast:

```
$scope.$on( 'name', function( event, [args, ...] ) { ... } )
```

Let's watch for the event in the child controller by adding a call to $scope.$on:

```js
.controller('childController', ['$scope', function($scope) {
  $scope.childClick = function() {
    console.log('child click');
  };
  
  $scope.$on('parent:click', function(event, msg) {
    console.log('parent:click event received', msg);
  });
}]);
```

All we're doing is logging the fact that we've received the event along with the (optional) message that was communicated with it. Refresh the page and click the button to see the parent event broadcast to the child across the scope.

**Emiting**

Let's do the same but in the other direction. This time we want to communicate from the child up to the parent. Communicating up the controller chain requires us to emit the event with `$scope.$emit` instead of broadcasting it. The parent,however, will watch for the event the same way using `$scope.$on`.

The emit function has the same syntax as broadcast, so let's just go ahead and add it to the childClick function:

```js
$scope.childClick = function() {
  console.log('child click');
  $scope.$emit('child:click', 'button click in the child');
};
```

Then in the parent we can add a similar event listener:

```js
$scope.$on('child:click', function(event, msg) {
  console.log('child:click event received', msg);
});
```

Altogether our page should look like:

```html

<!DOCTYPE html>
<html lang="en" ng-app="myApp">
  <head>
    <title>Angular</title>
  </head>
  <body>
    
    <div ng-controller="parentController">
      
      <h3>Parent</h3>
      <button ng-click="parentClick()">Click Me</button>

      <div ng-controller="childController">

        <h3>Child</h3>
        <button ng-click="childClick()">Click Me</button>
      
      </div>

    </div>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.28/angular.min.js"></script>
    <script type="text/javascript">

      angular.module('myApp', [])
        .controller('parentController', ['$scope', function($scope) {
          $scope.parentClick = function() {
            console.log('parent click');
            $scope.$broadcast('parent:click', 'button click in the parent');
          };
          $scope.$on('child:click', function(event, msg) {
            console.log('child:click event received', msg);
          });
        }])
        .controller('childController', ['$scope', function($scope) {
          $scope.childClick = function() {
            console.log('child click');
            $scope.$emit('child:click', 'button click in the child');
          };
          $scope.$on('parent:click', function(event, msg) {
            console.log('parent:click event received', msg);
          });
        }]);
    </script>
  </body>
</html>
```

When we have nested scopes we can use event broadcasting and emiting to communicate information between them. We simply broadcast or emit the event by name, which we define, passing in optional data that we'd like to communicate, and then set up a corresponding event handler in the other controller. Events travel all the way up or down the inheritance hierarchy so deeply nested children or ancestors can receive them.

But what do we do when we want to communicate information between controllers that aren't nested?

## Angular Service: $rootScope

<!-- 	
	perfect homework assignment: 
	master-detail using nested scopes and parallel scopes 
--> 

Now that we understand events we can look at the $rootScope service.

Consider a common interface design pattern called the master-detail pattern. This kind of interface is often composed of two views on a single page, a master view that contains a list of items in summary form and a detail view that shows the details for an item when it is selected from the master list. From the detail view a user is often able to edit or delete that item.

Following good coding practices our application will implement such an interface using two controllers that are each reponsible for managing part of the page. The master controller will present the list and the detail controller will present the selected item.

Considering how such a page will be used, how can the detail controller know when an item has been selected in the master controller? And more interestingly, how will the master controller know when an item has been renamed or deleted so that it can update its list?

We could implement such an interface with nested controllers and use event broadcasting and emitting to communicate changes in selection or details. But lets imagine instead that we have parallel controllers, that is, controllers which aren't nested in the dom but which reside on the same dom level (they are children of the same tag but not of each other). In such a case we cannot broadcast or emit events across the scope. The two controllers aren't in each other's hierarchy. So how can they communicate with one another?

In fact the two controllers are still contained in the same hierarchy when we consider it from a higher level. Recall that when angular encounters the ngApp directive in a page it sets up a root scope for the application. All other scopes are nested in the root scope and so inherit from it. In a sense we might say that all controllers are nested in some kind of "root controller" that is at the top level of our application.

Well we know that we can broadcast events from a parent scope (controller) to a child scope (controller), so if we could get access to the root scope we could then broadcast across parallel controllers, which are both nested in the root.

Consider the following similar page, but this time with controllers 1 and 2 in parallel and a button already wired up to an event handler in the first controller:

```html

<!DOCTYPE html>
<html lang="en" ng-app="myApp">
  <head>
    <title>Angular</title>
  </head>
  <body>
    
    <div ng-controller="controller1">
      <h3>Controller 1</h3>
      <button ng-click="msg()">Send Message</button>
    </div>
    
    <div ng-controller="controller2">
      <h3>Controller 2</h3>
    </div>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.28/angular.min.js"></script>
    <script type="text/javascript">

      angular.module('myApp', [])
        .controller('controller1', ['$scope', function($scope) {
          $scope.msg = function() {
            // ...
          };
        }])
        .controller('controller2', ['$scope', function($scope) {
          // ...
        }]);
    </script>
  </body>
</html>
```

To communicate information from one controller to the other we should *broadcast* an event on the $rootScope. The event will then travel down the dom from the tag which contains the ngApp directive and reach all its children, allowing controller 1 to send a message to controller 2 and vice versa.

We get access to the $rootScope simply by injecting it into the controller. Let's go ahead and inject it into the first controller. Add a string value to the dependency array and include it as a parameter in the constructor function. Mind the position!

```js
.controller('controller1', ['$scope', '$rootScope' function($scope, $rootScope) {
  $scope.msg = function() {
    // ...
  };
}])
```

We can then call $broadcast as we did before but on the $rootScope object. We'll do this in response to the button being clicked:

```js
.controller('controller1', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.msg = function() {
    $rootScope.$broadcast('app:myevent');
  };     
}])
```

Over in the second controller we don't need the root scope dependency because the event will travel down the scope chain and arrive on the scope object, which we're already injecting. We can just listen for the event there using the $on method as we've already seen:

```js
.controller('controller2', ['$scope', function($scope) {
  $scope.$on('app:myevent', function(evt) {
    console.log('received app:myevent from controller 2');
  });
}]);
```

What we're doing here with broadcasting and listening for events is no different than what we did with nested scopes but we must use the $rootScope service to do it.
 
We'll actually learn a better way to communicate selection in a master-detail interface when we learn about the ui-router extension in a future lesson, but propogating delete or rename events without reloading the entire page may very well be accomplished like this.

## Summary

$timeout and $rootScope are two of many services available to an angular application. Timeout uses promises to call back into success and failure functions after asynchronous activity. Scope supports the use of events to watch for changes to model objects and to communicate arbitrary, application defined information across controllers. When parallel controllers need to communicate events with one another they can use the rootScope service to do so. We've learned about these two services and more importantly how to use them.

Among the other services available to angular applications we'll learn about the http and resource services in our next lesson. But first let's take a look a defining our own services.