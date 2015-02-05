Lesson 9 Exercises
======

For this exercise begin with the 09-server files. You will implement the additional view and controller code required for the following exercises.

## 1. Implement Edit

Make it possible to edit a selected entry. You'll need a link to start editing and a form interface for performing the edit. You may also need a new controller to handle the editing tasks.

Let the user save their changes to an entry. Your code should send an HTTP PUT request to the correct url to update the data on the server. The server will echo back the changes. Update the list of posts immediately upon success.

## 2. Move the API calls to a service

Your API calls are spread all throughout your code. Create a service and consolidate your $http calls into that service. Create methods for each action on the service such as:

```js
getPosts()
getPost(postId)
createPost(data)
updatePost(postId, data)
deletePost(postId)
```

Your controllers should call this methods instead of directly making $http calls. But your controllers should still be able to respond to success and failure callbacks.

## 3. Implement Resource Edit

In the version of the code that uses an angular resource add edit support. You'll need to use that `update` method we talked about, so you'll have to define its behavior. Add interface for editing a post and use the resourceful method to send your data to the server.

## 4. Add a Resource Search Method

The API server includes an endpoint for running full text search on all the posts. It's the url `GET /api/v1/posts/search?text=string. Add support for searching to your Post resource. This means you'll need to define the behaivior for another method on the Post resource. You will have to set the url that's used, which is different from the primary url endpoint you've provided, and you'll need to identify the request method. Try searching the angular documention or stack overflow if you need help.

In the interface add a search bar that sends the search request to the server. Restrict the number of posts that are visible to those which match the search request.