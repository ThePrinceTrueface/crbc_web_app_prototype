import express from "express"
import homeRouter from "./home.router.js";

const router = new express.Router()

router.use("/", homeRouter)

export default router;