const catchAsync = require("../utils/catch_async");
const News = require("../models/news");

exports.getAll = catchAsync(async (req, res, next) => {
  const news = await News.find().lean();

  res.status(200).json({
    success: true,
    data: news,
  });
});

exports.get = catchAsync(async (current) => {
  const news = await News.findOne({
    $or: [{ title: current.title }, { source: current.url }],
  }).lean();

  return news ? true : false;
});

exports.create = catchAsync(async (current) => {
  const news = await News.create({
    title: current.title,
    source: current.url,
  });

  return news;
});

exports.delete = catchAsync(async () => {
  const date = new Date(Date.now() - 2592000000);
  await News.deleteMany({
    $lte: {
      createdAt: date,
    },
  });

  return true;
});
