Angular Dependency Injection
=====

Let's take a closer look at Angular's use of dependency injection. We learned in the previous lesson that angular instantiates and *injects* dependencies into the methods that require them. Angular accomplishes this for us, meaning that our code should not be instantiating objects from other parts of our application or other modules. What exactly does this look like?

## The Old Way in C++

Consider the following C++ code. Notice that Foo has a dependency on Bar. In Foo's constructor an instance of Bar is created and Foo does something with it. Main then instantiates a Foo. The critical point to know here is that Foo is instantiating bar itself.

```c++
class Bar { };

class Foo { 
  public: Foo(); 
};

Foo::Foo() {
  Bar *bar = new Bar();
  // do something with bar
}

int main() {
  Foo *foo = new Foo();
}

```

## Dependency Injection in C++

Now consider this counterexample. Foo still has a dependency on Bar but now an instance of Bar is being created in main and passed into Foo's constructor. Foo is no longer responsible for instantiating a Bar itself:

```c++
class Bar { };

class Foo { 
  public: Foo(Bar *bar); 
};

Foo::Foo(Bar *bar) {
  // do something with bar
}

int main() {
  Bar *bar = new Bar();
  Foo *foo = new Foo(bar);
}
```

In both cases Foo requires a Bar, but in the second case an instance of Bar is being injected into the constructor, which is just to say that it's being passed in as an argument.

## About Dependency Injection

In principle this is all dependency injection is. Classes and methods are injected with instances of objects they depend on rather than instantiating those objects themselves.

Why do this? First, imagine that you don't actually have to write the main method yourself and instead have a language which can introspect the method parameters at runtime and see what objects they depend on. Suddenly you are writing a lot less setup code. Angular is doing just this for us, taking advantage of javascript's runtime features. Try this in node:

```js
> function foo($scope) { $scope.x = 1; }
> foo.toString();
'function foo($scope) { $scope.x = 1; }'
```

You can imagine that it's not hard to determine what arguments a function wants by using a string representation of its definition.

Second, methods are much simpler to test when you inject dependencies in them. The code reponsible for instantiating dependencies can instead instantiate *mock* objects, which are standins for the actual dependencies with predefined behavior. Testing code can focus on testing the behavior of the object being tested and not have to worry about its dependencies.

For example, imagine a method which uses a dependency to make a network call to a server and then transforms the results. You want to test the transformation. But now you have to set up a server that returns the right objects so that your test correctly anticipates what the effect of the transformation should be, and you have to make sure the network connections are up.

With dependency injection, you mock the network dependency in your test and have it produce a canned response from your test code. Since your test code is dictating the fake response, your test can also anticipate the results of the transformation and focus on that alone, ignoring the condition of the network and server.

## Dependency Injection in Angular

Angular makes dependency injection a breeze. Whenever we want to declare a dependency in a method we simply include the name of that dependency as a parameter. This is one of the reason why angular uses the dollar sign `$` for its builtin objects. Angular quickly sees what angular dependencies are required and handles their instantiation. The example we're already familiar with is $scope:

```js
angular.module('myApp').controller('name', function($scope) { ... });
```

Angular sees the $scope parameter, recognizes it as a builtin angular object and dependency, and instantiates and injects it into the controller function.

There are a number of other angular objects we can inject into controllers. One of them is the $http service, which we'll learn more about in the next lesson. We can inject it and the $scope into our controller like so:

```js
angular.module('myApp').controller('name', function($scope, $http) { ... });
```

The order of the parameters doesn't matter because their names are introspected from the parameters list:

```js
angular.module('myApp').controller('name', function($http, $scope) { ... });
```

We'll learn in a moment that we can define our own services, constants, "factories" and so on in our modules. When we do we give them a name, and then we can use that name for the dependency injection:

```js
angular.module('myApp').constant('version', 1.1);

angular.module('myApp').controller('name', function($scope, version) {
 // version will be 1.1
});
```

Here we're assigning the value 1.1 to the constant named "version". We can then depend on that constant in other parts of our application by including it by name in the function's parameters;

## Explicit Dependency Injection

The use of function parameter introspection to infer dependencies should feel fragile to you. In fact it breaks badly when we use minification to optimize the delivery of our javascript files.

Minification strips unnecessary characters from javascript, effectively compressing it to improve the speed of its delivery over network connections. Minification might rename a local variable so that is uses fewer characters. Consider the following code:

```js
function doubleIt(myParameter) {
  return myParameter * 2;
}

doubleIt(5);
```

And a minified version, which is effectively the same:

```js
function x(y){return y*2;}x(5);
```

When angular code is minified the argument names change and no longer match the names of builtin angular objects or the names of the other objects you've defined.

Instead of relying on argument names for dependency injection we should explitly define our dependencies. We do this by using an array in place of a function for any angular method which takes a constructor function that contains dependencies. Inside the array we list the dependencies one after the other as string values, and then the final argument to the array is the normal function with arguments. It looks like this:

Before:

```js
angular.module('myApp').controller('name', function($scope) {
 // do something with $scope
});
```

After:

```js
angular.module('myApp').controller('name', ['$scope', function($scope) {
  // do something with $scope
}]);
```

Notice that we pass an array to the controller method instead of a function. The array contains the named dependencies as strings, which won't be changed when the code is minified, and the last argument is the normal function, which includes one argument each for the listed dependencies. Angular reads the array of string values, instantiates the objects by name, and then injects them into the function.

Be careful! Now the order of the parameters matters. The order of the parameters must match the order of the named dependencies. On the other hand, we can use whatever name for our parameters we want as long as we get the order right. In practice you should use the same name as the dependency.

Also pay special attention to the syntax, especially the final line, which ends in a strange looking:

```js
}]);
```

Here we're closing the function with `}`, closing the array with `]` and then closing the call to controller with `)`.

We should always set up our dependencies like this, assuming that our code will later be minified. **Never do it the shorter way**.

## Modules & Dependency Injection

Just as our controllers can depend on other angular objects and our own services and we can have those injected into our constructor functions, so too can our application module rely on other modules and have the controllers and services defined there injected into it.

We saw that when we define a module we pass two arguments to the module function and that the second is an array of dependencies:

```js
// with dependencies defines the module
angular.module('myApp', []);

// while no dependencies gets the module
angular.module('myApp');
```

In some cases we'll have module level dependencies. Angular itself provides additional functionality inside of modules, and we'll use the [uiRouter module](https://github.com/angular-ui/ui-router) in future lessons. In these cases we'll include the javascript files in our html and then list the dependencies on our module as described in their documentation, e.g.:

```js
angular.module('myApp', ['ui.router']); // adds ui-router dependency
```

Now, any objects, controllers, services, etc defined on that module are available by name in myApp's controllers and other objects. For example, we'll see that uiRouter defines a $state object. We can now inject that object into our controllers by name *without needing to refer to uiRouter*:

```js
angular.module('myApp').controller('name', ['$state', function($state) {
  // so something with $state
}]);
```

We can do this with our own modules as well. Let's define a "constants" module, define a constant on it, then inject it into our application module and depend on it in an application controller. I'll take advantage of the fact that the call to module() immediately returns the module's instance so I can call additional methods on it. We learned that this is called *method chaining*:

```js
// define a "constants" module and "version" on it
angular.module('constants', []).constant('version', 1.1);

// define my application module with the "constants" dependency
angular.module('myApp', ['constants']);

// define a controller which depends on "version" from the constants module
angular.module('myApp').controller('name', ['version', function(version) {
  // ...
}]);
```

When we create a module, a constant or another service we always provide a name, and in doing so we register the module or service with the dependency injector, which now knows how to instantiate or otherwise prepare that service when it is required by controllers and other objects.

Pay special attention as you begin to add module dependencies to your application. You might imagine that namespace issues start to arise with multiple controllers, constants, services and so on sharing the same name. If two separate modules use the same service name, and you include those modules in a third, only one of those services will be available to it. Always check the documentation to avoid name clashes.
