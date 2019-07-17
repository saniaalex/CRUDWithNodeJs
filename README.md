# CRUDWithNodeJs
Node app using Express and MongoDb that implements a set of REST APIs allowing CRUD functionality for an employee resource. 
This app also has a test client for performing CRUD operations on employee database.

**Getting Started

Download the project and run the following commands.

$ npm install 
This should install all required node modules

Launching the application - 
$node server.js
This runs the startup script and starts the node server on port 3000.

This API has 2 endpoints
1. http://localhost:3000/api/employees - Allows interaction with employees database for performing CRUD operations
2. http://localhost:3000/employees - Provides a USER Interface/Test Client for this API

**DETAILS-

**API endpoints for CRUD operations :

POST http://localhost:3000/api/employees

**Example:

CONTENT-TYPE : application/json

RAW DATA : 

[{"firstName":"Sania","lastName":"Alex","hireDate":"2019-07-12","role":"ceo"}, {"firstName":"John","lastName":"Mathew","hireDate":"2019-07-12","role":"lackey"}]

The above data should save successfully.

VALIDATION/Bad requests

1. Date in future-
[{"firstName":"Sania","lastName":"Alex","hireDate":"2019-07-19","role":"ceo"}, {"firstName":"John","lastName":"Mathew","hireDate":"2019-07-12","role":"lackey"}]

2. Invalid Date Format-
[{"firstName":"Sania","lastName":"Alex","hireDate":"2019-07","role":"ceo"}, {"firstName":"John","lastName":"Mathew","hireDate":"2019-07-12","role":"lackey"}]

3. Invalid Role
[{"firstName":"Sania","lastName":"Alex","hireDate":"2019-07","role":"Developer"}, {"firstName":"John","lastName":"Mathew","hireDate":"2019-07-12","role":"lackey"}]


The employee object created should have favorite joke and quotes from the below API's
     https://ron-swanson-quotes.herokuapp.com/v2/quotes
     https://icanhazdadjoke.com
     

PUT http://localhost:3000/api/employees/:id


- Replace the record corresponding to :id with the contents of the PUT body

**Example

http://localhost:3000/api/employees/5d2d49aa456665556075a9dc
CONTENT-TYPE : application/json

RAW DATA - 
{"firstName":"Sania","lastName":"Alex","hireDate":"2019-07-17","role":"manager"}

This updates record with given ID


GET http://localhost:3000/api/employees/:id
CONTENT-TYPE : application/json

- Return the record corresponding to the id parameter

**Example

http://localhost:3000/api/employees/5d2d49aa456665556075a9dc

{"_id":"5d2d49aa456665556075a9dc","firstName":"sania","lastName":"finalTest","hireDate":"2019-07-13T00:00:00.000Z","role":"CEO","favoriteJoke":"Why don’t seagulls fly over the bay? Because then they’d be bay-gulls!","favoriteQuote":"There are only three ways to motivate people: money, fear, and hunger.","__v":0}


GET http://localhost:3000/api/employees

- Return all current records


DELETE http://localhost:3000/api/employees/:id

- delete the record corresponding to the id parameter

EXAMPLE - 
http://localhost:3000/api/employees/5d2d49aa456665556075a9dc

**TEST CLIENT

POST http://localhost:3000/employees

PUT http://localhost:3000/employees/:id

GET http://localhost:3000/employees/:id

GET http://localhost:3000/employees

DELETE http://localhost:3000/employees/:id
