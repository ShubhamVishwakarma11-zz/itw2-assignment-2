const express = require("express");
const path = require("path");
const {v4:uuid} = require("uuid");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));

app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,"/public")))


// BOOKS

let novels = require("./Book-Data/novels.json");

let comics = require("./Book-Data/comics.json");

let academic_books = require("./Book-Data/academic-books.json");

novels.books = novels.books.map(book => Object.assign(book, {id: uuid()}));
comics.books = comics.books.map(book => Object.assign(book, {id: uuid()}));
academic_books.books = academic_books.books.map(book => Object.assign(book, {id: uuid()}));


//LOGIN CREDENTIALS

let userData = {
    name: "",
    username: "",
    email: "",
    password: ""
}
let loggedIn = false;


// For Testing

// let userData = {
//     name: "Shubham",
//     username: "shubham123",
//     email: "me@me.com",
//     password: "123"
// }

// let loggedIn = true;



app.get("/home", (req,res) => {
    res.render("index", {userData, loggedIn} );
});

app.get("/", (req,res) => {
    res.redirect("/home");
});

app.get("/books/:category", (req,res) => {
    let {category} = req.params;
    let bookList;
    if (category === "novels") bookList = novels;
    else if (category == "comics") bookList = comics;
    else if (category == "academic-books") bookList = academic_books;
    res.render("booksCatalogue", {category, collection:bookList,userData, loggedIn});
});

app.get("/book/add", (req,res) => {
    res.render("new-book", {userData, loggedIn});
});

app.post("/book/add", (req,res) => {
    const newBook = {
        title: req.body.book_name,
        author: req.body.book_author,
        price: req.body.book_price + " INR", 
        img_link: req.body.book_img_link,
        id: uuid()
    };
    if (req.body.book_collection === "comics") {
        comics.books.unshift(newBook);
        comics.total_books ++;
        res.redirect("/books/comics");
    }
    else if (req.body.book_collection === "novels") {
        novels.books.unshift(newBook);
        novels.total_books ++;
        res.redirect("/books/novels");
    }
    else if (req.body.book_collection === "academic-books") {
        academic_books.books.unshift(newBook);
        academic_books.total_books ++;
        res.redirect("/books/academic-books");
    }
    else {
        res.send("Some Error has occured...");
    }
});

app.get("/book/:category/:id" , (req,res) => {
    let {category,id} = req.params;
    let bookList;
    if (category === "novels") bookList = novels.books;
    else if (category === "comics") bookList = comics.books;
    else if (category === "academic-books") bookList = academic_books.books;
    const book = bookList.find(book => book.id === id);
    res.render("book-details", {book, userData, loggedIn});
});

app.get("/signup", (req,res) => {
    res.render("signup", {userData, loggedIn});
});

app.post("/signup", (req,res) => {
    userData = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    loggedIn = true;
    res.redirect("/home");
});

app.get("/login", (req,res) => {
    res.render("login", {userData, loggedIn});
});

app.post("/login", (req,res) => {
    if (userData.username === req.body.LoginUsername) { 
        if(userData.password === req.body.LoginPassword) {
            loggedIn = true;
            res.redirect("/home");
        } else {
            res.send("You entered wrong password");
        }
    }
    else {
        res.send("Error: No such account exist");
    }
});

app.get("/logout", (req,res) => {
    loggedIn = !loggedIn;
    res.redirect("/home");
});

app.get("/explore", (req,res) => {
    res.render("explore", {userData, loggedIn});
});

app.get("/about-us", (req,res) => {
    res.render("about-us", {userData, loggedIn});
});

app.listen(3000, () => {
    console.log("running server on port 3000...");
});