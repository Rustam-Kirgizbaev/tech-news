const axios = require("axios");
const News = require("./news");

const keywords = [
  "samsung",
  "iphone",
  "macbook",
  "sony",
  "dell",
  "huawei",
  "xiaomi",
  "google",
  "tesla",
  "redmi",
  "android",
  "pixel",
];

function urlBuilder(key) {
  const current = new Date().toISOString().split(".")[0];
  const old = new Date(Date.now() - 1000 * 60 * 60 * 4)
    .toISOString()
    .split(".")[0];

  return `https://newsapi.org/v2/everything?q=${key}&apiKey=175f665ee00f402e99878e923ace3f66&language=en&from=${old}&to=${current}&sources=ars-technica,reuters,news-com-au,the-verge,engadget,techradar&searchIn=title`;
}

async function getNews() {
  const urls = keywords.map((keyword) => urlBuilder(keyword));

  const results = await Promise.all([...urls.map((url) => axios.get(url))]);

  const articles = results.map((result) => result?.data?.articles).flat();

  return articles;
}

module.exports = getNews;
