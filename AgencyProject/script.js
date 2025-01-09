let text = document.getElementById('text');
let r2 = document.getElementById('r2');
let l2 = document.getElementById('l2');
let r1 = document.getElementById('r1');
let l1 = document.getElementById('l1');


window.addEventListener('scroll', () => { //EventListener 監聽頁面有沒有 scroll 發生 ，每次滾動的時候就會執行後面的回調函數
  let value = window.scrollY;             // value ==> 變數，用來存儲 滾動距離 的數值
  let opacity = 1 - value / 300;          // 滾動到300px or超過 透明度會變成0
  if (opacity >= 0) {
    text.style.opacity = opacity;
  } else {
    text.style.opacity = 0;               // 透明度是負數的話，設為 0
  }

  text.style.marginTop = value + 'px'; //根據value移動距離調整字的marginTop 讓滾動的時候文字向下跑

  r1.style.left = value * 0.5 + 'px';  
  r2.style.left = value * 0.2 + 'px'; 
  l1.style.left = value * -0.5 + 'px';  // 滾動距離x數值=圖片移動距離 +px(單位!!)
  l2.style.left = value * -0.2 + 'px'; // 正 水平向右 負水平向左
});
document.addEventListener("DOMContentLoaded", () => {
    
    const fadeInElements = document.querySelectorAll(".fade-in");// 把全部的.fade-in 儲存在 fadeInElements 。+動態效果
    

    // 設定 Intersection Observer 
    const options = {
        root: null, // 根元素設置為 viewport
        rootMargin: "0px", // 不增加額外邊距
        threshold: 0.2 // 當 20% 的元素進入視窗的時候會觸發
    };

    // 建立 Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 當元素進入 viewport , add visible 讓他回到原位
                entry.target.classList.add("visible");
                // 停止觀察，避免重複觸發
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // 將 observer 綁定到每個 .fade-in 元素
    fadeInElements.forEach(el => observer.observe(el));
});


// 當頁面重載的時後，從伺服器拉取圖片並更新
document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/images')                              //前端發送get到/api/images的程式碼
      .then(response => response.json())              // 把後端回應的資料轉成 JSON 格式
      .then(images => {
        const carouselInner = document.getElementById('carousel-images');     //前端用 JavaScript 找到輪播裡面的元素。
  
        // 清空原本的輪播內容，不然圖片會重複
        carouselInner.innerHTML = '';
  
        
        images.forEach((image, index) => {                          //前端收到後端從資料庫抓的圖片後，用forEach處理
          const item = document.createElement('div');
          item.classList.add('carousel-item');                      //給這個 div 加上 Boostrap 的 "carousel-item" class
          if (index === 0) item.classList.add('active');            // 如果是第一張加上active class ，讓他顯示
  
          // 前端用圖片資料生成 html放到網頁輪播上
          item.innerHTML = `<img src="${image.imgSrc}" class="d-block w-100" alt="${image.altText}">`; // 從資料庫裡抓到的圖片資料動態地生成 html
          carouselInner.appendChild(item);  // 加載圖片到輪播裡
        });
      })
      .catch(error => console.error('Error loading images:', error));       // 如果有錯誤會在主控台顯示
  });
  

  