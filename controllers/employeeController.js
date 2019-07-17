const express = require('express');
var moment = require('moment');
var helpers = require('handlebars-helpers')();
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/', (req, res) => {
    res.render("employees/createOrEdit", {
        viewTitle: "Create Employee"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

var Request = require("request");

var favoriteQuote = "";
Request.get("https://ron-swanson-quotes.herokuapp.com/v2/quotes", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    favoriteQuote = JSON.parse(body)[0];
});

var favoriteJoke = "";
var options = {
    url: 'https://icanhazdadjoke.com/',
    headers: {
      'User-Agent': 'request',

      'Accept': 'text/plain'
    }
  };
   
Request.get(options, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    favoriteJoke = body;
});

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

function insertRecord(req, res) {
    var employee = new Employee();

    employee.firstName = req.body.firstName;
    employee.lastName = req.body.lastName;

    if(isValidDate(req.body.hireDate))
    {  
        employee.hireDate = moment.utc(req.body.hireDate).format();
    }
    else
    {
        employee.hireDate = null;
    }

    employee.role = req.body.role;
    employee.favoriteJoke = favoriteJoke;
    employee.favoriteQuote = favoriteQuote;
    
    employee.save((err, doc) => {
      
        if (!err)
            res.redirect('employees/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employees/createOrEdit", {
                    viewTitle: "Create Employee",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}



function updateRecord(req, res) {
    console.log(req.body);
       if(!isValidDate(req.body.hireDate))
        {
            req.body.hireDate = null;
        }
    var opts = { runValidators: true, new: true };
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, opts, (err, doc) => {

        
        if (!err) { res.redirect('employees/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employees/createOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error while updating employee record :' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        docs.forEach(doc => {
            doc.hireDate = moment(doc.hireDate).utc().format("YYYY-MM-DD");
        });
        if (!err) {
            res.render("employees/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});




function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'firstName':
                body['firstNameError'] = err.errors[field].message;
                break;
            case 'lastName':
                body['lastNameError'] = err.errors[field].message;
                break;
            case 'hireDate':
                body['hireDateError'] = err.errors[field].message;
                break;
            case 'role':
                body['roleError'] = err.errors[field].message;
                break;

            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employees/createOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employees/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

module.exports = router;