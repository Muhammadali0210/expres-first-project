import { Router } from 'express';
import { validationResult, checkSchema, matchedData } from 'express-validator';
import { createUserValidationSchema } from '../utils/validationSchema.mjs';
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from '../utils/helpers.mjs';
import { verifyToken } from '../utils/auth.mjs';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Foydalanuvchilar bilan bog'liq operatsiyalar
 */


/**
 * @swagger
 * /users:
 *   get:
 *     tags: [User]
 *     summary: Barcha foydalanuvchilarni olish
 *     description: Barcha foydalanuvchilarni qaytaradi
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli barcha foydalanuvchilar olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   age:
 *                     type: number
 *                   nickname:
 *                     type: string
 *                   password:
 *                     type: string
 */
router.get("/users", async (request, response) => {
    const users = await User.find();
    if (!users) return response.sendStatus(404);
    return response.send(users);
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags: [User]
 *     summary: ID bo'yicha foydalanuvchini olish
 *     description: ID bo'yicha bir foydalanuvchini qaytaradi
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Foydalanuvchi ID si
 *     responses:
 *       200:
 *         description: Foydalanuvchi topildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 age:
 *                   type: number
 *                 nickname:
 *                   type: string
 *                 password:
 *                   type: string
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.get("/user/:id", async (req, res) => {
    const { params: { id } } = req;
    const findUser = await User.findById(id);
    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

/**
 * @swagger
 * /user:
 *   post:
 *     tags: [User]
 *     summary: Yangi foydalanuvchi yaratish
 *     description: Yangi foydalanuvchi yaratadi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               nickname:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Yangi foydalanuvchi yaratildi
 *       400:
 *         description: Foydalanuvchi yaratishda xato
 */
router.post("/user", 
    checkSchema(createUserValidationSchema),
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) return res.status(400).send(result.array());

        const data = matchedData(req);
        data.password = await hashPassword(data.password); // Parolni xeshlash
        const newUser = new User(data);
        try {
            await newUser.save();
            return res.status(201).send(newUser);
        } catch (error) {
            console.log(error);
            res.sendStatus(400);
        }
    }
);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags: [User]
 *     summary: Foydalanuvchini yangilash
 *     description: Foydalanuvchini ID bo'yicha yangilaydi
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Foydalanuvchi ID si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               nickname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Foydalanuvchi muvaffaqiyatli yangilandi
 *       400:
 *         description: Yangilashda xato
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.put("/user/:id", async (req, res) => {
    const { body, params: { id } } = req;

    const findUser = await User.findById(id);
    if (!findUser) return res.sendStatus(404);
    
    try {
        await findUser.updateOne(body); // Yangilash
        const updatedUser = await User.findById(id); // Yangilangan foydalanuvchini qayta olish
        return res.status(200).send(updatedUser);
    } catch (error) {
        return res.status(400).send("Foydalanuvchi yangilanmadi");
    }
});

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Foydalanuvchini o'chirish
 *     description: Foydalanuvchini ID bo'yicha o'chiradi
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Foydalanuvchi ID si
 *     responses:
 *       200:
 *         description: Foydalanuvchi muvaffaqiyatli o'chirildi
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.delete("/user/:id", async (req, res) => {
    const { params: { id } } = req;

    const findUser = await User.findById(id);
    if (!findUser) return res.sendStatus(404);

    try {
        await findUser.deleteOne();
        return res.status(200).send("Foydalanuvchi o'chirildi");
    } catch (error) {
        return res.status(400).send("Foydalanuvchi o'chirilmadi");
    }
});

export default router;
