Angular Directives
=====

So far we've only looked at the `ng-model` and `ng-bind` directives along with the template language for expressions. Let's look at a few more easy to use directives.

Let's first understand why some of these directives exist. Angular typically loads after the html on our page is loaded. This means there will be a period after a page has been loaded and is being displayed in the browser when bindings won't have updated the model values they refer to. Template expressions won't have evaluated yet and places where `{{ ... }}` appears in our html will simply have "{{ ... }}" there.

To see the effect, simply delete your script tag to the angular.js file.

For future discussion note that directives are described using camel case in documentation but use lowercase and dashes in the actual code with an `ng-` prefix:

<table>
<tr><th>Documentation</th><th>Code</th></tr>
<tr><td>ngBind</td><td>ng-bind</td>
<tr><td>ngModel</td><td>ng-model</td>
</table>

## ngHref

When we want to have dynamic href's for our urls we should use the ngHref directive. This prevents the anchor tag from briefly pointing to a url that has "{{ ... }}" in. For example:

```html
<h3>Input</h3>
<input ng-model="website">

<h3>Output</h3>
<a ng-href="http://www.{{website}}">{{website}}</a>
```

Notice that we've got a `website` model bound in the input field that we then refer to in the `ng-href` directive and the tag's content, both of which use handlebars to dynamically update their values.

## ngClass

Instead of using an expression with the class attribute on a tag we should do so with the ngClass directive. Considering our earlier example, correct usage is:

```html
<p ng-class="className"> ... </p>
```

Notice that we don't need the handlebars here as ngClass already expects an expression. It may just take some experience to know when to use handlebars and when to leave them out.

## ngHide

Conditionally hide an element on a page based on the truth value of the expression with the ngHide directive:

```html
<h3>Input</h3>
<label>Hide the paragraph:</label><input type="checkbox" ng-model="hideIt">

<h3>Output</h3>
<p ng-hide="hideIt"> ... </p>
```

Once again we don't need handlebars.

## ngCloak

The ngCloak directive completely hides an element on a page until the data bindings have been evaluated. As an application becomes more complex it will take longer to load. The lag between the initial html with embedded expression syntax being rendered and the updates after bindings have been evaluated may produce a noticable jump in the page. Use the ngCloak directive to hide elements with expressions and effectively mask that transition:

```html
<div ng-model="text" ng-cloak> {{ text }} </div>
```

## ngRepeat

ngRepeat is an angular directive you will find yourself using over and over. The directive takes what looks like a for loop expression and iterates over the items in a collection. It creates a copy of the tag to which the directive is attached for each item in the collection and exposes the item as a scoped model object within that tag for use in further expressions.

Let's unpack that sentence. Imagine you have an array with a few names in it. Initialize such an array in the body tag, paying special attention to the use of single and double quotes:

```html
<body ng-init="names=['Philip', 'Margaret', 'John', 'Penelope']">
```

We can now use the ngRepeat directive to loop over the names in the list. The syntax expected by the directive is:

```
x in y
```

I'll place the directive in a div element:

```html
<div ng-repeat="name in names"> ... </div>
```

For each name in the names model object that we initialized with ngInit, angular will create a new div element and expose the name to it. By "expose the name" I mean we can now have expressions in that tag that make reference to `name`:


```html
<div ng-repeat="name in names"> {{name}} </div>
```

This works because angular creates a new scope for each item in the loop and adds the name to it as model data.

We can use the directive with any tag element. Here's how you might create a dynamic list based on the names array:

```html
<ul>
  <li ng-repeat="name in names"> {{name}} </li>
</li>
```

Make sure to note that ngRepeat appears on the `li` tag. It always appears on the element that is repeated.

ngRepeat is a rich directive that offers quite a bit more functionality. We'll learn about some of it in future lessons.

## Filters

Filters extend directives by modifying their expressions. Normally this means performing some kind of transformation on the result of the expression such as formatting a number or date, but it can be as complex as reordering the elements in a list with ngRepeat.

Filters appear alongside the expression and are connected to it by the pipe symbol `|`. A pipe connects data from the output on one operation to the input of another. Each operation can modify the data and pass it to the next input by way of additional pipes.

The syntax for using filtes with the pipe symbol looks like:

```
expression | filter
```

or:

```
{{ expression | filter }}
```

If the expression appears in handlebars.

Filters can be connected to one another through multiple pipes:

```
expression | filter | filter
```

For example, consider our names loop. Let's transform those names to uppercase strings when they are rendered into the html. For this we'll use angular's built in uppercase filter:

```html
<div ng-repeat="name in names"> {{name | uppercase}} </div>
```

Notice how we pipe the result of evaluating `name`, which will be a value from the `names` array, into the uppercase filter, which simply transforms the string into its uppercase version. The `uppercase` filter is really just a function that takes a string as its single argument and returns another string.

**Filter arguments**

A filter can take parameters. Parameters immediately follow the filter after a colon:

```
expression | filter:param
```

A filter may take more than one parameter. Simply use multiple colons:

```
expression | filter:param1:param2
```

The `number` filter, for example, can take a fraction parameter that specifies how many decimal places should be included in the final output:

```html
{{ 1.23456 | number:2 }}
```

The output will be 1.23.

<!-- introduce the orderBy and filter filters in the next two lessons -->

**Additional Filters**

There are a number of filters for transforming data in angular. Refer to the [documentation on filters](https://docs.angularjs.org/api/ng/filter) for a complete list. You can also build custom filters for your application, which you may need to learn about over the course of your own projects.

## Event Directives

Not all directives are for data binding. When we hand coded our two way data binding in jQuery we learned that we can use events to inform parts of the application when model data changes. We also learned that events are often user generated. Angular provides directives for responding to the native user events that browsers support such as mouse clicks and keystrokes.

As a simple example let's use the **ngClick** directive to increment a value whenever we press a button:

```html
<button ng-click="count = count + 1" ng-init="count=0">Add 1</button>

<div> Total: {{ count }} </div>
```

This class of directives binds to events instead of model data, and their associated expressions will typically call some function that will be exposed on the scope. We haven't learned how to expose a function yet or even where a function would go in our web page. We'll cover it in our next lesson, where we'll have much more to say about user events.

## Angular Templates

HTML, directives, expressions and filters altogether make up angular's template language. Together they are the View in the Model-View-Controller (MVC) design pattern, and I will typically refer to an angular html page as the "view" in future lessons.

Angular views are connected to the model by way of the `$scope` object, which we've so far made a number of references to but haven't really discussed. In our next lesson we'll learn about scope and about angular Controllers, whose responsibility is to expose model data to the view by way of the scope, strictly limiting what data the view has access to. We'll see that controllers will also expose the functions that are called when we use directives to bind to user generated events.