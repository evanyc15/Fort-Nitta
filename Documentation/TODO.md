To-do list!
===========

Backend
-------

### Long-term
* Get some minimal functionality into the API
* Start to hash passwords stored after user creation is OK
* Consider CSRF protection for API
* Start on friends system

### Short-term
* Flesh out more API functionality for models
* Serve avatars not through API or Flask, but through Apache on optical.
* Update "Read" field in Chat_messages table when a user reads a chat message

### Urgent
* See (1). Add Flask routes to facilitate those changes.

Frontend
--------
--!D! means Done
--!P! means in Progress

### Urgent
* (1) JS app should reference static files by a designated static/assets/public folder. This will make static file URL routing in Apache much easier and less hacked. For development, Flask may serve URLs pointing to this folder, giving the added bonus of eliminating the need for CORS and development using two servers.

--!P! (2) Presence players on backbone side: Check by username rather than result list and make sure its all working since the Flask side is yielding rather than returning
--!D! (3) Remove change profile picture on profile page
--!D! (4) Better error checking on signup and login page
(5) Allow "enter" key on all inputs
(6) Error checking in all of messaging
--!D! (7) Messaging Notification not up yet 
(8) UML diagrams in xMind
--!D! (9) Need to transition to using Backbone Models more for Backbone.validation, POST/GET (AJAX calls), and storing user information. Validation using SignupModel, LoginModel
--!D! (10) Move players list and messages list to Backbone collections (PLAYERS LIST IS ALMOST DONE, GETTING WEIRD ERROR WHEN REMOVING PLAYERS FROM LIST IN PLAYERSVIEW)
--!P! (11) Create forums
(12) Create friends
(13) Gamify
--!D! (14) Switching between forum views seems to break (only sometimes) due to view not existing anymore
(15) Need Flask-side validation for forums threads, posts, images, etc
(16) Timer on players list
(17) Scroll bar not showing on players list
--!D! (18) Messaging not using "read" flag
(19) Forum navigator to go forward and back between categories, threads, posts
(20) Messaging avatar pictures
--!D! (21) Forum post images and lightbox
--!D! (22) Forum posts reply is posting multiple times
--!D! (23) Unlike posts as well
(24) Timer to logout after some time
(25) Delete post if image upload fails
--!D! (26) Implement image compression
--!D! (27) Migrate a lot of ajax calls and other definitions in view initializers into the onRender function to help with efficiency and performance.
--!D! (28) In layouts, move around the function bindings so that views are only instantiated when moving between views. No need to do it all in initializer
(29) Need to limit max width in slick post image (and/or make the container wider if needed)
--!P! (30) Need loading pages/icon when loading forums and such cause it takes a while which may confuse user to think that there are no threads/posts
(31) Home pageloader, need to also check images loaded because they are still rendering when home page shows (maybe use imageLoader.js?)
(32) Extra scrollbar is showing on player list
(33) Image resize and compression on profile pictures