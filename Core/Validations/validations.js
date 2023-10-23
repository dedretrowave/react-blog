import { body } from "express-validator";

const passwordLength = 5;
const nameLength = 3;

const blogTitleLength = 10;
const blogTextLength = 20;

export const registerValidator = [
  body('email', 'Incorrect email').isEmail(),
  body('password', `Password must be at least ${passwordLength} characters long`).isLength({ min: passwordLength }).isString(),
  body('fullName', `Name must be ${nameLength} characters long`).isLength({ min: nameLength }).isString(),
  body('avatarUrl', 'Try again').optional().isString(),
]

export const loginValidator = [
  body('email', 'Incorrect email').isEmail(),
  body('password', `Password must be at least ${passwordLength} characters long`).isLength({ min: passwordLength }).isString(),
]

export const postValidator = [
  body('title', `Title must be at least ${blogTitleLength} characters long`).isLength({ min:  blogTitleLength }).isString(),
  body('text', `Post must be at least ${blogTextLength} characters long`).isLength({ min: blogTextLength }).isString(),
  body('tags', 'Wrong tag format').optional().isString(),
  body('imageUrl', 'Try again').optional().isString(),
]