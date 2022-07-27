DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

-- DEPARTMENT
CREATE TABLE department (
  id INTEGER AUTO_INCREMENT PRIMARY KEY, 
  name VARCHAR(30) NOT NULL 
  );

--  ROLE
CREATE TABLE role (
  id INTEGER AUTO_INCREMENT PRIMARY KEY, 
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INTEGER,
  CONSTRAINT fk_departmentid FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
  );

  -- Employee ---

  CREATE TABLE employee(
  id INTEGER AUTO_INCREMENT PRIMARY KEY, 
  first_name VARCHAR(30) NOT NULL, 
  last_name VARCHAR(30), 
  role_id INTEGER, 
  manager_id INTEGER, 
  CONSTRAINT fk_roleid FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE 
  SET 
    NULL, 
    CONSTRAINT fk_managerid FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);