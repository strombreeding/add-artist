import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
import { originSongInfo } from "../types/rootService";

export const getSongList = async (artist: string) => {
  const pageArr = await getPages(artist);
  const arr = await croll(artist);
  const result = clusterWorker(pageArr, arr);
  return result;
  return [
    { tq: "gd", zz: "zz" },
    { tq: "gd", zz: "zz" },
    { tq: "gd", zz: "zz" },
  ];
};

export const searchSongInfo = async (id: string) => {
  const result = {
    albumPost: "",
    albumName: "",
    created: "",
    type: "",
    artist: "",
    title: "",
  };
  const html = await axios.get(`https://www.melon.com/song/detail.htm?songId=${id}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
  });
  const $ = cheerio.load(html.data);
  const gogo = $("div.wrap_info");
  const typeAndCreated = $("dl.list").children().next().next().next().text().split("장르");

  gogo.map((i, element) => {
    result.albumPost = $(element).find("div.thumb a img").attr("src");
    result.albumName = $(element).find("div.entry div.meta dl.list dd a").text();
    result.created = typeAndCreated[0];
    result.type = typeAndCreated[1].split("FLAC")[0];
    result.artist = $("div.artist a").attr("title");
    result.title = $("div.song_name")
      .text()
      .replace(/^\s+|\s+$/gm, "")
      .replace("곡명\n", "");
  });
  return result;
};
export const getPages = async (artist: string) => {
  let resultData = [];
  let pageArr = [1];
  const html = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await html.newPage();
  await page.goto(
    `https://www.melon.com/search/song/index.htm?q=${artist}&section=artist&searchGnbYn=Y&kkoSpl=N&kkoDpType=`
  );
  const contnet = await page.content();
  const $ = cheerio.load(contnet, { decodeEntities: true });
  const pageNum = $("span.page_num");
  pageNum.map((i, element) => {
    const pageText = $(element).find("a").text();
    for (let i = 0; i < pageText.length; i++) {
      // console.log(pageArr[i]);
      if (i > 4) break;
      pageArr.push(Number(pageArr[i] + 50));
    }
  });
  return pageArr;
};

export const croll = async (artist: string) => {
  console.log(artist);
  const pageArr = await getPages(artist);
  let resultData = [];
  for (let i = 0; i < pageArr.length; i++) {
    console.log(i + 1, "번째");
    const html = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await html.newPage();
    await page.goto(
      `https://www.melon.com/search/song/index.htm?q=${artist}&section=artist&searchGnbYn=Y&kkoSpl=N&kkoDpType=#params[q]=${artist}&params[sort]=date&params[section]=artist&params[sectionId]=&params[genreDir]=&params[mwkLogType]=T&po=pageObj&startIndex=${pageArr[i]}`
    );
    const contnet = await page.content();
    const $ = cheerio.load(contnet, { decodeEntities: true });
    const res = $("input.input_check");
    res.map(async (i, element) => {
      const length = resultData.length + 1;
      const title = String($(element).val());
      if (title !== "on") {
        resultData.push({
          index: length,
          id: title,
        });
      }
    });
  }
  return resultData;
};

export const writeSongInfo = async (num: number, arr: originSongInfo[]) => {
  console.log("writeSongInfo 메서드에  들어옴!");
  for (let i = num - 1; i < num + 50; i++) {
    if (i === arr.length) break;
    console.log(i + 1, "번째 실행중 ..................");
    const songInfo = await searchSongInfo(arr[i].id);
    arr[i] = { ...arr[i], ...songInfo };
  }
  return arr;
};

export const clusterWorker = async (pageArr: Array<number>, arr: originSongInfo[]) => {
  const count = pageArr.length;
  console.log("pageArr = ", pageArr);
  console.log("count = ", count);
  let resultArr = [];
  switch (count) {
    case 1:
      console.log("### ~50곡 ###");
      const a = await writeSongInfo(pageArr[0], arr);
      // resultArr.push(...a);
      break;
    case 2:
      console.log("### ~100곡 ###");
      const [b, c] = await Promise.all([writeSongInfo(pageArr[0], arr), writeSongInfo(pageArr[1], arr)]);
      // resultArr.push(...b);
      // resultArr.push(...c);
      break;
    case 3:
      console.log("### ~150곡 ###");
      const [d, e, f] = await Promise.all([
        writeSongInfo(pageArr[0], arr),
        writeSongInfo(pageArr[1], arr),
        writeSongInfo(pageArr[2], arr),
      ]);
      // resultArr.push(...d);
      // resultArr.push(...e);
      // resultArr.push(...f);

      break;
    case 4:
      console.log("### ~200곡 ###");
      const [g, h, i, j] = await Promise.all([
        writeSongInfo(pageArr[0], arr),
        writeSongInfo(pageArr[1], arr),
        writeSongInfo(pageArr[2], arr),
        writeSongInfo(pageArr[3], arr),
      ]);
      // resultArr.push(...g);
      // resultArr.push(...h);
      // resultArr.push(...i);
      // resultArr.push(...j);
      break;
    case 5:
      console.log("### ~250곡 ###");
      const [k, l, m, n, o] = await Promise.all([
        writeSongInfo(pageArr[0], arr),
        writeSongInfo(pageArr[1], arr),
        writeSongInfo(pageArr[2], arr),
        writeSongInfo(pageArr[3], arr),
        writeSongInfo(pageArr[4], arr),
      ]);
      // resultArr.push(...k);
      // resultArr.push(...l);
      // resultArr.push(...m);
      // resultArr.push(...n);
      // resultArr.push(...o);
      break;
    case 6:
      console.log("### ~300곡 ###");
      const [p, q, r, s, t, u] = await Promise.all([
        writeSongInfo(pageArr[0], arr),

        writeSongInfo(pageArr[1], arr),
        writeSongInfo(pageArr[2], arr),
        writeSongInfo(pageArr[3], arr),
        writeSongInfo(pageArr[4], arr),
        writeSongInfo(pageArr[5], arr),
      ]);
      // resultArr.push(...p);
      // resultArr.push(...q);
      // resultArr.push(...r);
      // resultArr.push(...s);
      // resultArr.push(...t);
      // resultArr.push(...u);
      break;
  }
  return arr;
};
