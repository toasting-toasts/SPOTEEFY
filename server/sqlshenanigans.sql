-- Active: 1780235224396@@127.0.0.1@3306@spoteefy
drop database if exists spoteefy;
CREATE DATABASE IF NOT EXISTS spoteefy;
USE spoteefy;
drop table if exists tracks;
--drop TABLE users;

CREATE TABLE IF NOT EXISTS users (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    username           VARCHAR(255) NOT NULL UNIQUE,
    email              VARCHAR(255) NOT NULL UNIQUE,
    password_hash      VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tracks (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    audio_path VARCHAR(255) NOT NULL,
    cover_path VARCHAR(255) NOT NULL,
    upload_time    DATETIME DEFAULT CURRENT_TIMESTAMP,

    title           VARCHAR(255) NOT NULL,
    duration_s     INT NOT NULL,
    author         VARCHAR(255) NOT NULL,
    description    TEXT NOT NULL,
    rating         INT NOT NULL DEFAULT 0,
    views          INT DEFAULT 0,

    uploader_id INT NOT NULL,
    FOREIGN KEY (uploader_id) REFERENCES users(id)
);

CREATE TABLE favourite_songs (
    user_id INT NOT NULL,
    song_id INT NOT NULL,

    PRIMARY KEY(user_id, song_id),

    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(song_id) REFERENCES tracks(id)
);

insert into tracks values