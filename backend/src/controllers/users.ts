import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { tokenExtractor } from '../middleware/tokenExtractor.js';
import { userExtractor } from '../middleware/userExtractor.js';
import { handleUpload } from '../middleware/uploadMiddleware.js';
import { createNewProfPic } from '../middleware/createThumbnail.js';

import {
  handleUserInfoChange,
  handleProfPictureChange,
} from '../middleware/validateUpdateInput.js';
import { userFinder } from '../middleware/finders.js';
import {
  validatePasswordChange,
  validateNewUserInput,
  validateFirstLoginPasswordChange,
} from '../middleware/validateInput.js';

import {
  UserInput,
  UserInfoUpdateInput,
  passwordChangeInput,
  UserFirstLoginInput,
} from '../types/types.js';

import models from '../models/index.js';
const { User } = models;

const router = express.Router();

// GET /api/users
//route for getting all users
router.get('/', async (_req: Request, res: Response) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
  });
  res.json(users);
});

// POST /api/users/addUser
// route for adding a new user
// Middlewares used:
// - tokenExtractor: validates the token and checks if the user is authenticated
// - validateNewUserInput: validates the new user input
// - not in use at ui, mainly for testing purposes and for possible future use
router.post(
  '/addUser',
  tokenExtractor,
  userExtractor,
  validateNewUserInput,
  async (req: Request<object, object, UserInput>, res: Response) => {
    const { name, username, password, email, role } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const profilePicture = '/images/about/profile-picture.jpg';

    const newUser = await User.create({
      name,
      username,
      passwordHash,
      email,
      role,
      profilePicture,
    });

    res.json({
      messageEn: 'New user added!',
      messageFi: 'Uusi käyttäjä lisätty!',
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture,
      },
    });
  },
);

// PUT /api/users/changePassword
// route for users passwordchange
// Middlewares used:
// - tokenExtractor: validates the token and checks if the user is authenticated
// - userExtractor: extracts the user from the token
// - validatePasswordChange: validates the new password
router.put(
  '/changePassword',
  tokenExtractor,
  userExtractor,
  validatePasswordChange,
  async (req: Request<object, object, passwordChangeInput>, res: Response) => {
    const updatedUser = await req.user.save();
    res.status(200).json({
      messageFi: 'Salasana vaihdettu!',
      messageEn: 'Password changed!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  },
);

// PUT /api/users/updateInfo
// route for changing user info
// Middlewares used:
// - tokenExtractor: validates the token and checks if the user is authenticated
// - userExtractor: extracts the user from the token
// - handleUserInfoChange: handles the updated user info
router.put(
  '/updateInfo',
  tokenExtractor,
  userExtractor,
  handleUserInfoChange,
  async (req: Request<object, object, UserInfoUpdateInput>, res: Response) => {
    const updatedUser = await req.user.save();

    res.json({
      messageEn: 'User info edited!',
      messageFi: 'Käyttäjän tietoja muokattu!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  },
);

// PUT /api/users/updateFirstLogin
// route for firslogin where user is forced to change default user info and password
// Middlewares used:
// - tokenExtractor: validates the token and checks if the user is authenticated
// - userExtractor: extracts the user from the token
// - validateFirstLoginPasswordChange: validates the new password
router.put(
  '/updateFirstLogin',
  tokenExtractor,
  userExtractor,
  validateFirstLoginPasswordChange,
  async (req: Request<object, object, UserFirstLoginInput>, res: Response) => {
    const { username, name, email, password } = req.body;

    const user = req.user;

    const passwordHash = await bcrypt.hash(password, 10);
    user.username = username;
    user.name = name;
    user.email = email;
    user.passwordHash = passwordHash;
    user.lastLogin = new Date();
    user.loginTime = new Date();

    const updatedUser = await user.save();

    res.json({
      messageEn: 'User info edited!',
      messageFi: 'Käyttäjän tietoja muokattu!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  },
);

// PUT /api/users/updateInfo
// route for changing user info
// Middlewares used:
// - tokenExtractor: validates the token and checks if the user is authenticated
// - userExtractor: extracts the user from the token
// - handleUserInfoChange: handles the updated user info
router.put(
  '/changeProfPic',
  handleUpload,
  tokenExtractor,
  userExtractor,
  createNewProfPic,
  handleProfPictureChange,
  async (req: Request<object, object, UserInfoUpdateInput>, res: Response) => {
    const updatedUser = await req.user.save();

    res.json({
      messageEn: 'Profile picture changed!',
      messageFi: 'Profiilikuva vaihdettu!',
      newProfPic: updatedUser.profilePicture,
    });
  },
);

// DELETE /api/users/:id
// Route for deleting users,
// Middlewares used:
// - tokenExtractor: validates the token and checks if the user is authenticated
// - userFinder: finds the user by id and attaches it to the request object
// - not in use at ui, mainly for testing purposes and for possible future use
router.delete(
  '/:id',
  tokenExtractor,
  userFinder,
  async (req: Request, res: Response) => {
    await req.user.destroy();
    res
      .status(200)
      .json({
        messageEn: 'User deleted!',
        messageFi: 'Käyttäjä Poistettu!',
      })
      .end();
  },
);

export default router;
