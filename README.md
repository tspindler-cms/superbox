superbox
========

## Enhancing html files of FOF7 ##

This is a sample project to get familiar with nodejs and jquery, and java 8. 
The usfl designation comes from the FOF7 online league I participate in.

The base for the project are the html files generated by the FOF7 football game. The game files
can be exported as csv and are stored in mongodb. The actual game results and statistics can
be exported as html from FOF7. The goal of the project is to connect the two and for example
give an overview of a player that one finds in a box score file.

### Javascript nodejs express server ###

The base technologies on the server side used are express, monk, mongodb driver and jade. The
frontend uses jquery. 

First the dependencies for node (and node itself) need to be installed. For that the usfl/package.json
is used as a base, calling npm install from the usfl directory will install the needed node
modules.

The express app itself resides in the usfl directory. The routes/index.js contains the needed
routes to connect the league html files with the usfl view. After starting the server (npm start in
the usfl directory), the league files can be reached via (http://localhost:3000/usfl/) When navigating
to a box score file, some javascript will be injected and when a player gets clicked on, a brief
overview is shown in a popup window.

### Java 8 import scripts ###

The files for creating the mongodb based on the csv export reside in import. This is work in progress.
For now you need to build the jars with ant and ivy:

  *ant runjar*

The config file can be supplied with

  *--file=config.yml*

Note that currently only the update class is defined in the jar. For accessing other classes you
need to work with the classpath of the jar.

KNOWN ISSUES:
- the scoring summary contains many player names and only one gets shown in the overview
- stats with a score of 0 are ignored, albeit they may be part of a players stat set
