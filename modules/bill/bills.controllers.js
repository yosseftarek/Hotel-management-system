import { connectToDb } from '../../db/dbConn.js';
const conn = connectToDb();

const handleError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ error: message });
};

export const addBill = (req, res) => {
  const { reservationId, taxes, discounts } = req.body;

  try {
    conn.execute(
      'SELECT totalAmount FROM Reservations WHERE reservationId = ?',
      [reservationId],
      (err, results) => {
        if (err) {
          return handleError(res, `Error fetching reservation: ${err.message}`);
        }

        const reservation = results[0];
        if (!reservation) {
          return res.status(404).json({ message: 'Reservation not found' });
        }

        const finalAmount = reservation.totalAmount + taxes - discounts;

        conn.execute(
          'INSERT INTO Bills (reservationId, amount, taxes, discounts, finalAmount) VALUES (?, ?, ?, ?, ?)',
          [reservationId, reservation.totalAmount, taxes, discounts, finalAmount],
          (err, result) => {
            if (err) {
              return handleError(res, `Error generating bill: ${err.message}`);
            }

            res.status(201).json({
              message: 'Bill generated successfully',
              finalAmount,
              billId: result.insertId, 
            });
          }
        );
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};
