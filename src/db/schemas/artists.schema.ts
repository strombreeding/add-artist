import { model, Schema } from "mongoose";

const artistSchema = new Schema({
  artistName: { type: String, unique: true },
  artistImgUrl: { type: String },
  duckPoint: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 },
  donationMsg: [{ type: Schema.Types.ObjectId, ref: "donations" }],
  albumList: [{ type: Schema.Types.ObjectId, ref: "Song" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Artist = model("Artist", artistSchema);
