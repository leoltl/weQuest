DROP TABLE IF EXISTS requests CASCADE;

CREATE TABLE requests (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  description TEXT,
  auction_start TIMESTAMP NOT NULL,
  auction_end TIMESTAMP NOT NULL,
  borrow_start DATE NOT NULL,
  borrow_end DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);