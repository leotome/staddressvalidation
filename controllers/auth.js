require("dotenv").config();

const db = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
module.exports = {
    authenticateToken : authenticateToken,
    registerUser : registerUser,
    loginUser : loginUser
}

function authenticateToken(req, res) {
    const Authorization = req.headers["Authorization"];
    if(Authorization !== undefined){
        const token = authHeader && authHeader.split(" ")[1];
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
    console.log("Registar novo utilizador");
    if (!req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const email = req.body.email;
        const password = hashPassword;
        //const confirmationToken = jwt.sign(req.body.email, process.env.ACCESS_TOKEN_SECRET);
        db.Crud_registar(email, password) // C: Create
        .then((data) => {
            var response = { message: "User created successfully!" };
            res.status(201).send(response);
            console.log("Controller - utilizador registado: " + JSON.stringify(data));
        });
    } catch {
        return res.status(400).send({ message: "Bad Request" });
    }
};

// LOGIN - autentica um utilizador
async function loginUser(req, res) {
    console.log("Autenticação de um utilizador");
    if (!req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const email = req.body.email;
    const password = hashPassword;
    db.cRud_login(email)
    .then(async (dados) => {
        if( await bcrypt.compare(req.body.password, dados.password) ) {
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