Angular Resources
====

An angular resource encapsulates all of the interactions a client typically needs to make with a resource on a server. Instead of sending individual $http requests we'll create an angular resource for that server data and call methods on the resource such as query, save and remove that will send the correct http request for us. This means that we'll write less code for the same behavior.

Let's rewrite our example web page for blog posts to use an angular resource service. We'll begin by creating a resource object in a factory and returning it. We'll inject that factory into any controller that requires access to the resource. Because an injected factory always takes on its return value we'll have immediate access to the resource in our controllers.

## ngResource

The angular resource service is not part of the core angular framework. To use ngResource in our project we have to include the ngResource extension. We'll do this by linking to the script file in our html and then listing `ngResource` as a dependency when we define our application module.

Place the link after the link to the main angular script but before your custom code:

```html
<script src="js/angular-resource.min.js"></script>
```

Then declare the dependency when you define your module:

```js
angular.module('myApp', ['ngResource']);
```

I've already downloaded the resource script and placed it the right place. We'll discuss organizing our project files and dependency management in our final lesson.

## Defining a Resource

Set up a factory service to create a resource. It wil need to depend on angular's $resource service. Give it the name 'Post':

```js
angular.module('myApp').factory('Post', ['$resource', function($resource) {

}]);
```

I like the use of a capitalize name here because we're going to treat the returned value as a kind of class definition with "class" methods and the ability to create "instances".

From the factory we want to return an object created with the $resource service. We'll call the $resource method and pass a fully formed endpoint for the resource. For our posts resource that means the url `/api/v1/posts/:id`. It's important to include that last `:id` bit as that identifies the url for getting, updating and deleting a single post:

```js
angular.module('myApp').factory('Post', ['$resource', function($resource) {
  return $resource('/api/v1/posts/:id');
}]);
```

Let's also pass a second argument to the resource function. The second argument is an object that maps properties on a post object to variable parameters in the url.

A resosurce will attempt to find those variables parameters, identified by a colon such as `:id`, using the same name, here `id`, for a property on the object data returned from the srever. But consider what one of our posts looks like as it arrives from the server:

```js
{
    _id: 0,
    author: 'Mr. T.',
    title: 'I pity the fool!',
    content: "Mr. T has the greatest hair in the world. ..."
},
```

If we were to instantiate an instance of a Post object with that data and then call save on it, as we'll see below, the resource would try to figure out what the `id` of the post is so that it can correctly fill in the `:id` portion of the `/v1/api/posts/:id` url.

But our post does not have an `id` property. Instead it has an `_id` property. When we create the resource we need to map `_id` to `id` so that internally the angular resource object can complete the url correctly. We'll create that mapping like so:

```js
angular.module('myApp').factory('Post', ['$resource', function($resource) {
  return $resource('/v1/api/posts/:id', {id: '@_id'});
}]);
```

All we do is pass a second argument to the $resource function, which is an object that contains the variable url parameters as keys and the properties on the server data that they map to prefaced by the `@` symbol, so:

```js
{
  id: '@_id'
}
```

This is a simple example but in some cases your url may include three or four variable parameters that need to be extracted from server data. When the data propety is the same name as the variable paramter no mapping is required, although even then I like to include it to make the mapping explicit.

## "Class" Methods on a Resource

The resoure object that gets injected into any controller or other application construct provides a number of methods that we can use to interact with a resource. Their names and the kind of request they make to the server are:

```js
{ 'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'} };
```

The query method is used to retrieve all the items for a resource, for example all the posts. That isArray property indicates that we are getting an array of values back from the server. The get method retrieves a single item. Save creates a new item while remove and delete are the same method and will delete a specific item. We'll see how to update an item in a moment.

The signature for these methods differs depending on whether they are a GET or non GET request. A GET request only ever retrieves data from a server while a POST, DELETE or PUT request will also send it. Consequently the arguments we pass to a method will differ to take into account any data we might want to send.

The GET methods all have the following signature:

```
Resource.action([parameters], [success], [error])
```

Where parameters is an object that provides values for the variable parameters in the url while success and error are callback functions.

The non-GET methods all take a json object or array that will be sent to the server in the request body and have the following signature:

```
Resource.action([parameters], postData, [success], [error])
```

## Using a Resource

Let's use these methods in place of the $http service we were using earlier.

**Retrieving all objects**

The simplest method to use is the `query` method which will return every object for that resource. We'll use this method to load our list of posts.

In the list controller inject the Post resource and replace:

```js
$scope.refresh = function() {
  $http.get('/api/v1/posts').then(
    function(response) {
      $scope.posts = response.data;
    },
    function(error) {
      console.log(error);
    });
};
```

with:

```js
$scope.posts = Post.query();
```

And that's it. Now this is a particularly interesting bit of code. In particular it is asynchronous, although it certainly doesn't look like it. We provide no callback function to handle a successful response like we do with the $http service. Instead, the resource methods return a proxy object immediately which internally updates itself after the asynchronous operation completes. This proxy object is not just an array but one which enapsulates the http request and simulates an array with the returned data.

We could continue to provide success and error callback functions that update the scope and handle errors, and I believe for error handling this would still be necessary, something like:

```js
$scope.posts = Post.query(null, null, function(error) { ... });
```

We provide null for the first two arguments because they are for request url parameters and the success callback respectively.

**Retrieving a specific object**

Lets retrieve a specific object when the user clicks on one of the posts. We'll use the `get` method for this and pass an object of values that we want our variable url parameters to take on.

In the item controller inject the Post dependency and replace:

```js
$scope.$on('post:selected', function(evt, postId) {
  $http.get( ['/api/v1/posts',postId].join('/') ).then(
    function(response) {
      $scope.post = response.data;
    },
    function(error) {
      console.log(error);
    });
});
```

with:

```js
$scope.$on('post:selected', function(evt, postId) {
  $scope.post = Post.get({id: postId});
});
```

Notice that we pass an object that provides a value for the variable `:id` parameter in the resource url with the `id` property.

**Deleting an object**

To delete an object we'll call the `delete` or `remove` method. These are mapped to the same function underneath the hood but `delete` is a reserved keyword in javascript and won't work in some versions of internet explorer, so we'll use the remove method.

This time we'll include a success callback so that we can refresh the list after the item has been deleted.

In the list controller replace:

```js
$scope.deletePost = function(post) {
  var postId = post._id;
  $http.delete( ['/api/v1/posts',postId].join('/') ).then(
    function(response) {
      $scope.refresh();
    },
    function(error){
      console.log(error);
    });
};
```

with:

```js
$scope.deletePost = function(post) {
  Post.remove({id: post._id}, null, $scope.refresh);
};
```

Notice that we pass `null` as the second parameter because remove uses a non-GET method and expects a request body as the second argument. For the third argument we just provide the function we want directly rather than wrapping it inside an anonymous callback.

Once again we have to be sure to provide a value for the `:id` parameter in the url.

**Creating an object**

We'll create an object a little differently. This time we won't have any parameters to provide as the `:id` portion of the url isn't used. Remember that when we want to create a resource on a server we post to the endpoint for all items in that collection, not a particular one, and the server creates the id for us. But we will have a post body, so we'll need to pass an empty object or null for the first parameter and a javascript object for the second.

We'll also include a success callback here so that we can broadcast the post:created event.

In the new controller inject the Post dependency and replace:

```js
$scope.createPost = function(post) {
  $http.post('/api/v1/posts', post).then(
    function(response) {
      $rootScope.$broadcast('post:created');
    }, 
    function(error) {
      console.log(error);
    });
};
```

with:

```js
$scope.createPost = function(post) {
  Post.save(null, post, function() {
    $rootScope.$broadcast('post:created');
  });
};
```

## Custom Methods: Updating a Post

Updating a post using the PUT method will be left as an exercise, including creating an interface for editing a post. However, updating a post requires adding a custom method to the resource, as no method on the resource actualy uses a PUT request.

We can add our own methods to a resource. When we do so we can provide an alternate url for the $http request, specify the request type we want to use, e.g. PUT, GET, POST, etc, and add data tranformations and so on.

The angular resource will actually implement the method for us. We only declare how that method should behave and what its interface will be and angular handles the rest.

To define a custom method on a resource pass a third argument to the $resource function. The third argument is a javascript object with properties that name the methods you would like to add and values that describe how those methods should behave.

We want an `update` method that issues a `PUT` request, so we'll provide the following object:

```js
{
  update: {
    method: 'PUT'
  }
}
```

Pass that object as the third argument to the $resource function in the Post factory:

```js
angular.module('myApp').factory('Post', ['$resource', function($resource) {
  return $resource('/api/v1/posts/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });
}]);
```

Because this method uses a non-GET request angular implements it so that it takes a post body object. We'll use it like we use a save request but this time also pass in the id of the post we are updating, something like:

```js
Post.update({id: x}, postData)
```

## "Instance" Resource Methods

An angular resource doesn't just provide "class" style methods on the resource object itself. We can also create instances of a resource from either client-side or server-side data and then run a subset of the methods we learned above on them. For example it doesn't make sense to query an instance because the query method retrieves all items in a collection and an instance is a specific item in a collection, but we can update, delete and create instances.

The method signatures for instance methods are the same as they are for the "class" methods except that we will never need to pass in a post body. The instance will always already encapsulate the post body.

Instance method names will differ from the "class" method names by prefacing the name with a dollar sign, `$`.

So for example to create a new post we could create an instance of a Post using the `new` javascript keyword and the post data we want to use and then call the `$save` function on it.

In the new post controller try replacing:

```js
$scope.createPost = function(post) {
  Post.save(null, post, function() {
    $rootScope.$broadcast('post:created');
  });
};
```

with:

```js
$scope.createPost = function(data) {
  var post = new Post(data);
  post.$save(null, function() {
    $rootScope.$broadcast('post:created');
  });
};
```

First I've changed the function's parameter name from post to data in order to avoid confusion. Inside the function I create an instance of a Post object from the data:

```js
var post = new Post(data);
```

Now when I call `post.$save` I don't need to provide that data again because the post variable already contains it. Consequently my first argument is null to indicate I don't have any variable parameters to identify and then second argument is the success callback:

```js
post.$save(null, function() {
  $rootScope.$broadcast('post:created');
});
```

We could implement similar behavior for the get, update and delete actions.

## Summary

Resources encapsulate the behavior we typically need to implement when interacting with server-side data. We can quickly support the four CRUD operations by defining a resource and pointing it at an api endpoint. When we define a resource we may need to map data properties to variable parameters, and we may also need to define other methods on the resource. All of this is straightforward. Morever a resource provides two styles of interaction, one by way of "class" methods on the resource object itself and the other by way of instances and instances methods that are prefaced with the dollar sign `$`.

The completed html document with our blogging client using an angular resource for server communication may be found at *09-examples/index-resource.html*.