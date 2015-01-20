Lesson 2: CSS Exercises
====

You will find the rest of the instructions for this assignment embedded in the HTML files in the *css-lesson* directory. 

In index.html you will be addeding properties to the style declarations to produce the desired styling. 

In selectors.html you will be adding selectors and their properties to change the appearance of the page.

You will be practicing CSS in this lesson, focusing first on properties and selectors and then on layout. If you haven't already done so, sync your local copy repository with the **upstream** version (my original) so that you have local access to this material.

## References

[Syncing a fork](https://help.github.com/articles/syncing-a-fork/)

It's what you want to do. You should already be synced up for this lesson.

[CSS @ MDN](https://developer.mozilla.org/en-US/docs/Web/CSS)

The Mozilla Developer Network's complete guide to css.

[CSS Pocket Guide](http://www.amazon.com/CSS-Pocket-Guide-Peachpit/dp/0321732278)

Fantastic little reference book for css and not that expensive.

## Git Workflow

Make sure you've first synced any changes to your local account. If you haven't set your upstream repository yet or aren't sure how to sync, see the full instructions at the end of this assignment.

This lesson is great chance to get into the habit of branching in git, making your changes, and then merging back into your master branch.

There are four html files you'll be editing for this assignment. Edit them one at a time, for each file branching to make your changes and then merging back into master when you are done, before going on to the next file.

Your workflow might look like:

```
git checkout -b index-changes
# make your changes
	
git add .
git commit -m "completed index assignment"
	
git checkout master
git merge index-changes
# changes now merged back into master
	
git branch -d index-changes 
# deletes the branch

git checkout -b selectors-changes
# start working on next file
```

If at any point you are confused about using git, try:

```
git status
git help
```

And be sure to use python's http server module for viewing your pages:

```
cd /path/to/public
python -m SimpleHTTPServer
```

Or for python3:

```
python3 -m http.server
```

Then visit http://localhost:8000 in a broswer.

## CSS

**Assignment 1** 

In index.html you will be addeding properties to the style declarations to produce the desired styling. Most of these should be straightforward. Follow the instructions in that file.

**Assignment 2**

In selectors.html you will be adding selectors and their properties to change the appearance of the page. The focus here is on correctly targeting parts of the html document. Follow additional instructions in that file.

**Assignment 3**

In navbar.html you should create a horizontal navbar, something that looks like the navbar at the top of the page here:

[http://getbootstrap.com/examples/navbar/](http://getbootstrap.com/examples/navbar/)

Don't worry about all the bells and whistles. Focus on turning that vertical unordered list into a horizontal ordered list. Most of your css will on the `li` selector. Hint: list elements are normally display: block but you need them to be inline as well. 

**Assignment 4**

In columns.html you will set up a page with a navbar, sidebar, main content area and footer. You will be setting element sizes and uses floats and clears to place elements correctly on the page. This may be frustrating, but it highlights the difficulties twitter bootstrap helps us overcome, which we'll be learning about in our next lesson.

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