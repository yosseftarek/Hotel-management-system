import express from "express";
import { addRoom, bookRoom, getRooms, checkRoomStatus, releaseRoom } from "./rooms.controllers.js";
const roomRouter = express.Router();

roomRouter.post('/',addRoom)
roomRouter.get('/',getRooms)
roomRouter.post('/book',bookRoom)
roomRouter.get('/:roomNumber/status',checkRoomStatus)
roomRouter.post('/release',releaseRoom)
export default roomRouter
