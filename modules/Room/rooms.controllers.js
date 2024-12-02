import { connectToDb } from "../../db/dbConn.js";
const conn = connectToDb();

const handleError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ error: message });
};

export const getRooms = async (req, res) => {
  try {
    conn.execute("SELECT * FROM rooms", (err, result) => {
      if (err) {
        return handleError(res, `Database error: ${err.message}`);
      }
      res.json(result);
    });
  } catch (error) {
    handleError(res, error.message);
  }
};

export const addRoom = async (req, res) => {
  const { roomNumber, roomType, price } = req.body;
  try {
    conn.execute(
      `INSERT INTO Rooms (roomNumber, roomType, price) VALUES (?, ?, ?)`,
      [roomNumber, roomType, price],
      (err, result) => {
        if (err) {
          return handleError(res, `Database error: ${err.message}`);
        }
        res
          .status(201)
          .send({ message: "Room added successfully", roomId: result.insertId });
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};

export const bookRoom = (req, res) => {
  const { roomNumber } = req.body;

  try {
    conn.execute(
      `SELECT * FROM Rooms WHERE roomNumber = ?`,
      [roomNumber],
      (err, room) => {
        if (err) {
          return handleError(res, `Error fetching room details: ${err.message}`);
        }

        if (room.length === 0) {
          return handleError(res, "Room not found", 404);
        }

        if (!room[0].isAvailable) {
          return handleError(res, "Room is already booked", 400);
        }

        conn.execute(
          `UPDATE Rooms SET isAvailable = FALSE WHERE roomNumber = ?`,
          [roomNumber],
          (err, result) => {
            if (err) {
              return handleError(res, `Error booking room: ${err.message}`);
            }
            res.send({ message: `Room ${roomNumber} booked successfully` });
          }
        );
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};

export const checkRoomStatus = (req, res) => {
  const { roomNumber } = req.params;

  try {
    conn.execute(
      `SELECT * FROM Rooms WHERE roomNumber = ?`,
      [roomNumber],
      (err, room) => {
        if (err) {
          return handleError(res, `Error fetching room status: ${err.message}`);
        }

        if (room.length === 0) {
          return handleError(res, "Room not found", 404);
        }

        const status = room[0].isAvailable ? "Available" : "Booked";
        res.send({ roomNumber, status });
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};

export const releaseRoom = (req, res) => {
  const { roomNumber } = req.body;

  try {
    conn.execute(
      `SELECT * FROM Rooms WHERE roomNumber = ?`,
      [roomNumber],
      (err, room) => {
        if (err) {
          return handleError(res, `Error fetching room details: ${err.message}`);
        }

        if (room.length === 0) {
          return handleError(res, "Room not found", 404);
        }

        if (room[0].isAvailable) {
          return handleError(res, "Room is already available", 400);
        }

        conn.execute(
          `UPDATE Rooms SET isAvailable = TRUE WHERE roomNumber = ?`,
          [roomNumber],
          (err, result) => {
            if (err) {
              return handleError(res, `Error releasing room: ${err.message}`);
            }
            res.send({ message: `Room ${roomNumber} is now available` });
          }
        );
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};
