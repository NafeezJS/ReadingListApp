var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");
    
// APP CONFIG
mongoose.connect("mongodb://localhost/reading_list_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// MONGOOSE / MODEL CONFIG
var bookSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {type: Date, default: Date.now}
});
var Book = mongoose.model("Book", bookSchema);

// =======================
// RESTful ROUTES
// =======================

// INDEX ROUTE
app.get("/", function(req, res){
    res.redirect("/books");
});

app.get("/books", function(req, res){
    Book.find({}, function(err, books){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {books: books});
        }
    });
});

// NEW ROUTE
app.get("/books/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/books", function(req, res){
    Book.create(req.body.book, function(err, newBook){
        if(err){
            res.render("new");
        } else {
            res.redirect("/books");
        }
    });
});

// SHOW ROUTE
app.get("/books/:id", function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            res.redirect("/books");
        } else {
            res.render("show", {book: foundBook});
        }
    });
});

// EDIT ROUTE
app.get("/books/:id/edit", function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            res.redirect("/books");
        } else {
            res.render("edit", {books: foundBook});
        }
    });
});

// UPDATE ROUTE
app.put("/books/:id", function(req, res){
   Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){
       if(err){
           res.redirect("/books");
       } else {
           res.redirect("/books/" + req.params.id);
       }
   });
});

// DESTROY ROUTE
app.delete("/books/:id", function(req, res){
    //destroy route
    Book.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/books");
        } else {
    //redirect somewhere
            res.redirect("/books");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Reading List App is RUNNING!!!!");
});