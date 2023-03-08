import { Song } from "../schemas/album.schema";

export const addOrUpdateSongs = async (songList: any, ownerId: any) => {
  const isSongList = await Song.findById(ownerId);
  if (!isSongList) {
    const created = await Song.create({
      songList,
      owner: ownerId,
    });
    return created;
  }
  isSongList.songList = songList;
  await Song.findByIdAndUpdate(isSongList.id, { $set: { songList } });
  return isSongList;
};
