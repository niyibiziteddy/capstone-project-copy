import pool from '../db/index.js';
import queries from '../queries/queries.js';
import { getStudentByIdValidator } from '../validators/index.js';

// This function to handle the field naming that goes to the frontend
function toFrontendStudent(dbRow) {
  return {
    id: dbRow.id,
    studentId: dbRow.student_id,
    firstName: dbRow.first_name,
    lastName: dbRow.last_name,
    email: dbRow.email,
    dateOfBirth: dbRow.date_of_birth,
    contactNumber: dbRow.contact_number,
    enrollmentDate: dbRow.enrollment_date,
    status: dbRow.status,
    profilePicture: dbRow.profile_picture,
  };
}

const getStudents = async (req, res, next) => {
  try {
    const { page, limit, search, sortBy, sortOrder, status } =
      req.validatedQuery;
    const offset = (page - 1) * limit;

    const sortColumns = {
      name: ['first_name', 'last_name'],
      enrollment_date: ['enrollment_date'],
    };
    const sortFields = sortColumns[sortBy] || ['student_id'];
    const dbSortOrder = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const orderBySql = sortFields
      .map((field) => `${field} ${dbSortOrder}`)
      .join(', ');

    const whereClauses = [];
    const queryParams = [];

    if (search) {
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern);
      whereClauses.push(`(first_name ILIKE $1 OR last_name ILIKE $2)`);
    }

    if (status && ['active', 'inactive','graduated'].includes(String(status).toLowerCase())) {
      queryParams.push(status);
      whereClauses.push(`status = $${queryParams.length}`);
    }

    const whereSql =
      whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM students${whereSql}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    queryParams.push(limit);
    const limitIndex = queryParams.length;

    queryParams.push(offset);
    const offsetIndex = queryParams.length;

    const dataQuery = `
          SELECT * FROM students
          ${whereSql}
          ORDER BY ${orderBySql}
          LIMIT $${limitIndex} OFFSET $${offsetIndex}
        `;

    const { rows } = await pool.query(dataQuery, queryParams);

    return res.status(200).json({
      success: true,
      message: 'The list of all students',
      data: rows.map(toFrontendStudent),
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Checks if the email, phone number, or student id is already saved.
async function checkDupHandler(email, contactNumber, studentId) {
  const dups = await Promise.all(
    [['email', email], ['contact_number', contactNumber], ['student_id', studentId]].map(async (item) => {
      const result = await pool.query(
        `select * from "students" where "${item[0]}" = $1`,
        [item[1]],
      );
      return result.rows.length ? `${item[0]} is alrady taken` : 'Unique';
    }),
  );
  return dups.filter((item) => item !== 'Unique');
}

// Adds a new student and returns the saved row.
const addStudent = async (req, res, next) => {
  try {
    const {
      studentId,
      firstName,
      lastName,
      contactNumber,
      email,
      dateOfBirth,
      enrollmentDate,
      status,
      profilePicture,
    } = req.validatedBody;

    const duplicates = await checkDupHandler(email, contactNumber, studentId);

    if (duplicates.length) {
      const err = new Error('Duplicate fields at insertion');
      err.code = 23505;
      err.details = duplicates;
      return next(err);
    }

    await pool.query(
      `insert into "students" ("student_id","first_name","last_name",email,"date_of_birth","contact_number",
                        "enrollment_date",status,profile_picture) values($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [studentId, firstName, lastName, email, dateOfBirth, contactNumber, enrollmentDate, status, profilePicture],
    );

    const result = await pool.query(`select * from students where student_id = $1`, [studentId]);
    return res.status(201).json({
      success: true,
      message: 'The new student was added succesfully',
      data: result.rows.map(toFrontendStudent),
    });
  } catch (error) {
    return next(error);
  }
};

// Returns one student using the numeric database id.
const getStudentById = async (req, res, next) => {
  const parsedId = getStudentByIdValidator.safeParse(req.params.id);

  if (!parsedId.success) {
    return next(parsedId.error);
  }

  try {
    const { rows } = await pool.query(queries.getStudentById, [parsedId.data]);

    if (rows.length === 0) {
      const err = new Error('Failed to retrieve student');
      err.name = 'CastError';
      err.details = `There is no student with this ID ${parsedId.data}`;
      return next(err);
    }

    return res.status(200).json({
      success: true,
      message: 'Student retrieved Successfully.',
      data: toFrontendStudent(rows[0]),
    });
  } catch (err) {
    return next(err);
  }
};

// Updates a student using the numeric database id.
const updateStudent = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const {
    firstName,
    lastName,
    email,
    contactNumber,
    dateOfBirth,
    enrollmentDate,
    status,
    profilePicture,
  } = req.body;

  try {
    const existingResult = await pool.query(
      'SELECT * FROM students WHERE id = $1',
      [id],
    );

    if (existingResult.rows.length === 0) {
      const err = new Error(`Student with ID '${id}' does not exist.`);
      err.name = 'CastError';
      return next(err);
    }

    const currentStudent = existingResult.rows[0];

    if (email && email !== currentStudent.email) {
      const emailCheck = await pool.query(
        'SELECT id FROM students WHERE email = $1 AND id != $2',
        [email, id],
      );
      if (emailCheck.rows.length > 0) {
        const err = new Error(`Email '${email}' is already registered to another student.`);
        return next(err);
      }
    }

    if (contactNumber && contactNumber !== currentStudent.contact_number) {
      const contactCheck = await pool.query(
        'SELECT id FROM students WHERE contact_number = $1 AND id != $2',
        [contactNumber, id],
      );

      if (contactCheck.rows.length > 0) {
        const err = new Error(`Contact number '${contactNumber}' is already in use by another student.`);
        err.code = 23505;
        return next(err);
      }
    }

    const updateQuery = `
            UPDATE students
            SET
                first_name = $1,
                last_name = $2,
                email = $3,
                contact_number = $4,
                date_of_birth = $5,
                enrollment_date = $6,
                status = $7,
                profile_picture = $8
            WHERE id = $9
            RETURNING *
        `;

    const values = [
      firstName !== undefined ? firstName.trim() : currentStudent.first_name,
      lastName !== undefined ? lastName.trim() : currentStudent.last_name,
      email !== undefined ? email : currentStudent.email,
      contactNumber !== undefined ? contactNumber.trim() : currentStudent.contact_number,
      dateOfBirth !== undefined ? dateOfBirth : currentStudent.date_of_birth,
      enrollmentDate !== undefined ? enrollmentDate : currentStudent.enrollment_date,
      status !== undefined ? status : currentStudent.status,
      profilePicture !== undefined ? profilePicture : currentStudent.profile_picture,
      id,
    ];

    const result = await pool.query(updateQuery, values);

    return res.status(200).json({
      success: true,
      message: 'Student record updated successfully.',
      data: toFrontendStudent(result.rows[0]),
    });
  } catch (error) {
    return next(error);
  }
};

// Deletes a student using the numeric database id.
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const queryText = 'DELETE FROM students WHERE id = $1 RETURNING *';
    const { rows, rowCount } = await pool.query(queryText, [id]);

    if (rowCount === 0) {
      const err = new Error('Student not found');
      err.name = 'CastError';
      return next(err);
    }

    const student = rows[0];

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted a student.',
      data: {
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        email: student.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export { getStudents, addStudent, getStudentById, updateStudent, deleteStudent };
