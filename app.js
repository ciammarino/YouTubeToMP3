const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// create express server
const app = express();

// server port
const PORT = process.env.PORT || 3001;

// set template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// needed to parse html data for POST request
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// create routes (get/post)
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/convert-mp3", async (req, res) => {
  const videoId = req.body.videoID;
  console.log(videoId);
  if (videoId === undefined || videoId === "" || videoId === null) {
    return res.render("index", {
      success: false,
      message: "Please enter a video ID",
    });
  } else {
    const fetchAPI = await fetch(
      "https://youtube-mp36.p.rapidapi.com/dl?id=" + videoId,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.API_KEY,
          "x-rapidapi-host": process.env.API_HOST,
        },
      }
    );

    const fetchResponse = await fetchAPI.json();
    console.log(fetchResponse);

    if (fetchResponse.status === "ok") {
      return res.render("index", {
        success: true,
        song_title: fetchResponse.title,
        song_link: fetchResponse.link,
      });
    } else {
      return res.render("index", {
        success: false,
        message: fetchResponse.msg,
      });
    }
  }
});

// start server
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

// app.listen(PORT, () => {
//   console.log('server started on port ${PORT}');
// });
