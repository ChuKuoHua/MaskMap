//地圖中心點
let map = L.map('map', {
    center: [22.998186,120.2100493],
    zoom: 16
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
//建立Marker顏色
let greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let blueIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let orangeIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let greyIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let markers = new L.MarkerClusterGroup().addTo(map);

/**
 * ----------------
 * 偵測使用者定位，設定使用者位置
 * ----------------
 */
navigator.geolocation.getCurrentPosition(CurrentlyPosition);
function CurrentlyPosition(position) {
    let my_Lat = position.coords.latitude;
    let my_Long = position.coords.longitude;
    map.setView(new L.LatLng(my_Lat, my_Long), 15);
    L.marker([my_Lat, my_Long], {icon: redIcon}).addTo(map)
    .bindPopup(`目前所在位置`).openPopup();
}

/**
 * -----
 * 處理口罩資料
 * -----
 */
const County = document.getElementById('county'),
    Village = document.getElementById('village'),
    load = document.querySelector('.loader'),
    maskTitle = document.getElementById('mask_title'),
    maskData = document.querySelector('.maskData'),
    maskfilter = document.getElementById('maskfilter'),
    maskSearch = document.getElementById('maskSearch'),
    main = document.querySelector('.main');

/** 透過AJAX取得城市資料 */
let CountyData = '';
function getCountydata(){
    const Countyxhr = new XMLHttpRequest();
    Countyxhr.open('get','https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/AllData.json',true);
    Countyxhr.send(null);
    Countyxhr.addEventListener('load',function(){
        if (Countyxhr.status == 200) {           
            CountyData = JSON.parse(Countyxhr.responseText); 
            countySelect();
        }else {
            alert('資料讀取錯誤');
        }
    })
}
/** 選單縣市 */
function countySelect(){
    let cOptions = '',
        ct = '',
        vt = '',        
        CountyLn = CountyData.length; 
    ct +=`<option >請選擇縣市</option>`;
    vt +=`<option >請選擇區域</option>`;
    for(let i = 0 ; i<CountyLn ; i++){
        let allCountyName = CountyData[i].CityName;
        cOptions +=`<option value="${allCountyName}">${allCountyName}</option>`;
    }
    County.innerHTML = ct + cOptions;
    Village.innerHTML = vt ;
}

County.addEventListener('change',county_str,false);
function county_str(e){
    let c_str = e.target.value;
    let c_num = e.target.selectedIndex;
    villageSelect(c_str,c_num);
}

/** 選單區域 */
function villageSelect(c_str,c_num){
    let vOptions = '',
        vt = '',
        c_n = c_num-1; 
    if(c_str == '請選擇縣市'){
        vOptions +=`<option >請選擇區域</option>`;
        maskTitle.innerHTML = `尚有0間店家`;
        maskData.innerHTML = '';
    }else {
        let villageLn = CountyData[c_n].AreaList.length;
        vt += `<option >請選擇區域</option>`;
        for(let j=0 ; j < villageLn; j++){
            let allvillageName = CountyData[c_n].AreaList[j].AreaName;
            vOptions += `<option value="${allvillageName}">${allvillageName}</option>`;
        }
        vOptions = vt + vOptions
    }
    village.innerHTML = vOptions;
    
    village.addEventListener('change',village_str,false);
    function village_str(e){
        document.getElementById('search_Data').value = '';
        searchList = '';
        let v_str = e.target.value;
        getMaskData(c_str,v_str);
        maskfilter.className ='maskfilter filterOpen';
        maskSearch.className ='maskfilter filterClose';
    }
}

/** 透過AJAX取得口罩資料 */
let getData;
function mask_Data(){
    const mask_xhr = new XMLHttpRequest();
    mask_xhr.open('get','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR17R1VInHOUDbahpcbn9XA4Q7o-CTIScJS-6uEZVWT0Wpnf_ictj5YDZ-w',true);
    mask_xhr.send(null);
    mask_xhr.addEventListener('load',function(){
        load.style.display = 'none';
        main.className = 'main blur';
        if (mask_xhr.status == 200) {           
            getData= JSON.parse(mask_xhr.responseText); 
            for(let c =0; getData.features.length > c; c++){
                let maskColor;
                pharmacy = getData.features[c].properties.name;
                phone = getData.features[c].properties.phone;
                add = getData.features[c].properties.address;
                mask_adult = getData.features[c].properties.mask_adult;
                mask_child = getData.features[c].properties.mask_child;
                coordinates1 = getData.features[c].geometry.coordinates[1];
                coordinates2 = getData.features[c].geometry.coordinates[0];

                //改變地圖口罩數量之區塊顏色
                if(mask_adult != 0 && mask_child != 0){
                    adultColor = 'map-adultBox';
                    childColor = 'map-childBox';
                }else if(mask_adult === 0 && mask_child === 0){
                    adultColor = 'map-zero';
                    childColor = 'map-zero';
                }else if(mask_adult === 0){
                    adultColor = 'map-zero';
                    childColor = 'map-childBox';
                }else if(mask_child === 0){
                    adultColor = 'map-adultBox';
                    childColor = 'map-zero';
                }
                //改變Marker顏色
                if(mask_adult === 0 && mask_child === 0){
                    maskColor = greyIcon;
                }else if(mask_adult === 0){
                    maskColor = orangeIcon;
                }else if(mask_child === 0){
                    maskColor = blueIcon;
                }else{
                    maskColor = greenIcon;
                }
                
                //地圖藥局資料顯示
                markers.addLayer(L.marker([coordinates1,coordinates2],
                {icon: maskColor}).bindPopup(`
                    <h1>${pharmacy}</h1>
                    <p>
                        <i class="fas fa-phone-alt"></i>
                        <span class="inf">${phone}</span>
                    </p>
                    <p>
                        <i class="fas fa-map-marked-alt"></i>
                        <span class="inf">${add}</span>
                    </p>
                    <hr>
                    <div class="map-maskNumBox">
                        <div class="${adultColor}">
                            <p>成人 ${mask_adult}</p>
                        </div>
                        <div class="${childColor}">
                            <p>兒童 ${mask_child}</p>
                        </div>
                    </div>
                `));
            }
            map.addLayer(markers);
        }else{
            maskData.innerHTML=`<p class="error">無取得資料</p>`;
        }
    })
}

function getMaskData(countyName,villageName){
    let cv = countyName + villageName;
    let cv_keyword = '';
    //判斷所輸入的台、臺，無論輸入哪個都會替換成臺(台)
    if(cv){
        if (cv.indexOf('臺') >= 0) {
            cv_keyword = cv.replace('臺', '台');
        }else if(cv.indexOf('台') >= 0){
            cv_keyword = cv.replace('台', '臺');
        }
    }
    let cv_keywords = [cv,cv_keyword];
    updateMaskData(cv_keywords);
}

/** 
 * ----
 * 搜尋功能 
 * ----
 * */
const searchBox = document.querySelector('.searchBox');
const search = document.getElementById('search');
searchBox.addEventListener('keyup',enterData,false);
search.addEventListener('click',searchData,false);

//使用者如果點擊 Enter 鍵，執行 search.click() 撈資料
function enterData(e){
    if(e.keyCode === 13){
        e.preventDefault(); 
        search.click();        
    }
}

let searchList = [];
function searchData(){    
    let searchStr = document.getElementById('search_Data').value;
    let searchNum = 0,
        str = '',
        adultColor='',
        childColor='';
        search.click();
    
    const newlist = [].concat(...getData.features);
    const searchResult = newlist.filter(function (value){
        if(value.properties.address.indexOf(searchStr) !== -1 || value.properties.name.indexOf(searchStr) !== -1){
            return searchStr 
        }else{
            return false
        }
    })
    //點擊搜尋顯示過濾按鈕
    maskfilter.className ='maskfilter filterClose';
    maskSearch.className ='maskfilter filterOpen';
    //取消過濾按鈕點擊效果
    let btnObj = maskSearch.children;
    for (let i = 0; i < btnObj.length; i++) {
        btnObj[i].classList.remove('active');
    }

    const result = [].concat(...searchResult);
    for(let s = 0; s < searchResult.length; s++){
        county = searchResult[s].properties.county;
        pharmacy = searchResult[s].properties.name;
        add = searchResult[s].properties.address;
        phone = searchResult[s].properties.phone;
        note = searchResult[s].properties.note;
        town = searchResult[s].properties.town;
        mask_adult = searchResult[s].properties.mask_adult;
        mask_child = searchResult[s].properties.mask_child;
        updatetime = searchResult[s].properties.updated;
        
        //判斷口罩數量，如果是0就改變顏色
        if(mask_adult != 0 && mask_child != 0){
            adultColor = 'adultbg';
            childColor = 'childbg';
        }else if(mask_adult === 0 && mask_child === 0){
            adultColor = 'zero';
            childColor = 'zero';
        }else if(mask_adult === 0){
            adultColor = 'zero';
            childColor = 'childbg';
        }else if(mask_child === 0){
            adultColor = 'adultbg';
            childColor = 'zero';
        }
        str += `
        <li>
            <h3>
                <a class="mapPosition" onclick="event.preventDefault();changeMapCenter(this)" index="${s}">
                    ${pharmacy}
                </a>
            </h3>
            <span class="time">${updatetime}</span>
            <i class="fas fa-map-marked-alt"></i>
            <a class="addMap inf" title="連結至google地圖" href="https://www.google.com/maps/place/${add}" target="_blank">${add}</a>
            <hr>
            <p>
                <i class="fas fa-phone-alt"></i>
                <span class="inf">${phone}</span>
            </p>
            <hr>
            <p class="note">
                <i class="fas fa-scroll"></i>
                <span class="inf">${note}<span>
            </p>
            <div class="adult ${adultColor}">
                <i class="fas fa-male" title="成人"></i>
                成人
                <span>${mask_adult}</span>
            </div>
            <div class="child ${childColor}">
                <i class="fas fa-child" title="兒童"></i>
                兒童
                <span>${mask_child}</span>
            </div>
        </li>`
        searchNum++;
    }    
    searchList = result;
    maskTitle.innerHTML = `尚有${searchNum}間店家`;
    maskData.innerHTML = str;

    //搜尋功能取得資料後，以第一筆資料為地圖的中心點
    let search_lat = searchList[0].geometry.coordinates[1],
        search_long = searchList[0].geometry.coordinates[0];
    map.setView(new L.LatLng(search_lat, search_long), 26);

    //選單初始化
    countySelect();

    /** 根據所選擇的條件，進行口罩篩選  */  
    let searchAllBtn = document.getElementById('SearchAllMask'),
        searchAdultBtn = document.getElementById('SearchAdultMask'),
        searhChildBtn = document.getElementById('SearchChildMask');

    searchAllBtn.addEventListener('click',searchAllMask,false);
    searchAdultBtn.addEventListener('click',searchAdultMask,false);
    searhChildBtn.addEventListener('click',searchChildMask,false);
    //篩選所有口罩
    function searchAllMask() {
        searchList.sort(function(a,b){
            //計算全部口罩數量，把資料從多到少排列
            let totalb = b.properties.mask_adult + b.properties.mask_child;
            let totala = a.properties.mask_adult + a.properties.mask_child;
            return totalb - totala
        })
        let btnObj = maskSearch.children;
        for (let i = 0; i < btnObj.length; i++) {
            btnObj[i].classList.remove('active');
        }
        this.className = 'maskBtn active';
        searchDataUpdate('all', searchList);
    }
    //篩選成人口罩
    function searchAdultMask() {
        //計算成人口罩數量，把資料從多到少排列
        searchList.sort(function(a,b){
            return b.properties.mask_adult - a.properties.mask_adult
        })
        let btnObj = maskSearch.children;
        for (let i = 0; i < btnObj.length; i++) {
            btnObj[i].classList.remove('active');
        }
        this.className = 'maskBtn active';
        searchDataUpdate('adult', searchList);
    }
    //篩選兒童口罩
    function searchChildMask() {
        //計算兒童口罩數量，把資料從多到少排列
        searchList.sort(function(a,b){
            return b.properties.mask_child - a.properties.mask_child
        })
        let btnObj = maskSearch.children;
        for (let i = 0; i < btnObj.length; i++) {
            btnObj[i].classList.remove('active');
        }
        this.className = 'maskBtn active';
        searchDataUpdate('child', searchList);
    }
    function searchDataUpdate(searchValue,searchData){
        let maskNum = 0,
            str = '',
            condition = 0;
        for(let i = 0; i<searchData.length; i++){
            pharmacy = searchData[i].properties.name;
            add = searchData[i].properties.address;
            phone = searchData[i].properties.phone;
            note = searchData[i].properties.note;
            mask_adult = searchData[i].properties.mask_adult;
            mask_child = searchData[i].properties.mask_child;
            updatetime = searchData[i].properties.updated;
            //判斷口罩數量，如果是0就改變顏色
            if(mask_adult != 0 && mask_child != 0){
                adultColor = 'adultbg';
                childColor = 'childbg';
            }else if(mask_adult === 0 && mask_child === 0){
                adultColor = 'zero';
                childColor = 'zero';
            }else if(mask_adult === 0){
                adultColor = 'zero';
                childColor = 'childbg';
            }else if(mask_child === 0){
                adultColor = 'adultbg';
                childColor = 'zero';
            }
            switch(searchValue){
                case 'adult':
                    if(searchData[i].properties.mask_adult !== 0){
                        condition++;
                        maskNum++;
                    }
                    break;
                case 'child':
                    
                    if(searchData[i].properties.mask_child !== 0){
                        condition++;
                        maskNum++;
                    }
                    break;
                default:
                    if(searchData[i].properties.mask_adult !== 0 || searchData[i].properties.mask_child !== 0 ){
                        maskNum++;
                    }
                    condition++;
            }
            if(condition > 0){
                str += `
                <li>
                    <h3>
                        <a class="mapPosition" onclick="event.preventDefault();changeMapCenter(this)" index="${i}">
                            ${pharmacy}
                        </a>
                    </h3>
                    <span class='time'>${updatetime}</span>
                    <i class="fas fa-map-marked-alt"></i>
                    <a class="addMap inf" title="連結至google地圖" href="https://www.google.com/maps/place/${add}" target="_blank">${add}</a>
                    <hr>
                    <p>
                        <i class="fas fa-phone-alt"></i>
                        <span class="inf">${phone}</span>
                    </p>
                    <hr>
                    <p class="note">
                        <i class="fas fa-scroll"></i>
                        <span class="inf">${note}<span>
                    </p>
                    <div class="adult ${adultColor}">
                        <i class="fas fa-male" title="成人"></i>
                        成人
                        <span>${mask_adult}</span>
                    </div>
                    <div class="child ${childColor}">
                        <i class="fas fa-child" title="兒童"></i>
                        兒童
                        <span>${mask_child}</span>
                    </div>
                </li>`
            }
        }
        maskTitle.innerHTML = `尚有庫存店家 共 ${maskNum} 筆`;
        maskData.innerHTML = str;
    }
}

/** 
 * 針對搜尋功能取得的資料
 * 點選左側之藥局名稱
 * 移動地圖中心點，至該藥局位置
 */
function changeMapCenter(str){
    let map_lat,
        map_long,
        index = str.getAttribute('index');
    
    pharmacy = searchList[index].properties.name;
    phone = searchList[index].properties.phone;
    add = searchList[index].properties.address;
    mask_adult = searchList[index].properties.mask_adult;
    mask_child = searchList[index].properties.mask_child;
    map_lat = searchList[index].geometry.coordinates[1];
    map_long = searchList[index].geometry.coordinates[0];

    //改變地圖口罩數量之區塊顏色
    if(mask_adult !== 0 && mask_child !== 0){
        adultColor = 'map-adultBox';
        childColor = 'map-childBox';
    }else if(mask_adult === 0 && mask_child === 0){
        adultColor = 'map-zero';
        childColor = 'map-zero';
    }else if(mask_adult === 0){
        adultColor = 'map-zero';
        childColor = 'map-childBox';
    }else if(mask_child === 0){
        adultColor = 'map-adultBox';
        childColor = 'map-zero';
    }
    //改變Marker顏色
    if(mask_adult === 0 && mask_child === 0){
        maskColor = greyIcon;
    }else if(mask_adult === 0){
        maskColor = orangeIcon;
    }else if(mask_child === 0){
        maskColor = blueIcon;
    }else{
        maskColor = greenIcon;
    }

    //點選藥局後，地圖移置中心點並顯示該藥局資訊
    L.marker([map_lat, map_long], {icon: maskColor}).addTo(map)
    .bindPopup(`
        <h1>${pharmacy}</h1>
        <p>
            <i class="fas fa-phone-alt"></i>
            <span class="inf">${phone}</span>
        </p>
        <p>
            <i class="fas fa-map-marked-alt"></i>
            <span class="inf">${add}</span>
        </p>
        <hr>
        <div class="map-maskNumBox">
            <div class="${adultColor}">
                <p>成人 ${mask_adult}</p>
            </div>
            <div class="${childColor}">
                <p>兒童 ${mask_child}</p>
            </div>
        </div>
    `).openPopup();
    map.setView(new L.LatLng(map_lat,map_long), 26, {animate: true});
}

/** 
 * ---------------
 * 選擇下拉式選單資料，顯示地區資料
 * ---------------
 */
let addDataArr = [];
function updateMaskData(cv_keywords){
    let storeNum = 0 ,
        str = '',
        adultColor='',
        childColor='',
        result_str = [];

    //取消過濾按鈕點擊效果
    let btnObj = maskfilter.children;
    for (let i = 0; i < btnObj.length; i++) {
        btnObj[i].classList.remove('active');
    }

    //利用關鍵字篩選數據，由result取得結果
    cv_keywords.forEach(function (v,i){
        result_str[i] = getData.features.filter(function (value){
            if(value.properties.address.indexOf(v) !== -1){
                return v
            }else{
                return false
            }
        })
    });

    let result = result_str[0].concat(result_str[1]);
    for(let m = 0; m < result.length; m++){
        county = result[m].properties.county;
        pharmacy = result[m].properties.name;
        add = result[m].properties.address;
        phone = result[m].properties.phone;
        note = result[m].properties.note;
        town = result[m].properties.town;
        mask_adult = result[m].properties.mask_adult;
        mask_child = result[m].properties.mask_child;
        updatetime = result[m].properties.updated;

        //判斷口罩數量，如果是0就改變顏色
        if(mask_adult != 0 && mask_child != 0){
            adultColor = 'adultbg';
            childColor = 'childbg';
        }else if(mask_adult === 0 && mask_child === 0){
            adultColor = 'zero';
            childColor = 'zero';
        }else if(mask_adult === 0){
            adultColor = 'zero';
            childColor = 'childbg';
        }else if(mask_child === 0){
            adultColor = 'adultbg';
            childColor = 'zero';
        }
        str += `
        <li>
            <h3>
                <a class="mapPosition" onclick="event.preventDefault();selectMapCenter(this)" index="${m}">
                    ${pharmacy}
                </a>
            </h3>
            <span class='time'>${updatetime}</span>
            <i class="fas fa-map-marked-alt"></i>
            <a class="addMap inf" title="連結至google地圖" href="https://www.google.com/maps/place/${add}" target="_blank">${add}</a>
            <hr>
            <p>
                <i class="fas fa-phone-alt"></i>
                <span class="inf">${phone}</span>
            </p>
            <hr>
            <p class="note">
                <i class="fas fa-scroll"></i>
                <span class="inf">${note}<span>
            </p>
            <div class="adult ${adultColor}">
                <i class="fas fa-male" title="成人"></i>
                成人
                <span>${mask_adult}</span>
            </div>
            <div class="child ${childColor}">
                <i class="fas fa-child" title="兒童"></i>
                兒童
                <span>${mask_child}</span>
            </div>
        </li>`
        storeNum++;
    }
    addDataArr = result;
    maskTitle.innerHTML = `尚有${storeNum}間店家`;
    maskData.innerHTML = str;

    //下拉式選單取得地區後，以第一筆資料為地圖的中心點
    let select_lat = addDataArr[0].geometry.coordinates[1],
        select_long = addDataArr[0].geometry.coordinates[0];

    map.setView(new L.LatLng(select_lat, select_long), 26);

    /** 根據所選擇的條件，進行口罩篩選  */
    let filterAlldBtn = document.getElementById('allMask'),
        filterAdultBtn = document.getElementById('adultMask'),
        filterChildBtn = document.getElementById('childMask');

    filterAlldBtn.addEventListener('click',filterAllMask,false);
    filterAdultBtn.addEventListener('click',filterAdultMask,false);
    filterChildBtn.addEventListener('click',filterChildMask,false);

    //篩選所有口罩
    function filterAllMask() {
        addDataArr.sort(function(a,b){
        //計算全部口罩數量，把資料從多到少排列
        let totalb = b.properties.mask_adult + b.properties.mask_child;
        let totala = a.properties.mask_adult + a.properties.mask_child;
        return totalb - totala
    })
    let btnObj = maskfilter.children;
    for (let i = 0; i < btnObj.length; i++) {
        btnObj[i].classList.remove('active');
    }
    this.className = 'maskBtn active';
    filterDataUpdate('all', addDataArr);
    }
    //篩選成人口罩
    function filterAdultMask() {
        //計算成人口罩數量，把資料從多到少排列
        addDataArr.sort(function(a,b){
            return b.properties.mask_adult - a.properties.mask_adult
        })
        let btnObj = maskfilter.children;
        for (let i = 0; i < btnObj.length; i++) {
            btnObj[i].classList.remove('active');
        }
    this.className = 'maskBtn active';
    filterDataUpdate('adult', addDataArr);
    }
    //篩選兒童口罩
    function filterChildMask() {
    //計算兒童口罩數量，把資料從多到少排列
        addDataArr.sort(function(a,b){
            return b.properties.mask_child - a.properties.mask_child
        })
        let btnObj = maskfilter.children;
        for (let i = 0; i < btnObj.length; i++) {
            btnObj[i].classList.remove('active');
        }
    this.className = 'maskBtn active';
    filterDataUpdate('child', addDataArr);
    }
    function filterDataUpdate(filterValue,UpdateData){
        let maskNum = 0,
            str = '',
            condition = 0;
        for(let i = 0; i<UpdateData.length; i++){
            pharmacy = UpdateData[i].properties.name;
            add = UpdateData[i].properties.address;
            phone = UpdateData[i].properties.phone;
            note = UpdateData[i].properties.note;
            mask_adult = UpdateData[i].properties.mask_adult;
            mask_child = UpdateData[i].properties.mask_child;
            updatetime = UpdateData[i].properties.updated;
            //判斷口罩數量，如果是0就改變顏色
            if(mask_adult != 0 && mask_child != 0){
                adultColor = 'adultbg';
                childColor = 'childbg';
            }else if(mask_adult === 0 && mask_child === 0){
                adultColor = 'zero';
                childColor = 'zero';
            }else if(mask_adult === 0){
                adultColor = 'zero';
                childColor = 'childbg';
            }else if(mask_child === 0){
                adultColor = 'adultbg';
                childColor = 'zero';
            }
            switch(filterValue){
                case 'adult':
                    if(UpdateData[i].properties.mask_adult !== 0){
                        condition++;
                        maskNum++;
                    }
                    break;
                case 'child':
                    
                    if(UpdateData[i].properties.mask_child !== 0){
                        condition++;
                        maskNum++;
                    }
                    break;
                default:
                    if(UpdateData[i].properties.mask_adult !== 0 || UpdateData[i].properties.mask_child !== 0 ){
                        maskNum++;
                    }
                    condition++;
            }
            if(condition > 0){
                str += `
                <li>
                    <h3>
                        <a class="mapPosition" onclick="event.preventDefault();selectMapCenter(this)" index="${i}">
                            ${pharmacy}
                        </a>
                    </h3>
                    <span class='time'>${updatetime}</span>
                    <i class="fas fa-map-marked-alt"></i>
                    <a class="addMap inf" title="連結至google地圖" href="https://www.google.com/maps/place/${add}" target="_blank">${add}</a>
                    <hr>
                    <p>
                        <i class="fas fa-phone-alt"></i>
                        <span class="inf">${phone}</span>
                    </p>
                    <hr>
                    <p class="note">
                        <i class="fas fa-scroll"></i>
                        <span class="inf">${note}<span>
                    </p>
                    <div class="adult ${adultColor}">
                        <i class="fas fa-male" title="成人"></i>
                        成人
                        <span>${mask_adult}</span>
                    </div>
                    <div class="child ${childColor}">
                        <i class="fas fa-child" title="兒童"></i>
                        兒童
                        <span>${mask_child}</span>
                    </div>
                </li>`
            }
        }
    maskTitle.innerHTML = `尚有庫存店家 共 ${maskNum} 筆`;
    maskData.innerHTML = str;
    }
}

/** 
 * 針對下拉式選單取得的資料
 * 點選左側之藥局名稱
 * 移動地圖中心點，至該藥局位置
 */
function selectMapCenter(str){
    let select_map_lat,
        select_map_long,
        index = str.getAttribute('index');

    pharmacy = addDataArr[index].properties.name;
    phone = addDataArr[index].properties.phone;
    add = addDataArr[index].properties.address;
    mask_adult = addDataArr[index].properties.mask_adult;
    mask_child = addDataArr[index].properties.mask_child;
    select_map_lat = addDataArr[index].geometry.coordinates[1];
    select_map_long = addDataArr[index].geometry.coordinates[0];

    //改變地圖口罩數量之區塊顏色
    if(mask_adult !== 0 && mask_child !== 0){
        adultColor = 'map-adultBox';
        childColor = 'map-childBox';
    }else if(mask_adult === 0 && mask_child === 0){
        adultColor = 'map-zero';
        childColor = 'map-zero';
    }else if(mask_adult === 0){
        adultColor = 'map-zero';
        childColor = 'map-childBox';
    }else if(mask_child === 0){
        adultColor = 'map-adultBox';
        childColor = 'map-zero';
    }
    //改變Marker顏色
    if(mask_adult === 0 && mask_child === 0){
        maskColor = greyIcon;
    }else if(mask_adult === 0){
        maskColor = orangeIcon;
    }else if(mask_child === 0){
        maskColor = blueIcon;
    }else{
        maskColor = greenIcon;
    }
    
    //點選藥局後，地圖移置中心點並顯示該藥局資訊
    L.marker([select_map_lat, select_map_long], {icon: maskColor}).addTo(map)
    .bindPopup(`
        <h1>${pharmacy}</h1>
        <p>
            <i class="fas fa-phone-alt"></i>
            <span class="inf">${phone}</span>
        </p>
        <p>
            <i class="fas fa-map-marked-alt"></i>
            <span class="inf">${add}</span>
        </p>
        <hr>
        <div class="map-maskNumBox">
            <div class="${adultColor}">
                <p>成人 ${mask_adult}</p>
            </div>
            <div class="${childColor}">
                <p>兒童 ${mask_child}</p>
            </div>
        </div>
    `).openPopup();
    map.setView(new L.LatLng(select_map_lat,select_map_long),26, {animate: true});
}

//啟動程式
function state(){
    getCountydata();
    mask_Data();
    countySelect();
}
state();

