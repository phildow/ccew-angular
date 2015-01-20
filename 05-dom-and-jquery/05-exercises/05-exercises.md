Lesson 5: Manipulating the Dom
======

For this assignment you will use jQuery to inject html into a webpage. Each html file in the *public* directory contains a template with a link to the required javascript data. Add a container into which you will inject the data and build up the necessary html for each data item.

## 1) Accounts

For the accounts assignment iterate through each item in the accounts array and inject a div into the page for each one. Each div should contain the account name, type as a string value ("checking", "savings") and the amount in the account in dollars. Use twitter bootstrap styling to make it look nice. Try varying text colors using spans to emphasize portions of the data.

## 2) People

For the people assignment divide the page into two columns using bootstrap's grid scaffolding. The left column should be the smaller of the two and contain a list of all the people by name. Use bootstrap's list group widget to display the list.

Set up the list group so that a user may click on a person. When they do insert that person's data into the right column. Make sure only one person ever appears on the right, so you'll need to clear out its container first. Show all of the person's data, including their name, age, sex, etc. You'll have to figure out how to communicate this information from one part of your application (the list) to the other (the main display).

## jQuery Constructs

You can build a new dom element just by passing the a tag string to the jQuery function:

```js
var $p = $('<p/>');
```

Notice that we can use the shorthand for a self-closing tag with the forward slash `/` to indicate that this is just an empty element.  I preface the variable name with a dollar sign `$` to remind myself that this is a jquery object.

I can add embed elements inside a dom element with the object's `append` function, among others:

```js
var $span = ...;
var $p = $('<p/>');

$p.append($span);
```

You'll use the same or a similar function to actually insert the constructed dom element into the page.

Actually insert content into a particular element with functions like `text` and `attr`. Don't use the `html` function:

```js
$p.attr('data-person', ...);
$p.text('...');
```

Make gratuitous use of divs in your html to create containers for the dom you will be injecting into the page, and target them with selectors to access them from your javascript:

```html
<body>
  <div id="people">
  </div>
</body>
```

```js
var $peopleDiv = $('#people');
...
```

You might find the empty function useful for clearing out the content of a dom element:

```js
$el.empty();
```