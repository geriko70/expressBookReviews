const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist=(username)=>{
    const userCheck=users.filter((user)=>user.username===username);
    if(userCheck.length>0){
        return true;
    }else{
        return false;
    }
}
public_users.post("/register", (req,res) => {
  const username=req.body.username;
  const password=req.body.password;
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
  public_users.get('/', function (req, res) {
  
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Impossibile recuperare i libri");
    }
  });

  getBooks
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    const getBooks=new Promise((resolve,reject)=>{
        if(isbn){
            if(books[isbn]){
                resolve(books[isbn]);
            }else{
                return reject("books with this isbn isn't present");
            }
        }else{
            return reject("Isbn not present");
        }
    })

    getBooks.then((book)=>res.status(203).json({book})).catch((err)=> res.status(403).json({message:"error"}));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author=req.params.author;
  let authorBooks=Object.values(books).filter((book)=>book.author===author)
  const getBooks=new Promise((resolve,reject)=>{
    if(authorBooks.length>0){
        resolve(authorBooks);
    }else{
        reject("There is no author named "+author);
    }

  })
  getBooks.then((book)=> res.status(203).json(book)).catch((err)=>res.status(203).json("error"));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 const title=req.params.title;
 let titleBooks=Object.values(books).filter((book)=>book.title===title);
 const getBooks=new Promise((resolve,reject)=>{
    if(titleBooks.length>0){
        resolve(titleBooks);
    }else{
        reject("There is no book named "+title);
    }

  })
  getBooks.then((book)=> res.status(203).json(book)).catch((err)=>res.status(203).json("error"));
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
