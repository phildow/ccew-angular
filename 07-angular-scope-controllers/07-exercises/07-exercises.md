Lesson 7: $Scope and Controllers
======

For this assignment we'll build on the pages we created in the last exercise and create a few new pages. For each page you'll need to set up an application module and add a controller or controllers.

Try recreating the pages from scratch so that you have the practice of writing html. Try writing more efficient html or using a different design from the previous assignment.

Once again don't forget to add the **ngApp** directive to each of your templates, but this time assign it to the name of your application module:

**HTML**

```html
<!DOCTYPE html>
<html lang="en" ng-app="myApp">
...
```

**JavaScript**

```js
angular.module('myApp', []);
...
```

You'll also need to use the **ngController** directive to set up the controller(s) for part(s) of the page:

**HTML**

```html
<div ng-controller="groceryController">
  ...
</div>
```

**JavaScript**

```js
angular.module('myApp').controller('groceryController', ...);
```


## 1. Grocery List

```
public/groceries.html
```

Create a horizontal form control with three input fields for a grocery list. Next to the form create a list that automatically updates and shows what items the user has typed in the inputs.

Use bootstraps grid system to arrange your elements so that the form takes up half the horizontal page and the list takes up the other half.

**New**

Create a controller for this page that adds the model for the three grocery items to the scope. Preopulate the model with three groceries, e.g. apples, bananas, bread.

Add a submit button to your form and bind the **ngSubmit** directive on the form to a function on your controller's scope that puts the three grocery items into an array and logs the value of the array to the console.

## 2. After Tax

```
public/total.html
```

Create an input field that takes a numeric input for a purchase price. You'll need to set its `type="number"` for this to work. The input is for a dollar amount, so prepend a dollar sign to the input field and make sure it has the label "Enter Amount".

You'll need to use the `form-group`, `control-label`, `input-group`, `input-group-addon`, and `form-control` classes for this. Dig around in the bootstrap forms documentation for details.

Below the input field inform the user what the total cost of their purchase is after calculating an additional 7.3% tax. Use a numeric filter to format the expression so that it only has two decimal places.

**New**

Create a controller for this page that exposes the purchase price on the scope. Set the initial purchase price to $99.

Remove the expression that calculates the total price and place that logic in the controller. Do this by wrapping the input field in a form and creating a submit button. Bind the **ngSubmit** directive to a function on your controller that calculates the total purchase price and assigns its value to some property on the scope, which you are also binding or templating into the page.

## 3/4. Accounts

```
public/accounts
```

Create a bootstrap styled table that shows the user accounts in a system. The table should have a header with **Name** and **Admin** columns. The table should be striped but the stripe should start on the first item, not in the header. What table tags haven't we seen yet that are needed to accomplish this?

Each row in the table has two cells, one for the name of a person and the other that indicates if they are an administrator. The second cell should contain a checkbox that is checked if they are an admin and unchecked if they are not.

Modify the table so that the user can sort by a person's name or administrative status.

There are a couple ways you could do this but one is to use a radio button group to toggle between name and admin sorting.

Set up the page so that the list is initially sorted by name.

Make it possible to change the sort order from ascending to descending and back with radio buttons. It should intially be ascending. Because this will require a boolean value in the filter you'll need to use the ngValue directive on the radio buttons.

**New**

Initialize an array of objects in the controller corresponding to the following user data and iterate over it when building your table rows:

```
name: Philip Dow
admin: true

name: Melinda Gates
admin: true

name: Marcus Aurelius
admin: true

name: Mr. T
admin: false

name: Gandolf
admin: true
```
 
Expose that array on the scope and iterate over that scoped property in your page.

## 5. Navigation Bar

Create a full on web application styled webpage with a bootstrap navbar at the top, a main content area, and a footer at the bottom. Make the footer and the navbar stick to the top and the bottom the page, respectively. In the main content area, using bootstrap's grid system for alignment add bootstrap list group on the left and an empty detail are on the right.

Create four different controllers for this application, one for the navbar, one for the list group, one for the empty detail area and one for the footer.

In the navbar controller expose an array of four navigable items of your choosing with titles and links on the scope (an array of objects might be handly). Dynamically construct the navbar from these items. Bind click events to each item and reflect the currently selected item in the navbar using appropriate bootstrap styling.

In the list group controller expose an array of items on the scope and dynamically build the list group from that. Also bind click events and show the currently selected item using the appropriate bootstrap styling.

In the detail area display the title of the currently selected navigation item and the item selected in the list group. It might be helpful to use nested scopes to accomplish this.

In the footer expose a copyright string on the scope and an email contact info. Inject them into the page, with the copyright string on the left and the contact email on the right.

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
