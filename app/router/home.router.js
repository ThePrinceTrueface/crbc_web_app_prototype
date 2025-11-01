import express from "express";
import { getHomePage, getAboutPage, getContactPage, getServicePage } from "../controller/home.controller.js";

const homeRouter = express.Router();

homeRouter.get("/", getHomePage);
homeRouter.get("/about", getAboutPage);
homeRouter.get("/contact", getContactPage);
homeRouter.get("/services", getServicePage);

export default homeRouter;
