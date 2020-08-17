/*************************************************************
**  Description: PROGRAMMERS PAGE - server side node.js routes
**
**  Contains:    /programmers/
**               /programmers/insertProgrammer
**************************************************************/

const express = require('express');
const router = express.Router();


// RENDER PROGRAMMER PAGE - Function to render the programmers page
function renderProgrammers(req, res, next) {
    // Find all of the programmers
    let sql_query = `SELECT * FROM Programmers`;

    const mysql = req.app.get('mysql');
    let context = {};

    mysql.pool.query(sql_query, (err, rows) => {
        if (err) {
            next(err);
            return;
        }

        // Put the mysql data into an array for rendering
        let programmersDbData = [];
        for (let i in rows) {
            programmersDbData.push({
                programmerId: rows[i].programmerId,
                firstName: decodeURIComponent(rows[i].firstName),
                lastName: decodeURIComponent(rows[i].lastName),
                email: decodeURIComponent(rows[i].email),
                dateStarted: rows[i].dateStarted,
                accessLevel: rows[i].accessLevel
            });
        }
        context.programmers = programmersDbData;
        res.render('programmers_view', context);
    })
}


// PROGRAMMERS PAGE INSERT NEW PROGRAMMER - Function to insert a new programmer
function submitProgrammer(req, res, next) {
    // Insert the form data into the Programmers table
    let sql_query = `INSERT INTO Programmers (firstName, lastName, email, dateStarted, accessLevel) 
                        VALUES (?, ?, ?, ?, ?)`;

    const mysql = req.app.get('mysql');
    let context = {};

    mysql.pool.query(sql_query, [
        req.body.firstName,
        req.body.lastName, 
        req.body.email, 
        req.body.dateStarted, 
        req.body.accessLevel
    ], (err, result) => {
        if (err) {
            next(err);
            return;
        }

        context.id = result.insertId;
        res.send(JSON.stringify(context));
    });
}


// PROGRAMMERS PAGE DELETE ROW - Route to delete a row from the programmer list
function deleteProgrammer(req, res, next) {
    // Delete the row with the passed in programmerId
    let sql_query_1 = `DELETE FROM Programmers WHERE programmerId=?`;
    let sql_query_2 = `SELECT * FROM Programmers`;

    const mysql = req.app.get('mysql');
    var context = {};

    mysql.pool.query(sql_query_1, [req.body.programmerId], (err, result) => {
        if (err) {
            next(err);
            return;
        }

        mysql.pool.query(sql_query_2, (err, rows) => {
            if (err) {
                next(err);
                return;
            }
            
            context.id = req.body.programmerId;
            context.results = JSON.stringify(rows);
            res.render('programmers_view', context);
        });
    });
}


/* PROGRAMMERS PAGE ROUTES ---------------------------------------------------- */

router.get('/', renderProgrammers);
router.post('/insertProgrammer', submitProgrammer);
router.post('/deleteProgrammer', deleteProgrammer);

module.exports = router;
