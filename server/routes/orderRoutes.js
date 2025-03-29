const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const PDFDocument = require('pdfkit');
const path = require('path');
const QRCode = require('qrcode');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const [orders] = await pool.query(`
            SELECT o.*, t.number
            FROM orders o
            LEFT JOIN tables t ON o.table_id = t.id
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get a single order
router.get('/:id', async (req, res) => {
    try {
        const [orders] = await pool.query(`
            SELECT o.*, t.number as table_number
            FROM orders o
            LEFT JOIN tables t ON o.table_id = t.id
            WHERE o.id = ?
        `, [req.params.id]);

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const [items] = await pool.query(`
            SELECT oi.*, d.name as dish_name
            FROM order_items oi
            JOIN dishes d ON oi.dish_id = d.id
            WHERE oi.order_id = ?
        `, [req.params.id]);

        res.json({
            ...orders[0],
            items
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Create a new order
router.post('/', async (req, res) => {
    const { table_id, customer_name, order_type, items, total_amount } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    try {
        // Start transaction
        await pool.query('START TRANSACTION');

        // Insert order
        const [orderResult] = await pool.query(
            'INSERT INTO orders (table_id, customer_name, order_type, total_amount, status) VALUES (?, ?, ?, ?, ?)',
            [table_id, customer_name, order_type, total_amount, 'pending']
        );

        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of items) {
            await pool.query(
                'INSERT INTO order_items (order_id, dish_id, quantity, price, notes) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.dish_id, item.quantity, item.price, item.notes || '']
            );
        }

        // Update table status if it's a dine-in order
        if (order_type === 'dine_in' && table_id) {
            await pool.query(
            'UPDATE tables SET status = ? WHERE id = ?',
            ['occupied', table_id]
        );
        }

        await pool.query('COMMIT');
        res.status(201).json({ id: orderId, message: 'Order created successfully' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get orders by table
router.get('/table/:tableId', async (req, res) => {
    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE table_id = ? ORDER BY created_at DESC',
            [req.params.tableId]
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'completed'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// Delete an order
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
});

// Generate bill for an order
router.get('/:id/bill', async (req, res) => {
    try {
        const orderId = req.params.id;
        
        // Get order details
        const [orders] = await pool.query(`
            SELECT o.*, t.number as table_number
            FROM orders o
            LEFT JOIN tables t ON o.table_id = t.id
            WHERE o.id = ?
        `, [orderId]);
        
        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orders[0];

        // Get order items with dish details
        const [items] = await pool.query(`
            SELECT oi.*, d.name as dish_name
            FROM order_items oi
            JOIN dishes d ON oi.dish_id = d.id
            WHERE oi.order_id = ?
        `, [orderId]);

        if (items.length === 0) {
            return res.status(400).json({ error: 'Order has no items' });
        }

        // Calculate tax (10%)
        const taxRate = 0.10;
        const subtotal = parseFloat(order.total_amount);
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Create a new PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        // Pipe the PDF into the response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=bill-${order.id}.pdf`);
        doc.pipe(res);

        // Add the logo and restaurant name
        doc.fontSize(36)
           .fillColor('#FC8019')
           .text('R', { align: 'center' });

        doc.fontSize(20)
           .fillColor('#3d4152')
           .text('RaVi\'S', { align: 'center' });

        doc.fontSize(16)
           .fillColor('#686b78')
           .text('ReStAuRaNt PoS', { align: 'center' });

        doc.moveDown(1);

        // Add a line separator
        doc.strokeColor('#e8e8e8')
           .lineWidth(1)
           .moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .stroke();

        doc.moveDown(1);

        // Order Details
        doc.fontSize(12)
           .fillColor('#3d4152');

        // Left side - Order details
        const leftStart = 50;
        doc.text('Order Details:', leftStart, doc.y);
        doc.moveDown(0.5);
        doc.fontSize(10)
           .fillColor('#686b78')
           .text(`Order ID: #${order.id}`, leftStart)
           .text(`Date: ${new Date(order.created_at).toLocaleString()}`, leftStart)
           .text(`Type: ${order.order_type.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}`, leftStart);

        // Right side - Customer Information
        const rightStart = 300;
        doc.fontSize(12)
           .fillColor('#3d4152')
           .text('Customer Information:', rightStart, doc.y - 60);
        doc.moveDown(0.5);
        doc.fontSize(10)
           .fillColor('#686b78')
           .text(`Name: ${order.customer_name || 'Walk-in Customer'}`, rightStart)
           .text(`Table: ${order.table_number || 'N/A'}`, rightStart);

        doc.moveDown(2);

        // Items Table Header
        const tableTop = doc.y;
        doc.fontSize(10)
           .fillColor('#3d4152');

        // Draw table headers
        doc.font('Helvetica-Bold')
           .text('ITEM', 50, tableTop)
           .text('QTY', 300, tableTop)
           .text('PRICE', 400, tableTop)
           .text('TOTAL', 480, tableTop);

        // Add a line under headers
        doc.strokeColor('#e8e8e8')
           .lineWidth(1)
           .moveTo(50, doc.y + 5)
           .lineTo(545, doc.y + 5)
           .stroke();

        // Items
        let y = doc.y + 15;
        doc.font('Helvetica');
        
        for (const item of items) {
            const price = parseFloat(item.price);
            const itemTotal = price * item.quantity;
            doc.fillColor('#3d4152')
               .text(item.dish_name, 50, y)
               .text(item.quantity.toString(), 300, y)
               .text(`₹${price.toFixed(2)}`.replace(/\s+/g, ''), 400, y)
               .text(`₹${itemTotal.toFixed(2)}`.replace(/\s+/g, ''), 480, y);
            y += 20;
        }

        // Add a line after items
        doc.strokeColor('#e8e8e8')
           .lineWidth(1)
           .moveTo(50, y + 5)
           .lineTo(545, y + 5)
           .stroke();

        // Totals
        y += 20;
        doc.fontSize(10)
           .fillColor('#686b78')
           .text('Subtotal:', 380, y)
           .text(`₹${subtotal.toFixed(2)}`.replace(/\s+/g, ''), 480, y);

        y += 20;
        doc.text(`Tax (${(taxRate * 100).toFixed(0)}%):`, 380, y)
           .text(`₹${tax.toFixed(2)}`.replace(/\s+/g, ''), 480, y);

        y += 20;
        doc.fontSize(12)
           .fillColor('#3d4152')
           .font('Helvetica-Bold')
           .text('Total Amount:', 380, y)
           .text(`₹${total.toFixed(2)}`.replace(/\s+/g, ''), 480, y);

        // Payment section
        doc.moveDown(3);

        // Generate and place QR code in center
        const pageWidth = 545 - 50; // document width minus margins
        const qrSize = 150;
        const qrX = 50 + (pageWidth - qrSize) / 2; // Center QR code
        const qrY = doc.y + 30; // Add more space before QR code

        // Generate QR code
        const qrCodeData = await QRCode.toDataURL(`upi://pay?pa=8484843035@ybl&pn=RaViS%20Restaurant&am=${total.toFixed(2)}`);
        doc.image(qrCodeData, qrX, qrY, {
            fit: [qrSize, qrSize]
        });

        // UPI ID box centered below QR
        const boxWidth = 200;
        const boxHeight = 30;
        const boxX = 50 + (pageWidth - boxWidth) / 2;
        const boxY = qrY + qrSize + 30; // Increased spacing after QR code

        // Draw box
        doc.rect(boxX, boxY, boxWidth, boxHeight)
           .strokeColor('#FC8019')
           .lineWidth(1)
           .stroke();

        // Center UPI ID in box
        doc.fontSize(12)
           .fillColor('#3d4152')
           .text('8484843035@ybl', boxX, boxY + 8, {
               width: boxWidth,
               align: 'center'
           });

        // Payment Steps centered below box
        doc.y = boxY + boxHeight + 30; // Increased spacing before payment steps
        doc.fontSize(11)
           .fillColor('#3d4152')
           .text('Payment Steps:', { align: 'center' });

        // Calculate width for payment steps to ensure center alignment
        const stepWidth = 300; // Width for payment step text
        const stepX = 50 + (pageWidth - stepWidth) / 2; // Center position

        doc.moveDown(0.8);
        doc.fontSize(10)
           .fillColor('#686b78')
           .text('1. Scan QR code above or use UPI ID', stepX, doc.y, {
               width: stepWidth,
               align: 'center'
           })
           .moveDown(0.5)
           .text('2. Open any UPI app (PhonePe/Google Pay/BHIM)', {
               width: stepWidth,
               align: 'center'
           })
           .moveDown(0.5)
           .text(`3. Enter amount: ₹${total.toFixed(2)}`, {
               width: stepWidth,
               align: 'center'
           })
           .moveDown(0.5)
           .text('4. Complete payment', {
               width: stepWidth,
               align: 'center'
           });

        // Finalize the PDF
        doc.end();

    } catch (error) {
        console.error('Error generating bill:', error);
        res.status(500).json({ error: 'Failed to generate bill' });
    }
});

module.exports = router; 