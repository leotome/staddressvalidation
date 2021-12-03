require("dotenv").config();

const db = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
module.exports = {
    authenticateToken : authenticateToken,
    registerUser : registerUser,
    loginUser : loginUser,
    verifyToken : verifyToken
}

function authenticateToken(req, res) {
    const Authorization = req.headers["authorization"];
    if(Authorization !== undefined){
        const token = Authorization && Authorization.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return false;
            }
            return true;
          });        
    } else {
        return false;
    }
}
  
// REGISTAR - cria um novo utilizador
async function registerUser(req, res){
    if (!req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    try {
        const body = req.body;
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(body.password, salt);
        const email = body.email;
        const password = hashPassword;
        //const confirmationToken = jwt.sign(req.body.email, process.env.ACCESS_TOKEN_SECRET);
        db.Crud_registar(email, password) // C: Create
        .then((data) => {
            var user = {
                email : email,
                password : password
            }
            var response = { message: "User created successfully!", user : user };
            res.status(201).send(response);
        })
        .catch((error) => {
            res.status(400).send({ message: error.msg });
        });
    } catch {
        return res.status(400).send({ message: "Bad Request" });
    }
};

// LOGIN - autentica um utilizador
async function loginUser(req, res) {
    if (!req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const email = req.body.email;
    const password = hashPassword;
    db.cRud_login(email)
    .then(async (data) => {
        if( await bcrypt.compare(req.body.password, data.password) ) {
            const user = { name: email };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken });
        } else {
            const message = { message : "Password incorrect." };
            return res.status(401).send(message);
        }
    })
    .catch((response) => {
        console.log(response);
        return res.status(400).send(response);
    });
};

async function verifyToken(req, res) {
    const Authorization = req.headers["authorization"];
    const token = Authorization && Authorization.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
        if(err) {
            return res.status(401);
        }
        if(result) {
            var email = result.name;
            db.cRud_login(email)
            .then(async (data) => {
                var response = {
                    _id : data._id,
                    token : token
                };
                return res.send(response);
            })
            .catch((response) => {
                console.log(response);
                return res.status(401);
            })
        }
    });
}