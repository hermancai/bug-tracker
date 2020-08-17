/* RESTORE DATABASE CLIENT SIDE ---------------------------------------------- */

// Function to drop and repopulate all database tables
let resetBtn = document.getElementById("restore-table");
resetBtn.addEventListener('click', restoreTable);

function restoreTable(event) {
    // Prompt the user for a confirmation before restoring the db
    let confirmVal = confirm("The database will be cleared and repopulated with sample data.");

    if (!confirmVal) {
        event.preventDefault();
        console.log("Restore database canceled.");
        return;
    } else {
        event.preventDefault();

        // Make the ajax request
        let path = "/restoreTable";
        let req = new XMLHttpRequest();

        req.open("POST", path, true);   
        req.setRequestHeader("Content-Type", "application/json");
        req.send(); 

        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) {
                location.reload();
            } 
            else {
                console.error("Reset database request error: " + req.status);
            }
        });
    }
}


/* CLEAR DATABASE CLIENT SIDE ---------------------------------------------- */

// Function to clear database
let clearBtn = document.getElementById("clear-table");
clearBtn.addEventListener('click', clearTable);

function clearTable(event) {
    // Prompt the user for a confirmation before clearing the db
    let confirmVal = confirm("All data will be removed from the database.");

    if (!confirmVal) {
        event.preventDefault();
        console.log("Clear database canceled.");
        return;
    } else {
        event.preventDefault();

        // Make the ajax request
        let path = "/clearTable";
        let req = new XMLHttpRequest();

        req.open("POST", path, true);   
        req.setRequestHeader("Content-Type", "application/json");
        req.send(); 

        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) {
                location.reload();
            } 
            else {
                console.error("Clear database request error: " + req.status);
            }
        });
    }
}