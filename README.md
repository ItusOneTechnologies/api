# api
API and Frontend 

/app
This folder contains the following subfolders: ./models and ./routes

/app/models/
This folder contains the Mongoose models that connect to the mongoDB. They define the fields that are 
used in the 'documents'
/app/routes/
Contains api.js and register.js. api.js is all of the API routes for the application. They are all
protected by requiring a valid json web token, jwt. register.js is the routes for registering companies
and users

/public/app/
Contains the following: controllers, services, views, app.js, and app.routes.js

/public/app/controllers/ is where the angular controllers are located
/public/app/services/ are where the angular services are located.
/public/app/views/ contains all of the html views for each page

