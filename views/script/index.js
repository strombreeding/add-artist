const windowWidth = $(window).width();
const form = document.getElementById("form");
const list = document.getElementById("list");
const section = document.getElementById("list");
const momForm = document.getElementById("momForm");
const spinner = document.getElementById("spinner");
const btn = document.getElementById("btn");
const main = document.getElementById("main");
// const ko = /([^가-힣\x20])/i;
// const int = /[^0-9]/g;
// const en = /[^a-z]/g;
// const regex = new RegExp(/([^가-힣\x20])/i);
// artist.addEventListener("submit", () => {});
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

  const artist = document.getElementById("artist").value;
  e.preventDefault();
  momForm.replaceChildren();
  const data = {
    artist,
  };
  console.log(data);
  const response = await fetch(`http://localhost:4000/artist`, {
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
  submitInput.type = "submit";
  submitInput.value = "덱 등록";
  momForm.appendChild(submitInput);

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

albumPost: string;
albumName: string;
created: string;
type: string;
artist: string;
title: string;
