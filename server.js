
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const DB = require("nedb-promises");

// 初始化伺服器
const server = express();
const port = 3000;

// 靜態檔案的路徑
server.use(express.static(__dirname + "/AgencyProject"));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(fileUpload({ defCharset: 'utf8', defParamCharset: 'utf8' }));

// 初始化 NeDB 資料庫
const ImageDB = DB.create(__dirname + "/images.db");

// 提供輪播圖片數據的 API 
server.get("/api/images", async (req, res) => {
  try {
    const images = await ImageDB.find({});
    res.json(images);
  } catch (err) {
    res.status(500).send({ error: "Database error" });
  }
});

// 新增圖片到資料庫的 API
server.post("/api/images", async (req, res) => {
  const { imgSrc, altText } = req.body;

  if (!imgSrc || !altText) {
    res.status(400).send({ error: "Invalid data" });
    return;// 有缺少的話會回傳錯誤訊息
  }

  try {
    const newImage = { imgSrc, altText };
    await ImageDB.insert(newImage);
    res.send({ success: true, message: "Image added successfully" });
  } catch (err) {
    res.status(500).send({ error: "Database error" });
  }
});


(async () => {
  try {
    // 從資料庫中讀取現有數據
    const existingImages = await ImageDB.find({});
    console.log("Existing images:", existingImages);

    
    const initialImages = [       // initialImages =手動設定的圖片清單 下面那些
      { imgSrc: "imGG/46.jpg", altText: "Image 1" },
      { imgSrc: "imGG/23.jpg", altText: "Image 2" },
      { imgSrc: "imGG/16.jpg", altText: "Image 3" },
      { imgSrc: "imGG/25.jpg", altText: "Image 4" },
      //{ imgSrc: "imGG/11.jpg", altText: "Image 5" },
      
    ];

    // 用filter比對initialImages跟existingImages裡的圖片
    const newImages = initialImages.filter((image) => {
      return !existingImages.some(
        (existing) =>
          existing.imgSrc === image.imgSrc && existing.altText === image.altText
      );
    });    //existingImages沒找到就會被加入newImages

    
    const imagesToRemove = existingImages.filter((existing) => {  //比對每一個 existingImages（資料庫裡的圖片）
      return !initialImages.some(
        (image) =>
          image.imgSrc === existing.imgSrc && image.altText === existing.altText 
      );       //如果資料庫裡的圖片（existing）和手動設定的圖片（image）一樣  就會不刪除

    });

    // 插入新的圖片數據
    if (newImages.length > 0) {
      await ImageDB.insert(newImages);   // 把 newImages 所有新圖片插入 imagesdb 
      console.log("New images inserted:", newImages);
    } else {  // 如果 newImages 是空的，表示沒有新圖片要插入
      console.log("No new images to insert.");
    }

    // 刪除多餘的圖片數據
    if (imagesToRemove.length > 0) {    // 如果 imagesToRemove 陣列有東西，就表示有多餘的圖片要刪
      const deletePromises = imagesToRemove.map((image) =>
        ImageDB.remove({ _id: image._id })
      );
      await Promise.all(deletePromises);    //用 Promise.all 等待所有東西刪除完成   //promise.all用來 同時執行多個非同步操作（刪除資料庫的圖片），而且會等到所有操作都完成後，才繼續執行程式
      console.log("Removed extra images:", imagesToRemove); // 刪完後，印出被刪除的圖片資料
    } else {
      console.log("No images to remove.");        // 反之沒有多餘的圖片，就會寫No images to remove.
    }
  } catch (err) {
    console.error("Error during database initialization:", err);
  }
})();




server.listen(port, () => {
  console.log(`Server is running at port ${port}.`);
});

