import pool from '../config/db.js'
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

const getProducts = async (req, res) => {
    try {
        const data = await fs.readFile('./data.json', 'utf-8');
        const products = JSON.parse(data);
        res.json(products);
    } catch (error) {
        console.log(error);
    }
};

const getAllOrders = async (req,res) => {
    try {
        if (req.body.order === 'all'){
            const { loadedItems } = req.query;
            const ITEMS_PER_LOAD = 50;
            const offset = loadedItems || 0; 
            const result = await pool.query('SELECT * FROM orders OFFSET $1 LIMIT $2', [offset, ITEMS_PER_LOAD]);
    
            if (result.rows.length > 0) {
                return res.json(result.rows);
            } else {
                return res.json({ error: 'No se encontraron órdenes' });
            }
        }
    } catch (error) {
        console.error('Error en getOrders:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const getOrders = async (req, res) => {
    try {
        if (!req.body.order) {
            const { loadedItems } = req.query;
            const ITEMS_PER_LOAD = 50;
            const offset = loadedItems || 0; 
            const result = await pool.query('SELECT * FROM orders WHERE buyer = $1 OFFSET $2 LIMIT $3', [req.body.buyer, offset, ITEMS_PER_LOAD]);

            if (result.rows.length > 0) {
                return res.json(result.rows);
            } else {
                return res.json({ error: 'Orden no encontrada' });
            }
        } else {
            const orderResult = await pool.query('SELECT * FROM orders WHERE pay_id = $1', [req.body.order]);

            if (orderResult.rows.length > 0) {
                const order = orderResult.rows[0];
                if (order.status === 'pending') { 
                    await pool.query('UPDATE orders SET status = $1 WHERE pay_id = $2', ['approved', req.body.order]);
                    order.status = 'approved';

                    const validItemTypes = ['weapon', 'item', 'money'];
                    const allItemsAreValid = order.items.every(e => validItemTypes.includes(e.type));

                    if (allItemsAreValid) {

                        const code = Array.from({ length: 32 }, () => Math.random().toString(36).charAt(2).toUpperCase()).join('');
                        const codeId = Array.from({ length: 64 }, () => Math.random().toString(36).charAt(2).toUpperCase()).join('');
                        const created_at = new Date().toUTCString();
                        const validItems = order.items.filter(element => element.type !== 'drugpoints' && element.type !== 'faccion' && element.type !== 'car' && element.type !== 'house' && element.type !== 'sign' && element.type !== 'pedmenu' && element.type !== 'vip');
                        let extractedItems = [];
                    
                        validItems.forEach(item => {
                            const extractedItem = {
                                type: item.type,
                                quantity: item.quantity
                            };
                    
                            if (item.type === 'money' || item.type === 'coins') {
                                const containParts = item.contain.split('-');
                                if (containParts.length === 2 && !isNaN(containParts[1])) {
                                    extractedItem.quantity = parseInt(containParts[1]);
                                }
                            } else if (item.type === 'weapon') {
                                const containParts = item.contain.split('-');
                                if (containParts.length === 2 && !isNaN(containParts[1])) {
                                    extractedItem.item = containParts[0];
                                    extractedItem.quantity = parseInt(containParts[1]);
                                }
                            } else if (item.type === 'item') {
                                const containParts = item.contain.split('-');
                                if (containParts.length === 2 && !isNaN(containParts[1])) {
                                    extractedItem.item = containParts[0];
                                    extractedItem.quantity = parseInt(containParts[1]);
                                }
                            } else if (item.type === 'weapon-kit') {
                                const containParts = item.contain.split('$');
                                const weapons = [];
                    
                                for (let i = 0; i < containParts.length; i++) {
                                    const parts = containParts[i].split('-');
                    
                                    if (parts.length === 2 && !isNaN(parts[1])) {
                                        const weaponItem = {
                                            type: 'weapon',
                                            item: parts[0].trim(),
                                            quantity: parseInt(parts[1].trim())
                                        };
                    
                                        weapons.push(weaponItem);
                                    }
                                }
                    
                                weapons.forEach(weapon => {
                                    const extractedWeaponItem = {
                                        type: 'weapon',
                                        item: weapon.weapon,
                                        quantity: weapon.quantity
                                    };
                    
                                    extractedItems.push(extractedWeaponItem);
                                });
                                return
                            }
                    
                            extractedItems.push(extractedItem);
                        });

                        const items = {
                            code: code,
                            codeId: codeId,
                            created_at: created_at,
                            order_id: order.order_id,
                            items: extractedItems
                        };

                        createCode(items.code, items.codeId, items.created_at, items.items, order.order_id)
                    }
                    await pool.query('DELETE FROM orders WHERE order_id = $1 AND status = $2', [order.order_id, 'pending']);
                }
                const result = await pool.query('SELECT * FROM code WHERE order_id = $1', [orderResult.rows[0].order_id]);

                if (result.rows.length > 0) {
                    return res.json({order:order, code:result.rows[0].code});
                } else {
                    return res.json({order:order, code:null});
                }
            } else {
                return res.status(404).json({ error: 'Orden no encontrada' });
            }
        }
    } catch (error) {
        console.error('Error en getOrders:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const createCode = async (code, codeId, created_at, items, orderId) => {

    try {
        const dbResult = await pool.query(
            'INSERT INTO code (code, code_id, created_at, items, order_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [code, codeId, created_at, JSON.stringify(items), orderId]
        );
        console.log(dbResult)
    } catch (error) {
        console.log(error)
    }

}

const generateCode = async (req, res) => {
    const { order_id, items } = req.body;

    try {
        const code = Array.from({ length: 32 }, () => Math.random().toString(36).charAt(2).toUpperCase()).join('');
        const codeId = Array.from({ length: 64 }, () => Math.random().toString(36).charAt(2).toUpperCase()).join('');
        const created_at = new Date().toUTCString();
        let extractedItems = [];
    
        items.forEach(item => {
            const extractedItem = {
                type: item.type,
                quantity: item.quantity
            };
    
            if (item.type === 'money' || item.type === 'coins') {
                const containParts = item.contain.split('-');
                if (containParts.length === 2 && !isNaN(containParts[1])) {
                    extractedItem.quantity = parseInt(containParts[1]);
                }
            } else if (item.type === 'weapon') {
                const containParts = item.contain.split('-');
                if (containParts.length === 2 && !isNaN(containParts[1])) {
                    extractedItem.item = containParts[0];
                    extractedItem.quantity = parseInt(containParts[1]);
                }
            } else if (item.type === 'item') {
                const containParts = item.contain.split('-');
                if (containParts.length === 2 && !isNaN(containParts[1])) {
                    extractedItem.item = containParts[0];
                    extractedItem.quantity = parseInt(containParts[1]);
                }
            } else if (item.type === 'weapon-kit') {
                const containParts = item.contain.split('$');
                const weapons = [];
    
                for (let i = 0; i < containParts.length; i++) {
                    const parts = containParts[i].split('-');
    
                    if (parts.length === 2 && !isNaN(parts[1])) {
                        const weaponItem = {
                            type: 'weapon',
                            weapon: parts[0].trim(),
                            quantity: parseInt(parts[1].trim())
                        };
    
                        weapons.push(weaponItem);
                    }
                }
    
                weapons.forEach(weapon => {
                    const extractedWeaponItem = {
                        type: 'weapon',
                        weapon: weapon.weapon,
                        quantity: weapon.quantity
                    };
    
                    extractedItems.push(extractedWeaponItem);
                });
                return
            }
    
            extractedItems.push(extractedItem);
        });
    
        const itemsFinal = {
            code: code,
            codeId: codeId,
            created_at: created_at,
            order_id: order_id,
            items: extractedItems
        };
    
        try {
            const dbResult = await pool.query(
                'INSERT INTO code (code, code_id, created_at, items, order_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [itemsFinal.code, itemsFinal.codeId, itemsFinal.created_at, JSON.stringify(itemsFinal.items), itemsFinal.order_id]
            );
            if (dbResult) {
                res.status(200).json({ code: itemsFinal.code });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } catch (error) {
        console.log(error)
    }
};

const exchangeCode = async (req, res) => {

    try {
        const result = await pool.query('SELECT * FROM code WHERE code = $1', [req.body.code]);
        if (result.rows.length > 0) {
            const items = result.rows[0].items;
            const orderId = result.rows[0].order_id
            await pool.query('DELETE FROM code WHERE order_id = $1', [orderId]);
            return res.json({ data: items });
        } else {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
    } catch (error) {
        console.log(error)
    }

}

const editProduct = async (req, res) => {
    try {
        const { id } = req.body.product;
        const data = await fs.readFile('./data.json', 'utf-8');
        const jsonData = JSON.parse(data);
        const products = jsonData.products;
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
          products[index] = req.body.product;
          await fs.writeFile('./data.json', JSON.stringify(jsonData, null, 2), 'utf-8');
          res.json({ success: true, message: 'Producto actualizado correctamente' });
        } else {
          res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const createProduct = async (req,res) => {
    try {
        const newProduct = req.body.product;
        const data = await fs.readFile('./data.json', 'utf-8');
        const jsonData = JSON.parse(data);
        const products = jsonData.products;
        const newProductId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        newProduct.id = newProductId;
        products.push(newProduct);
        await fs.writeFile('./data.json', JSON.stringify(jsonData, null, 2), 'utf-8');
        res.status(200).json({ success: true, message: 'Producto creado correctamente' });
    } catch (error) {
        console.log(error)
    }
    
}

const deleteProduct = async (req,res) => {
    try {
        const { id } = req.body.product;
        const data = await fs.readFile('./data.json', 'utf-8');
        const jsonData = JSON.parse(data);
        const products = jsonData.products;
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            await fs.writeFile('./data.json', JSON.stringify(jsonData, null, 2), 'utf-8');          
            res.status(200).json({ success: true, message: 'Producto eliminado correctamente' });
        } else {
          res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export {
    getProducts, 
    getOrders,
    exchangeCode,
    createCode,
    editProduct,
    createProduct,
    deleteProduct,
    generateCode,
    getAllOrders
}