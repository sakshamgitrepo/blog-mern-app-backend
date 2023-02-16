const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

router.post("/post",asyncHandler(async (req, res) => {
  const { filename } = req.file;

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) throw Error;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: filename,
      author: info.id,
    });
    res.json(postDoc);
  })
}));

router.put("/post", asyncHandler(async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) throw Error;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
  
    req.file
      ? await postDoc.update({
          title,
          summary,
          content,
          cover: req.file.filename,
        })
      : await postDoc.update({
          title,
          summary,
          content,
          cover: postDoc.cover,
        });

    res.json(postDoc);
  });
}))

router.get("/post", asyncHandler(async (req, res) => {
  res.json(
    await Post.find().populate("author", ["username"]).sort({ createdAt: -1 })
  );
}))

router.get("/post/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
}))
module.exports = router;
