let text = document.getElementById('text');
let r2 = document.getElementById('r2');
let l2 = document.getElementById('l2');
let r1 = document.getElementById('r1');
let l1 = document.getElementById('l1');


window.addEventListener('scroll', () => {
  let value = window.scrollY;
  let opacity = 1 - value / 300;  // 滾動300px
  if (opacity >= 0) {
    text.style.opacity = opacity;
  } else {
    text.style.opacity = 0;  // 當透明度為負數時，設為 0
  }
  text.style.marginTop = value * 1 + 'px';
  r1.style.left = value * 0.5 + 'px';  
  r2.style.left = value * 0.2 + 'px'; 
  l1.style.left = value * -0.5 + 'px';  // 
  l2.style.left = value * -0.2 + 'px'; // 正 水平向右 負水平向左
});
document.addEventListener("DOMContentLoaded", () => {
    
    const fadeInElements = document.querySelectorAll(".fade-in");// 選取所有.fade-in 儲存在 fadeInElements 。+動態效果
    

    // 設定 Intersection Observer 
    const options = {
        root: null, // 根元素設置為 viewport
        rootMargin: "0px", // 不增加額外邊距
        threshold: 0.2 // 當 20% 的元素可見時觸發
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


// 當頁面加載時，從伺服器拉取圖片數據並更新輪播
document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/images')
      .then(response => response.json())
      .then(images => {
        const carouselInner = document.getElementById('carousel-images');
  
        // 清空原本的輪播內容
        carouselInner.innerHTML = '';
  
        // 為每個圖片創建一個新的輪播項目
        images.forEach((image, index) => {
          const item = document.createElement('div');
          item.classList.add('carousel-item');
          if (index === 0) item.classList.add('active');  // 第一張顯示中的圖片
  
          // 創建圖片元素並加入到輪播項目中
          item.innerHTML = `<img src="${image.imgSrc}" class="d-block w-100" alt="${image.altText}">`;
          carouselInner.appendChild(item);
        });
      })
      .catch(error => console.error('Error loading images:', error));// 如果有錯誤會顯示
  });
  

  