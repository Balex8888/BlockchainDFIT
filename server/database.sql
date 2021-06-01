CREATE DATABASE dfitdb;

CREATE TABLE allblocks(
  unixtime INTEGER,
  compound FLOAT,
  dsr FLOAT,
  block INTEGER PRIMARY KEY
);

-- SELECT unixtime, compound, dsr, block FROM allblocks ORDER BY block DESC;
-- SELECT unixtime, compound, dsr, block FROM allblocks ORDER BY unixtime DESC;
-- DROP TABLE allblocks;



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





TRUNCATE allblocks;
DELETE FROM allblocks;