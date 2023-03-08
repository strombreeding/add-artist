import { Artist } from "../schemas/artists.schema";

type createArtistInfo = {
  artistName: string;
  artistImgUrl: string;
};
export const addOrUpdateArtist = async (createData: createArtistInfo, songInfo?: any) => {
  const isArtist = await Artist.findOne({ artistName: createData.artistName });
  if (!isArtist) {
    console.log(isArtist, "없따 만든다");
    await Artist.create({ ...createData });
    const newArtist = await Artist.findOne({ artistName: createData.artistName });
    console.log((await newArtist).id, "새로만든것");
    return newArtist;
  }
  const newArtist = await Artist.findOne({ artistName: createData.artistName });
  console.log("들어가나?", songInfo);
  if (songInfo) {
    newArtist.albumList.push(songInfo);
    await Artist.findByIdAndUpdate(newArtist.id, { $set: { ...newArtist } });
  }

  return newArtist;
};
