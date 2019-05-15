DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (255) NOT NULL,
    department_name VARCHAR (255) NOT NULL,
    price INT NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
('Poke Ball', 'Poke Balls', 50, 100),
('Ultra Ball', 'Poke Balls', 150, 30),
('Master Ball', 'Poke Balls', 500, 10),
('Antidote', 'Medicine', 100, 200),
('Awakening', 'Medicine', 100, 200),
('Full Restore', 'Medicine', 300, 100),
('Max Revive', 'Medicine', 500, 50),
('HM01', 'Machines', 400, 15),
('HM02', 'Machines', 400, 15),
('HM03', 'Machines', 400, 15);