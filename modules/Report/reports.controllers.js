import { connectToDb } from "../../db/dbConn.js";

const conn = connectToDb();

// Helper function for error handling
const handleError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ error: message });
};

// Room Occupancy Report
export const roomOccupancyReport = (req, res) => {
  try {
    conn.execute(
      "SELECT COUNT(*) AS occupiedRooms FROM Reservations",
      [],
      (err, result) => {
        if (err) {
          return handleError(res, `Error fetching room occupancy report: ${err.message}`);
        }
        res.status(200).json(result[0]);
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};

// Revenue Report with Daily, Weekly, or Monthly Summaries
export const revenueReport = (req, res) => {
  try {
    const { period } = req.query;
    let startDate, endDate;

    if (period === "daily") {
      startDate = endDate = new Date().toISOString().split("T")[0];
    } else if (period === "weekly") {
      const now = new Date();
      startDate = new Date(now.setDate(now.getDate() - 7))
        .toISOString()
        .split("T")[0];
      endDate = new Date().toISOString().split("T")[0];
    } else if (period === "monthly") {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      endDate = new Date().toISOString().split("T")[0];
    } else {
      ({ startDate, endDate } = req.query); // Fallback to user-defined range
    }

    conn.execute(
      `
          SELECT SUM(finalAmount) AS totalRevenue 
          FROM Bills 
          WHERE EXISTS (
              SELECT 1 
              FROM Reservations r
              WHERE Bills.reservationId = r.reservationId 
              AND r.startDate >= ? AND r.endDate <= ?
          )
        `,
      [startDate, endDate],
      (err, result) => {
        if (err) {
          return handleError(res, `Error fetching revenue report: ${err.message}`);
        }
        res.status(200).json(result[0]);
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};

// Customer Statistics Report
export const customerStatistics = (req, res) => {
  try {
    conn.execute(
      `
          SELECT COUNT(DISTINCT customerId) AS uniqueCustomers,
                 COUNT(*) AS totalReservations,
                 AVG(DATEDIFF(endDate, startDate)) AS averageStayDuration
          FROM Reservations
        `,
      [],
      (err, result) => {
        if (err) {
          return handleError(res, `Error fetching customer statistics: ${err.message}`);
        }
        res.status(200).json(result[0]);
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};

// Reservation Summary Report with Period Handling
export const reservationSummary = (req, res) => {
  try {
    const { period } = req.query;
    let startDate, endDate;

    if (period === "daily") {
      startDate = endDate = new Date().toISOString().split("T")[0];
    } else if (period === "weekly") {
      const now = new Date();
      startDate = new Date(now.setDate(now.getDate() - 7))
        .toISOString()
        .split("T")[0];
      endDate = new Date().toISOString().split("T")[0];
    } else if (period === "monthly") {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      endDate = new Date().toISOString().split("T")[0];
    } else {
      ({ startDate, endDate } = req.query); // Fallback to user-defined range
    }

    conn.execute(
      `
          SELECT COUNT(*) AS totalReservations, 
                 COUNT(DISTINCT customerId) AS uniqueCustomers
          FROM Reservations
          WHERE startDate >= ? AND endDate <= ?
        `,
      [startDate, endDate],
      (err, result) => {
        if (err) {
          return handleError(res, `Error fetching reservation summary: ${err.message}`);
        }
        res.status(200).json(result[0]);
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};
