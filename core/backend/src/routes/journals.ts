import { Router } from "express";
import { journalsSearchHandler } from "../controllers/journalsController";

const router = Router();

router.post("/search", journalsSearchHandler);

export { router };
