# Contribution guide

## Brief

First off, thank you for considering contributing to space3 project. 
You help to build a strong basis for 3D maths in Javascript :smile:.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. 
In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

space3 is an open source project and contributions are really appreciated :sparkles:.

Appropriate yourself the project : improving documentation, proposing new features, reporting bug. 
Contribute a way that you can earn time or add something you which, feel free to propose your ideas ! :smiley:

Be welcoming to newcomers and encourage diverse new contributors from all backgrounds.
See the [Code of Conduct](https://github.com/samiBendou/space/blob/master/CODE_OF_CONDUCT.md).

## Your First Contribution

You can work on any open issue, there are issues for any kind of work :
* **Good first issue** : issue which should require a few lines of code
* **Help wanted** : issue which should require some work and documentation
* Other issues reporting various things such as bugs, enhancements, ...

## How to suggest a feature or enhancement

### Philosophy
space3 philosophy is to provide fast and easy to use tools for 3D maths, it's great for realistic simulation, graphics and physics.

The module must provide as many tools as possible to manipulate 3D/4D objects such as vectors, matrix, points...

### Issues
* Create issues for changes and enhancements that you wish to make
* Use templates as often as possible

## Coding contributions
You can contribute to the codebase of space3. Each version is published following theses general guidelines :

* Keep as small as possible, preferably one new feature per version
* Avoid as much as possible using external packages
* Must be related to at least an open issue
* Must implement and pass unit tests

Before starting, ensure you understand the basics concepts of [space3](https://samibendou.github.io/space3/).

### Coding style

Please follow these conventions when submitting code :
* Class name : `UpperCamelCase`
* Instance property or method : `lowerCamelCase`
* Static property or method : `lowerCamelCase`
* Enumerations : `UPPERCASE`
* Variables and constants : `lowerCamelCase`
* Enumerations must belong to a class eg. `Solver.methods.EULER`
* Use typescript with ECMAScript2015 syntax.

The implementation must be as straight forward as possible since 3D objects easier to manipulate then ND objects.

### Commit message

Please follow these conventions for your commit messages :
```
tag : description [link to issue]
```
* `description` is a short text describing the work completed
* `tag` can take the following values :
    * fix : cleaning a bug, a typo or an inconsistency
    * doc : adding documentation to code
    * code : writing code for new feature
* `link_to_issue` is an URL referencing the issue related to the work completed