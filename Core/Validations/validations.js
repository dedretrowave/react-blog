import { body } from "express-validator";

const passwordLength = 5;
const nameLength = 3;

const blogTitleLength = 10;
const blogTextLength = 20;

export const registerValidator = [
  body('email', 'Enter email').isEmail(),
  body('password', 'Enter password').isLength({ min: passwordLength }).isString(),
  body('fullName', 'Enter name').isLength({ min: nameLength }).isString(),
  body('avatarUrl').optional().isURL(),
]

export const loginValidator = [
  body('email', 'Enter email').isEmail(),
  body('password', 'Enter password').isLength({ min: passwordLength }).isString(),
]

export const postValidator = [
  body('title', 'Enter article title').isLength({ min:  blogTitleLength }).isString(),
  body('text', 'Enter article text').isLength({ min: blogTextLength }).isString(),
  body('tags', 'Wrong tag format').optional().isArray(),
  body('imageUrl', 'Wrong image URL').optional().isString(),
]