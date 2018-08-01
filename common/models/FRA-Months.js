module.exports = function(FRAMonths){
FRAMonths.remoteMethod("totalMonthsFRA", {
    http: {
        path: "/totalMonthsFRA",
        verb: "POST"
    },
    accepts: [{
        arg: "propertyA",
        required: true,
        type: "date",
        description: "DOB from user register page to calculate the date of their FRA and total months alive to that date."
    }, {
        arg: "propertyB",
        type: "string",
        description: "A separate sentence description from above about this property API purpose."
    }],
    notes: "This field will describe how to use the API. Be as descriptive as necessary.",
    description: "Example description.",
    returns: {
        type: 'object',
        root: true
    }
})

}; 
