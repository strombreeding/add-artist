const windowWidth = $(window).width();
const form = document.getElementById("form");
const list = document.getElementById("list");
const section = document.getElementById("list");
const momForm = document.getElementById("momForm");
const spinner = document.getElementById("spinner");
const btn = document.getElementById("btn");
const main = document.getElementById("main");
const BASEURL = "http://localhost:4000";
let DB_URL = `${process.env.DB_URL}` | "";

if (sessionStorage.getItem(confirm) === 1) {
}
btn.addEventListener("click", () => {
  if (confirm("아타타 덱추가\n무분별한 검색 금지\n멜론으로부터\n기기가 차단당할 수 있습니다.")) {
    main.classList = "";
    btn.classList = "hidden";
    sessionStorage.setItem("confirm", "1");
  }
});
form.addEventListener("submit", async (e) => {
  spinner.classList = "";
  section.classList = "hidden";
  const nowTime = Date.now();
  const cooldown = Number(localStorage.getItem("cooldown"));
  if (nowTime - cooldown < 240000) {
    alert(`이전 요청 후 4분이 지나지 않았습니다.
    차단 방지를 위해 쉬어주세요!
    남은 시간 : ${Math.round((cooldown - nowTime) / 1000)}초
    `);
    throw new Error("잠시후 시도해주세요");
  }
  // 4분제한
  // localStorage.setItem("cooldown", String(Date.now() + 240000));
  const artist = document.getElementById("artist").value;
  e.preventDefault();
  momForm.replaceChildren();
  while (momForm.hasChildNodes()) {
    momForm.removeChild();
  }
  const data = {
    artist,
  };
  console.log(data);
  const response = await fetch(`${BASEURL}/artist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();
  console.log(res);

  spinner.classList = "hidden";
  // db에 저장하는버튼. 해당버튼 클릭시 res.songList 를 다주고 DB에 넣어야하므로 굉장히 빡센 작업임
  const submitInput = document.createElement("input");
  const artistInfoDiv = document.createElement("div");
  const artistInfoDivImg = document.createElement("img");
  artistInfoDivImg.src = res.artistInfo;
  artistInfoDiv.appendChild(artistInfoDivImg);
  artistInfoDivImg.classList = "artist_img";
  submitInput.type = "submit";
  submitInput.value = "덱 등록";
  const addDeckData = {
    songList: res.songList,
    artistName: artist,
    artistImgUrl: res.artistInfo,
  };
  submitInput.addEventListener("click", async () => {
    sendData(addDeckData);
  });
  momForm.appendChild(submitInput);
  momForm.appendChild(artistInfoDiv);

  const momUl = document.createElement("ul");
  const h2 = document.createElement("h2");
  h2.textContent = `${artist} 가수의 곡 목록 : ${res.songList.length} 곡`;
  momUl.appendChild(h2);
  for (let i = 0; i < res.songList.length; i++) {
    const div = document.createElement("div");
    if (windowWidth < 701) {
      div.innerHTML = `
                <div>
                    <img src="${res.songList[i].albumPost}" alt="" />
                    <span> :</span>
                    <span> : ${res.songList[i].title} :</span><br>
                    <span> : ${res.songList[i].albumName} :</span><br>
                </div>
            `;
    } else {
      div.innerHTML = `
                <div>
                    <img src="${res.songList[i].albumPost}" alt="" /><br>
                    <span>  ${res.songList[i].title} :</span><br>
                    <span> : ${res.songList[i].albumName} :</span><br>
                    <span> : ${res.songList[i].artist} :</span><br>
                    <span> : ${res.songList[i].created} :</span><br>
                    <span> : ${res.songList[i].type} :</span><br>
                </div>
            `;
    }
    momUl.appendChild(div);
  }
  momForm.appendChild(momUl);
  section.appendChild(momForm);
  section.classList = "";
});
// list.addEventListener("submit", () => {});
async function sendData(data) {
  const response = await fetch(`${BASEURL}/db`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  console.log(res);
}
