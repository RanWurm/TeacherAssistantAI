// routes/filters.ts
import { Router } from "express";
import {
  getSubjectsHandler,
  getAuthorsHandler,
  getKeywordsHandler,
} from "../controllers/filters";

const router = Router();

router.get("/subjects", getSubjectsHandler);
router.get("/authors", getAuthorsHandler);
router.get("/keywords", getKeywordsHandler);

export { router };

