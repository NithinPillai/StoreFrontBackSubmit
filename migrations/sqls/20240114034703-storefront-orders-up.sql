CREATE TABLE SFOrders (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES SFUsers (id),
  status  BOOLEAN NOT NULL
);