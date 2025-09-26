const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Validierungs-Wrapper für Routen
 */
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Benutzerverwaltung
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registriert einen neuen Benutzer
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: maxmustermann
 *               email:
 *                 type: string
 *                 example: max@example.com
 *               password:
 *                 type: string
 *                 example: geheim123
 *     responses:
 *       201:
 *         description: User erfolgreich registriert
 *       400:
 *         description: Ungültige Eingaben
 */
router.post(
  '/register',
  validate([
    body('username').notEmpty().withMessage('Username ist Pflicht'),
    body('email').isEmail().withMessage('Ungültige Email'),
    body('password').isLength({ min: 6 }).withMessage('Passwort zu kurz'),
  ]),
  registerUser
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Benutzer-Login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: max@example.com
 *               password:
 *                 type: string
 *                 example: geheim123
 *     responses:
 *       200:
 *         description: Erfolgreiches Login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Ungültige Zugangsdaten
 */
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Ungültige Email'),
    body('password').notEmpty().withMessage('Passwort ist Pflicht'),
  ]),
  loginUser
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Gibt das Profil des eingeloggten Benutzers zurück
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profildaten
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Nicht autorisiert
 */
router.get('/profile', protect, getUserProfile);

/**
 * @swagger
 * /api/users/update-profile:
 *   put:
 *     summary: Aktualisiert das Profil des eingeloggten Benutzers
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: neuername
 *               email:
 *                 type: string
 *                 example: neue.email@example.com
 *     responses:
 *       200:
 *         description: Profil aktualisiert
 *       400:
 *         description: Ungültige Eingaben
 *       401:
 *         description: Nicht autorisiert
 */
router.put(
  '/update-profile',
  protect,
  validate([
    body('email').optional().isEmail().withMessage('Ungültige Email'),
    body('username').optional().notEmpty().withMessage('Username darf nicht leer sein'),
  ]),
  updateUserProfile
);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Ändert das Passwort des eingeloggten Benutzers
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Passwort wurde geändert
 *       400:
 *         description: Ungültige Eingaben
 *       401:
 *         description: Nicht autorisiert / Falsches Passwort
 */
router.put(
  '/change-password',
  protect,
  validate([
    body('oldPassword').notEmpty().withMessage('Altes Passwort ist Pflicht'),
    body('newPassword').isLength({ min: 6 }).withMessage('Neues Passwort zu kurz'),
  ]),
  changePassword
);

module.exports = router;
