-- Active: 1780235224396@@127.0.0.1@3306@spoteefy
DROP DATABASE IF EXISTS spoteefy;
CREATE DATABASE IF NOT EXISTS spoteefy;
USE spoteefy;

CREATE TABLE IF NOT EXISTS users (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    username           VARCHAR(255) NOT NULL UNIQUE,
    email              VARCHAR(255) NOT NULL UNIQUE,
    password_hash      VARCHAR(255) NOT NULL
);

INSERT INTO users (username, email, password_hash)
VALUES
("user1", "generic@email.com", "$2b$12$e1Pk.ze9XD3m3/U24XLahe3vq1cJqGHZRaISSNcWS7enjttp4bOni"), 
("funguy", "shrooms@adderal.lcd", "$2b$12$4JQVUtKXYwAUH0v9WKwb4..K8Mcn4qoNIFcLP0I.LIMEGjR//7kVm"); 
--password to first user is: password1

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

INSERT INTO tracks
(title, author, description, audio_path, cover_path, duration_s, uploader_id, rating)
VALUES
('Mozart - Piano Sonata in B-flat major III Allegretto Grazioso', 'Brendan Kinsella', 'Classical piano piece', '/audio/Brendan_Kinsella_-_Mozart_-_Piano_Sonata_in_B-flat_major_III_Allegretto_Grazioso(chosic.com).mp3', '/covers/default_cover.jpg', 397, 1, 2),
('Smooth Criminal (DJ Savin Remix)', 'Michael Jackson', 'Remix version of Smooth Criminal', '/audio/Michael_Jackson_-_Michael_Jackson_-_Smooth_Criminal_DJ_Savin_Remix_(mp3.pm).mp3', '/covers/default_cover.jpg', 271, 1, 1),
('Billie Jean (Remix)', 'Michael Jackson', 'Remix version of Billie Jean', '/audio/Michael_Jackson_-_Michael_Jackson_-_Billie_Jean_Remix_(mp3.pm).mp3', '/covers/default_cover.jpg', 368, 1, 0),
('Beethoven - Piano Sonata No.15 Op.28 Pastoral IV Rondo Allegro ma non troppo', 'Karine Gilanyan', 'Classical piano sonata', '/audio/Karine_Gilanyan_-_Beethoven_-_Piano_Sonata_nr15_in_D_major_op28_Pastoral_-_IV_Rondo_Allegro_ma_non_troppo(chosic.com).mp3', '/covers/default_cover.jpg', 296, 1, 1),
('Beethoven - Piano Sonata No.15 Op.28 Pastoral II Andante', 'Karine Gilanyan', 'Classical piano sonata', '/audio/Karine_Gilanyan_-_Beethoven_-_Piano_Sonata_nr15_in_D_major_op28_Pastoral_-_II_Andante(chosic.com).mp3', '/covers/default_cover.jpg', 423, 1, 0),
('Sonata No.1 in F Minor Op.2 No.1 IV Prestissimo', 'Daniel Veesey', 'Classical piano sonata', '/audio/Daniel_Veesey_-_04_-_Sonata_No_1_in_F_Minor_Op_2_No_1_-_IV_Prestissimo(chosic.com).mp3', '/covers/default_cover.jpg', 446, 1, 1),
('Beethoven - Piano Sonata No.15 Op.28 Pastoral III Scherzo Allegro Vivace', 'Karine Gilanyan', 'Classical piano sonata', '/audio/Karine_Gilanyan_-_Beethoven_-_Piano_Sonata_nr15_in_D_major_op28_Pastoral_-_III_Scherzo_Allegro_Vivace(chosic.com).mp3', '/covers/default_cover.jpg', 118, 1, 1),
('Don Giovanni K.527 Overture', 'Mozart', 'Opera overture', '/audio/Don-Giovanni-K.-527-Overture(chosic.com).mp3', '/covers/default_cover.jpg', 389, 1, 0),
('Alla Turca', 'Mozart', 'Turkish March', '/audio/Alla-Turca(chosic.com).mp3', '/covers/default_cover.jpg', 214, 1, 1),
('Mozart Serenade in G major', 'Mozart', 'Serenade composition', '/audio/Mozart-Serenade-in-G-major(chosic.com).mp3', '/covers/default_cover.jpg', 252, 1, 0),
('Mozart Sonata No.13 in B-flat major K333 II Andante Cantabile', 'Brendan Kinsella', 'Classical piano sonata', '/audio/Brendan_Kinsella_-_Mozart_-_Sonata_No_13_In_B_Flat_Major_K333_-_II_Andante_Cantabile(chosic.com).mp3', '/covers/default_cover.jpg', 375, 1, 0);

CREATE TABLE track_ratings (
    user_id INT NOT NULL,
    track_id INT NOT NULL,

    PRIMARY KEY (user_id, track_id),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (track_id) REFERENCES tracks(id)
);

INSERT INTO track_ratings (user_id, track_id) VALUES
(2, 1), (2, 4), (2, 6), (2, 7), 
(2, 9), (1, 2), (1, 1);