# Contribution guide

## Introduction

First off, thank you for considering contributing to meca3 project. 
You help to build a strong basis for 3D maths in Javascript :smile:.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. 
In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

meca3 is an open source project and contributions are really appreciated :sparkles:.

Appropriate yourself the project : improving documentation, proposing new features, reporting bug. 
Contribute a way that you can earn time or add something you which, feel free to propose your ideas ! :smiley:

Be welcoming to newcomers and encourage diverse new contributors from all backgrounds.
See the [meca3 Code of Conduct](https://github.com/samiBendou/meca3/blob/master/CODE_OF_CONDUCT.md).

## Your First Contribution

You can work on any open issue, there are issues for any kind of work :
* **Good first issue** : issue which should require a few lines of code
* **Help wanted** : issue which should require some work and documentation
* Other issues reporting various things

## How to suggest a feature or enhancement

### Philosophy
meca3 philosophy is to provide fast and easy to use tools for 3D mechanics, it's great for 3D simulations that reconstruct
real physics behaviors.

The module must provide as many tools as possible to manipulate 3D objects such as vectors, matrix, trajectories...

It has to be easily integrable with a 3D animation framework such as [threejs](https://threejs.org/).

### Issues
* Create issues for any major changes and enhancements that you wish to make
* Use templates as often as possible. It makes you save time :smile:
* Add at least one label

## Coding contributions
You can contribute to the codebase of meca3. Each version is published following theses general guidelines :

* Keep as small as possible, preferably one new feature per version
* Must be related to at least an open issue
* Must be documented and implement necessary unit tests
* Must pass unit tests
* Use package only if necessary

Before starting, ensure following the rules in the basics concepts section of [meca3 Getting Started](https://github.com/samiBendou/meca3/wiki/Getting-Started).

### Coding style

Please follow these conventions when submitting code :
* Class name : `UpperCamelCase`
* Instance property or method : `lowerCamelCase`
* Static property or method : `lowerCamelCase`
* Enumerations : `UPPERCASE`
* Variables and constants : `lowerCamelCase`
* Enumerations must belong to a class eg. `Solver.methods.EULER`
* The classes must be implemented using the [ECMAScript2015 syntax](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes).
* Do not use arrow functions for the moment
* One class per file

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