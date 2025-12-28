const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
    // Usiamo il nome coerente: validUsers
    let validUsers = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    // Ora il nome corrisponde esattamente a quello sopra
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username=req.body.username;
    const password=req.body.password;
    if(authenticatedUser(username,password)){
        let accessToken=jwt.sign({
            data:password
        },'access',{expiresIn:60*60});

        req.session.authorization={
            accessToken,username
        }
        return res.status(208).json({message:"Valid login. "});
    }else{
        return res.status(208).json({message:"Invalid login. Check username and passowrd"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn=req.params.isbn;
    const review=req.body.review;
    const username=req.session.authorization.username;

    if(isbn){
        if(books[isbn]){
            if(review){
                books[isbn].reviews[username]=review;
                return res.status(203).json({message:"thanks for the review!"});
            }else{
                return res.status(403).json({message:"review not present"});
            }
        }else{
            return res.status(403).json({message:"isbn not valid"});
        }
    }else{
        return res.status(403).json({message:"isbn not present"});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn=req.params.isbn;
    const username=req.session.authorization.username;

    if(isbn){
        if(books[isbn]){
                delete books[isbn].reviews[username];
                return res.status(203).json({message:"delete successful"});
        }else{
            return res.status(403).json({message:"isbn not valid"});
        }
    }else{
        return res.status(403).json({message:"isbn not present"});
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
