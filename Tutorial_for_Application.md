Architecture of Application
---------------------------


Back-End
==========================
Main
-Flask
-PostgreSQL (Right now its SQLite)

Addons


Front-End
===========================
Main
-Backbone
-Marionette Framework: Framework on top of Backbone to provide application structure
-Foundation Framework: Framework that handles styling for the website (responsiveness, mobile, etc)

Addons
-Handlebars: Templating Engine
-RequireJS: Handles Javascript file dependencies


Breakdown of Backbone/Marionette
--------------------------------
Folder Structure

-Public: Root folder
--CSS: Contains website's CSS files
--Img: Contains website's IMG files
--JS: Contains website's JS files
---Lib: Contains the JS files required to run the website (foundation, backbone, require, marionette, etc)
---App: Contains the backbone/marionette files for the website
----Collections: Will contain our Backbone model collections
----Config: Contains the requireJS configurations
----Controllers: Contains the main controller to handle routing and transitions between the pages of the website
----Layout: Contains the Backbone/Marionettte Layouts (Home and Main so far)
----Models: Contains the Backbone/Marionette Models (Sessions and Users so far)
----Routers: Contains the Backbone/Marionette Routers (AppRouter so far)
----Templates: Contains the template files
----Views: Contains all our views 
----App.js: Instantiates the Marionette application and defines the mainRegion in which our layouts are put into

Application Hierarchy
--------------------------------

1. Application starts in index.html. "div#mainRegion" is the "main" region in which the home page and main page are rendered into. Remember that a single application (which are website is) does NOT re-render the whole page, instead it only renders parts of the page when needed. Thus, essentially a single page application has only one "page" and different "sections" in the page. Our website is a multi- single page application. The home page is one of the single pages and the main page (page after user logs in) is another page. They both have different layouts and sections on the page which is why the website is a "multi-" single page application.

2. Index.html has calls two js files in the line "<script type="text/javascript" src="js/libs/require.js" data-main="js/app/config/Init.js"></script>". Src references the requireJS source file. Data-main calls our require config file in which we establish our JS paths and dependencies.

3. 
