import { Router } from "express";
import { createProductValidationSchema } from "../utils/validationSchema.mjs";
import { query, validationResult, checkSchema, matchedData } from 'express-validator';
import { Product } from "../mongoose/schemas/products.mjs";
import { verifyToken } from "../utils/auth.mjs";
const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Mahsulotlar bilan bog'liq operatsiyalar
 */

/**
 * @swagger
 * /product:
 *   get:
 *     tags: [Product]
 *     summary: Barcha mahsulotlarni olish
 *     description: Tizimdagi barcha mahsulotlarni qaytaradi
 *     responses:
 *       200:
 *         description: Mahsulotlar muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 */
router.get("/product", async (req, res) => {
    const products = await Product.find();
    return res.send(products);
});

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     tags: [Product]
 *     summary: Mahsulotni ID bo'yicha olish
 *     description: Berilgan ID bo'yicha mahsulotni qaytaradi
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Mahsulot ID si
 *     responses:
 *       200:
 *         description: Mahsulot topildi
 *       404:
 *         description: Mahsulot topilmadi
 */
router.get("/product/:id", async (req, res) => {
    const { params: {id}} = req;

    const findProduct = await Product.findById(id);
    if(!findProduct) return res.sendStatus(404);
    return res.send(findProduct);
});

/**
 * @swagger
 * /product:
 *   post:
 *     tags: [Product]
 *     summary: Yangi mahsulot qo'shish
 *     description: Yangi mahsulot yaratadi va saqlaydi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Mahsulot muvaffaqiyatli yaratildi
 *       400:
 *         description: Xato
 */
router.post("/product", checkSchema(createProductValidationSchema), async (req, res) => {
    const result = validationResult(req);
    if(!result.isEmpty()) return res.status(400).send(result.array());
    const { body } = req;
    const newProduct = new Product(body);
    try {
        await newProduct.save();
        return res.status(201).send(newProduct);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     tags: [Product]
 *     summary: Mahsulotni yangilash
 *     description: Berilgan ID bo'yicha mahsulotni yangilaydi
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Mahsulot ID si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Mahsulot yangilandi
 *       404:
 *         description: Mahsulot topilmadi
 *       400:
 *         description: Xato
 */
router.put("/product/:id", checkSchema(createProductValidationSchema), async (req, res) => {
    const result = validationResult(req);
    if(!result.isEmpty()) return res.status(400).send(result.array());
    const { body, params: {id} } = req;
    const updatedProduct = await Product.findById(id);
    if(!updatedProduct) return res.sendStatus(404);

    try {
        await updatedProduct.updateOne(body);
        return res.send(updatedProduct);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);   
    }
});

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     tags: [Product]
 *     summary: Mahsulotni o'chirish
 *     description: Berilgan ID bo'yicha mahsulotni o'chiradi
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Mahsulot ID si
 *     responses:
 *       200:
 *         description: Mahsulot muvaffaqiyatli o'chirildi
 *       404:
 *         description: Mahsulot topilmadi
 */
router.delete("/product/:id", async (req, res) => {
    const { params: {id}} = req;
    const deletedProduct = await Product.findById(id);
    if(!deletedProduct) return res.sendStatus(404);
    try {
        await deletedProduct.deleteOne();
        return res.status(200).send("Maxsulot o'chirildi");
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});

export default router;
