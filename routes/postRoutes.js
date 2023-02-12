const express = require("express");
const router = express.Router();
const fs = require("fs");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

router.post("/post", async (req, res) => {
  const { filename } = req.file;

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: filename,
      author: info.id,
    });
    res.json(postDoc);
  });
});

router.put('/post', async (req,res) => {
  res.json(req.file)
})

router.get("/post", async (req, res) => {
  res.json(
    await Post.find().populate("author", ["username"]).sort({ createdAt: -1 })
  );
});

router.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})
module.exports = router;
