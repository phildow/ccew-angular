Angular HTTP
======

The angular $http service allows us to communicate with a server using [ajax](https://developer.mozilla.org/en-US/docs/AJAX) requests, or asynchronous javascript and xml requests. We'll actually use json, the javascript object notation, instead of xml, but in principle the behavior is the same.

Using the $http service we'll set GET, POST, PUT and DELETE requests to a server to fetch data from it and send data to it, in essence to instruct the server to peform the CRUD operations on informtion in its database. Our server will provide the urls that we can access and the operations we can perform on them in the form of an api.

We'll then inject the data we get back from the server into our webpage by attaching the results to the scope and using directives like ngBind and ngRepeat and handlebars templating.

## A Server

This lesson requires that we actually run a server on our computer. I've included the necessary code in the *09-server* subdirectory of this lesson. Sync the repository to your computer and `cd` into that subdirectory. Run `npm install` and then `npm start` to start up the web server.

What we have is a basic node server that is serving up an *index.html* file which contains our angular application and then also provides api endpoints to a blog post resource. The api provides a way for us to get blog posts, create blog posts, and retrieve, update and delete single posts.

Note that the endpoint for the posts resource on the server is:

```
/api/v1/posts
```

Our angular application defines two controllers, the listController and the itemController, which will be the starting points for our application.

## Resources

We'll talk about the angular resource object specifically in the next section, but a resource more generally describes data on a server for the four create, retrieve, update and delete (CRUD) operations can be performed in a RESTful manner, meaning that our http requests will contain all the information necessary to interact with the resource on the server.

Resources typically encapsulate collections of data and support modifying those collections. The server will respond to URLs that allow us to retrieve all the items in the collection often in summary form, create a new item in the collection, retrieve an item in the collection, update an item and delete an item.

We describe the actions we can take with respect to the api in terms of routes. A route describes the http request type (GET, PUT, POST, etc) and the url used for the action. Routes can share urls as long as the request type is distinct.

Resource typically support five routes that allow us to perform all of the CRUD operations on them. A resourecful route normally uses a plural name for the resource and then variable parameters to get to specific items. The routes provided will looke like:

**Routes**

<table>
	<thead>
		<tr>
			<th>Verb</th>
			<th>Path</th>
			<th>Used For</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>GET</td>
			<td>/items</td>
			<td>get all the items in the collection</td>
		</tr>
		<tr>
			<td>POST</td>
			<td>/items</td>
			<td>create a new item</td>
		</tr>
			<tr>
			<td>GET</td>
			<td>/items/:id</td>
			<td>get a specific item</td>
		</tr>
		<tr>
			<td>PUT</td>
			<td>/items/:id</td>
			<td>update a specific item</td>
		</tr>
		<tr>
			<td>DELETE</td>
			<td>/items/:id</td>
			<td>delete a specific item</td>
		</tr>
	</tbody>
</table>

For example, imagine we have a posts resource on a server. Then the server might implement the following routes:

```
GET 	/posts
POST 	/posts
GET		/posts/:id
PUT		/posts/:id
DELETE	/posts/:id
```

The `:id` variable in the parameter will change to access specific posts. GET /posts/1 will get the first post while PUT /posts/10 will update the tenth post, and so on.

**POST vs PUT**

We are most familiar with GET requests, which is what a browser makes every time we ask for a url. We may also be familiar with POST requests, which is what a browser does when we submit a form to a web site. And so we might think that a GET is for retreiving data and a POST is for sending it. If that were the case why do we need another kind of request, the PUT request, for updating an object on a server, which also involves sending data?

HTTP specifies that a PUT operation is *idempotent* while a POST operation is not. An idempotent operation is one which leaves a system in the same state given the same input no matter how many times it is performed.

For example, I might PUT my changes to an *existing* document and the server will update its entry in the database for that document. If I PUT the same changes to the server again, the server will again update the database, but the database is in the same state. The update operation was identicial. I didn't actually changing anything.

On the other hand, if I POST a new document to the server the server will create a new entry in the database. If I then go on to POST the same data to the server again the server will create a second entry in the database. I've created a new item, the database is not in the same state. This operation is not idempotent.

We creating routes we should always take care to use the PUT request for operations that are guaranteed to be idempotent and the POST operation for those that are not.

## Using $http

Let's build a simple bloging application that will interact with a posts resource on the server. I've prepared a template *index.html* file in the *09-server/public* directory that we can edit for this lesson.

First let's add the $http service to our list controller:

```js
angular.module('myApp').controller('listController', 
  ['$scope', '$http', function($scope, $http) {
  
}]);
```

We will call methods on the $http service from our controllers or other application constructs. The $http methods all return a promise, which remember is a proxy for a future value which we access by calling `then` on the promise and providing a success and callback function.

We should set up the success callback with a response object and the failure callback with an error object. These objects are fully composed http response that encapsulate all the information an http response provides, including status, headers and body. 

Moreover if the response returns json, the $http service will automatically deserialize the response body and attach the resulting javascript object or array to the `data` property of the response. We'll need to extract it in our callback and probably attach it to our scope for injection into the page. 

## Retrieving all the posts

Making request to a server using the $http service is a simple as calling a method that corresponds to the request type and then providing a url and optionally any data we want to send with the request. In the list controller let's make a request to GET all the posts on the server:

```js
$http.get('/api/v1/posts').then(
  function(response) {
    console.log(response);
  },
  function(error) {
    console.log(error);
  });
```

Refresh the page and watch the console to make sure you're getting the expected results.

Let's attach the data to a scoped property and then use ngRepeat to inject it into the page.

Remember that the response value propogated to the success callback completely encapsulates the http response, including the status, headers and body. We can access the deserialized javascript object on the response's `data` property. ...

In the success callback replace the call to the log with:

```js
$scope.posts = response.data;
```

And inside the list controller in the html add:

```html
<div ng-repeat="post in posts">
  <h3><a href="#">{{post.title}}</a></h3>
  <p>{{post.author}}</p>
</div>
```

## Retrieving a single post

Let's set the webpage up so that when the user clicks on one of the posts a message is sent to the item controller and it retrieves that post from the server. We'll do so by capturing the clicked post and then broadcast its _id on the root scope.

```html
<div ng-repeat="post in posts">
  <h3><a href="#" ng-click="viewPost(post)">{{post.title}}</a></h3>
  <p>{{post.author}}</p>
</div>
```

We'll need the $rootScope in the list controller so be sure to inject that dependency then set up the click handler:

```js
$scope.viewPost = function(post) {
  $rootScope.$broadcast('post:selected', post._id);
};
```

Watch for the event in the item controller using `$scope.$on`:

```js
angular.module('myApp').controller('itemController', ['$scope', function($scope) {
  
  $scope.$on('post:selected', function(evt, postId) {
    console.log(postId);
  });

}]);
```

Finally let's retrieve the item with that using that postId value. Include the $http dependency in the item controller and make a GET request for a specific post:

```js
$scope.$on('post:selected', function(evt, postId) {
  $http.get( ['/api/v1/posts',postId].join('/') ).then(
    function(response) {
      console.log(response);
    },
    function(error) {
      console.log(error);
    });
});
```

Here I'm using the `join` function on an array to quickly build the target url without having to use a lot of concatenation operations:

```js
['/api/v1/posts',postId].joins('/') // == '/api/v1/posts/' + postId
```

Let's attach the retrieved post to the scope and inject it into the page. We'll do this in the success callback. Once again the post object will be contained in the `response.data` property:

```js
$scope.post = response.data;
```

And in the html we should template in the values we ant to inject:

```html
<section id="item" ng-controller="itemController" ng-show="post">
  <hr>
  <h3>{{post.title}}</h3>
  <p>By {{post.author}}</p>
  <p>{{post.content}}</p>
</section>
```

Now you might think that this is a waste of resources to retrieve a post that we already have in memory, namely in the posts array in the list controller. In a real application, however, this content will usually appear on different pages and it's possible the user went directly to an individual post, in which case the array is never loaded. Moreover a server will typically send only summary data in a request for all the items in a collection and not full objects themselves. We'll return to these matters in our lesson on ui.router.

## Deleting a post

Let's make it possible to delete a post. We'll add a delete link to the post div in the list controller and handle it in a function. Add the following span to the div:

```html
<div ng-repeat="post in posts">
  <span class="pull-right"><a href="#" ng-click="deletePost(post)">Delete</a></span>
  <h3><a href="#" ng-click="viewPost(post)">{{post.title}}</a></h3>
  <p>{{post.author}}</p>
</div>
```

Our delete post function will extract the post's id and use the $http service to send a delete request to the server for that item:

```js
$scope.deletePost = function(post) {
  var postId = post._id;
  $http.delete( ['/api/v1/posts',postId].join('/') ).then(
    function(response) {
      console.log(response);
    },
    function(error){
      console.log(error);
    });
};
```

Refresh the page and delete a post. There won't be any change in the list but if we refresh the page again we'll see that item has been deleted. This is the case because, although we are deleting the item on the server, we aren't showing the fact that we've deleted it on the client. It will be our responsibility to keep the html view and the server data in sync

Let's visually remove the item immediately. We'll do this by again retrieving the list from the server after we've successfully deleted a post and updating the posts property on the scope. A more efficient approach might be to just remove it from the posts array directly.

First let's move the get posts call into its own function:

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

We should call that function as soon as the controller loads but after it's been defined:

```js
$scope.refresh();
```

We can then call it from the delete success callback as well:

```js
$http.delete( ['/api/v1/posts',postId].join('/') ).then(
  function(response) {
    $scope.refresh();
  },
  function(error){
    console.log(error);
  });
```

Refresh the page. A deletion should now be reflected in the list.

Because our simple backend server doesn't actually persist changes we make from the client we can simply restart it to get all the items back. Do that now with a couple of ctrl-c commands interrupts in the command line.

## Creating a post

Let's make a new section on the page with a form for creating a new post. We'll add a link that will show the form when the user clicks on it. In the submit handler for the form we'll make a call to the server to create a new post:

```html
<section id="new" ng-controller="newController">
  <p><a href="#" ng-click="toggleForm()">Create a new post</a></p>

  <form ng-show="formVisible" ng-submit="createPost(post)">
    <div class="form-group">
      <label for="title">Post Title</label>
      <input type="text" class="form-control" id="title" ng-model="post.title" placeholder="Enter title">
    </div>
    <div class="form-group">
      <label for="author">Author</label>
      <input type="text" class="form-control" id="author" ng-model="post.author" placeholder="Author">
    </div>
    <div class="form-group">
      <label for="content">Content</label>
      <textarea rows="5" class="form-control" id="content" ng-model="post.content" placeholder="Content"></textarea>
    </div>
    <button type="submit" class="btn btn-default">Create Post</button>
  </form>
  <hr>
</section>
```

And our controller will start out like:

```js
angular.module('myApp').controller('newController', 
  ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {

  $scope.post = {};
  $scope.formVisible = false;

  $scope.toggleForm = function() {
    $scope.formVisible = !$scope.formVisible;
  };

  $scope.createPost = function(post) {
    console.log(post);
  };

}]);
```

The most important thing to notice here is that we provide a post object on the scope and then refer to its properties for each item in the form. When we submit the form we pass the scoped object directly to the createPost function rather than retrieving it from the scope there. This is kind of like dependency injection and makes testing the createPost function simpler.

From the createPost function we can make an http POST call to the posts url on the server. This is the same url for getting all the posts but the action is POST instead of GET. We can pass a javascript object or array as the second argument to this method and the $http service will automatically serialize it for us and set the request's body to it.

```js
$scope.createPost = function(post) {
  $http.post('/api/v1/posts', post).then(
    function(response) {
      console.log(response);
    }, 
    function(error) {
      console.log(error);
    });
};
```

Refresh the page and create a post. If all your fields are empty it won't work so be sure to add at least a title. When you click submit your post is created but once again you won't see it until you refresh the page.

Let's broadcast a "new post created" message on the root scope so that the list controller can refresh itself after we've created a new post. In the create post success callback add:

```js
function(response) {
  $rootScope.$broadcast('post:created');
}, 
```

And in the list controller watch for this message on the scope and refresh the list when it's received:

```js
$scope.$on('post:created', function(evt) {
  $scope.refresh();
});
```

Refresh the page and create a new post. It should now automatically show up in the list.

## Updating a Post

There is one more behavior we should implement and that is editing a post. We use a PUT request to update an existing resource on a server and so we should make a call to $http.put at a `/posts/:id` url. We'll also need an interface for editing a post, but we'll leave all this as an exercise. 

## Summary

The $http service makes it easy for us to communicate asynchronously with a server and especially with a server api. We'll call methods on the service that correspond to the type of request we want to make and provide a url and optional body data that we want to send with the request.

The $http methods return a promise which we should call `then` on with success and failure callbacks. Each of these callbacks takes a single argument which will be the fully formed http response. If the response contained serialized json data angular will automatically deserialize it and provide it to us on the `response.data` property.

The completed version of this webpage is available at *09-angular-http/09-examples/index-http.html*.

Although you may very well use the $http service to make calls to a server, we'll learn in the lesson on ui.router that our pages will be organized quite differently and that we will transition to separate "pages" (states) each with their own controller for viewing, editing and creating a resource rather than broadcasting messages so that other controllers can set up their managed parts of the page.