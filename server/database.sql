-- 1. Create the Users table (For Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL
);

-- 2. Create the Login table (For Regular Users)
CREATE TABLE login (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
);

-- 3. Insert the DEFAULT ADMIN (This is crucial!)
INSERT INTO users (username, password) VALUES ('admin', 'admin123');

-- 4. (Optional) Add a dummy user for testing
INSERT INTO login (username, password, role) VALUES ('testuser', 'user123', 'user');


--5. create menu table
CREATE TABLE menu (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL, 
    category VARCHAR(100),
    image_url TEXT
);

6. -- insert dummy values for menu
INSERT INTO menu (name, price, category, image_url) VALUES 
('Classic Burger', 149.00, 'Main', '/images/burger.png'),
('Margherita Pizza', 299.00, 'Main', '/images/pizza.png'),
('Classic Burger', , 149.00, 'Main', '/images/burger.png'),
('Oreo shake', 299.00, 'Drink', '/images/pizza.png'),
('Spicy Pasta', 249.00, 'Side', '/images/pasta.png'),
('Badam Milk', 129.00, 'Drink', '/images/wrap.png'),
('Chocolate Cake', 199.00, 'Side', '/images/cake.png');

7.--create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    cname VARCHAR(100),
    tamt NUMERIC(10,2),
    status VARCHAR(25),
    items JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

8.--insert dummy values for orders table
INSERT INTO orders (cname, tamt, status, items) VALUES 
('John Doe', 430.00, 'Pending', '[
    {"name": "Veggie Supreme Pizza", "price": 280, "qty": 1},
    {"name": "Classic Burger", "price": 150, "qty": 1}
]'),

('Alice Smith', 180.00, 'Cooking', '[
    {"name": "Spicy Chicken Wrap", "price": 180, "qty": 1}
]');

