const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "harkirat123";

const app = express();
app.use (express.json()); // this liine of code help u to extract the body that is present in the json format 

const users = [];

// 1. Logger middleware function
function logger(req, res, next) {
    console.log(req.method + " request came");
    next();
}

// 5. Auth middleware function
function auth(req, res, next) {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);

    if (decodedData.username) {
        req.username = decodedData.username
        next()
    } else {
        res.json({
            message: "You are not logged in"
        })
    }
}

app.post("/signup",logger,function(req,res){

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

app.post("/signin", logger, function(req,res){

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

        // 4. Set custom headers in /signin
        res.header("jwt", token);
        res.header("random", "harkirat");

        res.json({
            token: token
        })
    }
    

    

})

app.get("/me", logger, auth, function(req,res){

    const currentUser = req.username;

    let foundUser = null;

    for (let i = 0 ; i < users.length; i++){  //decoding happens thrugh verify of tokken u will be decoded and get u the username 
        if(users[i].username === currentUser) { 
            foundUser = users[i];

        }
    }
    res.json({
        username : foundUser.username,
        password:foundUser.password
    })
});

// 3. Serve index.html on GET /
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(3000);
