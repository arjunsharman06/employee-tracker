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
    if (err) {
        throw console.error(err.message);
    }
    console.log("Connected to Database");
    userOption();
});

function userOption() {
    return inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do ?',
            name: 'choice',
            choices: options,
        }
    ]).then(userSelection => validateOption(userSelection));
}

function validateOption(userSelection) {
    let index = options.indexOf(userSelection.choice) + 1;
    console.log(index);
    switch (index) {
        case 1:
            getDepartment();
            break;
        case 2:
            getRoles();
            break;
        case 3:
            getEmployees();
            break;
        case 4:
            addDepartment();
            break;
        case 5:
            addRole();
            break;
        case 6:
            addEmployee();
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

        ]).then(({ role_title, role_salary, department }) => {
            var depInfo = rows.filter((data) => data.name === department);
            var id = depInfo[0].id;

            const query = `INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`
            const params = [role_title, role_salary, id];
            db.query(query, params, (err, rows) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
                userOption();
            })
        });
    });
}

// Get Employess including the ids,f_name,l_name,job title, dep ,salary 
function getEmployees() {
    const sql = `select 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name as department, 
    role.salary, 
    CONCAT(e1.first_name, " ", e1.last_name) as manager 
  from 
    employee 
    LEFT JOIN employee e1 ON (employee.manager_id = e1.id) 
    LEFT JOIN role on role.id = employee.role_id 
    LEFT JOIN department On role.department_id = department.id;`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log(cTable.getTable(rows));
        userOption();
    });
}

//Add Employee 
async function addEmployee() {
    console.log("hello")
    var rolesOnlyTitle;
    var roleData;
    var managersName;
    var managerData;

    db.query(`SELECT * FROM role`, (err, rows) => {
        if (err) {
            console.log(err.message);
            return;
        }
        rolesOnlyTitle = rows.map(role => role.title);
        roleData = rows.map(role => role);

        db.query(`SELECT * FROM employee`, (err, rows) => {
            if (err) {
                console.log(err.message);
                return;
            }
            managersName = rows.map(manager => manager.first_name + " " + manager.last_name);
            managerData = rows.map(manager => manager);

            console.log(roleData);
            console.log(managerData);

            inquirer.prompt([
                {
                    type: 'input',
                    message: `What is the employee's first name`,
                    name: 'first_name',
                    validate: (firstName) => {
                        if (firstName) {
                            return true;
                        } else {
                            console.log("Input your First Name");
                            return false;
                        }
                    }
                },

                {
                    type: 'input',
                    message: `What is the employee's last name`,
                    name: 'last_name',
                    validate: (lName) => {
                        if (lName) {
                            return true;
                        } else {
                            console.log("Input your Last Name");
                            return false;
                        }
                    }
                },

                {
                    type: 'list',
                    message: `What is the employee's role`,
                    name: 'emp_role',
                    choices: rolesOnlyTitle,
                },

                {
                    type: 'list',
                    message: `Who is the employee's manager`,
                    name: 'emp_manager',
                    choices: managersName,
                }
            ]).then(({ first_name, last_name, emp_role, emp_manager }) => {
                console.log(first_name, last_name, emp_role, emp_manager);

                var roleID = (roleData.filter((data) => data.title === emp_role))[0].id;
                var managerID = (managerData.filter((data) => data.first_name === (emp_manager.split(' '))[0]))[0].id;

                const sql = `INSERT INTO employee ( first_name, last_name, role_id, manager_id)  VALUES (?,?,?,?);`;
                const params = [first_name, last_name, roleID, managerID];

                db.query(sql, params, (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    userOption();
                })
            });
        })
    })
}

