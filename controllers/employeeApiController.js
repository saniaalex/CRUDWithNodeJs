const express = require('express');
var moment = require('moment');
var helpers = require('handlebars-helpers')();
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const Request = require('request-promise');

var favJokeoptions = {
    url: 'https://icanhazdadjoke.com/',
    headers: {
    'User-Agent': 'request',

    'Accept': 'text/plain'
    }
};

router.get('/', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.json(docs);
        }
        else {
            res.status(500).send(`Error in retrieving employee list. More info: ${err}`);
            console.log(`Error in retrieving employee list. More info: ${err}`);
        }     
    });
});

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
          res.json(doc);
        }
        else
        {
            res.status(204).send(`Error in retrieving employee with ID: ${req.params.id}. More info: ${err}`);
            console.log(`Error in retrieving employee with ID: ${req.params.id}. More info: ${err}`);
        }
    });
});

router.post('/', (req, res) => {
    insertRecord(req, res);
});

router.put('/:id', (req, res) => {
    updateRecord(req, res);
});

router.delete('/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.send(`Employee ${req.params.id} has been deleted successfully`);
        }
        else { 

            if (err.name == 'ValidationError') {
                res.status(400).send(`Unable to delete record with ID: ${req.params.id}. More info: ${err}`);
            }
            else
            {
                res.status(500).send(`Unable to delete record with ID: ${req.params.id}. More info: ${err}`);
                console.log(`Unable to delete record with ID: ${req.params.id}. More info: ${err}`)};
            }
    });
});

async function insertRecord(req, res) {
    var employeeCollection = [];
    for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            emp = req.body[key];

            var newEmp = new Employee();
            newEmp.firstName = emp.firstName;
            newEmp.lastName = emp.lastName;
            if(isValidDate(emp.hireDate))
            {  
                newEmp.hireDate = moment.utc(emp.hireDate).format();
            }
            else
            {
                res.status(400).send('Please enter date in valid YYYY-MM-DD format');
                return;
            }
            newEmp.role = emp.role;
            newEmp.favoriteQuote = await getQuote();
            newEmp.favoriteJoke = await  getJoke();
            employeeCollection.push(newEmp);
        }
    }

    Employee.insertMany(employeeCollection, (err, doc) => {
        if (!err)
            {
                res.send(`Employee(s) have been saved successfully`);
            }
        else {
            if (err.name == 'ValidationError') {
                res.status(400).send(`Unable to insert record. More info: ${err}`);
            }
            else
            {
                res.status(500).send(`Unable to insert record. More info: ${err}`);
                console.log('Error during record insertion : ' + err);
            }
        }
    });
}

function updateRecord(req, res) {
    if(!isValidDate(req.body.hireDate))
        {
            res.status(400).send('Please enter a valid date in YYYY-MM-DD format');
            return;
        }
    var opts = { runValidators: true, new: true };
    Employee.findOneAndUpdate({ _id: req.params.id }, req.body, opts, (err, doc) => {

        
        if (!err) {res.send(`Employee ${req.params.id} has been updated successfully`);
        }
        else {
            if (err.name == 'ValidationError') {
                res.status(400).send(`Unable to update record with ID: ${req.params.id}. More info: ${err}`);
            }
            else
                console.log('Error while updating employee record :' + err);
        }
    });
}

async function getJoke() {
     var res = await Request(favJokeoptions, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        var favoriteJoke = body;
   
        return favoriteJoke;
    }); 

    return res;

}

async function getQuote() {
    var favQuote = "";
    await Request("https://ron-swanson-quotes.herokuapp.com/v2/quotes", (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        favQuote = JSON.parse(body)[0];
    });
    return favQuote;

}

function isValidDate(value) {

    if(value == null || value.trim() == "")
    {
       return false;
    }
    if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) 
    {
       return false;
    }
    return true;
  }

module.exports = router;