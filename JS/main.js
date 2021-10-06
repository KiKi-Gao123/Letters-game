/* 默认音乐不播放*/
var isPlay = false;
/*定义画布,画板 */
var gameCanvas, gameContext;
/*定义宽度,高度*/
var cW = 724,
    cH = 433;
/*存储数组*/
var letters = [];
/*定义分数为:0 */
var score = 0;
/*定义变量 */
var mp3;

window.onload = function() {
    //得到画布
    gameCanvas = document.getElementById("gameCanvas");
    //得到画布中的画笔
    gameContext = gameCanvas.getContext("2d");

    mp3 = document.getElementById("mp3");
}


function playMusic(obj) {
    var bgmp3 = document.getElementById("bgmp3");

    if (isPlay) {
        bgmp3.pause();
        isPlay = false;
        obj.innerHTML = "音乐:关";
    } else {
        bgmp3.play();
        isPlay = true;
        obj.innerHTML = "音乐:开";
    }
}

//描述字母:构造函数(首字母大写)  相当于java类
function Letter() {

    this.w = 59; //宽度
    this.h = 77; //高度

    //横坐标随机 且不能超出画布范围
    this.x = Math.random() * cW - this.w;
    if (this.x < 0)
        this.x = 0;

    //纵坐标是负数
    this.y = this.h * -1; //纵坐标
    //加速度
    this.yval = 1; //加速下降


    //随机生成字母  ceil向上取整
    var num = Math.ceil(Math.random() * 52); //1--52

    //编码  a-97,A-65
    this.keyCode = num + 64;


    //根据字母得到字母对应的图片
    this.img = getImage("img/letter_" + num + ".png");

    //改变字母纵坐标 功能:函数
    this.updateFrame = function() {
        this.y += this.yval; //在原来纵坐标的基础上增加加速度
    }

    //画字母 功能:函数
    this.drawLetter = function() {
        gameContext.drawImage(this.img, this.x, this.y, this.w, this.h);
    }


}


//获取图片封装成一个函数
function getImage(obj) {
    var img = new Image();
    img.src = obj;
    return img;
}


//开始游戏
function gameStart() {
    //显示画布
    gameCanvas.style.display = "block";

    //创建字母,让这个函数被多次执行,间隔一秒创建一个字母
    setInterval("createLetter()", 1000);

    //不断把字母数组中的字母画在画布上
    setInterval("gameTick()", 10);

    //消除字母 按键事件
    onkeydown = keyAndDown;
}

//创建字母
function createLetter() {
    var letter = new Letter(); //创建了一个字母
    letters.push(letter); //存储字母到数组
}


//把字母数组中的字母画在画布上
function gameTick() {

    //清空画布
    gameContext.clearRect(0, 0, cW, cH);
    //画
    for (var i = 0; i < letters.length; i++) {
        var lett = letters[i];
        lett.updateFrame();
        lett.drawLetter();

        if (lett.y > cH) {
            letters.splice(i, 1);
        }
    }
}

//按键事件
function keyAndDown(e) {
    //得到用户所按键的字母
    var ev = e || window.event();
    //ev.keyCode;
    for (var i = 0; i < letters.length; i++) {
        var lett = letters[i];
        if (lett.keyCode == ev.keyCode || lett.keyCode - ev.keyCode == 26) {
            //分数
            score += 13;

            numImage(score);
            //分数分割
            letters.splice(i, 1);
            if (isPlay) {
                mp3.src = "img/bloser.mp3";
                mp3.play();
            }
            break;
        }
    }
    if (isPlay) {
        mp3.play();
    }
}

//
function numImage(score) {
    var arrnum = [0, -15, -30, -45, -60, -75, -90, -105, -120, -135];
    var str_num = "";

    var s_num = String(score); //
    for (var i = 0; i < s_num.length; i++) {
        var item = Number(s_num[i]);
        var point = arrnum[item];

        str_num += '<div class="num_01" style="background-position-x:' + point + 'px"></div>';
    }
    var fengshu = document.getElementById("score");
    fengshu.style.width = 15 * s_num.length + "px";
    fengshu.innerHTML = str_num;

}