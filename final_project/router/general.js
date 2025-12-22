const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist=(username)=>{
    const userCheck=users.filter((user)=>user.username===username);
    if(userCheck){
        return true;
    }else{
        return false;
    }
}
public_users.post("/register", (req,res) => {
  const username=req.params.username;
  const password=req.params.password;
  if(username&&password){
  if(doesExist(username)){
    res.send("Username already registered");
  }else{
    users.push({'username':username,'password':password});
    res.send("User registered!");
  }
}else{
    res.send("Unable to register");
}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    if(books[isbn]){
        res.send(books[isbn]);
    }else{
        res.send("Unable to find a book with the isbn: "+isbn);
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author=req.params.author;
  let authorBooks=Object.values(books).filter((book)=>book.author===author)
  if(authorBooks.length>0){
    res.send(JSON.stringify(authorBooks,null,4));
  }else{
    res.send("Unable to find a book of: "+author);
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 const title=req.params.title;
 let titleBooks=Object.values(books).filter((book)=>book.title===title);
 if(titleBooks.length>0){
    res.send(JSON.stringify(titleBooks,null,4)); 
 }else{
    res.send("Unable to find a book with this title: "+title);
 }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn=req.params.isbn;  
  if(books[isbn]){
    res.send(JSON.stringify(books[isbn],null,4));
  }else{
    res.send("Unable to find a book with this isbn: "+isbn);
  }
  
});

module.exports.general = public_users;
