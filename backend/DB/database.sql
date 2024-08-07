
-- Password hash system
--https://docs.vultr.com/how-to-securely-store-passwords-using-postgresql#first-principles---password-hashing
--SELECT gen_salt('xdes') ;
--SELECT crypt('password_example', gen_salt('xdes')) ;
CREATE EXTENSION pgcrypto ;

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR
);


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  surname VARCHAR,
  user_name VARCHAR,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES role(id)
);


CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  location VARCHAR  NOT NULL
);
ALTER TABLE location
ADD COLUMN qr TEXT;


CREATE TABLE complaint_status (
  id SERIAL PRIMARY KEY,
  status_name VARCHAR NOT NULL
);


CREATE TABLE complaints (
  id SERIAL PRIMARY KEY,
  location_id INT NOT NULL,
  user_id INT NOT NULL,
  complaint TEXT NOT NULL,
  photo_url TEXT[],
  assigned_user_id INT,
  status_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  finished_at TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES location(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (assigned_user_id) REFERENCES users(id),
  FOREIGN KEY (status_id) REFERENCES complaint_status(id)
);