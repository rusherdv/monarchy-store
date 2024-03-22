import express from 'express'
import pool from '../config/db.js'
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router()

const client = new MercadoPagoConfig({ accessToken: process.env.MP_TOKEN });

router.post("/create_preference", async (req, res) => {

    try {
        const body = {
            items: [
                {
                    title: req.body.title,
                    unit_price: Number(req.body.price),
                    quantity: Number(req.body.quantity),
                    currency_id: "ARS"
                }
            ],
            back_urls: {
                "success": `${process.env.FRONTEND_URL}/purchase`,
                "failure": process.env.FRONTEND_URL,
                "pending": process.env.FRONTEND_URL
            },
            auto_return: "approved",
        }
        const preference = new Preference(client)
        const result = await preference.create({ body })    
        const dbResult = await pool.query(
            'INSERT INTO orders (buyer, created_at, order_id, pay_id, items, price, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [req.body.buyer, req.body.created_at, req.body.order_id, result.id, JSON.stringify(req.body.items), req.body.price, "pending"]
        );
        return res.json({ id: result.id, init_point: result.init_point})
    } catch (error) {
        console.log(error)
    }
});



export default router