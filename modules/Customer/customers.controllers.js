import { connectToDb } from "../../db/dbConn.js";
const conn = connectToDb();

const handleError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ error: message });
};

export const addCustomer = (req, res) => {
  const { name, contactInfo, paymentMethod } = req.body;

  try {
    conn.execute(
      `INSERT INTO Customers (name, contactInfo, paymentMethod) VALUES (?, ?, ?)`,
      [name, contactInfo, paymentMethod],
      (err, result) => {
        if (err) {
          return handleError(res, `Error adding customer: ${err.message}`);
        }
        res.status(201).json({
          message: "Customer added successfully",
          customerId: result.insertId,
        });
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};

export const searchCustomer = (req, res) => {
  const { name } = req.body;

  try {
    conn.execute(
      `SELECT * FROM Customers WHERE name = ?`,
      [name],
      (err, result) => {
        if (err) {
          return handleError(res, `Error searching customer: ${err.message}`);
        }
        if (result.length === 0) {
          return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ result });
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};

export const updateCustomer = (req, res) => {
  const { customerId, name, contactInfo, paymentMethod } = req.body;

  try {
    conn.execute(
      `UPDATE Customers SET name = ?, contactInfo = ?, paymentMethod = ? WHERE customerId = ?`,
      [name, contactInfo, paymentMethod, customerId],
      (err, result) => {
        if (err) {
          return handleError(res, `Error updating customer: ${err.message}`);
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({
          message: "Customer updated successfully",
          customerId: customerId,
        });
      }
    );
  } catch (error) {
    handleError(res, error.message);
  }
};
