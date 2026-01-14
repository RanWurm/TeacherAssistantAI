import { Router } from "express";
import { sourcesSearchHandler } from "../controllers/sourcesController";

const router = Router();

router.post("/search", sourcesSearchHandler);

export { router };