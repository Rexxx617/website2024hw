let text = document.getElementById('text');
let r2 = document.getElementById('r2');
let l2 = document.getElementById('l2');
let r1 = document.getElementById('r1');
let l1 = document.getElementById('l1');


window.addEventListener('scroll', () => {
  let value = window.scrollY;
  let opacity = 1 - value / 300;  
  if (opacity >= 0) {
    text.style.opacity = opacity;
  } else {
    text.style.opacity = 0;  // 當透明度為負數時，設為 0
  }
  text.style.marginTop = value * 2.5 + 'px';
  r1.style.left = value * 0.5 + 'px';  // 根據滾動距離水平移動
  r2.style.left = value * 0.2 + 'px'; // 根據滾動距離向左水平移動
  l1.style.left = value * -0.5 + 'px';  // 根據滾動距離水平移動
  l2.style.left = value * -0.2 + 'px'; // 根據滾動距離向左水平移動
 
});
document.addEventListener("DOMContentLoaded", () => {
    // 選取所有需要進場效果的元素
    const fadeInElements = document.querySelectorAll(".fade-in");

    // 設定 Intersection Observer 的選項
    const options = {
        root: null, // 根元素設置為 viewport
        rootMargin: "0px", // 不增加額外邊距
        threshold: 0.2 // 當 20% 的元素可見時觸發
    };

    // 建立 Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 當元素進入 viewport 時加上 visible 樣式
                entry.target.classList.add("visible");
                // 停止觀察該元素，避免重複觸發
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // 將 observer 綁定到每個 .fade-in 元素
    fadeInElements.forEach(el => observer.observe(el));
});
if (entry.isIntersecting) {
    setTimeout(() => {
        entry.target.classList.add("visible");
    }, 500); // 延遲 500ms
}

