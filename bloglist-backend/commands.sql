CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);
insert into blogs (author, url, title, likes) values ('Esa', 'www.google.fi', 'Blog no. 1', 15);
insert into blogs (url, title) values ('www.yle.fi', 'Uutisblogi');
