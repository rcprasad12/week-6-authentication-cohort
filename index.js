const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors"); // <-- add this line

const JWT_SECRET = "kirat123123";

const app = express();
app.use(cors()); // <-- add this line
app.use(express.json());

const users = [];

function logger(req, res, next) {
    console.log(req.method + " request came");
    next();
}

// localhost:3000
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
})

app.post("/signup", logger, function(req, res) {
    const username = req.body.username
    const password = req.body.password
    users.push({
        username: username,
        password: password
    })

    // we should check if a user with this username already exists

    res.json({
        message: "You are signed in"
    })
})

app.post("/signin", logger, function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            foundUser = users[i];
        }
    }

    if (!foundUser) {
        return res.status(401).json({ message: "Credentials incorrect" });
    }

    const token = jwt.sign({ username: foundUser.username }, JWT_SECRET);
    res.json({ token: token });
});

function auth(req, res, next) {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);

    if (decodedData.username) {
        // req = {status, headers...., username, password, userFirstName, random; ":123123"}
        req.username = decodedData.username
        next()
    } else {
        res.json({
            message: "You are not logged in"
        })
    }
}

app.get("/me", logger, auth, function(req, res) {
    const currentUser = req.username;
    let foundUser = null; // <-- declare foundUser

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === currentUser) {
            foundUser = users[i];
        }
    }

    if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({
        username: foundUser.username,
        password: foundUser.password
    });
});

app.listen(3000);

// To check which process is using port 3000, run the following command in your terminal:
// netstat -ano | findstr :3000