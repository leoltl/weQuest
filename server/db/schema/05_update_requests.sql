CREATE TYPE status AS ENUM('deactivated', 'active', 'pending decision', 'winner selected', 'closed');
ALTER TABLE requests
  ADD COLUMN winning_bid_id INTEGER REFERENCES bids(id) DEFAULT NULL,
  ADD COLUMN current_bid_id INTEGER REFERENCES bids(id) DEFAULT NULL,
  ADD COLUMN title VARCHAR(250) NOT NULL DEFAULT 'NA',
  ADD COLUMN budget INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN request_status status DEFAULT 'active';