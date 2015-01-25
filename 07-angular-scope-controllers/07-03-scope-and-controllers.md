Angular Scope & Controllers
====

We've seen in our lesson on data binding that the data available to the view exists on the scope. The scope is just a regular javascript object that exposes data and methods to the web page. The job of a controller in an angular application is to set up the scope. The controller won't initialize the scope itself. We'll see that the angular framework actually initializes the scope and *injects* it into the controller, but then the controller will add model data to it and create methods on it that can be called from the view. Only this data and these methods will be available to the view.

The job of a controller is to set up the scope and so strictly limit what data and functionality parts of the webpage have access to.

## Rerefences

[MDN on Protypical Inheritance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain)

The Mozilla Developer Network on JavaScript's strange inheritance pattern, which affects how the $scope object works.

## Sample Web Page

Let's set up a sample web page that we'll put under the control of an angular application and a controller:

```html
<!doctype html>
<html ng-app="myApp">
<head>
  <title></title>
</head>
<body ng-controller="bodyController">
  <!-- all elements in the body use the bodyController sope -->

  <h3>Input</h3>
  <input ng-model="text">

  <h3>Output</h3>
  <p ng-bind="text"></p>

  <script type="text/javascript" src="/angular.min.js"></script>
  <script type="text/javascript">
    // application js here
  </script>
</body>
```

This is the same example we were using before but now we have the ngApp and ngController directives in use and given values:

```html
<html ng-app="myApp">
...
<body ng-controller="bodyController">
```

We already know that the **ngApp** directive associates this web page with an angular module named "myApp", which we'll need to define.

The **ngController** directive places that element and all elements it contains under the control of an angular controller, in this case named "bodyController". That means that the scope object that we'll use with other angular directives like **ngModel** or handlebar expressions will be managed by bodyController.

We'll need to define this controller.

## Defining a Controller

Let's define the myApp module and bodyController controller for this web page. The code should appear in the second script tag:

```js
// define the module: don't forget the dependencies array!
angular.module('myApp', []);

// get the module and define the body controller by name
angular.module('myApp').controller('bodyController', function($scope) {
  // ...
});
```

First we define the module and then we get it and define the bodyController on it. We pass to arguments to the controller function, with syntax that looks like:

```
module.controller( name, function )
```

Pay special attention to the single argument to our anonymous constructor function **$scope**. When angular sees the ngController directive on the body tag in our page, it initializes a scope object and then calls the constructor function for that controller with that scope object as an argument. 

How does angular know to pass in this scope object to our function? This is dependency injection at work. Angular actually introspects the function parameters, sees that one of them is called $scope, *and not something else*, and so calls the constructor with a scope argument. If we left out the $scope parameter angular would still initialize a scope for this controller and so for that part of the view under its control but it would not pass it to the constructor function.

## Setting up the $scope with data

Inside of the controller we now have access to the $scope for that part of the page. Remember the $scope is just a regular javascript object so we can assign property values to it. We're already accesing one of those properties, or what I've been calling model data, inside our html page with the ngModel directive:

```html
<h3>Input</h3>
<input ng-model="text">

<h3>Output</h3>
<p ng-bind="text"></p>
```

Let's initialize the `text` property on the scope to some value, which will be reflected in our web page because the bodyController is in scope for those elements:

```js
angular.module('myApp').controller('bodyController', function($scope) {
  $scope.text = "hello world";
});
```

Altogether our page should like this:

```html
<!doctype html>
<html ng-app="myApp">
<head>
  <title></title>
</head>
<body ng-controller="bodyController">
  <!-- all elements in the body use the bodyController sope -->

  <h3>Input</h3>
  <input ng-model="text">

  <h3>Output</h3>
  <p ng-bind="text"></p>

  <script type="text/javascript" src="/angular.min.js"></script>
  <script type="text/javascript">
    // define the module: don't forget the dependencies array!
    angular.module('myApp', []);

    // get the module and define the body controller
    angular.module('myApp').controller('bodyController', function($scope) {
      // set up the scope
      $scope.text = 'hello world';
    });
  </script>
</body>
```

If you don't have a local copy of angular.min.js in the same directory as this page you'll need to get one or point the link to a copy on the internet, such as:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.28/angular.min.js"></script>
```

We can add whatever data we want to the scope and then refer to it in our view using **ngModel**, **ngRepeat** and other directives and expressions. Let's set up another property and refer to it from the page:

Put this html at the top of the page

```html
<h1>{{title}}</h1>
```

And add this to the controller:

```js
$scope.title = 'Test Page';
```

We can add more complex objects to the scope. Add an array and use it with the **ngRepeat** directive. Add this html to the bottom of the page:

```html
<div ng-repeat="name in names">
 {{name}}
</div>
```

And add this to the controller:

```js
$scope.names = ['Philip', 'Margaret', 'John', 'Penelope'];
```

Notice how similar this is to our previous use of **ngInit**. ngInit does the same thing: it is setting properties on the scope object which are available to the view where that object is in scope. Now we're doing it in the controller, which is to say inside of our javascript code where the rest of our application logic resides.

## In Scope

What does it mean to be "in scope"? Properties on the scope are only accessible to the view where that scope is valid. A controller's scope is valid on whatever element a controller is defined and on all elements contained within that element.

In our example we've defined the controller on the body with the **ngController** directive, but what happens if we move it to an empty div at the top of the page:

```html
<body>
<div ng-controller="bodyController">
  <!-- empty -->
</div>
...
```

Refresh the page. Everything is broken. The scope values we've set up no longer appear in the page because all of those properties are out of scope there. Only our empty div has access to the scope on bodyController, and it doesn't refer to it at all. This is what it means to be in scope and it is why this object is called the scope object.

But I've lied. In truth not everything is broken. Start typing in the input field and sure enough we still get the text repeated back to us. The text property is still working. Why?

Recall that a root scope is set up for the page when **ngApp** is first encountered. The rest of the page still has access to this scope, so references to the *text* model property on the text field and in the paragraph use the root scope instead of the bodyController's scope. It simply doesn't have a value when the page is first loaded.

There is a deeper conundrum here which has to do with how scope inherits in a page which we will discuss later in this lesson.

In the meantime, set the controller back to the body and get rid of the empty div:

```html
<body ng-controller="bodyController"> ...
```

## Settting up the $scope with functions

Just as we can use a controller to set up data on the scope and refer to that data in our view we can also set up functions on the scope and have those functions called from the view. This is how we will handle events like mouse clicks on the page.

We'll attach a function to the scope just as we would any function to a javascript object:

```js
$scope.clickName = function() {
  console.log('clicked name');
  // do something
};
```

Note that we are naming the function by assigning it to a particular property on the $scope object, not by giving the function a name. In a sense this is an anonymous function and we can only refer to it by way of the $scope object.

**ngClick**

We can use this function by assigning it to dom events like a mouse click using directives like the **ngClick** directive. Let's attach it to the div that we're already using ngRepeat on:

```html
<div ng-repeat="name in names" ng-click="clickName()">
  {{name}}
</div>
```

Here we're just adding `ng-click=clickName()` to the div. Be careful. We are actually calling this function when the click event occurs, so we need to use the parenthesis with it.

Refresh the page and click a name. Watch the console, where you should see the log message appear.

It would be more useful if we could pass the name we clicked to the clickName function. Well it turns out that the ngRepeat directive creates a new scope for each element through the repetition, and the variable refered to in the directive is made available to that scope. That means that, here, `name` is available to the div and its contents.

We kind of already knew that, right? We're referring to the name in the expression:

```html
{{name}}
```

But now we know where that `name` is coming from. It's part of the narrower scope that is created with each iteration through the ngRepeat directive. But `name` is also available *on the div element itself*, which means we can refer to it in our ngClick directive and pass it as an argument to `clickName`:

```html
<div ng-repeat="name in names" ng-click="clickName(name)">
  {{name}}
</div>
```

Now modify the clickName function in our controller to accept an argument and log that argument to the console:

```js
$scope.clickName = function(name) {
  console.log('clicked name', name);
  // do something with name
};
```

Refresh the page and click away. Pretty sweet. And exceptionally easy.

<!-- What about the event object: homework assignment -->
