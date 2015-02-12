UI Router
=======

UI Router is a state based single page routing system for angular that allows us to build Single Page Applications (SPAs). A single page application is one which uses a single *index.html* page for all its content and then intercepts url changes at the browser level. The url changes are handled exclusively on the client. Instead of requesting full html pages from the server, our appliction code will request data and inject that data into the page, without ever actually navigating away from *index.html*.

UI Router works by defining application states that correspond to urls. We might have states for 'home', 'posts', 'about-us' and so on as well as nested states for 'posts.list', 'posts.item', 'posts.new', etc. We'll associate controller code and views, or what are called partials, with those states. When a user tries to browse to the url for a particular state, the router will intercept the request, prevent the browser from sending it to the server, and instead instantiate our controller with the correct view and inject it into the page.

## Resources

[ui.router GitHub](https://github.com/angular-ui/ui-router)

[ui.router guide](https://github.com/angular-ui/ui-router/wiki)

## Configuring Node

In order for the router to work we must have the server send back the same *index.html* page for every url on the server. Once the user is inside the application requests will be intercepted before they hit the server. But if the user is browsing directly to a url, because they've book marked it or are refreshing the page, then the application isn't loaded yet and the browser will make a normal server request. The server will send back our angular application and our ui.router code will see the currently requested url and route to the correct application code.

The backend team will mostly take care of this, and the code in Node is straightforward. This catch-all route handler can be placed after the code to handle api routes:

```js
app.get('*', function(req, res) {
  res.sendFile('index.html', {root: './public'});
});
```

For the frontend team this means that requests with incorrect urls will retrieve the *index.html* page. So if you're requesting some api data, a css or javascript file or a partial and you get back the index.html file, it means you've written your url incorrectly and that file doesn't actually exist on the server.

## Routing

UI Router allows our application to handle what are called routes. A route is a combination of a url and the application code that will handle requests to that url. Remember, all this will happen on the client-side inside the browser. Our application code that handles urls will be nothing other than the controllers which we've already built.

Our task will similar to setting up complex callbacks for particular urls, but we'll do it in a declarative manner. Using UI Router we'll declare, for each url we want our application to handle, what controller to use, what view to use and other properties. UI Router will then handle the work of getting that behavior into the page.

Routes and the states that are associated with them will often be nested. Think of a hiearachy that starts wih the home page at the url `/`, a posts page at `/posts` and a page for a particular post at `/posts/1`. Nested routes will have nested pages so that each page in our application will be able to contain additional pages. We'll see why this makes sense as we rebuild our posts application.

## The Plan

What we'd like to do is set up a website with a navbar that has a couple of links, including a link for posts. There will be a home page that a user always starts at as well as pages for the posts and other items in the navbar.

When the user views the posts page they'll see a list of posts on the left and when they click on a post they'll be able to view it in the center of the page.

At every point in the application the url in the browser will update to show the state they are in, such as:

```
/
/posts
/posts/1
```

As an alternate layout option we might show the lists of posts in the center of the page and when the user selects a post replace the list with the specific posts. This is a more advanced layout for ui.router and requires what are called *abstract states*.

## Installing UI Router

First we'll need to install ui.router, our first angular extension. We'll learn about the front end package manager *bower* in our final lessons. For now just grab the source code from [github](https://github.com/angular-ui/ui-router). I've already saved it in the *public/js/lib* folder for the included project.

Set up a javascript link to ui.router in index.html:

```html
<script src="js/lib/angular.min.js"></script>
<script src="js/lib/angular-resource.min.js"></script>
<script src="js/lib/angular-ui-router.min.js"></script>
```

And include ui.router as a dependency in the application module's dependency array:

```js
angular.module('myApp', [
  'ngResource',
  'ui.router'
]);
```

## UIView and Partials

Next let's template out our application. Our main *index.html* page will only contain the navbar and a container for the rest of our application's content. UI Router will fill this container with HTML that is kept in what are called *partials* whenever the user clicks one of the links in the navbar.

A partial is just that: part of an html document. It will be an html file that contains the view for a part of our page. We can already see how our page is composed of distinct parts: a section for creating a post, one for viewing the list of posts, another for viewing a single post. Partials allow us to store these views separately and have them loaded only when they are needed. We'll tell ui.router which partials belong to which urls and it will handle injecting them into the page for us.

Let's move these sections to their own partials. Create a *partials* folder in the project's *public* and create three files, *posts.html*, *post-item.html* and *post-new.html*:

```
mkdir public/partials
touch public/partials/posts.html
touch public/partials/post-item.html
touch public/partials/post-new.html
```

Move html our of the index so that the pages are set up as follows:

**posts.html**

```html
<p><a href="#" ng-click="toggleForm()">Create a new post</a></p>
<section id="list">
  <h1>Posts</h1>
  <div ng-repeat="post in posts">
    <span class="pull-right"><a href="#" ng-click="deletePost(post)">Delete</a></span>
    <h3><a href="#" ng-click="viewPost(post)">{{post.title}}</a></h3>
    <p>{{post.author}}</p>
  </div>
</section>
```

**post-item.html**

```html
<section id="item" ng-show="post">
  <h3>{{post.title}}</h3>
  <p>By {{post.author}}</p>
  <p>{{post.content}}</p>
</section>
```

**post-new.html**

```html
<section id="new">        
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
</section>
```

Notice that I do remove some html such as the ngController directives in the section tags, and I keep the link for creating a new post with the posts.html list. We'll make additional modifications to these partials in a moment.

Now in index.html we can set up the navbar and add a special tag that will tell ui.router where to inject additional page content.

First create a navigation bar at the top of the page outside the container:

```html
<nav class="navbar navbar-default navbar-static-top">
  <div class="container">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">
        My Application
      </a>
    </div>
    <div class="navbar-collapse collapse" id="navbar-main">
      <ul class="nav navbar-nav">
        <li><a href>Posts</a></li>
        <li><a href>Media</a></li>
        <li><a href>About</a></li>
      </ul>
    </div>
  </div>
</nav>
```

Now in the empty container div where the sections previously were add the tag:

```html
<div class="container">  
  <div ui-view></div>
</div>
```

The **uiView** directive is supplied by ui.router and tells ui.router that this is where additional content should be loaded. Any page may contain a div with this directive, including our partials. New content that is required because of state changes (url clicks) will be loaded into this part of the page.

What we end up with is a nested view hierarchy with each part of the application containing more deeply nested other parts. For example our main page will contain the posts partial when the user clicks on the post link, and the posts partial as we'll see will contain a single post when we click on a post in its list.

At this point you should confirm your page is still working. Visit the homepage and you'll see a navbar at the top but an otherwise empt ypage.

TODO:

```
ui-sref-active="active"
ui-sref="method"
```

## Setting up States

States are how ui.router associates controllers and partials with urls.

We'll set up states in a config block. Recall that a configuration block is a section of module level code that is run before the rest of the angular application runs. This is the perfect place to set up code that has to intercept url changes.

Add a config block to the application module and inject the necessary ui.router dependencies. A number of dependencies are required

```js
angular.module('myApp').config(
  ['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function ($stateProvider, $urlRouterProvider, $locationProvider) {

}]);
```

We will define our states on the $stateProvider object by calling the state method. A state is composed of a name that identifies it and its location in the state hierarchy along with a javascript object that declares to ui.router how that state should behave. The javascript object will tell ui.router what url to associate with that state, what controller to load for it and what view, as well as other behavior.

Let's define a state for the `/posts` url. We'll want our listController to be used and the posts.html partial we created. We'll call the state 'posts'.

Inside the config block add the following code:

```js
$stateProvider
  .state('posts', {
    url: '/posts',
    controller: 'listController',
    templateUrl: 'partials/posts.html'
  });
```

After we've defined the state we'll tell angular to use html5 urls:

```js
$locationProvider.html5Mode(true);
```

This lets the browser use real urls with our application even though they all point to the same page on the server.

Reload the page and you should see an error:

```
Error: error:nobase
$location in HTML5 mode requires a tag to be present!
```

We need to add a `base` tag to our document identifying the actual page on the server to use for urls. Add the following line to the html head:

```html
<base href="/">
```

Refresh the page. Nothing has changed but you shouldn't see any errors.

## Linking to States

Let's enable the link to the posts url. We could simply set the href attribute on our posts link in the navbar. Try it:

```html
<li><a href="/posts">Posts</a></li>
```

Refresh the page and click the posts. Content appears! We'll talk about what's happening in a moment.

**uiSref**

Instead of using the href tag and harcoding the posts url we should refer to the link by its ui.router state name, which is 'posts'. This protects our links against changes to the url that we might make in future development. For that we'll use the **uiSref** directive supplied by ui.router, replacing the href attribute with it:

```html
<li><a ui-sref="posts">Posts</a></li>
```

Notice that we don't need the forward slash. We're not refering to a url anymore but to the state name. And we don't need the href anymore. The directive we'll set the href attribute for us.

Refresh the page to make sure it's still working.

**uiSrefActive**

UI Router also provides another directive that is quite useful. After we've navigated to the posts section on the page we should indicate that this is the active section in the navbar. We normally do this with twitter bootstrap by adding the active class to the li element:

```html
<li class="active"><a ui-sref="posts">Posts</a></li>
```

But we can't hardcode this is. We need to programatically change it depending on what state we're currently in (what url is being visited). We could create a controller to manage the navbar that is aware of the current state and updates the navbar scope. That's some work.

Fortunately ui.router provides a directive for us that takes care of all this. The **uiSrefActive** directive tells ui.router what class to add to an element when its link points to the active state. The class we want to use is the twitter bootstrap "active" class, so we can just set uiSrefActive equal to that value and it will correctly highlight the link for us:

```html
<li ui-sref-active="active"><a ui-sref="posts">Posts</a></li>
```

Refresh the page and visit posts. Notice how the navbar now highlights to show we're on the posts section of our page.

## Filling in UIView

Great, but what exactly is UI Router doing here? How is our content now getting into the page?

When we active the "posts" state either by navigating directly to that page or clicking the posts link the router intercepts the navigation, sees that we've registered a state for that url and loads up the controller and view (partial) for it. It puts the partial under the control of that controller and then inject it into the current page wherever it find a **uiView** directive.

## Nested Views

Let's set up our page to show individual posts when the user clicks on them. Previously we did this by setting up an **ngClick** binding and broadcasting on the root scope. Now we will set up a state for the variable route:

```
/posts/:id
```

where `:id` is the id for some post. We'll set the **uiSref** directive for a post in our list to the corresponding state for it, including it's `:id` value, and we'll embed the selected post into the html, just like we did for the list.

We're going to lay out our page so that the list of posts appears on the left and the post itself appears in the center. Modify *posts.html* using bootstrap's support for a grid layout so that the posts occupy only 1/4 of the page:

```html

<div class="row">
  <div class="col-md-3">

    <p><a href="#" ng-click="toggleForm()">Create a new post</a></p>

    <section id="list">

      <h1>Posts</h1>
      <div ng-repeat="post in posts">
        <span class="pull-right"><a href="#" ng-click="deletePost(post)">Delete</a></span>
        <h3><a href="#" ng-click="viewPost(post)">{{post.title}}</a></h3>
        <p>{{post.author}}</p>
      </div>

    </section>

  </div>
  <div class="col-md-9">
    <!-- what goes here -->
  </div>
</div>
```

Notice towards the bottom that we have an empty col-md-9 class. This is where we want the selected post to appear. To get it into the page at this point we'll used a nested UIView. Just as we did for the main page we can add a **uiView** directive here. This will be a *nested* UIView and as long as we set up our post item state so that it is nested as well, an individual posts content will appear here.

Add a div with that directive:

```html
<div class="col-md-9">
  <div ui-view></div>
</div>
```

## Nested States

Now let's define a nested state for this nested view. On the $stateProvider object we can chain states together, so we can remove the semicolon from the state we original defined and just call the state method again.

This time we'll indicate that the state is nested by prefacing its name with `posts.` which we are taking from its parent `posts` state. The url will then be *relative to the parent post* have a *variable value in it* for the id of the particular post we want to view. The remaining object attributes will be similar:

```js
$stateProvider
  .state('posts', {
    url: '/posts',
    controller: 'listController',
    templateUrl: 'partials/posts.html'
  })
  .state('posts.item', {
    url: '/:id',
    controller: 'itemController',
    templateUrl: 'partials/post-item.html'
  });
```

We can link to a nested state using the **uiSref** directive again, but this time we need to indicate what value to use for the `:id` part of the url. This will come from the post's _id attribute.

As before we'll pass in the name of the state but this time we'll treat it like a function that we can call with an object that supplies the values we want for the variable portions of the url. So like this:

```js
posts.item({_id: ...})
```

Modify the *posts.html* page to do this. Remove the href attributes ngClick directives from the ngRepeat part of the page and replace them with the uiSref directive:

```html
<div ng-repeat="post in posts">
  ...
  <h3><a ui-sref="posts.item({id: post._id})">{{post.title}}</a></h3>
  ...
</div> 
```

Notice that we can just get the post id from the post item that is currently being iterated over.

Save your changes and refresh the page. Select a post. The url is correctly changing but the post isn't being loaded. Right now our item controller is set up to listen for `post:selected` events and load its post then, but we're not using events to communicate selection any more, we're using states. We'll need to modify our resource loading code to accommodate this new setup.

## Loading Resources

Everything we need to identify the selected post is contained in the url and corresponding ui.router state, for example the variable `:id` value. We can take advantage of that information to load our post resource is one of two places. The first is conceptually simpler. The second is the correct way to do it. We'll start with the first.

**$stateParams**

The variable parameters that are part of a state, such as the variable `:id` value for our posts.item state are made available to the state's controller in the $stateParams dependency. We can simply inject that dependency into our item controller and then access the `id` value on it:

```js
angular.module('myApp').controller('itemController', 
  ['$scope', '$stateParams', 'Post', function($scope, $stateParams, Post) {
  
  console.log($stateParams);
  
  ...
}]);
```

Refresh the page and select a post. You'll see the state params object with an id value logged to the console. Grab that value and use it to load the post resource, removing the post:selected watcher:

```js
angular.module('myApp').controller('itemController', 
  ['$scope', '$stateParams', 'Post', function($scope, $stateParams, Post) {
  
  $scope.post = Post.get({id: $stateParams.id});
}]);
```

That's it! Refresh the page and select a post or navigate directly to a post. The controller now loads the post from the `:id` value in the url and injects it into the page inside our nested uiView.

**ui.router resolve**

A better way to do this is to have ui.router resolve all the required data dependencies before instantiating the controller and pass them into the controller function. This moves our data loading code to the router and allows us to handle errors in a centralized manner. (UI Router provides a means for catching state transition errors such as when a resource fails to resolve).

We'll instruct ui.router to load the post resource for us by adding a resolve attribute to the state object:

```js
.state('posts.item', {
  url: '/:id',
  controller: 'itemController',
  templateUrl: 'partials/post-item.html',
  resolve: {
    // ...
  }
})
```

That resolve object will contain attribute values that are dependency injected functions that should return promise objects. The attribute name for the function will be the name of the ultimately resolved object that is injected into the controller.

We want a post value to resolve before instantiating the controller so let's add a post attribute to the resolve object:

```js
resolve: {
  post: // ...
}
```

The value is a dependency injected function, just like the kind we use for our controllers, so we should pass it an array of dependencies that ends in the function that will be called:

```js
resolve: {
  post: ['', function() {
    
  }]
}
```

We'll need the $stateParams dependency which as before will contain the `:id`: value for this post, and we'll need the Post dependency to make our resource call to the server:

```js
resolve: {
  post: ['$stateParams', 'Post', function($stateParams, Post) {

  }]
}
```

We can now have this function load the resource, just like we were doing in the controller, with the difference that we should return a promise object from the resource and not the post value itself. It'll look like:

```js
resolve: {
  post: ['$stateParams', 'Post', function($stateParams, Post) {
    return Post.get({id: $stateParams.id}).$promise;
  }]
}
```

The difference is the addition of `.$promise` to the Post.get() call.

Now when we navigate to a particular post url, ui.router will try to resolve the post for that url by calling this function. If that promise resolves, it will set the 'post' variable to its result, and this 'post' variable will be injected into the itemController. The variable will be called 'post' because that is the name of the attribute in the resolve object.

We can list that 'post' variable as a dependency in our controller and be guaranteed that its value is set when the controller function is called. Since we'll have the post value at that point, we can simply assign it to the correct $scope attribute:

```js
angular.module('myApp').controller('itemController', 
  ['$scope', 'post', function($scope, post) {
  
  $scope.post = post;
}]);
```

Notice that we can remove the previous dependencies on $stateParams and the Post resource.

**Resolving all posts**

We should do the same thing for our posts state. Instead of loading all the posts from the controller let's set up a resolve object in the state and inject the array of posts into the controller when it's instantiated.

Modify the state for the posts listing:

```js
.state('posts', {
  url: '/posts',
  controller: 'listController',
  templateUrl: 'partials/posts.html',
  resolve: {
    posts: ['Post', function(Post) {
      return Post.query().$promise;
    }]
  }
})
```

And then change the controller code to include a 'posts' dependency:

```js
angular.module('myApp').controller('listController', 
  ['$scope', '$rootScope', 'posts', 'Post', function($scope, $rootScope, posts, Post) {
  
  $scope.posts = posts;
  
  // ...
}]);
```

## Looking Forward 

There are still changes left to make to this simple application. We should add a state for creating a post. We could modify our list code so that full refreshes are unnecessary and items are deleted and added individually. These kinds of changes are straightforward.

A more difficult change would require us to re-organize the layout so that the posts listing occupies the center of the page and when we click a post we *replace* that list with the individual post. We still want to have nested states for this but we won't be able to use UIViews the same way for this because a UIView normally leaves the parent's content in place.

To implement behavior like this you must use *abstract states*. For more information about abstract states refer to the [Nested States and Nested Views](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views) documentation.