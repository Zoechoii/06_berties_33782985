// Create a new router
const express = require("express")
const router = express.Router()

// Display search page
router.get('/search', function(req, res, next) {
    res.render('search.ejs', {shopData: {shopName: "Berties Books"}});
});

// Handle search (advanced search with LIKE)
router.get('/search-result', function(req, res, next) {
    let keyword = req.query.keyword;
    // Advanced search: partial match using LIKE
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    let searchTerm = '%' + keyword + '%';
    
    console.log("Search keyword:", keyword);
    console.log("Search term:", searchTerm);
    console.log("SQL query:", sqlquery);
    
    db.query(sqlquery, [searchTerm], (err, result) => {
        if (err) {
            console.log("Error:", err);
            next(err);
        }
        console.log("Result:", result);
        res.render("search-result.ejs", {availableBooks:result});
    });
});


router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("list.ejs", {availableBooks:result});
    });
});

// Display add book page
router.get('/addbook', function(req, res, next) {
    res.render('addbook.ejs');
});

// Handle book submission
router.post('/bookadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        }
        else
            res.send('This book is added to database, name: '+ req.body.name + ' price £'+ req.body.price);
    });
});

// Display bargain books (books under £20)
router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("bargainbooks.ejs", {availableBooks:result});
    });
});

// Export the router object so index.js can access it
module.exports = router
