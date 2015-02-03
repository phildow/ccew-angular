Lesson 8 Exercises: Custom Services
=====

For this assignment you'll be building complete webpages from scratch. You should also serve all resources locally and view your webpage from a locally running server. That means you'll need to download angular into the *public/js/lib* folder and correctly link to it from your html pages. You'll need to do the same for the bootstrap css, js and font files.

Run a server locally from your machine for these files using python. In the command line `cd` into the *public* directory and then, depending on your version of python, run:

**Python Web Server**

```
cd /path/to/lesson/public
python -m SimpleHTTPServer
```

Or:

```
cd /path/to/lesson/public
python -m http.server
```

You can then access the files by name in your web browser at *http://localhost:8000*

**Downloads**

[Download Angular](https://angularjs.org/)

[Download Bootstrap](http://getbootstrap.com/)

**Set Up**

Don't forget that you'll need to use the ngApp directive, have an application level module and build your controllers on that.

## 1. Nested Navbar

Create a navbar interface with four links to *home*, *about*, *marketing*, *signin*. Build a page with a navbar at the top and a content area at the bottom. Do this from scratch. You want to get proficient building from bootstrap's instructions quickly.

Put the navbar under the control of a controller and the content area under the control of another controller that is nested inside the navbar controller.

Bind click events on the navbar links to a function on the navbar controller. That controller should broadcast an event on the scope indicating which navbar link was clicked. Give it an informative name and use a message to indicate which link was clicked.

In the content controller listen to that event on the scope. When the event is received update a model object with the message. The message should appear in a paragraph inside the content area.

## 2. Parallel Navbar

Create an identical interface to the nested navbar. Try it again from scratch.

This time put the navbar and content area under the control of parallel controllers. They should not be nested.

Communicate the same information from the navbar to the content controller but this time use the root scope.

## 3. Services

Create a page with a user sign up form that takes a name, email and password. Bootstrap style it all nice. Try using one of the alternative themes at [bootswatch.com](http://bootswatch.com/).

Create three separate services to validate the input from the form. The services should have a `validate` function that takes an input and returns true or false. Create an email validator that verifies if the input is an email address. Use a basic [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) for this. Create a password validator that ensures the input contains at least one non alphanumeric character. Again you might use a regular expression for this. Create a name validator that ensures the input is not empty.

Inject these services into your controller for the signup form, and when the user submits the form, validate the input. If the validation fails, show a validation error using bootstrap styling.

## 4. Modules

Create a web page with two list groups in half page width columns in a row using bootstrap's grid layout. One of the list groups will be for users and the other will be for blog posts. Create a controller for each list group.

In addition to the application module create an api module. On this module define two services, one for users and one for blog posts. Define an `all` method on each service that in the one case returns an array of users and in the other returns an array of blog posts. Users should have a name and email address and the blog posts should have a title and author. Make up five users and five blog posts.

Inject the api module into your application module and the api services into your list group controllers. Get the data from the services and attach ito the scope. Fill the list groups with the data.

<hr>

## Syncing the Repo

If you forked this repo earlier to your account and then cloned it to your computer you will now need to sync it to get up to date with the latest additions, including the homework assignment. This involves associating another remote repository with your local copy, *pulling* its changes to your computer and then *merging* those changes with your master branch.

In the command line, `cd` into the directory where you cloned the ccew-angular repository originally:

```
$ cd path/to/ccew-angular
$ ls
00-prep		01-html		02-css			README.md
```

Make sure you're executing the following commands from the root directory for this repository and not one of the lesson or exercise directories.

Before syncing, make sure you've merged all the changes to your assignment from any branches you were on for the previous assignment, commited then, and that you are on the master branch. Check your branch and status with git. They should be:

```
$ git status
On branch master
nothing to commit, working directory clean
```

Let's sync. First check to see if you've already associated the ccew-angular repository on my github account as a remote upstream repo:

```
$ git remote -v
origin	https://github.com/student/ccew-angular.git (fetch)
origin	https://github.com/student/ccew-angular.git (push)
```

Notice that I only have `origin` listed here, one each for fetching and pushing (getting the code from your repo on github and sending it back to it). Your origin will point to the repository on your account. I've used "student" here.

We'll be adding `upstream`. If you already have upstream and it points to my ccew-angular repo, you can skip this step. Otherwise, add the original repository on my account as an upstream remote repo:

```
$ git remote add upstream https://github.com/phildow/ccew-angular.git
```

You should now see fetch and push remote repositories for `origin` as well as `upstream`:

```
$ git remote -v
origin   https://github.com/student/ccew-angular.git (fetch)
origin   https://github.com/student/ccew-angular.git (push)
upstream https://github.com/phildow/ccew-angular.git (fetch)
upstream https://github.com/phildow/ccew-angular.git (push)
```

Notice that the origins point to your github account and the upstreams point to my github account.

We're now ready to sync. Fetch the changes from my account. We can refer to remote repositories by name:

```
$ git fetch upstream
```

Switch to your master branch if you aren't already there:

```
$ git checkout master
```

And merge the changes you just fetched from my account, which have been put on the "upstream/master" branch:

```
$ git merge upstream/master
```

That's it. You should now see the bootstrap lesson material and have access to the exercises on your machine:

```
$ ls
00-prep
01-html
02-css	
03-twitter-bootstrap
04-javascript
README.md
```

For additional help, full instructions for forking, cloning and syncing may be found at:

[Forking a Repo](https://github.com/phildow/ccew-angular/blob/master/01-html/01-exercises/01-exercises.md)

GitHub instructions for forking and cloning a repo.

[Sycning a Fork](https://help.github.com/articles/syncing-a-fork/) 

GitHub instructions for syncing a repo you've already forked and cloned.
