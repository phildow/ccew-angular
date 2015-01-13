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

Make sure you've first synced any changes to your local account.

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