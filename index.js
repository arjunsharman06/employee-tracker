const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

const options = [
    'View all Departments',
    'View all Roles',
    'View all Employees',
    'Add a Department',
    'Add a Role',
    'Add an employee',
    'Update an employee role',
    'Exit'
]

db.connect((err) => {
    if(err){
        throw console.error(err.message);
    }
    console.log("Connected to Database");
    userOption();
});

function userOption(){
    return inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do ?',
            name: 'choice',
            choices: options,
        }
    ]).then( userSelection => validateOption(userSelection));
}

function validateOption (userSelection){
    console.log(userSelection);
    let index = options.indexOf(userSelection.choice) + 1;
    switch (index){
        case 1:
            getDepartment();
            break;
        case 2:
            getRoles();
            break;
        case 3 :
            getEmployees();
            break;
        case 4 :
            addDepartment();
            break;

    };
}

// Department

// Get Department
function getDepartment(id = '') {
    const sql = `SELECT * FROM department WHERE ID LIKE '%${id}%'`;

    db.query(sql, (err, rows) => {
        if (err) {
            return reject(err);
        }
        console.log(cTable.getTable(rows));
        userOption();
    })
}

// Add Department
async function addDepartment() {
    await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department',
            name: 'dep_name',
            validate: (depName) => {
                if (depName) {
                    return true;
                } else {
                    console.log("Input your department");
                    return false;
                }
            }
        }
    ]).then(({ dep_name }) => {

        const sql = `INSERT INTO department (name) VALUES ('${dep_name}')`;
        db.query(sql, (err, rows) => {
            if (err) {
                return reject(err);
            }           
            userOption();
        })        
    });
}