Angular: Custom Services
=====

We've seen how to use the $timeout and $rootscope services and we'll learn how to use the $http service in our next lesson. Angular provides quite a few more services for us as well. But we also need to be able to define our own services and inject them into our controllers.

Angular makes it easy to do this. We'll define our own services just as we define our own controllers. We'll define them on the module and we'll give them a name so that they are registered with the dependency injector and can be used elsewhere in our application by name.

Angular will allow us to define a few different types of services. We'll look at *constants*, *values*, *factories* and *services*, which somewhat confusingly are all refered to as services.

## Constants

The simplest kind of service to define is a constant. We've already seen how to define a constant: call the `constant` method on a module and provide a name and a value. Assuming the angular module `myApp` has already been defined:

```js
angular.module('myApp').value('version', 1.1);
```

We can then use the value by injecting it into a controller:

```js
angular.module('myApp').controller('myController', ['version', function(version) {
  // use version
}]);
```

Doing this is much better than hardcoding the value 1.1 in a number of controllers and follows a coding practice known as **DRY: Don't Repeat Yourself**.

**The Config Block**

When angular instantiates an application module after encountering the ngApp directive it also calls any configuration blocks that have been registered on the module. A configuration block is often used for setting up services that have variable instantiation requirements. We'll encounter more of this later. For now we'll see that we can inject a constant into the configuration block.

Register a configuration block by calling `config` on the module and providing an array of dependencies and a function, just as we do with controllers:

```js
angular.module('myApp').config(['version', function(version) {
  // use version
}]);
``` 

A constant can take on any kind of value such as a string, number, array, object or function:

```js
angular.module('myApp').constant('version', {major: 1, minor: 2}); 
```

## Values

Values are like constants except that they cannot be injected into the configuration block. Declare a value with the `value` method on a module:

```js
angular.module('myApp').value('name', function() {
  return 'myApp';
});
```

Here we've registered a function value but it could have been a number, string, array, object, etc. The value is injected into other application components the same way but because here it's a function don't forget to call it:

```js
angular.module('myApp').controller('myController', ['name', function(name) {
  // use name()
}]);
```

## Services

Angular services are singleton objects that are built from a constructor function passed to the `service` method on a module. Because they are singletons we are guaranteed to receive the same instance of a service in all of our application constructs. This means that, in addition to abstracting away shared functionality, services provide another means for controllers to communicate with one another.

Create a service the same way you create a controller but with the `service` method. A name is required and then an array of dependencies with a constructor function:

```js
angular.module('myApp').service('api', ['$http', function($http) {
  // ...
}]);
```

We'll add properties and methods to the service by attaching them to `this`, like so:

```js
angular.module('myApp').service('api', ['$http', function($http) {
  this.getUsers = function() {
    // do something with $http
  };
  this.getUser = function(id) {
    // do something with $http and id
  };
}]);
```

Here we're defining an `api` service that itself depends on angular's builtin $http service. Our api service defines two functions `getUsers` and `getUser` that need to be implemented. We use `this` to define methods and values that will be exposed on the service because an object is being instantiated and `this` is how we give a singleton object functions and values.

We can then inject and use the service in a controller:

```js
angular.module('myApp').controller('myController', ['api', function(api) {
  // api.getUsers();
  // api.getUser();
}]);
```

We'll learn more about using $http and implementing an api service in our next lesson.

## Javascipt OOP Briefly

These use of `this` in the service might seem strange because we haven't talked much about how javascript handles object oriented programming. Briefly, javascript does not use classes to instantiate objects but constructor functions. These are otherwise normal looking functions that are then used with the `new` keyword. Because they represent prototypes and are treated like we might treat classes, we usually capitalize them.

Here's a Person constructor function that can be used to instantiate instances of people with `new`:

```js
function Person() {

}

var person = new Person();
```

We could go on to use that person like a normal object:

```js
person.name = "philip";
console.log(person.name);
```

When we call `new` with the function we get back an object. One way to define functions on that object is by using `this` in the constructor function as though we were defining functions on any other javascript object:

```js
function Person() {
  this.sayHello = function() {
    console.log('hello');
  }
}

var person = new Person();
person.sayHello();
```

Because of how the javascript prototyping system works this is not the preferred way to define functions for a "class" in javascript, but it's fine to get the idea and works without any problems for singleton objects.

You can image now how angular instantiates instances of services and controllers. Internally the `service` and `controller` methods will call the constructor function we provide using the `new` keyword, something like:

```js
function angular_service(name, constructor) {
  var service = new constructor();
  // register service by name with dependency injector
}
```

In lower level javascript programming we would add methods to a constructor function differently because of how prototypical inheritance works, but what we're doing here works fine for singletons.

For more information about object-oriented programming in javascript refer to the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript).

## Factories

Factories are like services except that they are more configurable and use a normal function instead of a constructor function. That means we can return whatever we want from a factory function. When we inject a factory into another application component we are injecting whatever value is returned from the factory.

Factories are also singletons. A factory function is only called once and its return value is injected into any other application construct that depends on it.

Let's return an object from a factory with a couple of methods. Then we can use those methods wherever we inject the factory:

```js
angular.module('myApp').factory('fac', [function() {
  return {
    x: function() {
      return 1;
    },
    y: function() {
      // ...
    }
  };
}]);
```

Notice that our factory function takes no dependencies in this example but we still use an array with the function in it. The factory function returns an object and that object has two functions defined on it, `x` and `y`.

Now we can inject that object into a controller and use `x()` and `y()`:

```js
angular.module('myApp').controller('myController', ['fac', function(fac) {
  // use fac.x()
}]);
```

Because factories return a value instead of using a constructor function we can change the value they return. Imagine a factory that itself depends on an application constant or value and returns different objects depending on what the value is:

```js
angular.module('myApp').factory('fac', ['version', function(version) {
  if (version.minor == 1) {
    return {
      //  ...
    }
  } else {
    return {
      // ...
    }
  }
}]);
```

## Providers

A provider wraps a service and is the most configurable of all injectible application constructs. Providers can be injected into a module's config block where they can be set up prior to being used by controllers. But providers will then *provide* a service to other parts of the application. By wrapping the service first in a provider we can set variable values before the service is injected into other application components, which we could not do with a service by itself.

We'll create a provider by calling the provider function on the module with a name and the dependencies and function array:

```js
angular.module('myApp').provider('endpoint', [function() {

}]);
```

Here I'm registering a provider called 'endpoint'. Imagine I want to return the endpoint for an api, which is the url or preface to every actual api call. For example if I want to get a list of 'users' from a server, I might make a get request to http://server.com/api/v1/users, in which case *http://server.com/api/v1/* or */api/v1* is the endpoint.

Let's set a default endpoint in our provider function:

```js
angular.module('myApp').provider('endpointService', [function() {
  var endpoint = '/api/web/v1';
}]);
```

Now I want the application to be able to configure this endpoint, which will usually be done in an application configuration block, so that the mobile version and the web version can share the code but hit different endpoints. I should add a function for setting it:

```js
angular.module('myApp').provider('endpointService', [function() {
  var endpoint = '/api/web/v1';

  this.setEndpoint = function(url) {
    endpoint = url;
  }
}]);
```

Now in an application configuration block I can inject the provider by asking for the name of the provider, which will be the name I passed to the provider function with the string 'Provider' appended:

```js
angular.module('myApp').config(
  ['endpointServiceProvider', function(endpointServiceProvider) {
  
  endpointServiceProvider.setEndpoint('/api/mobile/v1');
}]);
```

We can use the service that is wrapped by this provider by injecting it into a controller or other application construct as we normally do:

```js
angular.module('myApp').controller('bodyController', 
  ['$scope', 'endpointService', function($scope, endpointService) {
  
});
```

But what functionality does the service provide? That is defined by the value we return from the service's `this.$get` method. Let's define that method in the service:

```js
angular.module('myApp').provider('endpointService', [function() {
  var endpoint = '/api/web/v1';

  this.setEndpoint = function(url) {
    endpoint = url;
  };

  this.$get = function() {
    // implement $get
  };
}]);
```

Angular calls $get on the provider when we inject the service it is providing into an application componenet, and whatever value $get returns is the value that will be injected. So let's return an object that itself has a function for getting the endpoint:

```js
this.$get = function() {
  return {
    getEndpoint: function() {
      return endpoint;
    }
  };
};
```

Now we can use that value, an object in this case with a function defined on it, wherever we inject this service:

```js
angular.module('myApp').controller('bodyController', 
  ['$scope', 'endpointService', function($scope, endpointService) {
  
  console.log( endpointService.getEndpoint() );
}]);
```

Alltogether our code looks like:

```js
angular.module('myApp', []);

angular.module('myApp').provider('endpointService', [function() {
  var endpoint = '/api/web/v1';

  this.setEndpoint = function(url) {
    endpoint = url;
  };

  this.$get = function() {
    return {
      getEndpoint: function() {
        return endpoint;
      }
    };
  };
}]);

angular.module('myApp').config(['endpointServiceProvider', function(endpointServiceProvider) {
  endpointServiceProvider.setEndpoint('/api/mobile/v1');
}]);

angular.module('myApp').controller('bodyController', ['$scope', 'endpointService', function($scope, endpointService) {
  console.log( endpointService.getEndpoint() );
}]);
```

In summary, we've defined an endpointService that is wrapped in a provider so that we can configure the service before it is injected into application components. We'll configure it by injecting the provider into an application config block and call methods that are defined on `this` in the provider.

The provider must then implement the `this.$get` method which is responsible for returning the actual service. Because the config block is gauranteed to be run before $get is called, whatever we return can take advantage of values set in the provider.

## Summary

Most of our code in angular will be concentrated in controllers, but we should strictly limit our controllers to seting up the scope. Other behavior, especially behavior that is shared between controllers, should be placed inside services.

Services include constants, values, factories, and services proper. When we want to configure a service before it is made available to application constructs we should wrap it in a provider and inject the provider into the module's config block, where we can customize the service prior to it's use.

Often it will be unclear whether you should use a service, factory or provider. Services and factories are largely interchangeable, while providers can seem confusing. As you develop experience with angular you will also develop best practices, preference and a deeper understanding of when a provider will be appropriate.