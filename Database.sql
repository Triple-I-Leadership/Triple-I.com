CREATE TABLE users (
    id SERIAL PRIMARY KEY,       -- Automatically incrementing ID for each user
    email VARCHAR(255) NOT NULL, -- User's email address
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of registration
);

