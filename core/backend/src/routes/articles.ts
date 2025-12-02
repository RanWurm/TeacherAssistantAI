// backend/src/routes/articles.ts

import { Router } from "express";
import { searchArticlesHandler } from "../controllers/articlesController";

const router = Router();

// POST /api/articles/search
router.post("/search", searchArticlesHandler);

export { router };
