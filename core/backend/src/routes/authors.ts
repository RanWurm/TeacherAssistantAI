import { Router } from "express";
import { authorsSearchHandler } from "../controllers/authorsController";

const router = Router();

router.post("/search", authorsSearchHandler);

export { router };
