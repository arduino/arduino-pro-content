# What Is this Repository?

This repository hosts content for the documentation section of the Arduino Pro website mainly comprised of tutorials. The content needs to be written in Markdown and will be converted to HTML automatically.

# How Can I Contribute?

Contributing by creating content or suggestion changes to existing content can be done by making pull requests. CC-BY-SA-4.0 is the default license for any contribution. Sample code within this documentation is made available under the CC0 license.

You start by forking the `master` branch. Create a new branch based on master and name it according to what you will create (e.g. `wifi-tutorial`). Make a copy of the `template` folder and modify that if you're creating a new document.

When you're done with a draft you can create a pull request. This will give the content team the possibility to review it and leave comments or request changes. During this review process you can continue to push commits to the same branch. They will show up in the pull request automatically. Once the pull request gests merged into master, the content will be deployed to the staging server where you will be able to have a final look on how it looks on the website. When everything looks fine, one of the repository maintainers will create a release of the latest version. This will then be automatically deployed to the production server.

# Tutorial Guidelines

Before you jump right into writing a tutorial it's important to understand what a tutorial should focus on and what distinguishes them from other articles. Below are the main characteristics of our tutorials:

* Teaches the user about one particular core feature of the board.

* Provides  step-by-step instructions on how one can use this feature in a practical sense.

* Aims to provide both the practical skills and the technical knowledge around this core feature.

## Tutorial Structure

All tutorials must follow accurately the structure and features explained below in order to be accepted and published on the Arduino website.

### TITLE

Title of the tutorial which is directly linked to the feature of the board the tutorial covers.

### INTRODUCTION

A short introductory paragraph that summarises what the tutorial is about  (~150 - 200 words).

This section includes :

* What you will learn - Bullet points of the learning objectives

* Required hardware and software - A list of all the tools required for learning all that is explained in the tutorial and for building the examples

### FEATURE DESCRIPTION

Brief explanation of the topic of the tutorial. Highlight the relevant points and attach external links from trusted websites that a user can use for further investigation (~250 - 300 words)

### STEP BY STEP GUIDE

The practical part of the tutorial from which users learn how to use a particular feature covered by the tutorial. This guide is broken down into several easy-to-digest steps with images that the users can go through to accomplish the learning objectives.

### CONCLUSION

Concludes the tutorial by summarizing what the user has learnt through the tutorial (~100 words).

### NEXT STEPS

Describes next steps that are suggested for the user to further deepen their knowledge. You may list related topics or point to other relevant tutorials.

### TROUBLESHOOTING  (Optional)

Provides useful tips on how to deal with the most common programming errors or other technical issues.

## Creating Images for Tutorials
All images used in the tutorials are created as vector graphics unless they contain bitmap data such as screenshots. The resolution of the images must be 1920 * 1080 pixels and should be exported as a SVG or PNG file depending on the type of visual content. 

You may create drafts for the graphics to help the Arduino team create more refined illustrations that are visually consistent with the graphics from the other tutorials.