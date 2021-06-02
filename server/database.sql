CREATE DATABASE dfitdb;

CREATE TABLE historical(
  unixtime TIMESTAMP PRIMARY KEY,
  compound FLOAT,
  dsr FLOAT,
  dydx FLOAT,
  aave FLOAT
);


-- CREATE TABLE allblocks(
--   compound FLOAT,
--   dsr FLOAT,
--   unixtime INTEGER,
--   block INTEGER PRIMARY KEY
-- );

-- BIGINT on unix time when using *1000 or passes max int size
CREATE TABLE allblocks(
  compound FLOAT,
  dsr FLOAT,
  unixtime BIGINT,
  block INTEGER PRIMARY KEY
);

-- SELECT unixtime, compound, dsr, block FROM allblocks ORDER BY block DESC;
-- SELECT unixtime, compound, dsr, block FROM allblocks ORDER BY unixtime DESC;
-- DROP TABLE allblocks;

-- TRUNCATE allblocks;
-- DELETE FROM allblocks;


