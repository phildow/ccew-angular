Lesson 3: Twitter Bootstrap Exercises
====

Complete the files in the public folder of this subdirectory:

1. index.html
2. about.html
3. signup.html
4. reports.html

For this assignment you will need to create the files from scratch. I've added an empty file for each page. You will generate all the HTML. You should base your HTML on the Bootstrap "Basic Template". In order to do this, you'll need to download the Bootstrap framework to your computer.

Don't forget the [HTML shim](http://en.wikipedia.org/wiki/HTML5_Shiv) inlcuded with Bootstrap, and don't forget to edit the template to take into account the directory structure you're using. Typically you'll have a public directory with all your html files in it, and then you'll have a *css*, *js* and *fonts* directory inside it for additional files.

For this assignment you'll need to sync the original repository to your machine so that you'll have access to exercise files. See below for instructions on syncing a git repository.

Work together and refer to the Twitter Bootstrap documentation when you need help.

## References

[http://getbootstrap.com/](http://getbootstrap.com)

Twitter Bootstrap, you know it.

[http://bootswatch.com/](http://bootswatch.com/)

Bootswatch: easy to use, free custom bootstrap themes.

## Syncing the repo

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
00-prep		01-html		02-css		03-twitter-bootstrap
README.md
```

For additional help, full instructions for forking, cloning and syncing may be found at:

[Forking a Repo](https://github.com/phildow/ccew-angular/blob/master/01-html/01-exercises/01-exercises.md): GitHub instructions for forking and cloning a repo.

[Sycning a Fork](https://help.github.com/articles/syncing-a-fork/): GitHub instructions for syncing a repo you've already forked and cloned.

## Assignment: Navigation and Container

Imagine you are building an analytics product for business to business customer. Your marketing site should have information about the company in what's known as a landing page, an about page that describes your team, signup for your product and a sample product page that shows off your reporting system. 

Each page should have a working bootstrap based navigation bar with links to all the other pages that also indicates the current page, as in the earlier *navbar* assignment. Each page should also have a container div that contains the rest of the page.

For the over feel of you're site, if you're in a creative mood try to mimic one of the example pages bootstrap shows off:

[Bootstrap Examples](http://getbootstrap.com/getting-started/#examples)

Example bootstrap pages. Plenty of landing page examples.

[http://expo.getbootstrap.com/](http://expo.getbootstrap.com/): 

Professionally designed with bootstrap. How close can you get?

For a variation on the style, use one of the custom bootstrap themes provided free of charge by [Bootswatch](http://bootswatch.com/). Just download the themed bootstrap css file and replace the one you got from bootstrap.

What follows are descriptions for each of the four pages in your assignment. As you work through your assignment, follow the practice of creating a separate branch in git, making your changes on that branch, commiting them there, and then merging them back into master. Do that for each page to get in the habit of only making changes on a separate branch, thereby always preserving the most recent version of your work. See the Assignment 4 instructions in exercises from the first lesson for the necessary git commands.

## Index.html

The index is the front landing page for your site. Use the jumbotron component to introduce the site and a three column grid layout to highlight freatures. Make up marketing copy (text) for a data analysis firm. Grab a couple of generic images from google to add to your page.

## About.html

Create an about page that describes the business and the team. Add images for team members. The images should be circles, but don't edit square images. Use Bootstrap's support for making a rectangular image appear circular. Again, make up the copy (text contents).

## Signup.html

Create a sign up page for the product. Create a form using Bootstrap's form classes. Your sign up form should require an email address and password. No username and no password confirmation field. Include a signup button.

## Reports.html

A sample reports page. The reports page is where your customers go to view the data reports available to them. Use Bootstrap's grid system to create a two column layout. The left column is the sidebar (width:4) that contains a [List Group](http://getbootstrap.com/components/#list-group) component. The right column is the main content area (width:8) and should include a sample report or chart. If you're feeling brave, try incorporating one of the examples from [D3.js](http://d3js.org/).