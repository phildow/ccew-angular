Lesson 1: HTML Exercises
====

For this lesson you will create a new GitHub account for yourself if you do not already have one, **fork** this repository to your own account, and then **clone** it to your local machine for development. You will then complete the html assignment.

Make sure you complete all the assignments before coming to class.

## References

[Forking a repo](https://help.github.com/articles/fork-a-repo/)

GitHub instructions for forking and cloning a repo.

[Syncing a fork](https://help.github.com/articles/syncing-a-fork/)

This will come in handy for future lessons.

[Generating SSH Keys]([https://help.github.com/articles/generating-ssh-keys](https://help.github.com/articles/generating-ssh-keys))

GitHub instructions for setting up SSH keys to work with GitHub. 

## Git & GitHub

Git is a version control system. It allows you to track changes to your source files, explore development alternatives on branches that are independent of one another, and roll back changes that you have made in error. It's awesome.

GitHub works with Git and allows us to collaborate on software projects. We can each edit a project's files without overwriting our colleagues' work. Using git you can associate remote GitHub repositories with your local git repositories and then push and pull changes to and from the remote to your local machine.

In order to do this, you need to set up a GitHub account.

**Assignment 1**

Create a new GitHub account. You will need to set up SSH keys, which will require interacting with the Terminal. Follow GitHub's instructions and work on this with your fellow students who already have experience setting up accounts.

[https://help.github.com/articles/generating-ssh-keys](https://help.github.com/articles/generating-ssh-keys)

We will be distributing your homework assignments via GitHub. The first time you will fork this repository so that you have your own complete copy of it associated with your github account. You should immediately clone the repository to your local machine so you can do development there. Instructions are below.

For future assignments you will sync your copy of the repository with this copy in order to capture the latest additions (because I will be releasing lessons and assignments as we go). You'll then be up-to-date and will have access to the current assignment. Instructions will be forthcoming.

**Assignment 2**

Fork this repository to your own GitHub account. Just press the Fork button at the top right of the page.

At this point, you should stop reading these instructions and start reading the instructions from your own copy of the repository!

**Assignment 3**

Now that you have your own personal copy of the assignment, you should download it to your machine by cloning it. Cloning the repository will initialize a new git repository on your computer and associate it with the remote repository in your account.

You'll find more information about cloning a repository at: 

[https://help.github.com/articles/fork-a-repo](https://help.github.com/articles/fork-a-repo)

You should now have a copy of the repository on your local machine!

**Assignment 4**

Before you begin editing the html files for this assignment, you should create a development branch. Branching in git allows you to edit files while preserving their original content. Git makes it easy to switch back and forth between branches to see the effects of your changes as well as to merge branches when you are ready to keep your changes.

Create a new 'development' branch in your local git repository. The command will look something like:

```
git checkout -b development
```

Where "development" is just the name of the branch. It can be any single or hyphenated word you want. The `-b` flag indicates that the branch should be simultaneously created if it does not already exist.

All changes to your html should be made in this branch, where they will be isolated from the **master** branch. Only when you are satisfied with the changes should you merge them back into master.

Try making a change. Save the file and then **commit** your changes:

```
git add .
git commit -m "first changes"
```

The first command **stages** any changes you've made to your files and the second actually commits them to the branch you are on. The `-m` flag indicates that you are including the commit message.

Now switch back to the master branch:

```
git checkout master
```

Examine the file you changed. The changes are gone! That's because they have been isolated to the development branch. This is what git does, it lets us make changes to files while keeping the original. We can then make fast, incremental changes to a project without having to worry about breaking it.

Merge the development branch into master:

```
git merge development
```

Now your changes appear in master, and the original has been added to the repository's history, which is always recoverable.

You should switch back to your development branch and continue doing work:

```
git checkout development
```

When you are finished, once again stage and commit your changes, switch back to master, and merge them. When you're done with the development branch altogether, you can delete with the `-d` flag:

```
git branch -d development
```

Just make sure you're on master (or another branch) and have merged your changes!

You can read more about git branching at [http://git-scm.com/book/en/Git-Branching-Basic-Branching-and-Merging](http://git-scm.com/book/en/Git-Branching-Basic-Branching-and-Merging). This is part of an excellent free book on git. Refer to the 00 leson material as well.
	
## HTML

**Assignment 5**

You will find the rest of the instructions for this assignment embedded in the html files in the *public* directory. You will be converting plain text into html. Just add the required html tags. Each file includes additional instructions in the form of comments. I suggest approaching the assignment in the following order:

* index.html
* people.html
* resources.html
* suggestions.html
* syllabus.html

Use Python's built-in http server module to view your changes. **Never** view an HTML file directly in a web browser. Always access it through a (local) server.

In the terminal:

```
cd /path/to/public
python -m SimpleHTTPServer
```

Or if you are running python3:

```
python3 -m http.server
```

Then visit http://localhost:8000 in a broswer.

## Finding Help

You have three excellent resources to help with the homework:

1. Each other! Please do work together.
2. [The Mozilla Developers Network](https://developer.mozilla.org/en-US/)
3. [The always amazing StackOverflow](http://stackoverflow.com/)
