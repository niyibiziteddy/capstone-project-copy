import { z } from 'zod';
import validateMiddleware from '../middleware/validateMiddleware.js';
import postValidate from '../middleware/postValidator.js';

const getStudentsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'enrollment_date']).optional(),
  sortOrder: z.enum(['ASC', 'DESC', 'asc', 'desc']).transform(val => val.toUpperCase()).default('ASC'),
  status: z
    .string()
    .trim()
    .transform(val => val.toLowerCase())
    .refine(val => ['active', 'inactive','graduated'].includes(val), {
      message: 'Status must be either active, inactive or graduated',
    })
    .transform(val => val.charAt(0).toUpperCase() + val.slice(1))
    .optional()
});

const dateText = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

const addStudentSchema = z.object({
  studentId: z.string().min(1).max(50),
  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  email: z.email("Email must be a full address, such as name@gmail.com").max(255),
  contactNumber: z.string().min(1).max(20),
  dateOfBirth:z.coerce.date(),
  enrollmentDate:z.coerce.date(),
  status: z.enum(["Active", "Inactive", "Graduated"]),
  profilePicture: z.string().min(1),
}).refine((result) => {
  return result.enrollmentDate > result.dateOfBirth
},{
  message: "The enllolment date must be greater that the date of birth",
  path: ["enrollmentDate"]
});

const getStudentByIdValidator = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .pipe(z.number().int().min(1).max(2147483647));

const updateStudentSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'First name cannot be empty.').max(100)
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(1, 'Last name cannot be empty.').max(100)
      .optional(),

    email: z
      .string()
      .trim()
      .email('Invalid email format.').max(255)
      .optional(),

    contactNumber: z
      .string()
      .trim()
      .min(1, 'Contact number cannot be empty.').max(20)
      .optional(),

    status: z
      .enum(['Active', 'Inactive', 'Graduated'], {
        errorMap: () => ({ message: "Status must be 'Active', 'Inactive', or 'Graduated'." })
      })
      .optional(),

    dateOfBirth: z
      .coerce.date()
      .optional(),

    enrollmentDate: z
      .coerce.date()
      .optional(),

    profilePicture: z
      .string()
      .trim()
      .min(1, 'Profile picture URL cannot be empty.')
      .optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Request body cannot be empty. At least one field must be provided for update.'
  }).refine((result) => {
        return result.enrollmentDate > result.dateOfBirth
      },{
        message: "The enllolment date must be greater that the date of birth",
        path: ["enrollmentDate"]
      });

const deleteStudentSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const getStudentsValidator = validateMiddleware(getStudentsSchema);
const addStudentValidator = postValidate(addStudentSchema);

function updateStudentValidator(req, res, next) {
  const result = updateStudentSchema.safeParse(req.body);

  if (!result.success) {
    return next(result.error);
  }

  req.body = result.data;
  next();
}

function deleteStudentValidator(req, res, next) {
  const result = deleteStudentSchema.safeParse(req.params);

  if (!result.success) {
    return next(result.error);
  }

  next();
}

export { getStudentsValidator, addStudentValidator, getStudentByIdValidator, updateStudentValidator, deleteStudentValidator };
