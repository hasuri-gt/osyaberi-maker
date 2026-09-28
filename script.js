let images = {};


// 画像アップロード処理

function setupUpload(id){


    document
    .getElementById(id)
    .addEventListener(
        "change",
        function(e){


            let file =
            e.target.files[0];


            if(file){

                images[id] =
                URL.createObjectURL(file);

            }


        }
    );

}



["a","i","u","e","o","n"]
.forEach(setupUpload);




// 口切替

function changeMouth(type){

    console.log("切替:", type);
    console.log("画像:", images[type]);


    if(images[type]){

        document
        .getElementById(
            "characterImage"
        )
        .src =
        images[type];

    }else{

        console.log(
            type + "の画像がありません"
        );

    }


}





function speak(){


    let text =
    document
    .getElementById(
        "textInput"
    )
    .value;



    let sounds=[];


    for(let c of text){


        let v =
        getVowel(c);


        if(v){

            sounds.push(v);

        }


    }



    play(sounds);


}





function play(list){


    let i=0;


    let timer =
    setInterval(()=>{


        if(i>=list.length){


            clearInterval(timer);


            return;

        }



        changeMouth(
            list[i]
        );


        i++;


    },150);


}





function getVowel(c){


const table={


"あ":"a",
"か":"a",
"さ":"a",
"た":"a",
"な":"a",
"は":"a",
"ま":"a",
"ら":"a",
"わ":"a",


"い":"i",
"き":"i",
"し":"i",
"ち":"i",
"に":"i",
"ひ":"i",
"み":"i",
"り":"i",


"う":"u",
"く":"u",
"す":"u",
"つ":"u",
"ぬ":"u",
"ふ":"u",
"む":"u",
"る":"u",


"え":"e",
"け":"e",
"せ":"e",
"て":"e",
"ね":"e",
"へ":"e",
"め":"e",
"れ":"e",


"お":"o",
"こ":"o",
"そ":"o",
"と":"o",
"の":"o",
"ほ":"o",
"も":"o",
"よ":"o",
"ろ":"o",


"ん":"n"


};


return table[c];

}