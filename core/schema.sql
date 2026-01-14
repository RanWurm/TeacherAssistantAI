-- schema.sql
-- Drop in correct dependency order
DROP TABLE IF EXISTS ArticleAuthorInstitutions;
DROP TABLE IF EXISTS ArticlesKeywords;
DROP TABLE IF EXISTS ArticlesSubjects;
DROP TABLE IF EXISTS ArticlesAuthors;
DROP TABLE IF EXISTS Institutions;
DROP TABLE IF EXISTS Keywords;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Articles;
DROP TABLE IF EXISTS Sources;
DROP TABLE IF EXISTS Journals;
-- --------------------------------------------------
-- 1. Journals
-- --------------------------------------------------
CREATE TABLE Sources (
    source_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(64),
    impact_factor FLOAT,
    publisher VARCHAR(255),
    UNIQUE(name)
);

-- --------------------------------------------------
-- 2. Articles
-- --------------------------------------------------
CREATE TABLE Articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    openalex_id VARCHAR(64) NOT NULL,
    title TEXT NOT NULL,
    year INT,
    language VARCHAR(64),
    type VARCHAR(128),
    citation_count INT,
    source_id INT NULL DEFAULT NULL,
    article_url TEXT NULL,

    UNIQUE KEY uq_articles_openalex_id (openalex_id),
    FOREIGN KEY (source_id) REFERENCES Sources(source_id)
);
-- --------------------------------------------------
-- 3. Authors
-- --------------------------------------------------
CREATE TABLE Authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    openalex_author_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY uq_openalex_author_id (openalex_author_id)
);

-- --------------------------------------------------
-- 4. Subjects
-- --------------------------------------------------
CREATE TABLE Subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL,
    UNIQUE(subject_name)
);

-- --------------------------------------------------
-- 5. Keywords
-- --------------------------------------------------
CREATE TABLE Keywords (
    keyword_id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    UNIQUE(keyword)
);

-- --------------------------------------------------
-- 6. ArticlesAuthors (Many-to-Many)
-- --------------------------------------------------
CREATE TABLE ArticlesAuthors (
    article_id INT,
    author_id INT,
    PRIMARY KEY (article_id, author_id),
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (author_id) REFERENCES Authors(author_id)
);

-- --------------------------------------------------
-- 7. ArticlesSubjects (Many-to-Many)
-- --------------------------------------------------
CREATE TABLE ArticlesSubjects (
    article_id INT,
    subject_id INT,
    PRIMARY KEY (article_id, subject_id),
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
);

-- --------------------------------------------------
-- 8. ArticlesKeywords (Many-to-Many)
-- --------------------------------------------------
CREATE TABLE ArticlesKeywords (
    article_id INT,
    keyword_id INT,
    PRIMARY KEY (article_id, keyword_id),
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (keyword_id) REFERENCES Keywords(keyword_id)
);

CREATE TABLE Institutions (
    institution_id INT AUTO_INCREMENT PRIMARY KEY,
    openalex_institution_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY uq_openalex_institution_id (openalex_institution_id)
);

CREATE TABLE ArticleAuthorInstitutions (
    article_id INT,
    author_id INT,
    institution_id INT,
    PRIMARY KEY (article_id, author_id, institution_id),
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (author_id) REFERENCES Authors(author_id),
    FOREIGN KEY (institution_id) REFERENCES Institutions(institution_id)
);