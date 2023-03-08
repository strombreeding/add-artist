import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
import { originSongInfo } from "../types/rootService";

export const getSongList = async (artist: string) => {
  const pageArr = await getPages(artist);
  const arr = await croll(artist, pageArr);
  const result = clusterWorker(pageArr, arr);
  return result;
};
export const getArtistInfo = async (artist: string) => {
  const html = await axios.get(
    `https://www.melon.com/search/total/index.htm?q=${encodeURIComponent(
      artist
    )}&section=&searchGnbYn=Y&kkoSpl=N&kkoDpType=`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    }
  );
  const $ = cheerio.load(html.data);
  const artistImgUrl = $(`div.section_atist`).children().next().children().next().children().next().attr("src");
  return artistImgUrl;
};

export const searchSongInfo = async (id: string) => {
  const result = {
    albumPost: "",
    albumName: "",
    created: "",
    type: "",
    artist: "",
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
  });
  return result;
};
export const getPages = async (artist: string) => {
  let resultData = [];
  let pageArr = [1];
  const html = await puppeteer.launch({});
  const page = await html.newPage();
  await page.goto(
    `https://www.melon.com/search/song/index.htm?q=${encodeURIComponent(
      artist
    )}&section=artist&searchGnbYn=Y&kkoSpl=N&kkoDpType=#params%5Bq%5D=%25EC%2595%2584%25EC%259D%25B4%25EC%259C%25A0&params%5Bsort%5D=date&params%5Bsection%5D=artist&params%5BsectionId%5D=&params%5BgenreDir%5D=&params%5BmwkLogType%5D=T&po=pageObj&startIndex=1`
  );
  const contnet = await page.content();
  const $ = cheerio.load(contnet, { decodeEntities: true });
  const pageNum = $("span.page_num");
  pageNum.map((i, element) => {
    const pageText = $(element).find("a").text();
    for (let i = 0; i < pageText.length; i++) {
      if (i > 4) break;
      pageArr.push(Number(pageArr[i] + 50));
    }
  });
  return pageArr;
};

export const croll = async (artist: string, pageArr: number[]) => {
  console.log(artist, "총 페이지", pageArr);
  let resultData = [];
  const html = await puppeteer.launch({});
  const page = await html.newPage();
  for (let i = 0; i < pageArr.length; i++) {
    console.log(pageArr[i], "페이지 분석중");
    await page.goto(
      `https://www.melon.com/search/song/index.htm?q=${encodeURIComponent(
        artist
      )}&section=artist&searchGnbYn=Y&kkoSpl=N&kkoDpType=#params[q]=${encodeURIComponent(
        artist
      )}&params[sort]=date&params[section]=artist&params[sectionId]=&params[genreDir]=&params[mwkLogType]=T&po=pageObj&startIndex=${
        pageArr[i]
      }`,
      { waitUntil: "load" }
    );
    sleep(2);
    const contnet = await page.content();
    const $ = cheerio.load(contnet, { decodeEntities: true });
    const res = $("input.input_check");
    const emptyArr = [];
    res.map((i, element) => {
      const length = emptyArr.length + resultData.length + 1;
      const id = String($(element).val());
      const title = $(element).attr("title").replace(" 곡 선택", "");
      if (id !== "on") {
        emptyArr.push({
          index: length,
          id,
          title,
        });
      }
    });
    resultData.push(...emptyArr);
  }
  console.log("✅곡인덱스", resultData);
  return resultData;
};

export const writeSongInfo = async (num: number, arr: originSongInfo[]) => {
  const newObj = [];
  console.log(num, "번 실행중.....");
  for (let i = num - 1; i < num + 50; i++) {
    if (i === arr.length) break;
    const songInfo = await searchSongInfo(arr[i].id);
    arr[i] = { ...arr[i], ...songInfo };
    newObj.push(arr[i]);
  }
  console.log(num, "번 작업끝!");
  return newObj;
};

/**파라미터에 0을 주면 1~10초만큼 랜덤으로 잠 */
export const sleep = (second: number) => {
  let sleepTime = second * 1000;
  if (second === 0) {
    sleepTime = Math.round(Math.random() * 1) * 1000;
  }
  const wakeUpTime = Date.now() + sleepTime;
  console.log((wakeUpTime - Date.now()) / 1000, "초 만큼 잔다~");
  while (Date.now() < wakeUpTime) {}
  return;
};
export const clusterWorker = async (pageArr: Array<number>, arr: originSongInfo[]) => {
  const count = pageArr.length;
  console.log("몇페이지? ", count);
  let resultArr = [];
  switch (count) {
    case 1:
      console.log("### ~50곡 ###");
      const a = await writeSongInfo(pageArr[0], arr);
      resultArr.push(...a);
      break;
    case 2:
      console.log("### ~100곡 ###");
      const [b, c] = await Promise.all([writeSongInfo(pageArr[0], arr), writeSongInfo(pageArr[1], arr)]);
      resultArr.push(...b, ...c);
      break;
    case 3:
      console.log("### ~150곡 ###");
      const [d, e, f] = await Promise.all([
        writeSongInfo(pageArr[0], arr),
        writeSongInfo(pageArr[1], arr),
        writeSongInfo(pageArr[2], arr),
      ]);
      resultArr.push(...d, ...e, ...f);

      break;
    case 4:
      console.log("### ~200곡 ###");
      const [g, h, i, j] = await Promise.all([
        writeSongInfo(pageArr[0], arr),
        writeSongInfo(pageArr[1], arr),
        writeSongInfo(pageArr[2], arr),
        writeSongInfo(pageArr[3], arr),
      ]);
      resultArr.push(...g, ...h, ...i, ...j);
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
      resultArr.push(...k, ...l, ...m, ...n, ...o);
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
      resultArr.push(...p, ...q, ...r, ...s, ...t, ...u);
      break;
  }
  return resultArr;
  return;
};
