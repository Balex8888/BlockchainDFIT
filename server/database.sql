CREATE DATABASE dfitdb;


CREATE TABLE historical(
  unixtime TIMESTAMP PRIMARY KEY,
  compoundvalue FLOAT,
  dsrvalue FLOAT,
  dydxvalue FLOAT,
  aavevalue FLOAT
);

CREATE TABLE example(
  unixtime TIMESTAMP PRIMARY KEY,
  compoundvalue FLOAT,
  dsrvalue FLOAT,
  dydxvalue FLOAT,
  aavevalue FLOAT
);

CREATE TABLE one (
  unixtime TIMESTAMP PRIMARY KEY,
  compoundvalue FLOAT
);


-- Example
-- CREATE TABLE blocks(
--   blocks_id SERIAL PRIMARY KEY,
--   description VARCHAR(255)

-- );