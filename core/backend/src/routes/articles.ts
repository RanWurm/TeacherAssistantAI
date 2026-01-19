// backend/src/routes/articles.ts
import { Router } from "express";
import { searchArticlesHandler, incrementArticleView } from "../controllers/articlesController";

const router = Router();

// POST /api/articles/search
router.post("/search", searchArticlesHandler);

// POST /api/articles/:articleId/increment-view
router.post("/:articleId/increment-view", incrementArticleView);

export { router };
