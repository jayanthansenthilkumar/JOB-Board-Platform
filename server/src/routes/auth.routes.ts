import { Router } from "express";
import { Role } from "@prisma/client";
import authController from "../controllers/auth.controller";

const authRouter = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     operationId: register
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password
 *               role:
 *                 type: Role
 *                 example: EMPLOYEE
 *
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         role:
 *                           type: Role
 *                           example: EMPLOYEE
 *       400:
 *         description: Bad request - Missing name, email, password or role
 *       409:
 *         description: Conflict - User already exists
 *       500:
 *         description: Internal server error
 */
authRouter.post("/register", authController.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     operationId: login
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     description: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 required: true
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         role:
 *                           type: Role
 *                           example: EMPLOYEE
 *                         createdAt:
 *                           type: Date
 *                           example: 2024-03-31T16:38:21.714Z
 *                         updatedAt:
 *                           type: Date
 *                           example: 2024-03-31T16:38:21.714Z
 *                         vacancies:
 *                           type: array of objects
 *                           example: []
 *                         applications:
 *                           type: array of objects
 *                           example: []
 *         400:
 *           description: Bad request - Missing email or password
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
authRouter.post("/login", authController.login);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     security:
 *       - bearerAuth: []
 *     tags: [Auth]
 *     operationId: logout
 *     produces:
 *       - application/json
 *     description: Logout a user
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad request - Missing refresh token
 */
authRouter.post("/logout", authController.logout);
/**
 * @swagger
 * /api/auth/refresh:
 *   get:
 *     summary: Refresh a token
 *     tags: [Auth]
 *     operationId: refresh
 *     produces:
 *       - application/json
 *     description: Refresh a token
 *     responses:
 *       200:
 *         description: OK
 */
authRouter.get("/refresh", authController.refresh);

export default authRouter;
