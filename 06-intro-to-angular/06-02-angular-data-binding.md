Introduction to AngularJS
=====

Angular is described as a framework that teaches html new tricks. It is a javascript library built on top of a lightweight version of jquery that automates a lot of the glue code complex web applications require.

Angular is an MVC framework, or Model-View-Controller framework that also helps us oragnize our application. We'll split our application into three parts: 1. the model, which handles low level data, 2. the view, which represents the data to the user, and 3. the controller, which manages interactions between the two.

Angular works by providing directives which extend html with tags, attributes, and css classes. The directives rely on model data supplied by our controllers to automatically construct and dynamically modify our html. Angular also provides a template language that lets us insert content into html without needing to write jquery-like code to do so.

Behind the scenes angular will also provide utilities such as asynchronous javascript services that let use communicate with a backend server and route handling that allows us to write what are called single page applications (SPAs), where our application handles all links *in the browser* rather than making additional full page requests to the server.

## References

[https://angularjs.org/](https://angularjs.org/)

The AngularJS homepage. The tutorial, developers guide and api reference should be your first stop for angular questions.

[https://docs.angularjs.org/guide/introduction](https://docs.angularjs.org/guide/introduction)

The angular guide at the angular homepage. Start reading it now.

[https://docs.angularjs.org/api/ng/directive](https://docs.angularjs.org/api/ng/directive)

Angular directives documentation, which we will be focusing on for today's lesson.

## Two Way Data Binding

We'll quickly appreciate angular's power by examing how it extends html using directives. Let's see how to accomplish two way databinding using angularjs directives. Modify the html we began with earlier so that it looks like this:

```html
<!doctype html>
<html ng-app>
<head>
  <title></title>
</head>
<body>

  <h3>Input</h3>
  <input ng-model="text">

  <h3>Output</h3>
  <p ng-bind="text"></p>

  <script type="text/javascript" src="/angular.min.js"></script>
</body>
```

Examine the html closely. Notice that we've added an `ng-app` attribute to the html tag, and then we've added `ng-model` and `ng-bind` attributes `="text"` to the input and paragraph tags, respectively. These are examples of angular directives. They are simply attributes that we're adding to html tags. Finally we link to the angular source code.

And that's it. Seriously. Refresh the page and start typing in the text field. The paragraph is automatically updated. All of the jquery glue code we wrote to handle this interaction is in a sense being written for us behind the scenes. This is pretty incredible.

Try adding another paragraph tag that also binds to the text model:

```html
<h3>Another Paragraph</h3>
<p ng-bind="text"></p>
```

Angular automatically handles updating its text as well. We can add another model value using `ng-model="moreText"` on a second text field and bind it to another paragraph:

```html
<h3>More Text</h3>
<input ng-model="moreText">

<h3>Output</h3>
<p ng-bind="moreText"></p>
```

Notice that I've set `ng-model` and `ng-bind` to `="moreText"` on the input field and paragraph respectively. Angular automatically distinguishes between the model values and only updates the correct fields. Imagine how much jquery code we'd need to do that.

Moreover we can initialize the text model with an `ng-init` directive on the body tag and the value will be reflected in our input field and paragraph immediately:

```html
<body ng-init="text='initial value'"> ...
```

Pay attention to the use of both double and single quotes.

**Scope, briefly**

What angular is doing underneath the hood is not all that dissimilar from what we previously coded ourselves in javascript. Angular sets up a plain old javascript object called the `$scope` and attaches model data to it. So for example when our page loads with the `ng-init` directive we'll have a variable like:

```js
var $scope = {
  text: 'initial value'
};
```

Angular then walks the dom and finds directives that reference the model data in the scope. It binds event handlers to those elements so that when an element's text value changes, such as the input field's value, angular automatically updates the model data in scope for us. Similarly angular watches for changes to data in the scope and updates values in the html when they occur.

This is our first introduction to the concept of scope, which has a huge role in the angular framework.

## Templates: One Way Data Binding

We've set up two way data binding with the `ng-model` directive. In the one direction, when the value changes in the html because of user input, the model object is updated, and in the other direction when the model object is changed then the html is updated as well.

`ng-bind` on the other hand is a one way binding. It doesn't watch for changes to the html but only for change to the model object. This makes sense because our paragraph isn't editable.

One way data bindings typically use angular's templating language instead of directives. Angular's templating languages adds a special escape code for inserting dynamic content into the html. It's two open curly braces followed by two closed curly braces:

```html
<p> {{ ... }} </p>
```

When angular encounters that sequence of characters, which I will refer to as **handlebars**, it evaluates the text between them as a javascript expression within the context of the current scope, meaning simply that we can write brief snippets of code inside those curly braces that reference the data available on the `$scope` object, such as our `text` model.

Try replacing the `ng-bind` directive in our original page with handlebars that refer to the same model data:

```html
<!doctype html>
<html ng-app>
<head>
  <title></title>
</head>
<body>

  <h3>Input</h3>
  <input ng-model="text">

  <h3>Output</h3>
  <p>{{text}}</p>

  <script type="text/javascript" src="/angular.min.js"></script>
</body>
```

Notice that we've just replaced

```html
<p ng-bind="text"></p>
```

with

```html
<p>{{text}}</p>
```

This *expression* instructs angular to evaluate `$scope.text` and insert the result into the page at that point. Moreover it sets up angular to watch for changes to that expression, which is to say changes to that variable, and automatically update the page whenever they occur.

## Expressions

Angular does something magical with expressions. It notes what variables they depend on and makes sure to update the *complete* expression any time one of their variables changes.

For example, replace the simple `{{text}}` expression with something that uses the text model data:

```html
<p>{{"you wrote: " + text}}</p>
```

Refresh the page and type in some input. As you type and changes to the `text` model are propogated to the scope, angular also updates the entire expression that depends on `text`. It sees that that expression refers to model data and re-evaluates it whenever the model changes, inserting the result into the page.

We can do this with multiple model variables. Add a second input field for `text2` and then update the expression to reference it as well:

```html
<h3>Input 1</h3>
<input ng-model="text">

<h3>Input 2</h3>
<input ng-model="text2">

<h3>Output</h3>
<p>{{"you wrote: " + text + " and: " + text2}}</p>
```

Pretty sweet.

Note that template expressions can be used anywhere and not just for a tag's content. For example, we can also use them with attributes. Let's use an expression to set the class value for a tag. We'll add a style definition so that we can see the change take effect:

```html
<style type="text/css">
  .red-border {
    border: 2px solid red;
    padding: 2px;
  }
</style>

<h3>Input 1</h3>
<input ng-model="className">

<h3>Output</h3>
<p class="{{className}}"> ... </p>
```

We're adding a `red-border` class to the style definition and then setting the `ng-model` value on the input field to `className`, which we then also use in the `class="{{className}}"` attribute for the paragraph tag. Once we've typed "red-border" into the text field our class definition is applied.

This is only an example and not how we will normally modify an element's class definition. Angular provides another directive **ngClass** that does that for us.

In fact angular provides a great many directives that "teach html new tricks".