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
