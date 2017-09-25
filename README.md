# README #

This repository is for the ddos api application built with Express, a fast minimalist web framework for Node.

### App architecture? ###

A single NodeJS application running on the **ddps** server accesses both the remote InfluxDB database linked with fastnetmon (for querying only) and the local PostgreSQL db (for querying and performing CRUD operations). We chose NodeJS as this would allow for a single language over server and client side applications to manage information flow. Hence allowing for easy debugging and future scaling up.

We have a single node application to manage several instances of fastnetmon and connected InfluxDB instances and the single PostgreSQL rules database for all rules over all fastnetmon instances categorized over networks and IPs. 

The following line diagram shows the specific architecture that we have now for ddos gui.

![Application Overview](public/readme/app-overview.png)

Also, queries written in SQL are parsed and processed by the application for both PostgreSQL and InfluxDB. 
Thus the app provides the necessary API endpoints and services that are used by the client application.

Essentially, a single node app manages operations over *n-instances* of fastnetmon (and InfluxDB) and *1-instance* of the rules database implemented with PostgreSQL. The line diagram below shows the scaled version of the entire architecture.

![App Architecture : Scaled Up](public/readme/scaled.png)


### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact
