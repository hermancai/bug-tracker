/******************************************************************************
**  Description:    sql query to clear the project database
******************************************************************************/

module.exports = `
UNLOCK TABLES;
DROP TABLE IF EXISTS Bugs_Programmers;
DROP TABLE IF EXISTS Bugs;
DROP TABLE IF EXISTS Projects;
DROP TABLE IF EXISTS Programmers;
DROP TABLE IF EXISTS Companies;


CREATE TABLE Programmers (
    programmerId int(11) NOT NULL AUTO_INCREMENT,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    email varchar(255), 
    dateStarted date, 
    accessLevel int(11),
    PRIMARY KEY (programmerId)
) ENGINE=InnoDB;


CREATE TABLE Companies (
    companyId int(11) NOT NULL AUTO_INCREMENT,
    companyName varchar(255) NOT NULL,
    dateJoined date,
    PRIMARY KEY (companyId)
) ENGINE=InnoDB;


CREATE TABLE Projects (
    projectId int(11) NOT NULL AUTO_INCREMENT,
    projectName varchar(255) NOT NULL, 
    dateStarted date,
    lastUpdated date, 
    inMaintenance BOOLEAN DEFAULT TRUE,
    companyId int(11) NOT NULL,
    PRIMARY KEY (projectId),
    FOREIGN KEY (companyId) REFERENCES Companies (companyId)
        ON UPDATE CASCADE 
        ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE Bugs (
    bugId int(11) NOT NULL AUTO_INCREMENT,
    projectId int(11),
    bugSummary text NOT NULL,
    bugDescription text,
    dateStarted date NOT NULL,
    resolution text,
    fixed BOOLEAN DEFAULT FALSE,
    priority int(11),
    PRIMARY KEY (bugId),
    FOREIGN KEY (projectId) REFERENCES Projects (projectId)
        ON UPDATE CASCADE 
        ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE Bugs_Programmers (
    bugId int(11) NOT NULL,
    programmerId int(11) NOT NULL,
    PRIMARY KEY (bugId, programmerId),
    FOREIGN KEY (bugId) REFERENCES Bugs (bugId)
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
    FOREIGN KEY (programmerId) REFERENCES Programmers (programmerId)
        ON UPDATE CASCADE 
        ON DELETE CASCADE
) ENGINE=InnoDB;`
