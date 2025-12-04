const express = require('express');
const router = express.Router();

// API route to get books with search, price filter, and sort options
router.get('/books', function (req, res, next) {
    let sqlquery = "SELECT * FROM books";
    let conditions = [];
    let params = [];
    
    // search
    if (req.query.search) {
        conditions.push("name LIKE ?");
        params.push('%' + req.query.search + '%');
    }
    
    // price filter
    if (req.query.minprice) {
        conditions.push("price >= ?");
        params.push(req.query.minprice);
    }
    
    if (req.query.maxprice) {
        conditions.push("price <= ?");
        params.push(req.query.maxprice);
    }
    
    // Add WHERE conditions if any exist
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }
    
    // sort
    if (req.query.sort) {
        if (req.query.sort === 'name') {
            sqlquery += " ORDER BY name";
        } else if (req.query.sort === 'price') {
            sqlquery += " ORDER BY price";
        }
    }
    
    // execute query
    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json(err);
            next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;