Nested Scope in Angular
=====

We can nest controllers in our view just as we can nest elements inside one another in html. This is as simple as using the ngController directive on an element that's already in a tag with its own ngController directive.

Because angular instantiates a new scope for each controller, we also end up with nested scopes. Nested scopes inherit values from their parents and so behave mostly as you would expect them to but with quirks that are unique to javascript.

## Nested Scopes and Scope Inheritance

Let's see an example. We'll use a bodyController and a headerController with a title property on the bodyController scope that we'll reference in both parts of the page:

```html
<!doctype html>
<html ng-app="myApp">
<head>
  <title></title>
</head>
<body ng-controller="bodyController">
  
  <h3>In the Body</h3>
  <p>{{title}}</p>
  
  <div ng-controller="headerController">
    <h3>Nested in the Header</h3>
    <p>{{title}}</p>
  </div>

  <script type="text/javascript" src="/angular.min.js"></script>
  <script type="text/javascript">
    // script follows
  </script>
</body>
```

Notice that we are using the ngController directive on the body tag and on a div tag inside the body. We have a nested scope.

Also totice the use of `{{title}}` in both the bodyController html and the headerController html.

Our application will then have two controllers, and let's go ahead and set up the $scope on the bodyController to have a title:

```js
// define the module: don't forget the dependencies array!
angular.module('myApp', []);

// get the module and define the body controller
angular.module('myApp').controller('bodyController', function($scope) {
  // set up the scope
  $scope.title = 'From the body controller';
});

// get the module and define the header controller
angular.module('myApp').controller('headerController', function($scope) {
  // no scope set up
});
```

Again, let me state that our nested scope in the headerController is *inheriting* from the scope in the bodyController -- angular sets this up for us -- so the title correctly appears in both parts of the page.

Let's add an input field under the control of the bodyController that binds to the title:


```html
<h3>In the Body</h3>
<p>{{title}}</p>

<input type="text" ng-model="title">
```

Type in the text field and the values everywhere in the dom change accordingly. This is good and expected.

Now for the unexpected. Add a second input field under the control of the headerController:

```html
<div ng-controller="headerController">
<h3>Nested in the Header</h3>
<p>{{title}}</p>

<input type="text" ng-model="title">
</div>
```

Type in the first input field. All the values change, which is again good and right. Scopes inherit so we should expect this. But now, type in the second input field.

Oh dear god.

Only the values in the nested scope change, even though I've correctly stated that nested scopes inherit from their parents. What's going on then? Why aren't the values in the bodyController also updating when we change values in the headerController?

## Inheritance in JavaScript

Recall that the $scope is just a normal javascript object that angular instantiates and injects into our controller whenever it encounters an ngController directive. It really is like:

```js
var $scope = { };
```

Javascript objects can inherit from one another, but objects inherit *prototypically* from one another in javascript, instead of using *class-based* inheritance which you might be familiar with from every other object oriented language.

In class-based inheritance, subclasses always use property values from a parent class when they are available. When I get or set a property on an instance of a class, if that property is defined on the superclass, the values are set there, not on the subclass itself.

In fact I believe most languages forbid a subclass from overriding properties, even though they can override methods. If `Foo` defines a `qux` property and `Bar` inherits from `Foo`, then `Bar` cannot also define a `qux` property. Static type checking will prevent it.

Somewhat disturbingly, this is not the case in javascript. In javascript we have a prototype chain instead of a class chain. Objects don't subclass one another, object use other objects as their *prototypes*. Practically this means two things. One is familiar and the other is strange.

On the one hand, when a method or more importantly in our case a property is referenced on an object, **not defined** but referenced (used), the runtime first checks to see if it exists on that object. If it does it calls the method or gets the value. If it does not the runtime walks up the prototype chain, checking each parent object in the chain for the method or property. The first time it finds it, it uses it. If it doesn't find it you'll get undefined for a property or a runtime error if you try to call a nonexistant method. Fine. This is similar to class-based inheritance.

On the other hand, when you **define** a method on an object or set a value on an object property, the value is set on that object *even if it already exists on a parent*. For methods this is a lot like a subclass overriding a method. But the same thing happens for properties. Now, when we later refer to that property or method, the runtime checks to see if the object has it, sees that it does, and uses it without needing to walk up the prototype chain.

In a sense, javascript objects that prototypically inherit from other objects can override both methods and properties.

## Revisiting Nested Scope

Let's revisit our example above and analyze what is going on with the `title` property.

When angular walks the dom after initialization and sees the ngController directive for the bodyController it instantiates a new scope and calls the controller's constructor function, injecting the scope as an argument. Our controller immediately sets the title on the scope.

Angular then encounters our headerController. Angular instantiates another scope object *and sets it prototype to the bodyController's scope object* so that it prototypically inherits from it. We haven't encountered this before, but it looks something like:

```js
var $scope1 = { };
var $scope2 = { };

$scope2.__proto__ = $scope1;
```

Now when angular goes to render the unnested `{{title}}` and `ng-model="title"` in the page, it checks the bodyController scope for a title property, sees it, and uses it.

When angular checks the *nested* 
`{{title}}` and `ng-model="title"` is checks the headerController scope for a title property, doesn't find it, walks up the prototype chain to the bodyController scope, finds it and uses it.

Now when we change the title by typing in the unnested text field, we set the title on the bodyController. Angular sees the change and our template and model values update as they did before.

However, when we change the title by typing in the *nested* field, we set the title on the headerController, not the bodyController, because that is the most local scope. Angular sees the change and our template and model values go to update.

Now, however, when angular renders the *nested* titles, it checks the headerController for a title value, finds it, and uses it, no longer needing to walk up the prototype chain. The title value for the unnested elements continues to work the same as before.

## Practical Nesting

I may have belabored this topic a bit, but is important it to understand it so that we can avoid hard to track down bugs in our code.

We will certainly be using nested controllers in our application. In fact the routing module we'll learn about in future lessons encourages the use of nested controllers. How can we avoid some of the confusion that might arise from javascript prototypical inheritance with scope?

First and foremost we can use unique property on our scope objects. If you are going to have a nested scope, don't use a `title` property that is supposed to be different in both of them.

Second, design ahead and be aware of the scopes that angular creates for you. Remember that angular creates a new scope for each element made with the ngRepeat directive too. You may be refering to an object in that scope that uses the same property names as objects higher up in the prototype chain. If the object is missing that property, angular will walk the prototype chain and you will get an unexpected value.

## Summary

Controllers help us organize our code into groups of data and behavior that are local to sections of a webpage. We will expose data and functionality on a controller's $scope object, and elements of the page that are under the control of that controller will have access to them. We ensure this with the ngController directive. Doing so strictly limits what information parts of our webpage have acccess to and helps us write modular code, maintainable code.

We can nest controllers in our views, which leads to nested scopes. Scopes deeper down in the dom hierarchy prototyipcally inherit from their parents. Most of the time we'll get the expected behavior but we must be aware that prototypical inheritance is different from class-based inheritance so that we can recognize unexpected behavior that is caused by it.

When you create a controller for your application be sure that you define it on the application module and that you include the $scope parameter in the constructor function if you intend to make data and behavior available to the view.