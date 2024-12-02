import express from "express";
import { addCustomer, searchCustomer, updateCustomer } from "./customers.controllers.js";
const customerRouter = express.Router();

customerRouter.post('/',addCustomer)
customerRouter.get('/',searchCustomer)
customerRouter.put('/update',updateCustomer)

export default customerRouter
