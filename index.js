import express from 'express'
import roomRouter from './modules/Room/rooms.routes.js';
import reservationRouter from './modules/Reservation/reservations.routes.js';
import customerRouter from './modules/Customer/customer.routes.js';
import billRouter from './modules/bill/bills.routes.js';
import reportRouter from './modules/Report/reports.routes.js';

const app=express()

app.use(express.json())

app.use('/rooms', roomRouter);
app.use('/reservations', reservationRouter);
app.use('/customers', customerRouter);
app.use('/bills', billRouter);
app.use('/reports', reportRouter);

app.listen(3000,()=>console.log('server is running'))