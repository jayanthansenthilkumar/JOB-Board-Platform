import { Router } from "express";
import vacancyController from "../controllers/vacancy.controller";
import ensureRole from "../middleware/ensureRole";
import { Role } from "@prisma/client";

const vacancyRouter = Router();

/**
 * @swagger
 * /api/vacancies:
 *   get:
 *     summary: Get all vacancies
 *     tags: [Vacancies]
 *     operationId: getAllVacancies
 *     produces:
 *       - application/json
 *     description: Get all vacancies
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal server error
 */
vacancyRouter.get("/", vacancyController.getAllVacancies);
/**
 * @swagger
 * /api/vacancies/{id}:
 *   get:
 *     summary: Get a vacancy
 *     tags: [Vacancies]
 *     operationId: getVacancyById
 *     produces:
 *       - application/json
 *     description: Get a vacancy
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
vacancyRouter.get("/:id", vacancyController.getVacancyById);
/**
 * @swagger
 * /api/vacancies:
 *   post:
 *     summary: Create a new vacancy
 *     tags: [Vacancies]
 *     operationId: createVacancy
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     description: Create a new vacancy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               englishLevel:
 *                 type: string
 *               grade:
 *                 type: string
 *               tags:
 *                 type: array
 *               items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *               employerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
vacancyRouter.post(
  "/",
  ensureRole(Role.EMPLOYER),
  vacancyController.createVacancy
);
/**
 * @swagger
 * /api/vacancies/{id}:
 *   put:
 *     summary: Update a vacancy
 *     tags: [Vacancies]
 *     operationId: updateVacancy
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     description: Update a vacancy(ONLY EMPLOYER)
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               englishLevel:
 *                 type: string
 *               grade:
 *                 type: string
 *               tags:
 *                 type: array
 *               items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
vacancyRouter.put(
  "/:id",
  ensureRole(Role.EMPLOYER),
  vacancyController.updateVacancy
);
/**
 * @swagger
 * /api/vacancies/{id}:
 *   patch:
 *     summary: Change status of a vacancy
 *     tags: [Vacancies]
 *     operationId: changeStatusVacancy
 *     produces:
 *       - application/json
 *     description: Change status of a vacancy(ONLY EMPLOYER)
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
vacancyRouter.patch(
  "/:id",
  ensureRole(Role.EMPLOYER),
  vacancyController.changeStatusVacancy
);
/**
 * @swagger
 * /api/vacancies/{id}:
 *   delete:
 *     summary: Delete a vacancy
 *     tags: [Vacancies]
 *     operationId: deleteVacancy
 *     produces:
 *       - application/json
 *     description: Delete a vacancy(ONLY EMPLOYER)
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
vacancyRouter.delete(
  "/:id",
  ensureRole(Role.EMPLOYER),
  vacancyController.deleteVacancy
);

export default vacancyRouter;
