CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL,
  avatarUrl VARCHAR(255),
  points INT DEFAULT 0,
  isEmailVerified BOOLEAN DEFAULT FALSE,
  emailVerificationToken VARCHAR(255),
  emailVerificationExpires TIMESTAMP NULL,
  preferredLanguage ENUM('de', 'en') DEFAULT 'de',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id INT NOT NULL,
  language ENUM('de', 'en') DEFAULT 'de',
  age_range VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id)
);

CREATE TABLE class_memberships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  class_id INT NOT NULL,
  joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (class_id) REFERENCES student_classes(id),
  UNIQUE KEY unique_membership (student_id, class_id)
);

CREATE TABLE challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  topic VARCHAR(255),
  language ENUM('de', 'en') DEFAULT 'de',
  age_range VARCHAR(50),
  reading_level ENUM('beginner', 'intermediate', 'advanced'),
  teacher_id INT NOT NULL,
  class_id INT,
  source_type ENUM('ai_generated', 'gutenberg', 'custom') DEFAULT 'ai_generated',
  source_reference VARCHAR(500),
  total_points INT DEFAULT 100,
  time_limit_minutes INT DEFAULT 30,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id),
  FOREIGN KEY (class_id) REFERENCES student_classes(id)
);

CREATE TABLE challenge_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id INT NOT NULL,
  type ENUM('text', 'quiz') NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  order_index INT NOT NULL,
  points_value INT DEFAULT 10,
  time_estimate_seconds INT DEFAULT 60,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);

CREATE TABLE quiz_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_item_id INT NOT NULL,
  question TEXT NOT NULL,
  option_a VARCHAR(500),
  option_b VARCHAR(500),
  option_c VARCHAR(500),
  option_d VARCHAR(500),
  correct_answer ENUM('a', 'b', 'c', 'd') NOT NULL,
  points_value INT DEFAULT 5,
  order_index INT NOT NULL,
  FOREIGN KEY (challenge_item_id) REFERENCES challenge_items(id)
);

CREATE TABLE student_challenge_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  challenge_id INT NOT NULL,
  status ENUM('not_started', 'in_progress', 'completed', 'abandoned') DEFAULT 'not_started',
  current_item_id INT,
  total_points_earned INT DEFAULT 0,
  total_time_spent_seconds INT DEFAULT 0,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id),
  FOREIGN KEY (current_item_id) REFERENCES challenge_items(id),
  UNIQUE KEY unique_attempt (student_id, challenge_id)
);

CREATE TABLE student_item_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id INT NOT NULL,
  challenge_item_id INT NOT NULL,
  status ENUM('not_started', 'reading', 'completed') DEFAULT 'not_started',
  time_spent_seconds INT DEFAULT 0,
  points_earned INT DEFAULT 0,
  reading_speed_wpm DECIMAL(5,2),
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (attempt_id) REFERENCES student_challenge_attempts(id),
  FOREIGN KEY (challenge_item_id) REFERENCES challenge_items(id)
);

CREATE TABLE quiz_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_answer ENUM('a', 'b', 'c', 'd'),
  is_correct BOOLEAN,
  time_spent_seconds INT DEFAULT 0,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id) REFERENCES student_challenge_attempts(id),
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id)
);

CREATE TABLE leaderboard_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  class_id INT,
  challenge_id INT,
  points INT DEFAULT 0,
  completion_time_seconds INT,
  accuracy_percentage DECIMAL(5,2),
  reading_speed_avg_wpm DECIMAL(5,2),
  rank_position INT,
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (class_id) REFERENCES student_classes(id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);

-- Legacy tables (keeping for backward compatibility)
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