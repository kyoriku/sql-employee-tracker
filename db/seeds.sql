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
