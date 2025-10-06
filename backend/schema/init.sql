create database if not exists movie_booking;
use movie_booking;

create table if not exists movies (
    id bigint primary key auto_increment,
    title varchar(150) not null,
    genre varchar(100),
    filename varchar(255),
    rating decimal(2,1) default null,
    created_at timestamp default current_timestamp
);

create table if not exists seats (
    id bigint primary key auto_increment,
    seat_number varchar(10) not null unique,
    seat_type enum('regular', 'premium', 'vip') default 'regular',
    price int not null
);

create table if not exists bookings (
    id bigint primary key auto_increment,
    movie_id bigint not null,
    customer_name varchar(100),
    created_at timestamp default current_timestamp,
    foreign key (movie_id) references movies(id) on delete cascade
);

create table if not exists booked_seats (
    id bigint primary key auto_increment,
    booking_id bigint not null,
    seat_id bigint not null,
    foreign key (booking_id) references bookings(id) on delete cascade,
    foreign key (seat_id) references seats(id)
);


insert into movies (title, genre, filename, rating) values
('Interstellar', 'Science fiction', 'Interstellar.jpg', 8.6),
('The Dark Knight', 'Superhero', 'The Dark Knight.jpg', 9.0),
('Fight Club', 'Drama', 'Fight Club.jpg', 8.8),
('The Godfather', 'Crime', 'The Godfather.jpeg', 9.2),
('Se7en', 'Thriller', 'Se7en.jpeg', 8.6),
('Transformers: Dark of the Moon', 'Action', 'Transformers  Dark of the Moon.jpg', 6.2),
('F1', 'Sports', 'F1.jpg', 7.5),
('John Wick: Chapter 3', 'Action', 'John Wick Chapter 3.webp', 7.4),
('Shutter Island', 'Mystery', 'Shutter Island.jpeg', 8.2),
('Schindler''s List', 'Historical', 'Schindlers List.jpeg', 9.0);


insert into seats (seat_number, seat_type, price) values
('A1','regular',200),('A2','regular',200),('A3','regular',200),('A4','regular',200),
('A5','regular',200),('A6','regular',200),('A7','regular',200),('A8','regular',200),

('B1','regular',200),('B2','regular',200),('B3','regular',200),('B4','regular',200),
('B5','regular',200),('B6','regular',200),('B7','regular',200),('B8','regular',200),

('C1','premium',300),('C2','premium',300),('C3','premium',300),('C4','premium',300),
('C5','premium',300),('C6','premium',300),('C7','premium',300),('C8','premium',300),

('D1','premium',300),('D2','premium',300),('D3','premium',300),('D4','premium',300),
('D5','premium',300),('D6','premium',300),('D7','premium',300),('D8','premium',300),

('E1','vip',500),('E2','vip',500),('E3','vip',500),('E4','vip',500),
('E5','vip',500),('E6','vip',500),('E7','vip',500),('E8','vip',500);
