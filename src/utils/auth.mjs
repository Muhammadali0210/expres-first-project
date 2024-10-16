import { Router } from "express";
import jwt from 'jsonwebtoken';
import { checkSchema, validationResult } from 'express-validator';
import { comparePassword } from "./helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { authValidationSchema } from "./validationSchema.mjs";
const router = Router();

// JWT kaliti (sercret)
const JWT_SECRET = 'Muhammadali\'s token';

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Foydalanuvchi autentifikatsiyasi
 */


/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Foydalanuvchini tizimga kirishi
 *     description: Foydalanuvchi nikname va parolini kiritishi orqali tizimga kiradi va JWT token oladi.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: Foydalanuvchi nikname
 *               password:
 *                 type: string
 *                 description: Foydalanuvchi paroli
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirish va token olish
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: So'rovda xatolik
 *       401:
 *         description: Foydalanuvchi paroli noto'g'ri
 *       404:
 *         description: Foydalanuvchi topilmadi
 *       500:
 *         description: Server xatosi
 */
router.post(
    "/login",
    checkSchema(authValidationSchema),
    async (req, res) => {
        const result = validationResult(req);
        if(!result.isEmpty()) return res.status(400).send(result.array());
        const {
            body: {nickname, password}
        } = req;
        
        try {
            const findUser = await User.findOne({nickname});
            if(!findUser) return res.sendStatus(404);
            
            if(await !comparePassword(password, findUser.password)) return res.sendStatus(401);
            // Foydalanuvchi uchun token yaratish
            const token = jwt.sign({ id: findUser.id }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({ auth: true, token, userId: findUser.id });
        } catch (error) {
            console.log("Error during user search:", error);
            return res.sendStatus(500);
        }

    }
)

// Tokenni tekshirish uchun middleware
export function verifyToken(req, res, next) {
    const authToken = req.headers['authorization'];
    const token = authToken.split(' ')[1]; 
    // return res.send(token);
    if (!token) return res.status(403).send('No token provided.');
    
    // Tokenni tekshirish
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token.');
        
        // Foydalanuvchi ID sini token orqali olish
        req.userId = decoded.id;
        next();
    });
}

router.get('/me', verifyToken, async (req, res) => {
    const user = await User.find();
    return res.send(user);
});

/**
 * @swagger
 * /logout:
 *   post:
 *     tags: [Auth]
 *     summary: Foydalanuvchini tizimdan chiqarish
 *     description: Foydalanuvchini tizimdan chiqaradi va tokenni yo'q qiladi.
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli chiqish
 */
router.post('/logout', (req, res) => {
    res.json({ auth: false, token: null });
});

export default router;