Promises in Angular
====

A promise represents the result of an asynchronous operation. Typically that means it will represent a value that is not yet available, but it provides behavior that allows our code to act once the value does become available. We can say that a promise is a proxy for a future value.

Quite a bit of code in javascript is asynchronous. On the server we write asynchronous code when we want to access a database or perform a long running file operation. In the browser we use asynchronous code to perform network operations.

For example we might make a GET request to some resource on the server, but instead of waiting for the request to finish, which would render our application interface unresponsive, we let the network operation take place in the background. Our application continues to run in the foreground in the meantime When the network operation finishes it will call back into code we've provided so that we can then update the interface.

A promise encapsulates this asynchronous operation and its result and allows us to write relatively straightforward code to initiate it and respond to it.

## Resources

[$q Service](https://docs.angularjs.org/api/ng/service/$q)

The $q service documentation, which provides access to promises by way of *deferred* objects.

## Resolving and Rejecting

Code that returns a promise, such as an $http request, will internally be responsible for *resolving* or *rejecting* a promise. Our code, which called the $http request in the first place, will provide success and failure callback functions that will be called when, internally, the $http request either resolves or rejects the promise. It will resolve when, for example, the network operation completed successfully. It will reject it when on the other hand a network error occurs or the server denies the request.

A promise is always either resolved or rejected. When we write code that uses promises we will always provide a success callback for the resolution and we will often provide a second failure callback for the rejection. When we create promises ourselves to encapsulate asynchronous operations, we must always resolve or reject them.

## Using Promises

A promise is a proxy that will provide a value in the future. Functions return promises when they have asynchronous operations that complete after the function returns. When the asynchronous operation completes the function will either resolve or reject the promise it previously returned. When the function resolves the promise it provides a value, typically the result of the asynchronous operation. When the function rejects the promise it provides an error message. At this point the future value has arrived or an error has occurred.

**then**

To access the value on a promise object that a function returns we call the `then` method on it. This method typically takes two arguments which will be callback functions that are called when the promise is rejected or resolved. The first callback is the success callback for resolution and the second is the failure callback for rejection.

The syntax for this method is as follows:

```
promise.then( function, function )
```

Including the function signatures for those callback functions, the syntax looks like:

```
promise.then( function(result) { ... }, function(error) { ... } )
```

The success callback argument will be the data acquired after the asynchronous operation completes, and the error callback argument will be some error object or message describing a failure in the asynchronous operation.

Often you will see it written like:

```js
promise.then(
  function(result) {
    // ...
  },
  function(error) {
    // ...
  });
```

Pay special attention to the syntax as you write this kind of code.

Normally we won't save the returned promise into a variable. Intead we'll just call `then` directly on the result of calling the original function, like so:

```js
funcThatReturnsPromise().then(
  function(result) {
    // ...
  },
  function(error) {
    // ...
  });
```

Code like this looks synchronous in that we're calling another function, the `then` function, right away, when in fact then itself takes callbacks that are only called once the promise is asynchronously resolved or rejected. Promises abstract the asynchronicity of an operation and provide a straightforward interface for getting the results or an error back from it.

Let's see promises in action with the $http service. We'll learn more about this service in the next section. For now let's focus on the fact that $http lets us retrieve resources from a server asynchronously and returns a promise on which we can call `then` to access the results.

Set up a basic *index.html* webpage with an ng-app directive and a body controller. In the body controller repeat over a users array that injects names into the dom:

**index.html**

```html
<!doctype html>
<html ng-app="myApp">
<head>
  <title></title>
</head>
<body ng-controller="bodyController">

  <h3>Users</h3>
  <div ng-repeat="user in users">
    {{user.name}}
  </div>

  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.11/angular.min.js"></script>

  <script type="text/javascript">
    // angular code ...
  </script>

</body>
</html>
```

Also create a json file inside the same directory as the html document. We'll make it an array of user objects with names and ids. Save it as *users.json*:

**users.json**

```js
[
  {
    "name": "Mr. T.",
    "id": 1
  },
  {
    "name": "Ripley",
    "id": 2
  },
  {
    "name": "Benjamin Button",
    "id": 3
  },
  {
    "name": "Ruby Rod",
    "id": 4
  }
]
```

In order to use the $http service, which makes an [ajax call (asynchronous javascript call)](https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started) to a server, we'll actually need to be running a server. In the command line `cd` into the directory with your files and start up python's simple http server, either with:

```
python -m SimpleHTTPServer
```

or:

```
python -m http.server
```

Ensure that you're server is working by visiting http://localhost:8000 in a browser.

What we'd like to do now is request the json resource from our body controller when it is initialized and then inject the resulting user data into the page when it arrives. We can use the $http service to do this. As I've already mentioned the $http service methods perform asynchronous operations and return a promise. We'll call `then` on the resulting object and give it two callbacks, one of which the $http service method will call after the asynchronous operation completes or fails.

Here's what our angular code looks like:

```js
angular.module('myApp', []);

angular.module('myApp').controller('bodyController', 
  ['$scope', '$http', function($scope, $http) {

  $http.get('/users.json').then(
    function(response) {
      $scope.users = response.data;
    },
    function(error) {
      console.log('get /users.json error:', error);
    });

}]);
```

We make the `$http.get` call, which immediately returns a promise, and call `then` on that, providing our two success and failure callbacks. When the promise resolves because the asynchronous operation completed successfully our success callback is called with the ajax result.

As we'll learn in the next section, for the $http methods this result is a full http response object with information about the http status, headers and body content. We can extract the body by calling `response.data`, which in our case is json that has automatically been deserialized into a normal javascript object, in this case an array. We can then just pass that data to the scope, which causes our html to update.

If an error were to occur instead, for example we requested a non-existant resource, the failure callback will be called and we can handle the error in an application specific manner. Here we just log it to the console.

## Creating Promises

Let's create a promise ourselves to get a clearer understanding of what is happening internally. We'll use angular's $timeout service to set up an asynchronous operation.

Angular provides the $q service to create *deferred* objects which encapsulate promise behavior. We'll use the deferred object value we get back from $q to get the promise as well as to resolve or reject it.

Let's first create a function that will return a promise object. You could imagine this function being defined in a service or as a utility method in a controler. Be sure you've injected the $q service whereve you're using this:

```js
function performAsync() {
  var deferred = $q.defer();

  return deferred.promise;
}
```

All we're doing is created a deferred object from the $q service and returning its promise instance. Importantly, this function returns that promise object immediately.

Next we should perform some asynchronous operation. Be sure you've injected the $timeout service and run a function that will finish executing in a couple seconds:

```js
function performAsync() {
  var deferred = $q.defer();

  $timeout(function() {

  }, 2000);

  return deferred.promise;
}
```

Now inside the timeout's callback function, which is only called after that two second delay, we should call resolve on the deferred object. Whatever value we pass to resolve is the value that will be propogated to the promise's success callback function:

```js
function performAsync() {
  var deferred = $q.defer();

  $timeout(function() {
    deferred.resolve('Success Value');
  }, 2000);

  return deferred.promise;
}
```

You could imagine that in a real asynchronous operation some error might occur, in which case we would call the reject function, something like this:

```js
function performAsync() {
  var deferred = $q.defer();

  $timeout(function(error) {
    if (error) {
      // never called, example only
      deferred.reject('Error Value');
    } else {
      deferred.resolve('Success Value');
    }
  }, 2000);

  return deferred.promise;
}
```

For the timeout callback the error parameter will always be undefined.

We're now ready to use this function. We'll call it, and the object we get back is a promise. We already know that we should call `then` on the promise object and provide two callback funcions, one for the success condition and one for the failure condition, in that order:

```js
performAsync().then(
  function(msg) {
    console.log('Success Callback:', msg);
  },
  function(err) {
    console.log('Failure Callback:', msg);
  });
```

When the promise is resolved the success callback is executed, and when it is rejected the failure callback is.

Altogether our code inside a controller and module with the properly injected dependencies looks like:

```js
angular.module('myApp', []).controller('bodyController', 
  ['$scope', '$q', '$timeout', function($scope, $q, $timeout) {

  function performAsync() {
    var deferred = $q.defer();

    $timeout(function(error) {
      if (error) {
        // never called, example only
        deferred.reject('Error Value');
      } else {
        deferred.resolve('Success Value');
      }
    }, 2000);

    return deferred.promise;
  }

  performAsync().then(
    function(msg) {
      console.log('Success Callback:', msg);
    },
    function(err) {
      console.log('Failure Callback:', msg);
    });

}]);
```

Even better we could put the `performAsync` function in a service.

<!--
## Promise Chaining

...
-->

## Summary

Promises can seem confusing. As soon as we step out of the normal imperative order of operations and move into asynchronous programming we must pay special attention to what code is executed when. Promises help us do this.

A promise is a proxy for a future value. Functions that perform asynchronous operations return promises and when the operation is complete either resolve them or reject them. We can call `then` on the promise object to provide success and failure callback handlers. When the promise is resolved the success callback executes with the result, and when the promise is rejected the failure callback executes with an error.

We'll get quite a bit of practice with promises in the next section with the $http service and in our next lesson on the ui.router extension.
