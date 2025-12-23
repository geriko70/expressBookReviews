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
    const review=req.body.review;
    if(review){
    if(req.session.authorization){
        let username=req.session.authorization.username;
        let isbn=req.params.isbn;
        if(isbn){
            let isbnBook=Object.values(books).filter((book)=>book.isbn===isbn);
            if(isbnBook){
                let index=books[isbn].reviews.findIndex(rev=>rev.startsWith('${username}:'));
                if(index!=-1){
                    books[isbn].review[index]='${username}:${review}';
                }else{
                    books[isbn].review.push('${username}:${review}');
                }
            }else{
                return res.status(400).json({message:"Book not found"});
            }
        }else{
            return res.status(400).json({message:"Invalid ISBN"});
        }
    }else{
        return res.status(400).json({message:"Invalid session, log again"});
    }
}else{
    return res.status(400).json({message:"review not valid"});
}
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
