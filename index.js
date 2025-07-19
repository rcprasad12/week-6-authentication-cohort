const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "harkirat123";

const app = express();
app.use (express.json()); // this liine of code help u to extract the body that is present in the json format 

const users = [];

app.post("/signup",function(req,res){

        const username = req.body.username
        const password = req.body.password

        users.push({
            username : username,
            password : password
        })
// we should checkk whether the username is already exist or not 
        res.json({
            message:"You are Signed In"
        })
})

app.post("/signin", function(req,res){

    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    for (let i = 0 ; i < users.length; i++){
        if(users[i].username === username && users[i].password === password) { 
            foundUser = users[i];

        }
    }

    if(!foundUser) {
        res.json({
                message : "Credentials incorrect"
        })
        return
    } else {
        const token = jwt.sign({
            username
        },JWT_SECRET);

        res.json({
            token: token
        })
    }
    

    

})

app.get("/me", function(req,res){

    const token = req.headers.token;

    const decodedData = jwt.verify(token,JWT_SECRET);


    if(decodedData.username){
            let foundUser = null;

    for (let i = 0 ; i < users.length; i++){  //decoding happens thrugh verify of tokken u will be decoded and get u the username 
        if(users[i].username === decodedData.username) { 
            foundUser = users[i];

        }
    }
    res.json({
        username : foundUser.username,
        password:foundUser.password
    })
  }
});

app.listen(3000);
