var heightIpt = document.querySelector("#heightIpt");
var weightIpt = document.querySelector("#weightIpt");
var calcBtn = document.querySelector("#calcBtn");
var calcResult = document.querySelector("#calcResult");
var refreshBtn = document.querySelector("#refreshBtn");
var calculate = document.getElementById("calculate");
var circular = document.getElementById("circular");
var recordData = JSON.parse(localStorage.getItem('recordSet')) || [];
var recordSet = document.querySelector("#records");

calcBtn.addEventListener('click', calcBMI, false);
refreshBtn.addEventListener("click", resetResult, false);
recordSet.addEventListener("click", delRecord, false);

// 計算使用者的BMI值
function calcBMI() {
	var height = heightIpt.value;
	var weight = weightIpt.value;
	var spaceReg = /\s/g.test(height) || /\s/g.test(weight);
	var BMI;
	var lineBar = "";
	var status = "";
	var time = "";

	// 確認填入的值是否異常
	if (height == "" || weight == "") {
		alert("必須填入值");
		return;
	} else if(spaceReg == true) {
		alert("值不能為空白"); 
		return;
	} else if(isNaN(height) || isNaN(weight)){
		alert("值必須為數字"); 
		return;
	} else if(height < 40 || height > 300 || weight < 20 || weight > 500) {
		alert("數值異常");
	} else {
		console.log("checked success!");
	}

	height = parseFloat(heightIpt.value);
	weight = parseFloat(weightIpt.value);
	
	// 計算BMI
	BMI = (weight / Math.pow((height / 100), 2)).toFixed(2);		
	console.log(BMI);	

	// 變更計算按鈕的顯示
	calculate.classList.add("hide");
	circular.classList.remove("hide");

	calcResult.textContent = BMI;
	
	if (BMI < 18.5) {		
		circular.style.borderColor = "#86D73F";
		circular.style.color = "#86D73F";
		refreshBtn.style.backgroundColor = "#86D73F";
		lineBar = "green";
		status = "過輕";
	} else if(18.5 <= BMI &&  BMI < 24) {		
		circular.style.borderColor = "#31BAF9";
		circular.style.color = "#31BAF9";
		refreshBtn.style.backgroundColor = "#31BAF9";
		lineBar = "blue";
		status = "正常";
	} else if(24 <= BMI && BMI < 27) {
		circular.style.borderColor = "#e69405";
		circular.style.color = "#e69405";
		refreshBtn.style.backgroundColor = "#e69405";
		lineBar = "light-orange";
		status = "稍重";
	} else if(27 <= BMI && BMI < 30) {		
		circular.style.borderColor = "#e66a05";
		circular.style.color = "#e66a05";
		refreshBtn.style.backgroundColor = "#e66a05";
		lineBar = "deep-orange";
		status = "輕度肥胖";
	} else if(30 <= BMI && BMI < 35) {		
		circular.style.borderColor = "#c32402";
		circular.style.color = "#c32402";
		refreshBtn.style.backgroundColor = "#c32402";
		lineBar = "light-red";
		status = "中度肥胖";
	} else if(BMI >= 35) {		
		circular.style.borderColor = "#961e05";
		circular.style.color = "#961e05";
		refreshBtn.style.backgroundColor = "#961e05";
		lineBar = "deep-red";
		status = "重度肥胖";
	}

	// 取得時間
	var nowTime = new Date();
	var MM = (nowTime.getMonth() + 1);
    var DD = nowTime.getDate();
    var YY = nowTime.getFullYear();
    var hours = nowTime.getHours();
    var min = nowTime.getMinutes();
    var sec = nowTime.getSeconds();
    
    time = YY + '-' + MM + '-' + DD + ' ' + hours + ':' + min + ':' + sec;

	// record 物件	
	var recordSet = {
		"lineBar": lineBar,
		"status": status,
		"bmi": BMI,
		"height": height,
		"weight": weight,
		"time": time
	}

	recordData.push(recordSet);	

	// 畫面更新record紀錄
	update(recordData);

	// 資料存入 localStorage
	localStorage.setItem("recordSet", JSON.stringify(recordData));
}

// 重置填入值的按鈕
function resetResult() {
	// 重置計算按鈕
	calculate.classList.remove("hide");
	circular.classList.add("hide");

	// 重置顯示BMI值
	calcResult.textContent = "00.00";

	// 清空身高體重的輸入值
	heightIpt.value = "";
	weightIpt.value = "";
}

function update(records) {
	console.log("processing...");
	console.log(records);
	var str = "";
	for (var i = (records.length - 1); i >= 0; i--) {
		str += `<div class="record-set">
					<div class="line ${records[i].lineBar}"></div>
					<div class="text">${records[i].status}</div>
					<div class="bmi">
						<span class="label">BMI</span>
						<span class="data">${records[i].bmi}</span>
					</div>
					<div class="height">
						<span class="label">height</span>
						<span class="data">${records[i].height}cm</span>
					</div>
					<div class="weight">
						<span class="label">weight</span>
						<span class="data">${records[i].weight}kg</span>
					</div>
					<div class="time">
						<span class="date">${records[i].time}</span>
					</div>
					<div class="close">
						<span class="close-btn" data-close="${i}">&times;</span>
					</div>				
				</div>`
	}

	recordSet.innerHTML = str;
}

// 刪除紀錄
function delRecord(e) {
	if (e.target.className !== "close-btn") {return}
		
	var index = e.target.dataset.close;
	recordData.splice(index, 1);
	update(recordData);
	localStorage.setItem("recordSet", JSON.stringify(recordData));    
}