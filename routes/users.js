// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

const redirectlogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    // Get plain password from form
    const plainPassword = req.body.password;
    
    // Hash password with bcrypt
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return console.error(err.message);
        }
        
        // Save user data to database
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
            
            // Display result (for debugging purposes)
            let resultMessage = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;
            resultMessage += '<br>Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
            res.send(resultMessage);
        });
    });
});

router.get('/list', redirectlogin, function(req, res, next) {
    // Select all users but exclude passwords
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
    // Find user in database by username
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";
    
    db.query(sqlquery, [req.body.username], (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        
        // If user does not exist
        if (result.length === 0) {
            // Log failed attempt
            let auditQuery = "INSERT INTO audit_log (username, success) VALUES (?, ?)";
            db.query(auditQuery, [req.body.username, false], (err) => {
                if (err) console.error(err.message);
            });
            
            res.send('Login failed: Username not found');
            return;
        }
        
        // Get hashed password from database
        let hashedPassword = result[0].hashedPassword;
        
        // Compare entered password with hashed password
        bcrypt.compare(req.body.password, hashedPassword, function(err, compareResult) {
            if (err) {
                return console.error(err.message);
            }
            
            if (compareResult == true) {
                // Save user session here, when login is successful
                req.session.userId = req.body.username;

                // Log successful login
                let auditQuery = "INSERT INTO audit_log (username, success) VALUES (?, ?)";
                db.query(auditQuery, [req.body.username, true], (err) => {
                    if (err) console.error(err.message);
                });
                
                res.send('Login successful! Welcome back, ' + req.body.username);
            }
            else {
                // Log failed login attempt
                let auditQuery = "INSERT INTO audit_log (username, success) VALUES (?, ?)";
                db.query(auditQuery, [req.body.username, false], (err) => {
                    if (err) console.error(err.message);
                });
                
                res.send('Login failed: Incorrect password');
            }
        });
    });
});

router.get('/audit',  redirectlogin, function(req, res, next) {
    // Get all audit logs ordered by most recent first
    let sqlquery = "SELECT username, login_time, success FROM audit_log ORDER BY login_time DESC";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("audit.ejs", {logs: result});
    });
});



// Export the router object so index.js can access it
module.exports = router