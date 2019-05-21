CREATE DATABASE IF NOT EXISTS bamazonDB;

USE bamazonDB;

CREATE TABLE products(
item_id integer auto_increment NOT NULL PRIMARY KEY,
product_name  varchar(50) NOT NULL, 
department_name varchar(30) NULL,
price numeric(10,2),
stock_quantity integer
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ('XPS 9370','laptop','2000','100'),
      ('Macbook PRO','laptop','2350','50'),
      ('Blue Marker','marker','1.50','8'),
      ('Red Marker','marker','1.50','12'),
   	  ('USB 3M','cable','15.25','82'),
      ('HDMI 2M','cable','34.80','55'),
	  ('Scrabble','boardgame','19','122'),
      ('Monopoly','boardgame','22','5'),
      ('Mario Bros 3','videogame','35','122'),
      ('Street Fighters 22','videogame','250','5');
      
SELECT * FROM products;
CREATE TABLE departments(
dept_id integer auto_increment NOT NULL PRIMARY KEY,
department_name varchar(30) NULL,
overhead_costs numeric(10,2)
);

INSERT INTO departments (department_name, overhead_costs)
VALUES ('laptop', 2500),
	   ('marker', 2), 
       ('cable', 35),
       ('boardgame', 25),
       ('videogame', 300);

SELECT * FROM departments;