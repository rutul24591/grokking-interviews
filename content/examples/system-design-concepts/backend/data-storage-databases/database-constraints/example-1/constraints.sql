CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active','disabled'))
);
