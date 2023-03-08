import { model, Schema } from "mongoose";

const songSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "Artist" },
  songList: [
    {
      index: Number,
      title: String,
      albumName: String,
      albumImgUrl: String,
      since: {
        year: Number,
        month: Number,
        date: Number,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Song = model("Song", songSchema);
