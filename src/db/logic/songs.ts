import { Song } from "../schemas/album.schema";

export const addOrUpdateSongs = async (songList: any, ownerId: any) => {
  const isSongList = await Song.findById(ownerId);
  if (!isSongList) {
    await Song.create({
      songList,
      owner: ownerId,
    });
    return true;
  }
  return true;
};
