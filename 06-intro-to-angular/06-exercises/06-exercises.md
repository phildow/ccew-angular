Lesson 6: Introduction to Angular
=====

For this assignment you will use angular to build dynamic webpages without writing much javascript. You'll limit your javascript to expressions. You should use twitter bootstrap styling for all the pages. Your task is to add the necessary html, angular directives and expressions to each page to complete the assignment.

You'll find html files in the *public* directory already set up with a bootstrap template that includes links to the bootstrap css and javascript, jquery and angular.

Don't forget to add the ngApp directive to each of your templates!

```html
<!DOCTYPE html>
<html lang="en" ng-app>
...
```

## 1. Grocery List

```
public/groceries.html
```

Create a horizontal form control with three input fields for a grocery list. Next to the form create a list that automatically updates and shows what items the user has typed in the inputs.

Use bootstraps grid system to arrange your elements so that the form takes up half the horizontal page and the list takes up the other half.

## 2. After Tax

```
public/total.html
```

Create an input field that takes a numeric input for a purchase price. You'll need to set its `type="number"` for this to work. The input is for a dollar amount, so prepend a dollar sign to the input field and make sure it has the label "Enter Amount".

You'll need to use the `form-group`, `control-label`, `input-group`, `input-group-addon`, and `form-control` classes for this. Dig around in the bootstrap forms documentation for details.

Below the input field inform the user what the total cost of their purchase is after calculating an additional 7.3% tax. Use an angular expression to do this. Use a numeric filter to format the expression so that it only has two decimal places.

## 3. Accounts

```
public/accounts
```

Create a bootstrap styled table that shows the user accounts in a system. The table should have a header with **Name** and **Admin** columns. The table should be striped but the stripe should start on the first item, not in the header. What table tags haven't we seen yet that are needed to accomplish this?

Each row in the table has two cells, one for the name of a person and the other that indicates if they are an administrator. The second cell should contain a checkbox that is checked if they are an admin and unchecked if they are not.

You should initialize an array of objects corresponding to the following user data and iterate over it when building your table rows:

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
 
What directive is needed to initialize an array of objects? Pay special attention to your syntax!

## 4. Sorting

Copy the table you build in the accounts assignment and modify it so that the user can sort by a person's name or administrative status.

There are a couple ways you could do this but one is to use a radio button group to toggle between name and admin sorting.

We didn't go over this in class but you'll need to use a certain filter to sort the array of people in the repeat directive.

Set up the page so that the list is initially sorted by name.

Make it possible to change the sort order from ascending to descending and back with radio buttons. It should intially be ascending. Because this will require a boolean value in the filter you'll need to use the ngValue directive on the radio buttons.

## 5. Panel

```
public/panel.html
```

Create a bootstrap styled button which toggles a bootstrap styled panel component. The panel should contain a title and a body and initially be hidden. Add an OK and a Cancel button to the panel. The Cancel button should also toggle the panel closed.

What directive is needed to hide or show a dom element?

We only briefly looked at the ngClick directive but you will require it for this exercise. This directive takes an expression, which can either call a method, which we haven't learned about yet, or update a model. What expression is needed to toggle the panel?

Make sure that panel doesn't flash while the page is loading. What directive do you need to add to it to prevent this from happening?

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

