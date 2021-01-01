CREATE DATABASE user_database;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY ,
    firstName  VARCHAR(80),
    lastName  VARCHAR(80),
    email  VARCHAR(80) NOT NULL UNIQUE,
    username  VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);