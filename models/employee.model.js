const mongoose = require('mongoose');
var moment = require("moment-timezone")

var employeeSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: 'Please enter First Name'
    },
    lastName: {
        type: String,
        required : "Please enter Last Name"
    },
    hireDate: {
        type: Date,
        required: "Please enter valid date in YYYY-MM-DD format"
    },
    role: {
        type: String,
        enum: ['CEO', 'VP', 'MANAGER', 'LACKEY'],
        uppercase : true,
        trim : true,
        required: "Please enter the role"
    },
    favoriteQuote:{
        type: String
    },
    favoriteJoke:{
        type: String
    }
});


    function isValidDate(date)
    {
        var hireDate = date;
        var curDate = new Date();
        curDate.setHours(0,0,0,0)
        console.log(hireDate + " " + curDate);
        var eval =hireDate.getTime() < curDate.getTime();
        console.log("is valid date" + eval);
        return eval;
    }

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function isValidFormat(date) {
    if(date == null)
    {
        return false;
    }

    var value = formatDate(date);

    if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

    if (!date.getTime()) return false;
   
    console.log("Is valid format");
    return true;
  }

employeeSchema.path('hireDate').validate((val) => {
    return isValidFormat(val);
}, 'Please enter a valid date in YYYY-MM-DD format.');

employeeSchema.path('hireDate').validate((val) => {

    return isValidFormat(val) && isValidDate(val);
}, 'Please enter a date in the past.');

//This converts the input date to GMT/CST while interacting with the database, which always stores dates in CST
employeeSchema.path('hireDate').get((val) => {
    return val ? moment(val).tz('GMT').format('YYYY-MM-DD') : '';
   });

mongoose.model('Employee', employeeSchema);