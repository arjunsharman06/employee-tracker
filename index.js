const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { error } = require('console');

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
        case 5 : 
            addRole();
            break;
    };
}

// Department

// Get Department
function getDepartment(id = '') {
    const sql = `SELECT * FROM department WHERE ID LIKE '%${id}%'`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
            return;
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
                console.log(err.message);
                return;
            }           
            userOption();
        })        
    });
}

// Role
// Get Role : All or by ID 
function getRoles() {
    const sql = `SELECT 
                    role.id, 
                    role.title, 
                    role.salary, 
                    department.name AS department 
                FROM 
                    role 
                LEFT JOIN 
                    department 
                On 
                    role.department_id = department.id;`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log(cTable.getTable(rows));
        userOption();
    })
}

//Add Role 
async function addRole() {
    db.query('SELECT * FROM department', (err, rows) => {
        var department = rows.map((dep) => dep.name);      
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the role',
                name: 'role_title',
                validate: (depName) => {
                    if (depName) {
                        return true;
                    } else {
                        console.log("Input your role");
                        return false;
                    }
                }
            },

            {
                type: 'number',
                message: 'What is the salary of the role',
                name: 'role_salary',
            },

            {
                type: 'list',
                message: 'Which department the role belongs',
                name: 'department',
                choices: department,
            }

        ]).then(({role_title,role_salary,department}) => {                  
            var depInfo = rows.filter((data) => data.name === department);
            var id = depInfo[0].id;

            const query = `INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`
            const params = [role_title,role_salary,id];
            db.query(query,params, (err, rows) => {
            if (err) {
                console.log(err.message);
                return;
            }
            userOption();              
            })           
        });
    });
}
