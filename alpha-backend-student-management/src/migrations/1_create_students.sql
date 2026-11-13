CREATE TABLE students (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    contact_number VARCHAR(20) NOT NULL UNIQUE,
    enrollment_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Active', 'Inactive', 'Graduated')),
    profile_picture TEXT
);
