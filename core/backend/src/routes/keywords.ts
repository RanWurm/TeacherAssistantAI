import { Router } from "express";
import { keywordsSearchHandler } from "../controllers/keywordsController";

const router = Router();

router.post("/search", keywordsSearchHandler);

export { router };
