Angular Modules
======

All application code in angular belongs to a module. Application module's don't actually provide any functionality. They just group code.

We'll learn that, in addition to controllers, we can also create services, providers, our own directives and filters, and other constructs. All of these will be created as part of a module.

## Defining a Module

We define a module by calling the `angular.module()` method with two arguments, the module name and an array of dependencies. We'll learn about dependencies in upcoming lessons, but for now we'll be able to do a great deal with an empty array.

Syntax:

```
angluar.module(name, [dependencies])
```

So for example we can create a module called "myApp" with:

```js
angular.module('myApp', []);
```

This function returns a module object that exposes other functions which let us define controllers and other constructs on the module. We could store the value in a variable:

```js
var myApp = angular.module('myApp', []);
```

Typically we won't do this however, as it pollutes javascript's global namespace, and we have other ways of referring to the module.

## ngApp

We discussed a number of angular directives in our last lesson but we left out a discussion of the ngApp directive. Recall that our example html document looked something like:

```html
<!doctype html>
<html ng-app>
<head>
  ...
</head>
<body>
  ...
</body>
```

Notice the use of the ngApp directive in the html tag:

```html
<html ng-app>
```

This directive instructs angular to associate a module with this web page. When we use the directive without specifying a module by name, angular creates a module for us and sets up a *root scope* which lets us bind html elements to model data with directives and expressions.

Normally we'll specify the name of the module that our web page should use. We'll then be able to reference application constructs that are part of that module, such as custom controllers, inside the html.

For example, we've created a module named `myApp` so we should assign this value to the ngApp directive:

```html
<html ng-app="myApp">
```

Of course we'll need to include the javascript that creates the module, otherwise angular will throw an exception. Altogether our page might look something like:

```html
<!doctype html>
<html ng-app="myApp">
<head>
  ...
</head>
<body>
  ...
  
  <script src="/path/to/angular.js"></script>
  
  <script>
    angular.module('myApp', []);
  </script>
  
</body>
```

Note that normally you would include your custom javascript in a separate file and link to it from the page.

## Using a Module

We'll use a module by calling methods on it that create our application constructs such as controllers, services, custom directives and so on.

For example to create a controller for our application we'll call the `controller()` method on the application module object. This method takes a name and a constructor function which will be used to instantiate the controller when the corresponding directive is encoutered in the webpage.

Syntax:

```
someModule.controller(name, function)
```

For example we'll create a controller called "bodyController" like so:

```js
myApp.controller('bodyController', function() {
  // ...
});
```

Pay special attention to the syntax. We're passing in an anonymous constructor function to the `controller()` method, so be sure to get your curly braces and parentheses correct.

**Module method chaining**

The method that creates a module supports *method chaining*, which means it returns the object itself so that we can call additional methods on it immediately. This means that normally we won't save the module into a variable but will instead call methods directly on it like so:

```js
angular.module('myApp', []).controller('bodyController', function() {
  // ...
});
```

You'll often see it written like:

```js
angular.module('myApp', [])
  .controller('bodyController', function() {
    // ...
  });
```

All we're doing is calling `controller()` on the result of calling `angular.module()`, which is an angular module object.

**Refering to a module by name**

We could chain additional calls to the `controller()` method after the first one, as they always returns the original module object. But this can get out of hand once our application has a number of controllers, and it won't be possible if we keep our controllers in different javascript files.

Instead of method chaining we'll typically get an instance of a module by name and define additional controllers from there. Just as we can *define* a module by calling `angular.module()` and passing in the module name and an array of dependencies, we can *retrieve* a module by calling `angular.module()` with only the module's name, like so:

```
angular.module(name)
```

The module must already be defined. So for example after we have defined our module we can then define our "bodyController" on "myApp" like this:

```js
angular.module('myApp').controller('bodyController', function() {
  // ...
});
```

Altogether our code will first define the module and then will retrieve it to define controllers and other application constructs on it:

```js
// define the module: don't forget the dependencies array!
angular.module('myApp', []);

// get the module and define a controller
angular.module('myApp').controller('bodyController', function() {
  // ...
});

// get the module and define another controller
angular.module('myApp').controller('footerController', function() {
  // ...
});
```

This is how we will typically create a module along with additional application constructs.