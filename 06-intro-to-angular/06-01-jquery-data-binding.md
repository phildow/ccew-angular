Two Way Data Binding with jQuery
=====

Consider the following HTML document. There is an input field whose `id="input"` and a paragraph whose `id="output"`:

```html
<!doctype html>
<html>
<head>
  <title></title>
</head>
<body>

  <h3>Input</h3>
  <input id="input">

  <h3>Output</h3>
  <p id="output"></p>

  <script type="text/javascript" src="/jquery.min.js"></script>
  <script type="text/javascript">
  	$(function() { // document.ready
     // ...
  	});
  </script>
</body>
```

What we'd like to do is keep the text in the input field and the paragraph in sync. For example, as the user types out "hello" the text in the paragraph should dynamically change from "h" to "he" to "hel" and so on.

We can accomplish this with jQuery. In the document ready callback, set up an event handler for the `keyup` event on the input field. This event fires after a key is pressed and released. We'll get the current value of the input field and set the paragraph's text with it:

```js
$('#input').on('keyup', function() {
  var text = $(this).val();
  $('#output').text(txt);
});
```

That's not too bad. But what if we want to store the text value in a model object and not just a temporary variable as the paragraph is updated? This way we can use the value elsewhere in the application via the model without needing to refer to the input field again.

Let's create a javascript object called `model` and give it a `text` attribute. We'll update this variable instead of the temporary variable like so:

```js
var model = {text: ""};

$('#input').on('keyup', function() {
  model.text = $(this).val();
  $('#output').text(model.text);
});
```

What we've set up is called a **one way data binding** from the view to the model and from one part of the view directly to another. As text changes in the input, the `model.text` is updated along with the paragraph.

What we'd really like is for the view and the model to always match, regardless which one changes first. But what if we change `model.text` directly? In this case the input field and the paragraph aren't updated unless we manually update them ourselves:

```js
var model = {text: ""};

model.txt = "happy"
$('#input').val(model.text);
$('#output').text(model.text);

$('#input').on('keyup', function() {
  model.text = $(this).val();
  $('#output').text(model.text);
});
```

Now we have what's called a **two way data binding** between the model and the view. When the input field changes the model is updated along with the paragraph, and when we update the model the input field and paragraph are changed.

Unfortunately we have to keep the model in sync with the view every time we change it from anywhere in our code. We're going to have to repeat the following three lines an aweful lot:

```js
model.txt = "...";
$('#input').val(model.text);
$('#output').text(model.text);
```

Worse, if we add other elements to the page that should also be kept in sync with the model we'll have to remember to add more code to handle this everywhere there is existing sync code. This quickly gets out of hand.

What if we could keep our data binding code in one place and not have to repeat it for every new element on the page. What we'd like to do is have a single block of code responsible for updating the model when the input field changes and one more block of code responsible for updating the html (the dom) when the model changes.

For this we're going to need a more advanced model object. Let's set up a model with getters and setters that can update or retrieve any attribute on it:

```js
var model = {
  set: function(attr, val) {
    this[attr] = val;
  },
  get: function(attr, val) {
    return this[attr];
  }
};
```

We can use this model object like so:

```js
model.set('text', 'hello'); // model.text := 'hello'
model.get('text'); // = 'hello'
```

Let's go ahead and update our keyup handler to use the new setter, and let's remove the code to update the paragraph while we're at it. This will be the single block of code responsible for keeping the model in sync with view changes:

```js
$('#input').on('keyup', function(event) {
  model.set("text", $(this).val());
});
```

Now for the magic. Add the following line of code to the model's setter method:

```js
$(this).trigger("change:"+attr);
```

This line of code takes advantage of jQuery's support for custom events on any object, not just dom elements. The jQuery `trigger` method causes the named event to fire, which in our case will be `change:text`. The colon is not significant. We could use any text or sequence of characters we like, but this one is descriptive. We just have to be sure to wrap the object in the jQuery function with `$(this)` because native javascript objects don't have support for events.

Our model now looks like:

```js
var model = {
  set: function(attr, val) {
    this[attr] = val;
    $(this).trigger("change:"+attr);
  },
  get: function(attr, val) {
    return this[attr];
  }
}
```

We can watch for that `change:text` event on the model object from elsewhere in our code just like we watch for `keyup` events from the input field with the `on` method:

```js
$(model).on("change:text", function() {
  // ...
});
```

Now, anytime the model object is updated via it's setter for the `text` attribute *from anywhere in the application*, the `change:text` event will fire and our event handler code will be called. We'll use this handler to define the single block of code that's responsible for keeping the view in sync with changes to the model:

```js
$(model).on("change:text", function() {
  if ( $('#input').val() !== model.get("text") ) {
    $('#input').val(model.get("text"));
  }
  if ( $('#output').text() !== model.get("text") ) {
    $('#output').text(model.get("text"));
  }
});
```

We're updating the dom from the model value now whenever the model's change event for the text property fires. We're also checking that the view's contents aren't already equal to the model value, which prevents a few interface glitches.

Our completed two way data binding code looks like:

```js
var model = {
  set: function(attr, val) {
    this[attr] = val;
    $(this).trigger("change:"+attr);
  },
  get: function(attr, val) {
    return this[attr];
  }
};

$(model).on("change:text", function() {
  if ( $('#input').val() !== model.get("text") ) {
    $('#input').val(model.get("text"));
  }
  if ( $('#output').text() !== model.get("text") ) {
    $('#output').text(model.get("text"));
  }
});

$('#input').on('keyup', function(event) {
  model.set("text", $(this).val());
});
```

No matter where else in the application the model's text value changes, as long as it's done via the `model.set('text','...')` method, the `change:text` event will fire, our event handler will be called, and our code to update the view will execute. Likewise, when the text input changes, we update the model which causes the `change:text` event to fire and the view to update elsewhere in the page.

This is a significant improvement. We won't have to repeat that sync block anywhere else. But it's still not great. If there are other sections of the page that allow the user to edit the `model.text` value, we'll need to add event handlers to update the model as we're doing now with the keyup event and we'll have to add code to update that part of the view in the `change:text` handler. Even though we'll only ever have the two sync blocks for the two-way data binding, as our interface becomes more complex so too will those blocks of code.

We also have to write exactly the same kind of code for each other model attribute we want to keep in sync with the view. Imagine a form with ten input fields. We'd need ten `change:x` event handlers and ten keyup handlers. The code will be similar in every case but different enough that rote copy-pasting won't work or will lead to bugs.

This kind of tedious code is called glue code. It's the glue that holds the model and the view in sync. AngularJS does away with it.