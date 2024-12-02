import express from "express";
import { addReservation, checkIn, checkOut } from "./reservations.controllers.js";
const reservationRouter = express.Router();

reservationRouter.post('/',addReservation)
reservationRouter.post('/checkin', checkIn); 
reservationRouter.post('/checkout', checkOut); 

export default reservationRouter
