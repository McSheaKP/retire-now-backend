'use strict';
const moment = require('moment');
module.exports = function(Profile) {
    Profile.remoteMethod("retireNowCalc", {
        http: {
            path: "/retireNowCalc",
            verb: "POST"
        },
        accepts: [{
            arg: "userData",
            required: true,
            type: "object",
            description: "Takes in user data object and returns a profile json object."
        }],
        notes: "Will take in user data from the front-end and returns a user object.",
        description: "Pass in a user object to return a profile ojbect.",
        returns: {
            type: 'object',
            root: true
        }
    });
    Profile.retireNowCalc = function (userData, callback){

    let myFRAAmt = userData.myFRAAmt;
    let myDOB = userData.myDOB;
    let myDOR = userData.myDOR;
    let FRAMonths = userData.fraMonths;
    let FRADate = userData.FRADate;
    
    let userObject = {
        "name": "string",
        "fra": 0,
        "fraMonths": 0,
        "fraDate": "2018-08-12T23:53:05.829Z",
        "fraAmount": 0,
        "retireAge": 0,
        "retireDate": "2018-08-12T23:53:05.829Z",
        "monthlyAmount": 0,
        "chart": [
          {}
        ],
        "userId": "string",
        "barChartLabels": "Array"
    }

    function populateUserObject(){

        userObject.name = userData.profileName;
        userObject.retireDate = userData.myDOR; 
        
    }
    
    //calculate the retire age for the chart
    function calcRetireAge(DOB, DOR){
      let retireAge = Math.abs(moment(DOB).diff(DOR, "years", false));
      console.log("this is the retire age", retireAge);
      return String(retireAge);
    }
    
    //calculates the age of full retirement amount
    function calcFullRetirmentAge(DOB, FRAMonths){
      let fullRetireDate = moment(DOB).add(FRAMonths, "months");
      let fullRetireAge = Math.abs(moment(DOB).diff(fullRetireDate, "years"));
      return String(fullRetireAge);
    }
    
    function calcMonthAmt70(DOB, FRADate, myFRAAmt){
      let age70Date = moment(DOB).add(70, "years");
      let mthsDiff = Math.abs(moment(FRADate).diff(age70Date, "months"));
      let percent = (mthsDiff * (2/3 *.01)) ; 
      let mthAmt70 = (percent * myFRAAmt) + myFRAAmt;
      return mthAmt70;
    }
    
    function calcMonthAmt62(DOB, FRADate, myFRAAmt){
      let age62Date = moment(DOB).add(62, "years");
      let mthsDiff = Math.abs(moment(age62Date).diff(FRADate, "months"));
      let percent;
      if(mthsDiff > 0){
        if (mthsDiff <= 36){
          percent = mthsDiff * (.01 * (5/9));
          percent = Math.round(percent * 1000) / 1000;
        } else if (mthsDiff > 36){
            percent = (36 * (.01 * (5/9)))
            percent = percent + ((mthsDiff - 36) * (5/12 * .01));
            percent = Math.round(percent * 1000) / 1000;
        }
      }
      myFRAAmt = (myFRAAmt - (myFRAAmt * percent));
      return myFRAAmt;
    }
    
    function calcMonthAmtRetireDate(FRADate, myDOR, myFRAAmt){
      let mthsDiff = moment(FRADate).diff(myDOR, "months");
      let percent;
      let retireAmt;
      if(mthsDiff > 0){
        if (mthsDiff <= 36){
          percent = mthsDiff * (.01 * (5/9));
          percent = Math.round(percent * 1000) / 1000;
          retireAmt = (myFRAAmt - (myFRAAmt * percent));
        }
        else if (mthsDiff > 36){
          percent = (36 * (.01 * (5/9)));
          percent = percent + ((mthsDiff - 36) * (5/12 * .01));
          percent = Math.round(percent * 1000) / 1000;
          retireAmt = (myFRAAmt - (myFRAAmt * percent));
        }
      }
      else{
          mthsDiff = Math.abs(mthsDiff);
          percent = (mthsDiff * (2/3 *.01));
          percent = Math.round(percent * 1000) / 1000; 
          retireAmt = (percent * myFRAAmt) + myFRAAmt;
      }
      return retireAmt;
    } 

    function populateChart(){
       
       
        let retireAge = calcRetireAge(myDOB, myDOR);
        let fullRetireAge = calcFullRetirmentAge(myDOB, FRAMonths);
     
        let chart = [
           {
             data: [],
             label: ""
           }
         ];
        let barChartLabels = [];
        
        chart[0].data[0] = calcMonthAmt62(myDOB, FRADate, myFRAAmt)
        barChartLabels[0] = "62"
        let monthlyAmount = 0;
         
        if(retireAge < fullRetireAge){
           monthlyAmount = calcMonthAmtRetireDate(FRADate, myDOR, myFRAAmt);
           chart[0].data[1] = monthlyAmount;
           chart[0].data[2] = myFRAAmt;
           barChartLabels[1] = retireAge; //make each of these strings
           barChartLabels[2] = fullRetireAge; //make each of these strings
        }
        else{
           chart[0].data[1] = myFRAAmt;
           monthlyAmount = calcMonthAmtRetireDate(FRADate, myDOR, myFRAAmt);
           chart[0].data[2] = monthlyAmount 
           barChartLabels[2] = retireAge; //make each of these strings
           barChartLabels[1] = fullRetireAge; //make each of these strings
        }
     
        chart[0].data[3] = calcMonthAmt70(myDOB, FRADate, myFRAAmt)
        barChartLabels[3] = "70";
 
        userObject.monthlyAmount = monthlyAmount
        userObject.chart = chart;
        userObject.barChartLabels = barChartLabels;
        userObject.retireAge = retireAge;
        populateUserObject();
    }

    populateChart();
    
    callback(null, userObject)

    }

};
