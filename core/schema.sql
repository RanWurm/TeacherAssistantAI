-- schema.sql
-- Drop in correct dependency order
DROP TABLE IF EXISTS ArticlesKeywords;
DROP TABLE IF EXISTS ArticlesSubjects;
DROP TABLE IF EXISTS ArticlesAuthors;
DROP TABLE IF EXISTS Keywords;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Articles;
DROP TABLE IF EXISTS Journals;

--------------------------------------------------
-- 1. Journals
--------------------------------------------------
CREATE TABLE Journals (
    journal_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    impact_factor FLOAT,
    publisher VARCHAR(255),
    UNIQUE(name)
);

--------------------------------------------------
-- 2. Articles
--------------------------------------------------
CREATE TABLE Articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    year INT,
    language VARCHAR(64),
    type VARCHAR(128),
    citation_count INT,
    journal_id INT NULL DEFAULT NULL,
    FOREIGN KEY (journal_id) REFERENCES Journals(journal_id)
);

--------------------------------------------------
-- 3. Authors
--------------------------------------------------
CREATE TABLE Authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    affiliation VARCHAR(255),
    UNIQUE(name, affiliation)
);

--------------------------------------------------
-- 4. Subjects
--------------------------------------------------
CREATE TABLE Subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL,
    UNIQUE(subject_name)
);

--------------------------------------------------
-- 5. Keywords
--------------------------------------------------
CREATE TABLE Keywords (
    keyword_id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    UNIQUE(keyword)
);

--------------------------------------------------
-- 6. ArticlesAuthors (Many-to-Many)
--------------------------------------------------
CREATE TABLE ArticlesAuthors (
    article_id INT,
    author_id INT,
    PRIMARY KEY (article_id, author_id),
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (author_id) REFERENCES Authors(author_id)
);

--------------------------------------------------
-- 7. ArticlesSubjects (Many-to-Many)
--------------------------------------------------
CREATE TABLE ArticlesSubjects (
    article_id INT,
    subject_id INT,
    PRIMARY KEY (article_id, subject_id),
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
);

--------------------------------------------------
-- 8. ArticlesKeywords (Many-to-Many)
--------------------------------------------------
CREATE TABLE ArticlesKeywords (
    article_id INT,
    keyword_id INT,
    PRIMARY KEY (article_id, keyword_id),
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (keyword_id) REFERENCES Keywords(keyword_id)
);
