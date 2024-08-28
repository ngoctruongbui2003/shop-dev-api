use test;

-- create table
CREATE TABLE test_table (
id int NOT NULL,
name VARCHAR(255) DEFAULT NULL,
age int DEFAULT NULL,
address VARCHAR(255) DEFAULT NULL,
PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Change delimiter to handle the procedure
DELIMITER //
-- create procedure
CREATE PROCEDURE `insert_data`()
CREATE DEFINER=`truong`@`%` PROCEDURE `insert_data`()
BEGIN
DECLARE max_id INT DEFAULT 1000000;
DECLARE i INT DEFAULT 1;
WHILE i <= max_id DO
INSERT INTO test_table (id, name, age, address) VALUE (i, CONCAT('Name', i), i%100, CONCAT('Address', i));
SET i = i + 1;
END WHILE;
END //
-- Reset the delimiter
DELIMITER ;