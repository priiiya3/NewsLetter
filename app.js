
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { Server } = require('http');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
   const firstName = req.body.fName;
   const lastName = req.body.lName;
   const  email = req.body.emailAddress;

   console.log(firstName, lastName, email);
//    res.send(firstName + " congrat's. You're signedUp to our Newsletter for email : " + email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed", 
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }    

   const jsonData = JSON.stringify(data);              // To turn our data into human readable string form.
   const url = "https://us6.api.mailchimp.com/3.0/lists/3acfccf5fc"

   const options = {
        method: "POST",
        auth: "Priya1:3a6f36693188e2d8a2976b0516177491-us6"
   }

   const request = https.request(url, options, function(response){

        if (response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
            
        } else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
   });

   request.write(jsonData);        // Passing the mailing data to our mailchimp Server.
   request.end();       // ending our request

});

app.post("/failure", function(req, res) {
   res.redirect("/") 
});

app.listen(3000, function(req, res){
    console.log("You're at port 3000.");
});











// App ID : 3a6f36693188e2d8a2976b0516177491-us6
// List ID : 3acfccf5fc