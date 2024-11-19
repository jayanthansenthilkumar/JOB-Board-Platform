import { Router } from "express";

import userController from "../controllers/user.controller";

const userRouter = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     operationId: getAllUsers
 *     produces:
 *       - application/json
 *     description: Get all users
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal server error
 */
userRouter.get("/", userController.getAllUsers);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user
 *     tags: [Users]
 *     operationId: getUserById
 *     produces:
 *       - application/json
 *     description: Get a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
userRouter.get("/:id", userController.getUserById);
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     operationId: createUser
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     description: Create a new user
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
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request - Missing name, email or password
 *       409:
 *         description: Conflict - User already exists
 *       500:
 *         description: Internal server error
 *
 */
userRouter.post("/", userController.createUser);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     operationId: updateUser
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     description: Update a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
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
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad request - Missing name, email or password
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
*/
userRouter.put("/:id", userController.updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     operationId: deleteUser
 *     produces:
 *       - application/json
 *     description: Delete a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error

*/
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
