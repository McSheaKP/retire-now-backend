'use strict';
const moment = require('moment');

module.exports = function(Appuser) {
    Appuser.remoteMethod("totalMonthsFRA", {
        http: {
            path: "/totalMonthsFRA",
            verb: "POST"
        },
        accepts: [{
            arg: "userDOB",
            required: true,
            type: "string",
            description: "the user's DOB gathered from the register page"
        }
    ],
        notes: "Used to calculate the date of a user's FRA and total months alive to that date.",
        description: "Calculate the user's FRA date and total months alive",
        returns: {
            type: 'object',
            root: true
        }
    })
    Appuser.totalMonthsFRA = function(userDOB, callback){
            let totalFRAMonths;
            let myDOBNum;
            myDOBNum = parseInt(userDOB.substring(0,4), 10);
            if (userDOB.substring(5,11) === "01-01"){
                myDOBNum -= 1; 
              }
                if (myDOBNum >= 1960) {
                totalFRAMonths = 804; 
                } else if (myDOBNum === 1959) {
                totalFRAMonths = 802 
                } else if (myDOBNum === 1958) {
                totalFRAMonths = 800 
                } else if (myDOBNum === 1957) {
                totalFRAMonths = 798
                } else if (myDOBNum === 1956) {
                totalFRAMonths = 796
                } else if (myDOBNum === 1955) {
                totalFRAMonths = 794 
                } else if (myDOBNum <= 1954 && myDOBNum >= 1948) {
                totalFRAMonths = 792
                } else {
                totalFRAMonths = "already at 70, trigger"; 
                }
            let FRADate = moment(userDOB).add(totalFRAMonths, "months");
            let userFRAData = {
                "FRAMonths": totalFRAMonths,
                "FRADate": FRADate
            } 
            console.log("userFRAData", userFRAData);
            callback(0, userFRAData); 
        } 

    }; 
            