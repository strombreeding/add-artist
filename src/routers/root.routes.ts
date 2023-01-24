import express from "express";

import * as rootService from "../controllers/root.service";

export const root = express();

root.get("/", (req, res) => {
  res.render("home");
});

root.post("/artist", async (req, res, next) => {
  const { artist } = req.body;
  if (artist === undefined) {
    next(new Error("꺼져"));
    return;
  }
  try {
    const songList = await rootService.getSongList(artist);
    return res.status(200).json({
      songList,
    });
  } catch (err) {
    next(err);
  }
});
