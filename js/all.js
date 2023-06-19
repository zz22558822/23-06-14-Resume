let current_fs, next_fs, previous_fs;
let left, opacity, scale;
let animating; //防快速多點
let nowPage = 1; //頁面值 上下一步隨之增減
let timeoutId; // 氣泡框重置用
let today = new Date().toISOString().split('T')[0]; //取得今天日期
let pageNum = document.querySelectorAll('fieldset').length;
const button = document.getElementById("myButton");
const popup = document.getElementById("myPopup");


// 氣泡框監控
popup.addEventListener("click", function() {
    popup.classList.remove("show");
});


$(".next").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();

	// 按鈕觸發檢查 並使用累計方式帶入數值
	if (checkData(nowPage) == 0 ) {
		// alert('資料均已填寫')
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
		//顯示下一個輸入表
		next_fs.show(); 
		// 移動到頂部的位置
		scrollToTargetPosition();
		//Css隱藏輸入完成
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				scale = 1 - (1 - now) * 0.2;
				left = (now * 50)+"%";
				opacity = 1 - now;
				current_fs.css({
			'transform': 'scale('+scale+')',
			'position': 'absolute'
		  });
				next_fs.css({'left': left, 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			easing: 'easeInOutBack'
		});
	
		//下一步隨之增加頁面值
		nowPage = nowPage + 1

		// 更新進度條
		updateProgressBar(nowPage, pageNum);

	} else {
		animating = false //按下觸發失敗後初始化
		// 取消之前的定时器（如果存在）
		clearTimeout(timeoutId);
		// alert('資料無填寫')
		popup.classList.add("show");
		timeoutId =setTimeout(function() {
		  popup.classList.remove("show");
		}, 3000);
	}

	// // 移動到未填寫資料的位置 Demo 可移除
	// let offsetTop = current_fs.offset().top;
	// $('html, body').animate({scrollTop: offsetTop}, 600);

});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//顯示上一步
	previous_fs.show(); 
	// 移動到頂部的位置
	scrollToTargetPosition();
	//Css隱藏目前表單
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			scale = 0.8 + (1 - now) * 0.2;
			left = ((1-now) * 50)+"%";
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		easing: 'easeInOutBack'
	});

	//上一步隨之增加頁面值
	nowPage = nowPage - 1

	// 更新進度條
	updateProgressBar(nowPage, pageNum);
});

//送出後的程式修改位置
$(".submit").click(function(){
	return false;
})

//移動視窗當前位置的副程式
function scrollToTargetPosition() {
	$('html,body').animate({
		scrollTop: 95
	  },150);
}

// // 副程式判斷是否寫入資料 初始版本
// function checkData(pageNum) {
// 	let noData = 0;
	
// 	// 檢查 input 是否寫入資料
// 	let inputs = document.querySelectorAll('.Page_' + pageNum);
// 	for (let i = 0; i < inputs.length; i++) {
// 	  if (inputs[i].value === '') {
// 		noData++;
// 	  }
// 	}
  
// 	// 檢查 radio 是否有選擇
// 	let radioBoxes = document.querySelectorAll('.radioBox.Page_' + pageNum);
// 	for (let i = 0; i < radioBoxes.length; i++) {
// 	  let radioButtons = radioBoxes[i].querySelectorAll('input[type="radio"]');
// 	  let isSelected = Array.from(radioButtons).some(function(radioButton) {
// 		return radioButton.checked;
// 	  });
  
// 	  if (!isSelected) {
// 		noData++;
// 	  }
// 	}
  
// 	console.log(noData);
// 	return noData;
//   }

// 副程式判斷是否寫入資料 陰影版本
function checkData(pageNum) {
	let noData = 0;
  
	// 檢查 input 是否寫入資料
	let inputs = document.querySelectorAll('.Page_' + pageNum);
	for (let i = 0; i < inputs.length; i++) {
	  if (inputs[i].value === '') {
		noData++;
		inputs[i].style.outline = '5px solid red'; // 使用 outline 屬性添加紅色框線
		inputs[i].style.boxShadow = '0 0 0 5px red'; // 使用 box-shadow 屬性添加紅色框線
		inputs[i].style.webkitBoxShadow = '0 0 0 5px red'; // Safari 的 -webkit-box-shadow 屬性
		// inputs[i].classList.add('redBorder');
		inputs[i].addEventListener('input', clearInputBorder); // 添加事件監聽器
	  } else {
		inputs[i].style.outline = 'none'; // 使用 outline 屬性添加紅色框線
		inputs[i].style.boxShadow = 'none'; // 清除 box-shadow 樣式
		inputs[i].style.webkitBoxShadow = 'none'; // Safari 的清除 box-shadow 屬性
		// inputs[i].classList.remove('redBorder');
	  }
	}
  
	// 檢查 radio 是否有選擇
	let radioBoxes = document.querySelectorAll('.radioBox.Page_' + pageNum);
	for (let i = 0; i < radioBoxes.length; i++) {
	  let radioButtons = radioBoxes[i].querySelectorAll('input[type="radio"]');
	  let isSelected = Array.from(radioButtons).some(function(radioButton) {
		return radioButton.checked;
	  });
  
	  if (!isSelected) {
		noData++;
		radioBoxes[i].style.outline = '5px solid red'; // 使用 outline 屬性添加紅色框線
		radioBoxes[i].style.boxShadow = '0 0 0 5px red'; // 使用 box-shadow 屬性添加紅色框線
		radioBoxes[i].style.webkitBoxShadow = '0 0 0 5px red'; // Safari 的 -webkit-box-shadow 屬性
		// inputs[i].classList.add('redBorder');
		radioBoxes[i].addEventListener('click', clearRadioBorder); // 添加事件監聽器
	  } else {
		radioBoxes[i].style.outline = 'none'; // 使用 outline 屬性添加紅色框線
		radioBoxes[i].style.boxShadow = 'none'; // 清除 box-shadow 樣式
		radioBoxes[i].style.webkitBoxShadow = 'none'; // Safari 的清除 box-shadow 屬性
		// inputs[i].classList.remove('redBorder');
	  }
	}
  
	// console.log(noData);
	return noData;
  }
  
  // 清除 input 的紅色框線
  function clearInputBorder() {
	this.style.outline = 'none';
	this.style.boxShadow = 'none';
	this.style.webkitBoxShadow = 'none';
	// inputs[i].classList.remove('redBorder');
  }
  // 清除 radioBox 的紅色框線
  function clearRadioBorder() {
	this.style.outline = 'none';
	this.style.boxShadow = 'none';
	this.style.webkitBoxShadow = 'none';
	// inputs[i].classList.remove('redBorder');
  }


// // 計算進度條寬度的函數 v1 會超過100%
// function calculateProgress(nowPage, pageNum) {
// 	return (nowPage / pageNum) * 100 + "%";
// }


// 計算進度條寬度的函數 v2 限制最大100%
function calculateProgress(nowPage, pageNum) {
	let progress = (nowPage / pageNum) * 100;
	if (progress > 100) {
	  progress = 100; // 如果超过100%，将进度限制为100%
	}
	return progress + "%";
  }

// 更新進度條寬度的函數
function updateProgressBar(nowPage, pageNum) {
	const progressBar = document.getElementById("progress-bar");
	const progressWidth = calculateProgress(nowPage, pageNum);
	progressBar.style.width = progressWidth;
  
	const progressText = progressBar.querySelector("p");
	progressText.textContent = Math.ceil(parseFloat(progressWidth)) + "%";
}

// // 手機返回鍵優化成上一頁 因為瀏覽器強制性 這邊測試失敗所以註解掉
// window.addEventListener('pageshow', function(event) {
// 	window.history.forward();
//   });
// window.addEventListener('beforeunload', function(event) {
// 	if (nowPage !== 1) {
// 	  const backButton = document.querySelector('.previous');
// 	  if (backButton) {
// 		backButton.click();
// 		event.preventDefault();
// 		event.returnValue = '';  // 要求設置 returnValue 以兼容某些舊版瀏覽器
// 	  }
// 	}
//   });

// 輸入確認偵測換行 無跳轉按鈕功能
function setupNextInputOnEnter(inputs) {
	for (let i = 0; i < inputs.length; i++) {
	  inputs[i].addEventListener('keydown', function(event) {
		const key = event.key || event.keyCode;
  
		if (key === 'Enter' || key === 13) {
		  event.preventDefault(); // 防止提交表單
		  const nextIndex = i + 1;
  
		  if (nextIndex < inputs.length) {
			inputs[nextIndex].focus();
		  }
		}
	  });
	}
  }
  const inputs = document.querySelectorAll('input');
  setupNextInputOnEnter(inputs);

// // 必填題目標註星號且紅色 已縮減
// function emphasize() {
// 	// 找到所有帶有 "Page_" class 的 input 元素
// 	const inputs = document.querySelectorAll('input[class*="Page_"]');
// 	// 遍歷每個 input 元素
// 	inputs.forEach(input => {
// 	// 找到前一個元素
// 	const prevHeading = input.previousElementSibling;
// 	// 檢查前一個元素是否存在且為 'H3' 標籤
// 	if (prevHeading && prevHeading.tagName === 'H3') {
// 		// 創建一個 <span> 元素
// 		const span = document.createElement('span');
// 		// 添加 'required' class
// 		span.className = 'required';
// 		// 設定 <span> 元素的文字內容為 '*'
// 		span.textContent = '*';
// 		// 將 <span> 元素添加到前一個元素 ('H3' 標籤) 中
// 		prevHeading.appendChild(span);
// 	}
// 	});
// 	// 找到所有帶有 "Page_" class 的 div 元素
// 	const divs = document.querySelectorAll('div[class*="Page_"]');
// 	// 遍歷每個 div 元素
// 	divs.forEach(div => {
// 	// 找到前一個元素
// 	const prevHeading_div = div.previousElementSibling;
// 	// 檢查前一個元素是否存在且為 'H3' 標籤
// 	if (prevHeading_div && prevHeading_div.tagName === 'H3') {
// 		// 創建一個 <span> 元素
// 		const span = document.createElement('span');
// 		// 添加 'required' class
// 		span.className = 'required';
// 		// 設定 <span> 元素的文字內容為 '*'
// 		span.textContent = '*';
// 		// 將 <span> 元素添加到前一個元素 ('H3' 標籤) 中
// 		prevHeading_div.appendChild(span);
// 	}
// 	});
// }


// 必填題目標註星號且紅色 採用陣列縮減程式碼
function emphasize() {
	const elements = document.querySelectorAll('input[class*="Page_"], div[class*="Page_"]');
	
	elements.forEach(element => {
	  const prevHeading = element.previousElementSibling;
	  
	  if (prevHeading && prevHeading.tagName === 'H3') {
		const span = document.createElement('span');
		span.className = 'required';
		span.textContent = '*';
		prevHeading.appendChild(span);
	  }
	});
}

//更新預計上班日最小值
function workingDayUpdate() {
	// 取得預計上班日的 input 元素
	let workingDayInput = document.getElementById("working_day");
	// 更新 min 屬性的值為今天日期
	workingDayInput.min = today;
}

// 初始化
function __init__() {

	//尾頁更換色彩分布
	document.querySelectorAll('fieldset')[pageNum-1].classList.add('submitPage')
	//進度條重置
	updateProgressBar(nowPage, pageNum)
	//更新預計上班日最小值
	workingDayUpdate()
	//強調必填資料
	emphasize()

}

__init__()