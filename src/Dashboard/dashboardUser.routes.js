import { Router } from "express";
import {  getDashboardStats, getUpcomingGames, getRecentActivity, getTopLeagues } from "./dashboardUser.controller.js";

const router = Router();

router.get("/upcoming", getUpcomingGames);
router.get("/stats", getDashboardStats);
router.get("/activity", getRecentActivity);
router.get("/top-leagues", getTopLeagues);

export default router;