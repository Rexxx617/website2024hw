
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

    // 預設的圖片數據
    const initialImages = [
      { imgSrc: "imGG/46.jpg", altText: "Image 1" },
      { imgSrc: "imGG/23.jpg", altText: "Image 2" },
      { imgSrc: "imGG/16.jpg", altText: "Image 3" },
      { imgSrc: "imGG/25.jpg", altText: "Image 4" },
      //{ imgSrc: "imGG/11.jpg", altText: "Image 5" },
      
    ];

    // 用比對找出新的圖片
    const newImages = initialImages.filter((image) => {
      return !existingImages.some(
        (existing) =>
          existing.imgSrc === image.imgSrc && existing.altText === image.altText
      );
    });    //existingImages沒找到就會被加入newImages

    // 找出需要刪除的圖片數據
    const imagesToRemove = existingImages.filter((existing) => {
      return !initialImages.some(
        (image) =>
          image.imgSrc === existing.imgSrc && image.altText === existing.altText
      );
    });

    // 插入新的圖片數據
    if (newImages.length > 0) {
      await ImageDB.insert(newImages);
      console.log("New images inserted:", newImages);
    } else {
      console.log("No new images to insert.");
    }

    // 刪除多餘的圖片數據
    if (imagesToRemove.length > 0) {
      const deletePromises = imagesToRemove.map((image) =>
        ImageDB.remove({ _id: image._id })
      );
      await Promise.all(deletePromises);
      console.log("Removed extra images:", imagesToRemove);
    } else {
      console.log("No images to remove.");
    }
  } catch (err) {
    console.error("Error during database initialization:", err);
  }
})();



// 啟動伺服器
server.listen(port, () => {
  console.log(`Server is running at port ${port}.`);
});

