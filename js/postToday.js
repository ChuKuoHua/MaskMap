const today = document.querySelector('.todayDate'),
      week = document.querySelector('.week'),
      Ann = document.querySelector('.Ann');

/** 顯示當天日期 */
function date(){
    let date = new Date();
    let Y = date.getFullYear();
    let M = date.getMonth() + 1;
    let D = date.getDate();
    
    today.innerHTML =`
    <span class="date"> 
    ${Y}年${getM(M)}月${getD(D)}日</span>`;

    //顯示日期
    let W = date.getDay();
    let day = ['日', '一', '二', '三', '四', '五', '六'];

    week.innerHTML = `星期${day[W]}`;
    if(W === 0){
        Ann.innerHTML= `
        <p>今天<span class="id_num">不限</span><p>
        <p><span class="id_num">身份證字號</span>皆可以購買!</p>`;
    }else if(W % 2 === 0){
        Ann.innerHTML= `
        <p>今天身分證<span class="f_b">最後一碼</span>為</p>
        <p><span class="id_num">2、4、6、8、0</span>的人可以購買!</p>`;
    }else{
        Ann.innerHTML= `
        <p>今天身分證<span class="f_b">最後一碼</span>為</p>
        <p><span class="id_num">1、3、5、7、9</span>的人可以購買!</p>`;
    }
}

/* 
 * -----------------
 * 判斷日期月份
 * 日期月份小於 10 前面補 0 
 * -----------------
 */
function getM(month){
    
    if((month + 1) < 10){
        return '0'+ month;
    }else{
        return '' + month;
    }
};

function getD(Dnum){
    if(Dnum < 10){
        return '0'+ Dnum;
    }else{
        return '' + Dnum;
    }
};

date();