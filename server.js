const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
const { Telegram } = require("telegraf");
const getNews = require("./controllers/api");
const app = require("./app");
const translate = require("google-translate-api");

dotenv.config();

const telegram = new Telegram(process.env.TELEGRAM);

cron.schedule("0 0 */4 * * *", async () => {
  try {
    const articles = await getNews();

    if (articles) {
      await Promise.all([
        ...articles.map(async (article) => {
          if (article.urlToImage) {
            telegram.sendPhoto("@tech_news_latest", article.urlToImage, {
              parse_mode: "HTML",
              caption: `š ${article.title}\n\nšø ${article.description}\n\nš @Tech_News_Latest`,
              reply_markup: {
                inline_keyboard: [
                  [{ text: "š Read more š", url: article.url }],
                  [
                    {
                      text: "š± Share our channel š²",
                      url: `https://t.me/share/url?url=https://t.me/tech_news_latest`,
                    },
                  ],
                ],
              },
            });
          }
        }),
      ]);
    }
  } catch (error) {
    telegram.sendMessage(786162360, `${error}`);
  }
});

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
).replace("<username>", process.env.DATABASE_USERNAME);

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("\x1b[35mDatabase connection successful \x1b[0m"));

const port = process.env.PORT || 3110;
const server = app.listen(port, () => {
  console.log(`\x1b[35mApp running on port ${port} \x1b[0m`);
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! š„ Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! š„ Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("š SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("š„ Process terminated!");
  });
});
