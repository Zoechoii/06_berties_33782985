// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;
    
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return console.error(err.message);
        }
        
        
        let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
        
        let newrecord = [
            req.body.username, 
            req.body.first, 
            req.body.last, 
            req.body.email, 
            hashedPassword
        ];
        
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            
            
            let resultMessage = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;
            resultMessage += '<br>Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
            res.send(resultMessage);
        });
    });
}); 

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT username, first_name, last_name, email FROM users";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("listusers.ejs", {users: result});
    });
});

// show login form
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

// login processing
router.post('/loggedin', function (req, res, next) {
    // find user by username from the database
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";
    
    db.query(sqlquery, [req.body.username], (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        
        // if user not found
        if (result.length === 0) {
            res.send('Login failed: Username not found');
            return;
        }
        
        // hashed password
        let hashedPassword = result[0].hashedPassword;
        
        // compare 
        bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
            if (err) {
                return console.error(err.message);
            }
            else if (result == true) {
                res.send('Login successful! Welcome back, ' + req.body.username);
            }
            else {
                res.send('Login failed: Incorrect password');
            }
        });
    });
});

// Export the router object so index.js can access it
module.exports = router