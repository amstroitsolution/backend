const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");

(async function testUpload() {
  try {
    const form = new FormData();
    form.append("title", "Om Hospital Machine");
    form.append("description", "Testing JPG image upload");
    form.append("price", "3000");
    form.append("type", "sale");

    
    form.append("image", fs.createReadStream("C:\\Users\\rajan\\Desktop\\Om Hospital.jpg"));

    const res = await axios.post("https://api.yashper.com//api/equipment", form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 10000,
    });

    console.log("✅ Response:", res.data);
  } catch (err) {
    console.error("---- ERROR START ----");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("Error message:", err.message);
    }
    console.error("---- ERROR END ----");
  }
})();
