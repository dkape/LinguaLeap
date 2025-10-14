CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL,
  avatarUrl VARCHAR(255),
  points INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_paths (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id)
);

CREATE TABLE learning_path_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  learning_path_id INT NOT NULL,
  type VARCHAR(255) NOT NULL,
  content TEXT,
  order_index INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id)
);