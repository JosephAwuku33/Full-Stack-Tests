
# Farm Direct

A marketplace where farmers can list their products and customers can browse and purchase fresh produce directly from farms.



## Tech Stack

- Node.js
- Express
- Typescript
- MongoDB



## Features

#### 1. User Authentication (Required)
- **Farmers**: Can register, login, manage their profile
- **Customers**: Can register, login, browse and purchase
- Simple email/password authentication

#### 2. Product Management (Required)
- Farmers can add products with:
  - Product name, description, price
  - Category (vegetables, fruits, grains, dairy)
  - Quantity available
  - Single image upload
  - Harvest/expiry date

#### 3. Product Browsing (Required)
- Customers can:
  - View all products in a grid/list
  - Search products by name
  - Filter by category and price range
  - View product details

#### 4. Shopping Cart & Orders (Required)
- Add/remove items from cart
- Simple checkout process
- Order confirmation with basic details
- Order history for customers
- Order management for farmers (view incoming orders)

#### 5. Basic Dashboard (Required)
- **Farmer Dashboard**: List their products, recent orders
- **Customer Dashboard**: Order history, account details





## API Reference

#### Register

```http
  POST /api/register
```

| Body Params | Type     | Description                                 |
| :---------- | :------- | :------------------------------------------ |
| `name`      | `string` | **Required**. Full name of the user         |
| `email`     | `string` | **Required**. Email address of the user     |
| `password`  | `string` | **Required**. Password for account          |
| `role`      | `string` | **Required**. Either `farmer` or `customer` |


#### Login

```http
  POST /api/auth/login
```

| Body Params | Type     | Description                             |
| :---------- | :------- | :-------------------------------------- |
| `email`     | `string` | **Required**. Email address of the user |
| `password`  | `string` | **Required**. Password for account      |


### Public Products
#### List Products

```http
  GET /api/products
```

| Query Params | Type     | Description                            |
| :----------- | :------- | :------------------------------------- |
| `search`     | `string` | Search keyword (optional)              |
| `category`   | `string` | Filter by category (optional)          |
| `minPrice`   | `number` | Minimum price filter (optional)        |
| `maxPrice`   | `number` | Maximum price filter (optional)        |
| `page`       | `number` | Page number (optional, default: 1)     |
| `limit`      | `number` | Items per page (optional, default: 12) |

#### Get Product Details

```http
  GET /api/products/:id
```
| Path Params | Type     | Description              |
| :---------- | :------- | :----------------------- |
| `id`        | `string` | **Required**. Product ID |



### Farmer Endpoints ( Requires Bearer Token & Role = farmer )
#### Farmer Dashboard
```http
  GET /api/farmer/dashboard
```
| Header (Bearer Auth) | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `token`              | `string` | **Required**. Access token |


#### Create Product
```http
  POST /api/farmer/products
```
| Header (Bearer Auth) | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `token`              | `string` | **Required**. Access token |


| Body Params         | Type     | Description                                                    |
| :------------------ | :------- | :------------------------------------------------------------- |
| `name`              | `string` | **Required**. Product name                                     |
| `description`       | `string` | Product description                                            |
| `category`          | `string` | **Required**. One of `vegetables`, `fruits`, `grains`, `dairy` |
| `price`             | `number` | **Required**. Price per unit                                   |
| `quantityAvailable` | `number` | **Required**. Stock quantity                                   |
| `imageUrl`          | `string` | **Required**. Product image URL                                |
| `harvestDate`       | `string` | **Required**. Harvest date (ISO format)                        |
| `expiryDate`        | `string` | **Required**. Expiry date (ISO format)                         |



#### Update Product
```http
  POST /api/farmer/products/:id
```
| Header (Bearer Auth) | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `token`              | `string` | **Required**. Access token |

| Path Params | Type     | Description              |
| :---------- | :------- | :----------------------- |
| `id`        | `string` | **Required**. Product ID |

| Body Params         | Type   | Description            |
| :------------------ | :----- | :--------------------- |
| (any product field) | varies | Partial update allowed |


#### Delete Product
```http
  DELETE /api/farmer/products/:id
```
| Header (Bearer Auth) | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `token`              | `string` | **Required**. Access token |

| Path Params | Type     | Description              |
| :---------- | :------- | :----------------------- |
| `id`        | `string` | **Required**. Product ID |


### Customer Endpoints (Requires Bearer Token & Role = customer)
#### Customer Dashboard
```http 
    GET /api/customer/dashboard
```
| Header (Bearer Auth) | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `token`              | `string` | **Required**. Access token |


#### Get cart 
```http 
    GET /api/customer/cart
```
| Header (Bearer Auth) | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `token`              | `string` | **Required**. Access token |


#### Add to cart
```http 
    POST /api/customer/cart/items
```
| Header (Bearer Auth) | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `token`              | `string` | **Required**. Access token |

| Body Params | Type     | Description                   |
| :---------- | :------- | :---------------------------- |
| `productId` | `string` | **Required**. Product ID      |
| `quantity`  | `number` | **Required**. Quantity to add |



#### Remove from Cart 
```http 
DELETE /api/customer/cart/items/:productId
```
| Header (Bearer Auth) | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `token`              | `string` | **Required**. Access token |

| Path Params | Type     | Description              |
| :---------- | :------- | :----------------------- |
| `productId` | `string` | **Required**. Product ID |



#### Checkout
```http 
POST /api/customer/checkout
```
| Header (Bearer Auth) | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `token`              | `string` | **Required**. Access token |

| Body Params       | Type     | Description                                                            |
| :---------------- | :------- | :--------------------------------------------------------------------- |
| `shippingAddress` | `string` | **Required**. Shipping address                                         |
| `paymentMethod`   | `string` | **Required**. One of `credit_card`, `mobile_money`, `cash_on_delivery` |


#### Customer Orders
```http 
GET /api/customer/orders
```
| Header (Bearer Auth) | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `token`              | `string` | **Required**. Access token |


#### Get Single Order
``` http 
GET /api/customer/orders/:id
```
| Header (Bearer Auth) | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `token`              | `string` | **Required**. Access token |

| Path Params | Type     | Description            |
| :---------- | :------- | :--------------------- |
| `id`        | `string` | **Required**. Order ID |


### Shared Order Access ( Customer or Farmer)

#### Get Order By ID
``` http 
GET /api/orders/:id
```
| Header (Bearer Auth) | Type     | Description                                                      |
| :------------------- | :------- | :--------------------------------------------------------------- |
| `token`              | `string` | **Required**. Access token (must own the order or be the farmer) |

| Path Params | Type     | Description            |
| :---------- | :------- | :--------------------- |
| `id`        | `string` | **Required**. Order ID |














## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd backend / cd frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Running Tests

To run tests, run the following command

```bash
  npm test
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SECRET_KEY`
`TOKEN_EXPIRATION`
`MONGODB_URI`
`PORT`

