
drop database if exists tech_db;
create database tech_db;


use tech_db;

create table department (
    id int not null auto_increment primary key,
    name varchar(30) not null
);

create table role (
   id int not null auto_increment primary key, 
   title varchar(30) not null,
   salary decimal not null,
   department_id int,
   foreign key (department_id)
   references department(id)
   on delete set null 
);

create table employee (
    id int not null auto_increment primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int,
    manager_id int,
    foreign key (role_id)
    references role(id)
);