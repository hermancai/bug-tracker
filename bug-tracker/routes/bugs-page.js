/*************************************************************
**  Description: BUGS PAGE - server side node.js routes
**
**  Contains:    /
**               /insertBug
**               /deleteBug
**               /searchBug
**               /viewAllBugs
**               /resetTable
**************************************************************/

const express = require('express');
const router = express.Router();


// RENDER BUGS MAIN PAGE - Function to render the bugs page
function renderHome(req, res, next) {
    // 1st query gathers the projects for the dropdown
    let sql_query_1 = `SELECT projectName, projectId FROM Projects`;

    // 2nd query gathers the programmers for the scrolling checkbox list
    let sql_query_2 = `SELECT programmerId, firstName, lastName FROM Programmers`;
    
    // 3rd query populates the bug list
    let sql_query_3 = `SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, b.bugDescription, 
                        b.dateStarted, b.resolution, b.priority, b.fixed 
	                    FROM Programmers p 
		                JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
		                JOIN Bugs b ON bp.bugId = b.bugId
                        LEFT OUTER JOIN Projects pj ON b.projectId <=> pj.projectId
                            ORDER BY bugId`;

    const mysql = req.app.get('mysql');                 
    let context = {};

    mysql.pool.query(sql_query_3, (err, rows) => {
        if (err) {
            next(err);
            return;
        }

        let prevEntryBugId;           // Cache the previous entry's id to avoid duplication
        let bugProgrammers = [];      // Hold the programmers for each entry
        let bugsDbData = [];          // Put the mysql data into an array for rendering

        for (let i in rows) {
            // If this is the same entry as the last, then only add the programmer to the array
            if (prevEntryBugId == rows[i].bugId) {
                bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);
            }
            // This is a new entry
            else {
                prevEntryBugId = rows[i].bugId;         // Cache the bugId
                bugProgrammers = [];                    // Add the programmer to the array
                bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);

                // Push a single entry
                bugsDbData.push({
                    bugId: rows[i].bugId,
                    bugSummary: rows[i].bugSummary,
                    bugDescription: rows[i].bugDescription,
                    projectName: rows[i].projectName,
                    programmers: bugProgrammers,
                    dateStarted: rows[i].dateStarted,
                    priority: rows[i].priority,
                    fixed: rows[i].fixed,
                    resolution: rows[i].resolution
                });
            }
        }

        // Query for the list of programmers
        mysql.pool.query(sql_query_2,  (err, rows) => {
            if (err) {
                next(err);
                return;
            }

            let programmersDbData = [];
            for (let i in rows) {
                programmersDbData.push({
                    programmerId: rows[i].programmerId,
                    firstName: rows[i].firstName,
                    lastName: rows[i].lastName
                });
            }

            // Query for the list of projects
            mysql.pool.query(sql_query_1,  (err, rows) => {
                if (err) {
                    next(err);
                    return;
                }

                
                let projectDbData = [];
                for (let i in rows) {
                    projectDbData.push({
                        projectName: rows[i].projectName,
                        projectId: rows[i].projectId
                    });
                }

                // After the 3 calls return, then populate the context array
                context.bugs = bugsDbData;
                context.programmers = programmersDbData;
                context.projects = projectDbData;
                res.render('user-home', context);
            });
        });
    });
}


// INSERT NEW BUG MAIN PAGE - Function to insert a new bug
function submitBug(req, res, next) {
    // Query to insert the bug data
    let sql_query_1 = `INSERT INTO Bugs (bugSummary, bugDescription, projectId, dateStarted, priority, fixed, resolution) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)`;
    // Query to run in loop to create Bugs_Programmers instances
    let sql_query_2 = `INSERT INTO Bugs_Programmers (bugId, programmerId) 
                            VALUES (?, ?)`;

    const mysql = req.app.get('mysql');
    let context = {};
    let bugId;

    // Insert new bug data
    mysql.pool.query(sql_query_1, [
        req.body.bugSummary,
        req.body.bugDescription,
        req.body.bugProject,
        req.body.bugStartDate,
        req.body.bugPriority,
        req.body.bugFixed,
        req.body.bugResolution
    ], (err, result) => {
        if (err) {
            next(err);
            return;
        }

        // Retrieve the bugId from the previous query's result
        bugId = result.insertId;

        // Run the Bugs_Programmers insertion for each programmer
        for (let i in req.body.programmerArr) {
            mysql.pool.query(sql_query_2, [result.insertId, req.body.programmerArr[i]], (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
            });
        }

        context.id = bugId;
        context.bugs = result.insertId;
        res.send(JSON.stringify(context));
    });
}


// BUGS MAIN PAGE DELETE ROW - Route to delete a row from the bug list
function deleteBug(req, res, next) {
    // Delete the row with the passed in bugId
    let sql_query_1 = `DELETE FROM Bugs WHERE bugId=?`;
    let sql_query_2 = `SELECT * FROM Bugs`;

    const mysql = req.app.get('mysql');
    var context = {};

    mysql.pool.query(sql_query_1, [req.body.bugId], (err, result) => {
        if (err) {
            next(err);
            return;
        }

        mysql.pool.query(sql_query_2, (err, rows) => {
            if (err) {
                next(err);
                return;
            }
            context.results = JSON.stringify(rows);
            res.render('user-home', context);
        });
    });
}


// BUGS MAIN PAGE SEARCH BUG - Function to search for string in bugs table
function searchBug(req, res, next) {
    // query to find bug entries that contain substring
    let searchQuery = 'SELECT bugId FROM Bugs WHERE CONCAT(bugSummary, bugDescription, resolution) LIKE "%' + 
                        req.body.searchString + '%"';

    const mysql = req.app.get('mysql');                 
    let context = {};
    
    mysql.pool.query(searchQuery, (err, result) => {
        if (err) {
            next(err);
            return;
        }

        // if no results were found in initial search query
        if (result.length == 0) {
            context.bugs = [];
            res.send(JSON.stringify(context));
            return;
        }

        // Get list of matching bugIds 
        resultsList = [];
        for(i = 0; i < result.length; i++) {
            resultsList.push(result[i].bugId)
        }
        idString = resultsList.join();

        // query to gather data of bugs in the initial query results
        let bugsQuery = 'SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, b.bugDescription, ' + 
                        'b.dateStarted, b.resolution, b.priority, b.fixed FROM Programmers p ' + 
                        'JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId ' + 
                        'JOIN Bugs b ON bp.bugId = b.bugId ' + 
                        'LEFT OUTER JOIN Projects pj ON b.projectId = pj.projectId ' + 
                        'WHERE b.bugId IN (' + idString + ') ' +
                        'ORDER BY b.bugId;';

        // console.log(bugsQuery)  // this string can be pasted in phpmyadmin for testing

        mysql.pool.query(bugsQuery, (err, rows) => {
            if (err) {
                next(err);
                return;
            }

            let prevEntryBugId;
            let bugProgrammers = [];
            let matchingBugsData = [];

            for (let i in rows) {
                if (prevEntryBugId == rows[i].bugId) {
                    bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);
                }
                else {
                    prevEntryBugId = rows[i].bugId;
                    bugProgrammers = [];
                    bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);

                    matchingBugsData.push({
                        bugId: rows[i].bugId,
                        bugSummary: rows[i].bugSummary,
                        bugDescription: rows[i].bugDescription,
                        projectName: rows[i].projectName,
                        programmers: bugProgrammers,
                        dateStarted: rows[i].dateStarted,
                        priority: rows[i].priority,
                        fixed: rows[i].fixed,
                        resolution: rows[i].resolution
                    }) 
                }
            }

            context.bugs = matchingBugsData;
            res.send(JSON.stringify(context));
        });
    });
}


// BUGS MAIN PAGE VIEW ALL BUGS - Function to clear search results and display all bugs
function viewAllBugs(req, res, next) {
    let viewAllQuery = `SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, b.bugDescription, 
                        b.dateStarted, b.resolution, b.priority, b.fixed 
	                    FROM Programmers p 
		                JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
		                JOIN Bugs b ON bp.bugId = b.bugId
                        LEFT OUTER JOIN Projects pj ON b.projectId <=> pj.projectId
                            ORDER BY bugId`;

    const mysql = req.app.get('mysql');                 
    let context = {};
    
    mysql.pool.query(viewAllQuery, (err, result) => {
        if (err) {
            next(err);
            return;
        }

        // if no results were found in initial search query
        if (result.length == 0) {
            context.bugs = [];
            res.send(JSON.stringify(context));
            return;
        }

        let rows = result;
        let prevEntryBugId;
        let bugProgrammers = [];
        let matchingBugsData = [];

        for (let i in rows) {
            if (prevEntryBugId == rows[i].bugId) {
                bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);
            }
            else {
                prevEntryBugId = rows[i].bugId;
                bugProgrammers = [];
                bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);

                matchingBugsData.push({
                    bugId: rows[i].bugId,
                    bugSummary: rows[i].bugSummary,
                    bugDescription: rows[i].bugDescription,
                    projectName: rows[i].projectName,
                    programmers: bugProgrammers,
                    dateStarted: rows[i].dateStarted,
                    priority: rows[i].priority,
                    fixed: rows[i].fixed,
                    resolution: rows[i].resolution
                }) 
            }
        }

        context.bugs = matchingBugsData;
        res.send(JSON.stringify(context));
    });
}


// BUGS MAIN PAGE RESET TABLES - Function to drop and repopulate database
function resetTable(req, res, next) {
    // Query to display the table after reset
    let viewAllQuery = `SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, b.bugDescription, 
                        b.dateStarted, b.resolution, b.priority, b.fixed 
                        FROM Programmers p 
                        JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
                        JOIN Bugs b ON bp.bugId = b.bugId
                        LEFT OUTER JOIN Projects pj ON b.projectId <=> pj.projectId
                            ORDER BY bugId`;

    let recreateQuery = require('../sql/reset_database.js');
    const mysql = req.app.get('mysql');                 
    
    mysql.pool.query(recreateQuery, (err, result) => {
        if(err) {
            next(err);
            return;
        }

        const mysql = req.app.get('mysql');                 
        let context = {};

        mysql.pool.query(viewAllQuery, (err, result) => {
            if(err) {
                next(err);
                return;
            }

            let rows = result;
            let prevEntryBugId;
            let bugProgrammers = [];
            let matchingBugsData = [];

            for (let i in rows) {
                if (prevEntryBugId == rows[i].bugId) {
                    bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);
                }
                else {
                    prevEntryBugId = rows[i].bugId;
                    bugProgrammers = [];
                    bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);

                    matchingBugsData.push({
                        bugId: rows[i].bugId,
                        bugSummary: rows[i].bugSummary,
                        bugDescription: rows[i].bugDescription,
                        projectName: rows[i].projectName,
                        programmers: bugProgrammers,
                        dateStarted: rows[i].dateStarted,
                        priority: rows[i].priority,
                        fixed: rows[i].fixed,
                        resolution: rows[i].resolution
                    }) 
                }
            }

            context.bugs = matchingBugsData;
            res.send(JSON.stringify(context));
        });
    })
}


/* PROJECTS PAGE ROUTES ---------------------------------------------------- */

router.get('/', renderHome);
router.post('/insertBug', submitBug);
router.post('/deleteBug', deleteBug);
router.post('/searchBug', searchBug);
router.post('/viewAllBugs', viewAllBugs);
router.post('/resetTable', resetTable);

module.exports = router;
