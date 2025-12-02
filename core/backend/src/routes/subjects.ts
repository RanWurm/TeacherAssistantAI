import { Router } from "express";
import { subjectsSearchHandler } from "../controllers/subjectsController";

const router = Router();

router.post("/search", subjectsSearchHandler);

export { router };
