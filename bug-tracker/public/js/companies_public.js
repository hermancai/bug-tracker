/*************************************************************
**  Description: ADD COMPANY - Client-side JavaScript file
**************************************************************/

let recordForm = document.getElementById('recordForm');
let spinner = document.getElementById('spinner');
spinner.style.visibility = "hidden"; 

// Function to submit the form data
recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    spinner.style.visibility = "visible"; 
    let req = new XMLHttpRequest();
    let path = '/companies/insertCompany';

    // String that holds the form data
    let reqBody = {
        companyName: recordForm.elements.companyName.value,
        dateJoined: recordForm.elements.dateJoined.value
    };

    reqBody = JSON.stringify(reqBody);

    // Ajax request
    req.open('POST', path, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
        if (req.status >= 200 && req.status < 400) {
            let response = JSON.parse(req.responseText);
            let id = response.companies;

            // Table of database records for the added companies
            let tbl = document.getElementById('recordTable');
            let newRow = tbl.insertRow(-1);

            // Company Name element
            let nameCell = document.createElement('td');
            nameCell.textContent = recordForm.elements.companyName.value;
            nameCell.className = 'mdl-data-table__cell--non-numeric'; 
            newRow.appendChild(nameCell);
        
            // Date Joined element
            let dateCell = document.createElement('td');
            dateCell.textContent = recordForm.elements.dateJoined.value;
            newRow.appendChild(dateCell);

            // Delete button element
            let deleteCell = document.createElement('td');
            newRow.appendChild(deleteCell);
            let deleteBtn = document.createElement('a');
            deleteCell.appendChild(deleteBtn);
            deleteBtn.type = "button";
            deleteBtn.text = "Delete";
            deleteBtn.className = "option-btn";
            deleteBtn.setAttribute('onclick', `deleteCompany('recordTable', this, ${response.id})`);

            // Clear the submit form and stop spinner
            document.getElementById('recordForm').reset();
            setTimeout(() => { spinner.style.visibility = "hidden"; }, 1000);
            
        } else {
            console.error('Database return error');
        }
    });

    req.send(reqBody);
});


/* DELETE COMPANY CLIENT SIDE -------------------------------------------------- */

// Function call to delete a row from companies
function deleteCompany(tbl, curRow, companyId) {
    let table = document.getElementById(tbl);
    let rowCount = table.rows.length;
    let req = new XMLHttpRequest();
    let path = "/companies/deleteCompany";

    reqBody = JSON.stringify({companyId: companyId});

    req.open("POST", path, true);
    req.setRequestHeader("Content-Type", "application/json");

    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            for (let i = 0; i < rowCount; i++) {
                let row = table.rows[i]; 
        
                if (row == curRow.parentNode.parentNode) {
                    table.deleteRow(i);
                    return;
                }
            }
        } 
        else {
            console.error("Delete request error: " + req.status);
            console.log(path + companyId)
        }
    });

    req.send(reqBody);
} 