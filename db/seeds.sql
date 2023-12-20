INSERT INTO department (id, name) 
VALUES (1, 'Engineering'),
       (2, 'Sales'),
       (3, 'Human Resources'),
       (4, 'Marketing'),
       (5, 'Finance');

INSERT INTO role (id, title, salary, department_id) 
VALUES (1, 'Software Engineer', 80000, 1),
       (2, 'Sales Manager', 90000, 2),
       (3, 'HR Specialist', 75000, 3),
       (4, 'Marketing Coordinator', 70000, 4),
       (5, 'Financial Analyst', 85000, 5),
       (6, 'Quality Assurance Engineer', 82000, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
VALUES (1, 'John', 'Doe', 1, NULL),
       (2, 'Jane', 'Smith', 2, NULL),
       (3, 'Bob', 'Johnson', 3, 2),
       (4, 'Alice', 'Williams', 1, 1),
       (5, 'Charlie', 'Brown', 3, 2),
       (6, 'Eva', 'Lee', 4, NULL),
       (7, 'Michael', 'Clark', 5, NULL),
       (8, 'Grace', 'Miller', 6, 1),
       (9, 'David', 'Wong', 1, 1),
       (10, 'Sophie', 'Baker', 4, 7);