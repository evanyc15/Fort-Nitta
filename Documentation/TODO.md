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

### Urgent
* See (1). Add Flask routes to facilitate those changes.

Frontend
--------

### Urgent
* (1) JS app should reference static files by a designated static/assets/public folder. This will make static file URL routing in Apache much easier and less hacked. For development, Flask may serve URLs pointing to this folder, giving the added bonus of eliminating the need for CORS and development using two servers.

(2) Presence players on backbone side: Check by username rather than result list and make sure its all working since the Flask side is yielding rather than returning
(3) Remove change profile picture on profile page
(4) Better error checking on signup and login page
(5) Allow "enter" key on all inputs
(6) Error checking in all of messaging
(7) Messaging Notification not up yet
(8) UML diagrams in xMind
(9) Need to transition to using Backbone Models more for validation, POST/GET (AJAX calls), and storing user information
(10) Move players list and messages list to Backbone collections