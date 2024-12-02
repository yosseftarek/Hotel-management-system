import express from "express";
import { revenueReport, roomOccupancyReport } from "./reports.controllers.js";
const reportRouter = express.Router();

reportRouter.get('/occupancy',roomOccupancyReport)
reportRouter.get('/revenue',revenueReport)

export default reportRouter
