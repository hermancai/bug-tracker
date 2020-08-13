/******************************************************************************
**  Description:    sql query to reset the project database
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

LOCK TABLES Programmers WRITE;

INSERT INTO Programmers VALUES 
    (1, 'Joe', 'Smith', 'joe_s@mail.com', '1999-05-05', 2), 
    (2, 'Andy', 'Ng', 'andy_n@mail.com', '2001-04-13', 3),
    (3, 'Sally', 'Smith', 'sally_s@gmail.com', '1997-12-31', 2),
    (4, 'Jack', 'Miller', 'jack_m@gmail.com', '1998-01-01', 1),
    (5, 'Amy', 'Ellis', 'amy_e@yahoo.com', '1996-08-17', 3),
    (6, 'Dan', 'King', 'dan_k@yahoo.com', '1995-11-11', 2),
    (7, 'Kate', 'Hooper', 'kate_h@gmail.com', '2000-07-06', 2),
    (8, 'Ben', 'Kent', 'ben_k@yahoo.com', '1999-03-20', 3),
    (9, 'Kyle', 'Gable', 'kyle_g@gmail.com', '1996-05-03', 2),
    (10, 'Jen', 'Thomas', 'jen_t@gmail.com', '1998-09-20', 3);

UNLOCK TABLES;

CREATE TABLE Companies (
    companyId int(11) NOT NULL AUTO_INCREMENT,
    companyName varchar(255) NOT NULL,
    dateJoined date,
    PRIMARY KEY (companyId)
) ENGINE=InnoDB;

LOCK TABLES Companies WRITE;

INSERT INTO Companies VALUES
    (1, 'Micro-ware systems', '1994-07-30'),
    (2, 'Solatech', '1998-10-03'),
    (3, 'N-tier services', '2005-02-02'),
    (4, '10x consulting', '2008-11-12'),
    (5, 'Sell-ya marketing', '2012-04-12'),
    (6, 'Click-it CMS', '2015-09-09');

UNLOCK TABLES;

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

LOCK TABLES Projects WRITE,
    Companies AS c1 WRITE,
    Companies AS c2 WRITE,
    Companies AS c3 WRITE,
    Companies AS c4 WRITE,
    Companies AS c5 WRITE,
    Companies AS c6 WRITE,
    Companies AS c7 WRITE,
    Companies AS c8 WRITE,
    Companies AS c9 WRITE;

INSERT INTO Projects (projectName, dateStarted, lastUpdated, inMaintenance, companyId) VALUES
    ('MicroSheets', '2002-03-19', '2002-09-22', TRUE, (SELECT companyId FROM Companies AS c1 WHERE companyName = 'Micro-ware systems')),
    ('1N\-router firmware', '2020-02-27', '2020-05-08', TRUE, (SELECT companyId FROM Companies AS c2 WHERE companyName = 'Solatech')),
    ('NetDash', '2005-06-01', '2018-01-15', TRUE, (SELECT companyId FROM Companies AS c3 WHERE companyName = 'N-tier services')),
    ('Force CRM', '2016-12-12', '2017-01-15', TRUE, (SELECT companyId FROM Companies AS c4 WHERE companyName = '10x consulting')),
    ('SY design system', '2018-07-03', '2019-01-15', TRUE, (SELECT companyId FROM Companies AS c5 WHERE companyName = 'Sell-ya marketing')),
    ('T-best CMS', '2015-09-22', '2019-01-15', TRUE, (SELECT companyId FROM Companies AS c6 WHERE companyName = 'Click-it CMS')),
    ('eText Editor', '2002-03-19', '2002-09-22', TRUE, (SELECT companyId FROM Companies AS c7 WHERE companyName = 'Micro-ware systems')),
    ('1R\-rf receiver', '2020-02-27', '2020-05-08', FALSE, (SELECT companyId FROM Companies AS c8 WHERE companyName = 'Solatech')),
    ('NetMonitor', '2005-06-01', '2018-01-15', TRUE, (SELECT companyId FROM Companies AS c9 WHERE companyName = 'N-tier services'));

UNLOCK TABLES;

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

LOCK TABLES Bugs WRITE, 
    Projects AS p1 WRITE, 
    Projects AS p2 WRITE,
    Projects AS p3 WRITE,
    Projects AS p4 WRITE,
    Projects AS p5 WRITE,
    Projects AS p6 WRITE,
    Projects AS p7 WRITE,
    Projects AS p8 WRITE,
    Projects AS p9 WRITE,
    Projects AS p10 WRITE,
    Projects AS p11 WRITE,
    Projects AS p12 WRITE,
    Projects AS p13 WRITE,
    Projects AS p14 WRITE,
    Projects AS p15 WRITE,
    Projects AS p16 WRITE,
    Projects AS p17 WRITE,
    Projects AS p18 WRITE,
    Projects AS p19 WRITE,
    Projects AS p20 WRITE;

INSERT INTO Bugs (projectId, bugSummary, bugDescription, dateStarted, resolution, fixed, priority) VALUES
    ((SELECT projectId FROM Projects AS p1 WHERE projectName = 'MicroSheets'), 'Window close error', 'When the use tries to set preferences/useraccount/business number the windows just exits', '2002-09-22', '', 0, 3),
    ((SELECT projectId FROM Projects AS p2 WHERE projectName = '1N\-router firmware'), 'CLI error', 'The documentation says to pass -3 for configuration, but it is not working for the user', '2020-05-08', '', 0, 5),
    ((SELECT projectId FROM Projects AS p3 WHERE projectName = 'NetDash'), 'Logging error', 'Logs not being generated of Fridays!!', '2015-03-02', '', 0, 4),
    ((SELECT projectId FROM Projects AS p4 WHERE projectName = 'Force CRM'), 'Button location', 'The button should be 50px to the right', '2018-11-05', 'Fixed sql syntax and the new query fixed the problem', 1, 1),
    ((SELECT projectId FROM Projects AS p5 WHERE projectName = 'SY design system'), 'Color incorrect', 'The requested color is #7ef542 on div_back_two', '2019-08-03', '', 0, 3),
    ((SELECT projectId FROM Projects AS p6 WHERE projectName = 'T-best CMS'), 'Login error', 'Helpdesk unable to log in with their credentials', '2014-04-18', '', 0, 2),
    ((SELECT projectId FROM Projects AS p7 WHERE projectName = 'eText Editor'), 'Window error', 'The main window is fixed rather than adjustable', '2005-09-21', '', 0, 5),
    ((SELECT projectId FROM Projects AS p8 WHERE projectName = '1N\-router firmware'), 'ICMP error', 'IP_REQ_TIMED_OUT, ICMP error #11010', '2017-12-14', '', 0, 5),
    ((SELECT projectId FROM Projects AS p9 WHERE projectName = 'NetDash'), 'API error', 'Time logged in property missing in JSON response', '2008-06-01', 'Rolled back npm dependency on lodash to 4.17.11', 1, 4),
    ((SELECT projectId FROM Projects AS p10 WHERE projectName = 'Force CRM'), 'Failed log', 'Manual log attempt failed!', '2016-04-13', '', 0, 2),
    ((SELECT projectId FROM Projects AS p11 WHERE projectName = 'SY design system'), 'Import error', 'Hass realty unable to add new images', '2016-02-11', '', 0, 1),
    ((SELECT projectId FROM Projects AS p12 WHERE projectName = 'T-best CMS'), 'API error', 'WooCommerce not completing sales', '2015-06-21', 'Still broken!!!', 0, 5),
    ((SELECT projectId FROM Projects AS p13 WHERE projectName = 'eText Editor'), 'Option missing in edit', 'No option listed in edit dropdown for find in this page', '2004-03-01', '', 0, 3),
    ((SELECT projectId FROM Projects AS p14 WHERE projectName = 'eText Editor'), 'Extra whitespace', 'Extra whitespace added to the end of each paragraph', '2004-03-01', '', 0, 3),
    ((SELECT projectId FROM Projects AS p15 WHERE projectName = 'Force CRM'), 'Errant % in string', 'Unexplained % symbol showing up in strings', '2004-03-01', '', 0, 3),
    ((SELECT projectId FROM Projects AS p16 WHERE projectName = 'SY design system'), 'Incorrect font', 'Font should be set to Roboto', '2004-03-01', '', 0, 3),
    ((SELECT projectId FROM Projects AS p17 WHERE projectName = 'SY design system'), 'Move div 15 px', 'div_main_box should be 25 px higher', '2004-03-01', '', 0, 3),
    ((SELECT projectId FROM Projects AS p18 WHERE projectName = 'MicroSheets'), 'Image render error', 'Images not rendering when dragged and dropped onto the page', '2004-03-01', '', 0, 3),
    ((SELECT projectId FROM Projects AS p19 WHERE projectName = 'NetDash'), 'Login error', 'Users unable to log into settings', '2004-03-01', '', 0, 3),
    ((SELECT projectId FROM Projects AS p20 WHERE projectName = 'eText Editor'), 'Undo error', 'Every 3rd undo is undoing 2 steps!!', '2004-03-01', '', 0, 3);

UNLOCK TABLES;

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
) ENGINE=InnoDB;

LOCK TABLES Bugs_Programmers WRITE, Bugs AS b1 WRITE, Programmers AS p1 WRITE;

INSERT INTO Bugs_Programmers (bugId, programmerId) VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
    (10, 10),
    (11, 1),
    (12, 1),
    (13, 2),
    (14, 2),
    (15, 2),
    (16, 2),
    (17, 2),
    (18, 2),
    (19, 2),
    (20, 2),
    (6, 2),
    (9, 2),
    (12, 2),
    (13, 5),
    (16, 7),
    (19, 9);

UNLOCK TABLES;`
