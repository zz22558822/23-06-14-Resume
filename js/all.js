let current_fs, next_fs, previous_fs;
let left, opacity, scale;
let animating; //防快速多點
let nowPage = 1; //頁面值 上下一步隨之增減
let pageNum = document.querySelectorAll('fieldset').length;
const button = document.getElementById("myButton");
const popup = document.getElementById("myPopup");


//尾頁更換色彩分布
document.querySelectorAll('fieldset')[pageNum-1].classList.add('submitPage')

//進度條重置
updateProgressBar(nowPage, pageNum)

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
		// alert('資料無填寫')
		popup.classList.add("show");
		setTimeout(function() {
		  popup.classList.remove("show");
		}, 3000);
	}

});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//顯示上一步
	previous_fs.show(); 
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
		inputs[i].style.boxShadow = '0 0 0 5px red'; // 使用 box-shadow 屬性添加紅色框線
		inputs[i].style.webkitBoxShadow = '0 0 0 5px red'; // Safari 的 -webkit-box-shadow 屬性
		inputs[i].addEventListener('input', clearInputBorder); // 添加事件監聽器
	  } else {
		inputs[i].style.boxShadow = 'none'; // 清除 box-shadow 樣式
		inputs[i].style.webkitBoxShadow = 'none'; // Safari 的清除 box-shadow 屬性
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
		radioBoxes[i].style.boxShadow = '0 0 0 5px red'; // 使用 box-shadow 屬性添加紅色框線
		radioBoxes[i].style.webkitBoxShadow = '0 0 0 5px red'; // Safari 的 -webkit-box-shadow 屬性
		radioBoxes[i].addEventListener('click', clearRadioBorder); // 添加事件監聽器
	  } else {
		radioBoxes[i].style.boxShadow = 'none'; // 清除 box-shadow 樣式
		radioBoxes[i].style.webkitBoxShadow = 'none'; // Safari 的清除 box-shadow 屬性
	  }
	}
  
	// console.log(noData);
	return noData;
  }
  
  // 清除 input 的紅色框線
  function clearInputBorder() {
	this.style.boxShadow = 'none';
	this.style.webkitBoxShadow = 'none';
  }
  // 清除 radioBox 的紅色框線
  function clearRadioBorder() {
	this.style.boxShadow = 'none';
	this.style.webkitBoxShadow = 'none';
  }


// 計算進度條寬度的函數
function calculateProgress(nowPage, pageNum) {
	return (nowPage / pageNum) * 100 + "%";
}

// 更新進度條寬度的函數
function updateProgressBar(nowPage, pageNum) {
	const progressBar = document.getElementById("progress-bar");
	const progressWidth = calculateProgress(nowPage, pageNum);
	progressBar.style.width = progressWidth;
  
	const progressText = progressBar.querySelector("p");
	progressText.textContent = Math.ceil(parseFloat(progressWidth)) + "%";
}