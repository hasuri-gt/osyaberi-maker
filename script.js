console.log("JavaScript読み込み成功");

let images = {};
let playing = false;
let stopFlag = false;
let loopMode = false;

// =====================
// 画像登録
// =====================
function setupUpload(id){

    document
    .getElementById(id)
    .addEventListener("change", function(e){

        let file = e.target.files[0];

        if(file){

            images[id] =
            URL.createObjectURL(file);

            console.log(id + " 登録完了");

        }

    });

}

setupUpload("a");
setupUpload("i");
setupUpload("u");
setupUpload("e");
setupUpload("o");
setupUpload("n");

// =====================
// 口画像切替
// =====================
function changeMouth(type){

    console.log("口:", type);

    if(images[type]){
        document
        .getElementById("characterImage")
        .src = images[type];
    }

}

// =====================
// セリフ開始
// =====================
function speak(){

    if(playing){
        return;
    }

    let text =
    document
    .getElementById("textInput")
    .value;

    let timeline = [];

    let i = 0;
    while(i < text.length){

        // まず2文字を見る
        let two =
        text[i] + text[i+1];

        let mouths =
        getVowel(two);

        // 2文字発音があった場合
        if(mouths.length){

            timeline.push({
                char:two,
                mouths:mouths
            });

            i += 2;

        }else{

            // 通常1文字
            let one =
            text[i];

            mouths =
            getVowel(one);

            if(mouths.length){
                timeline.push({
                    char:one,
                    mouths:mouths
                });

            }

            i++;

        }

    }

    loopMode =
    document
    .getElementById("loopCheck")
    .checked;

    playing=true;
    stopFlag=false;

    document
    .getElementById("speakButton")
    .disabled=true;

    document
    .getElementById("stopButton")
    .disabled=false;

    createSubtitle(timeline);
    playLipSync(timeline);

}

// =====================
// 口パク再生
// =====================
function playLipSync(timeline){

    let charIndex = 0;
    let mouthIndex = 0;

    function next(){

        // 停止
        if(stopFlag){
            finishPlay();
            return;
        }

        // 全文終了
        if(charIndex >= timeline.length){

            changeMouth("n");

            if(loopMode){

                setTimeout(()=>{

                    charIndex = 0;
                    mouthIndex = 0;
                    next();

                },1000);

            }else{
                finishPlay();
            }

            return;

        }

        let current = timeline[charIndex];

        // 字幕更新
        updateSubtitle(charIndex);

        // 現在の口
        let mouth =
        current.mouths[mouthIndex];

        if(mouth=="hold"){
            mouthIndex++;
            if(mouthIndex >= current.mouths.length){
                charIndex++;
                mouthIndex=0;
            }

            setTimeout(
                next,
                100
            );
            return;
        }

        changeMouth(mouth);

        // =====================
        // 表示時間計算
        // =====================
        let defspeed = 200;
        let speed = defspeed;

        // 1文字内で複数口の場合
        if(current.mouths.length > 1){

            // 最初の口だけ短くする
            if(mouthIndex === 0){
                speed = 50;
            }else{
                // 残り時間
                speed = 200 - 50;
            }

        }

        mouthIndex++;

        // 次の口へ
        if(mouthIndex >= current.mouths.length){
            charIndex++;
            mouthIndex = 0;
        }

        setTimeout(
            next,
            speed
        );

    }

    next();

}

// =====================
// 停止
// =====================
function stopLipSync(){
    stopFlag=true;
}

// =====================
// 終了処理
// =====================
function finishPlay(){

    playing=false;
    stopFlag=false;

    changeMouth("n");

    document
    .getElementById("currentText")
    .innerText="";

    document
    .getElementById("speakButton")
    .disabled=false;


    document
    .getElementById("stopButton")
    .disabled=true;

}

// =====================
// 日本語 → 口モーション
// =====================
function getVowel(c){

    const table={

    "あ":["a"],
    "か":["a"],
    "さ":["i","a"],
    "た":["n","a"],
    "な":["n","a"],
    "は":["a"],
    "ま":["n","a"],
    "や":["a"],
    "ら":["a"],
    "わ":["u","a"],

    "が":["a"],
    "ざ":["i","a"],
    "だ":["e","a"],
    "ば":["n","a"],
    "ぱ":["n","a"],

    "い":["i"],
    "き":["i"],
    "し":["i"],
    "ち":["i"],
    "に":["i"],
    "ひ":["i"],
    "み":["n","i"],
    "り":["i"],

    "ぎ":["i"],
    "じ":["i"],
    "ぢ":["i"],
    "び":["n","i"],
    "ぴ":["n","i"],

    "う":["u"],
    "く":["u"],
    "す":["u"],
    "つ":["u"],
    "ぬ":["u"],
    "ふ":["u"],
    "む":["n","u"],
    "ゆ":["u"],
    "る":["u"],

    "ぐ":["u"],
    "ず":["u"],
    "づ":["u"],
    "ぶ":["n","u"],
    "ぷ":["n","u"],

    "え":["e"],
    "け":["e"],
    "せ":["i","e"],
    "て":["i","e"],
    "ね":["i","e"],
    "へ":["e"],
    "め":["n","e"],
    "れ":["e"],

    "げ":["e"],
    "ぜ":["i","e"],
    "で":["i","e"],
    "べ":["n","e"],
    "ぺ":["n","e"],

    "お":["o"],
    "こ":["u","o"],
    "そ":["u","o"],
    "と":["u","o"],
    "の":["u","o"],
    "ほ":["o"],
    "も":["n","o"],
    "よ":["o"],
    "ろ":["o"],
    "を":["o"],

    "ご":["o"],
    "ぞ":["u","o"],
    "ど":["u","o"],
    "ぼ":["n","o"],
    "ぽ":["n","o"],

    "ん":["n"],

    "きゃ":["i","a"],
    "きゅ":["u"],
    "きょ":["u","o"],
    "しゃ":["i","a"],
    "しゅ":["u"],
    "しょ":["u","o"],
    "ちゃ":["i","a"],
    "ちゅ":["u"],
    "ちょ":["u","o"],
    "にゃ":["i","a"],
    "にゅ":["u"],
    "にょ":["u","o"],
    "ひゃ":["i","a"],
    "ひゅ":["u"],
    "ひょ":["u","o"],
    "みゃ":["i","a"],
    "みゅ":["u"],
    "みょ":["u","o"],
    "りゃ":["i","a"],
    "りゅ":["u"],
    "りょ":["o"],

    "ぎゃ":["i","a"],
    "ぎゅ":["u"],
    "ぎょ":["u","o"],
    "じゃ":["i","a"],
    "じゅ":["u"],
    "じょ":["u","o"],
    "びゃ":["i","a"],
    "びゅ":["u"],
    "びょ":["u","o"],
    "ぴゃ":["i","a"],
    "ぴゅ":["u"],
    "ぴょ":["u","o"],

    "っ":["hold"],
    "ー":["hold"],
    "、":["hold"]

    };

    return table[c] || [];

}

function createSubtitle(timeline){

    let html="";

    timeline.forEach((item,index)=>{
        html +=
        `<span id="char${index}">
        ${item.char}
        </span>`;
    });

    document
    .getElementById("currentText")
    .innerHTML=html;

}

function updateSubtitle(index){

    let spans =
    document.querySelectorAll(
        "#currentText span"
    );

    spans.forEach((span,i)=>{

        if(i===index){
            span.classList.add(
                "active"
            );
        }else{
            span.classList.remove(
                "active"
            );
        }

    });

}
