import express from "express";
import { addBill } from "./bills.controllers.js";
const billRouter = express.Router();

billRouter.post('/',addBill)

export default billRouter
