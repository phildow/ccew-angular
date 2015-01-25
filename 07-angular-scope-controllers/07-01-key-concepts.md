Key Angular Concepts
=====

Before we begin our lesson on scope and controllers we should briefy go over some key angular concepts and put together a big picture of what pieces are required in an angular application and how they interact to make the application work.

We'll learn that there are a number of parts to a working angular application, including modules, controllers, services and views and important behavior such as dependency injection.

## References

Material for this and all future lessons has been derived from the following resources:

[AngularJS Developer Guide](https://docs.angularjs.org/guide)

The go to place for a quick and effective introduction to angular.

[Learning AngularJS](http://www.amazon.com/Learning-AngularJS-Brad-Dayley/dp/0134034546/)

An excellent if more abstract approach to angularjs. Covers key angular constructs and provides examples for using them. Gives the big picture of how an angular application works and how its components interact.

[AngularJS: Novice to Ninja](http://www.amazon.com/AngularJS-Novice-Ninja-Sandeep-Panda/dp/0992279453/)

A more practical approach to learning angularjs. You will still learn big picture concepts but they are more grounded in concrete examples and project based lessons.

## Modules

All application code in an angular project is organized into modules. A module is a top level object that functions as a namespace in an angular project. It doesn't provide any functionality itself but it is the point from which you will define all of your custom code.

## Scope

Scope is probably the most important concept in angular. Scope in angular is similar to scope in programming languages in so far as the totality of valid variable bindings consistutes the scope at any given moment, in other words, what variables your code can refer to at some point in an application. Think of locally defined variables that are available inside a given function but not outside it.

Similarly, scope in angular defines all the variables that a particular part of the view may refer to, such as the model objects we worked with in our previous lesson. We'll learn that there is a root scope at the application level which in normal circumstances all of the page will have access to and that there are multiple narrower scopes that are created whenever part of the page is managed by a controller. Scopes can be nested or parallel just as they are in programming languages generally.

Scope is closely related to the Model in the Model-View-Controller design pattern.

## Controllers

Except for the root scope, which is associated with an application module, a new scope is created any time the **ngController** directive is used to place a portion of the page under the control of a controller. We haven't seen this directive yet, but it will be the subject of this lesson. We'll learn that a controller's job is to set up the scope for that part of the page. It will expose model data to the view by attaching it to the scope and will define methods on the scope to which view events can be bound. Consequently  we can say that a controller strictly limits what data and functionality parts of the webpage have access to.

In our previous lesson we learned quite a bit about views in angular, but we didn't learn how to set up view scopes or respond to user events. Controllers allow us to do this.

Controllers are obviously the Controller in the Model-View-Controller design pattern.

## Services

Angular design guidelines explicitly state that a controller's sole responsibility should be the management of scope. It exposes data, but it shouldn't in general be generating it. Where does the data come from then? And by data I will often mean data that comes from a server api.

Instead of the controller making an http call to the server to fetch the required data and then attaching it to the scope, communication with the server should be wrapped in what angular calls a service. Services are re-usable components that often aren't controller specific. For example many parts of the application will need to communicate with the server api, so that functionality shouldn't be localized to any one controller. Instead it should go in a service and then the service will be made available to the controllers.

Angular provides a number of built in services which we will learn to wrap inside our own custom services. We'll see how to abstract away the low level details of, say, making http calls to a server in order to provide convenient access to model data.

## Dependency Injection

At some point in the development of our application we will have many different controllers all refering to many different services, some builtin and some custom built. We can say that our controllers will consume many services. How does angular make those services available to the controllers?

In many programming environments an object, which is all a controller is, will instantiate instances of other objects locally as it needs them. Inside its source code file, object A will require or include the code for object B and then make instances of object B in instance methods or when object A is initialized.

In angular, on the other hand, all objects that another object depends upon, for example the services that a controller depends upon, are pre-instantiated and injected into that object when it is first initialized. Instead of an object instantiating its dependencies itself, they are instantiated outside it and provided to it in its constructor function. This is called dependency injection.

We'll discover that we don't need to write any of this code. Angular will take care of instantiating dependencies as objects need them. All we'll need to do is list an object's dependencies and angular will take care of the rest.

Dependency injection is not specific to angular. It is a framework level design decision made by the project's creators that can be implemented in other programming languages, although this may be the first time you've seen it.

## Directives and Views

We've already seen how directives and views work in angular. When we talk about views we are just talking about our web page, so plain old html, but with all of the angular expressions and directives included in it.

Parts of a view will come under the management of controllers, which will stricly control what model data and behavior the view has access to by way of the scope. Views will render model data to the user and communicate events back to the controller so that our custom javascript can handle them.

Views compose the View part in the Model-View-Controller design pattern.