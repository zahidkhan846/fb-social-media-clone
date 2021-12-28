const express = require("express");

const {
  getAllPosts,
  addPost,
  createComment,
  createLike,
  removeLike,
  deleteComment,
  deleleteSeletedPost,
  editPost,
  getSelectedPost,
} = require("../controllers/post");
const { isAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/posts", getAllPosts);
router.post("/add-post", isAuth, addPost);
router.put("/edit-post/:postId", isAuth, editPost);
router.get("/posts/:postId", getSelectedPost);
router.post("/posts/:postId/comment", isAuth, createComment);
router.delete("/posts/:postId/:commentId/delete", isAuth, deleteComment);
router.get("/posts/:postId/like", isAuth, createLike);
router.get("/posts/:postId/unlike", isAuth, removeLike);
router.delete("/posts/:postId/delete", isAuth, deleleteSeletedPost);

module.exports = router;
