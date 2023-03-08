import express from "express";

import * as rootService from "../controllers/root.service";

export const root = express();

root.get("/", (req, res) => {
  res.render("home");
});

root.post("/artist", async (req, res, next) => {
  const { artist } = req.body;
  if (artist === undefined) {
    next(new Error("아티스트 이름을 입력하세요"));
    return;
  }
  try {
    const startWork = Date.now();
    const songList = await rootService.getSongList(artist);
    const artistInfo = await rootService.getArtistInfo(artist);
    console.log("작업시간 : ", Date.now() - startWork, "ms 걸림!!");
    return res.status(200).json({
      songList,
      artistInfo,
    });
  } catch (err) {
    next(err);
  }
});
