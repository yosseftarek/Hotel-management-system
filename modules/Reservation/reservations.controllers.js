import { connectToDb } from "../../db/dbConn.js";
const conn = connectToDb();

const handleError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ error: message });
};

export const addReservation = (req, res) => {
  const { customerId, roomId, startDate, endDate } = req.body;

  try {
    conn.execute(
      "SELECT * FROM customers WHERE customerId = ?",
      [customerId],
      (err, result) => {
        if (err) {
          return handleError(res, `Error verifying customer: ${err.message}`);
        }

        if (result.length === 0) {
          return handleError(res, "Customer does not exist", 404);
        }

        conn.execute(
          "SELECT * FROM Rooms WHERE roomId = ? AND isAvailable = TRUE",
          [roomId],
          (err, results) => {
            if (err) {
              return handleError(res, `Error checking room availability: ${err.message}`);
            }

            if (results.length === 0) {
              return handleError(res, "Room not available", 400);
            }

            const room = results[0];
            const totalAmount =
              ((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) *
              room.price;

            conn.execute(
              "INSERT INTO Reservations (customerId, roomId, startDate, endDate, totalAmount) VALUES (?, ?, ?, ?, ?)",
              [customerId, roomId, startDate, endDate, totalAmount],
              (err,reservationResults) => {
                if (err) {
                  return handleError(res, `Error creating reservation: ${err.message}`);
                }

                conn.execute(
                  "UPDATE Rooms SET isAvailable = FALSE WHERE roomId = ?",
                  [roomId],
                  (err) => {
                    if (err) {
                      return handleError(res, `Error updating room status: ${err.message}`);
                    }

                    res.status(201).json({ message: "Reservation confirmed" ,reservationId: reservationResults.insertId});
                  }
                );
              }
            );
          }
        );
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};

export const checkIn = (req, res) => {
  const { reservationId } = req.body;

  try {
    conn.execute(
      "UPDATE Reservations SET checkedIn = TRUE WHERE reservationId = ?",
      [reservationId],
      (err, result) => {
        if (err) {
          return handleError(res, `Error during check-in: ${err.message}`);
        }

        if (result.affectedRows === 0) {
          return handleError(res, "Reservation not found", 404);
        }

        res.status(200).json({ message: "Check-in successful" });
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};

export const checkOut = (req, res) => {
  const { reservationId } = req.body;

  try {
    conn.execute(
      "UPDATE Reservations SET checkOutDate = NOW() WHERE reservationId = ?",
      [reservationId],
      (err, result) => {
        if (err) {
          return handleError(res, `Error during check-out: ${err.message}`);
        }

        if (result.affectedRows === 0) {
          return handleError(res, "Reservation not found", 404);
        }

        conn.execute(
          "UPDATE Rooms SET isAvailable = TRUE WHERE roomId = (SELECT roomId FROM Reservations WHERE reservationId = ?)",
          [reservationId],
          (err) => {
            if (err) {
              return handleError(res, `Error updating room status: ${err.message}`);
            }

            res.status(200).json({
              message: "Check-out successful, room is now available",
            });
          }
        );
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};
