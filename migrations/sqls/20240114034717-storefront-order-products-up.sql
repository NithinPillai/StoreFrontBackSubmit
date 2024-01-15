CREATE TABLE SFOrderProducts (
  order_id   INTEGER NOT NULL REFERENCES SFOrders (id),
  product_id INTEGER NOT NULL REFERENCES SFProducts (id),
  quantity   INTEGER NOT NULL
);