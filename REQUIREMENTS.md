# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 'storefront_products/' (GET Request)
- Show 'storefront_products/:id' (GET Request)
- Create [token required] 'storefront_products/create' (POST Request)


#### Users
- Index [token required] 'users/' (GET Request)
- Show [token required] 'users/:id' (GET Request)
- Create N[token required] 'users/create' (POST Request)

#### Orders
- Current Order by user (args: user id)[token required] 'orders/:user_id' (GET Request)


## Data Shapes
#### Product
-  id
- name
- price

CREATE TABLE SFProducts (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(250) NOT NULL,
  price INTEGER      NOT NULL
);

#### User
- id
- firstName
- lastName
- password

CREATE TABLE SFUsers (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(250) NOT NULL,
  firstname       VARCHAR(250) NOT NULL,
  lastname        VARCHAR(250) NOT NULL,
  password_digest VARCHAR(250) NOT NULL
);

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

CREATE TABLE SFOrderProducts (
  order_id   INTEGER NOT NULL REFERENCES SFOrders (id),
  product_id INTEGER NOT NULL REFERENCES SFProducts (id),
  quantity   INTEGER NOT NULL
);
CREATE TABLE SFOrders (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES SFUsers (id),
  status  BOOLEAN NOT NULL
);