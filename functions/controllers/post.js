const { db } = require("../config/admin");
const { isEmpty } = require("../utils/validators");

const getAllPosts = (req, res) => {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then((docs) => {
      const posts = [];
      docs.forEach((doc) => {
        posts.push({
          postId: doc.id,
          ...doc.data(),
        });
      });
      return res.json(posts);
    })
    .catch((err) => {
      return res.status(500).json({ ...err, message: "Something went wrong!" });
    });
};

const addPost = async (req, res) => {
  const creatorFullName = `${req.user.firstName} ${req.user.lastName}`;

  const { content } = req.body;

  const post = {
    content,
    createdBy: req.user.username,
    creatorFullName: creatorFullName,
    createdAt: new Date().toISOString(),
    creatorImageUrl: req.user.imageUrl,
    likeCount: 0,
    commentCount: 0,
  };

  try {
    const doc = await db.collection("posts").add(post);
    return res.status(201).json({ ...post, postId: doc?.id });
  } catch (error) {
    return res.status(500).json({ ...error, message: "Something went wrong!" });
  }
};

const editPost = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;
  try {
    const docSnap = await db.collection("posts").doc(postId).get();
    if (!docSnap.exists) {
      return res.status(404).json({ message: "Post not found!" });
    }
    if (docSnap.data().createdBy !== req.user.username) {
      return res.status(403).json({ message: "Unauthorized!" });
    }
    await db.collection("posts").doc(postId).update({ content });
    return res.json({ message: "Successfully updated!", post: content });
  } catch (error) {
    return res.status(500).json({ ...error, message: "Something went wrong!" });
  }
};

const deleleteSeletedPost = async (req, res) => {
  const { postId } = req.params;
  let status = 500;
  try {
    const doc = await db.doc(`/posts/${postId}`).get();
    if (!doc.exists) {
      throw new Error("Post does not exists!");
    }

    if (req.user.username !== doc.data().createdBy) {
      status = 403;
      throw new Error("Unauthorize access! Your can delete this post.");
    }
    await doc.ref.delete();

    // Deleting comments related to this post.
    const commentsSnap = await db
      .collection("comments")
      .where("postId", "==", postId)
      .get();
    if (!commentsSnap.empty) {
      await commentsSnap.forEach((doc) => {
        doc.ref.delete();
      });
    }
    // Deleting likes related to this post.
    const likesSnap = await db
      .collection("likes")
      .where("postId", "==", postId)
      .get();
    if (!likesSnap.empty) {
      await likesSnap.forEach((doc) => {
        doc.ref.delete();
      });
    }
    // Deleting notifications related to this post.
    const notifySnap = await db
      .collection("notifications")
      .where("postId", "==", postId)
      .get();
    if (!notifySnap.empty) {
      await notifySnap.forEach((doc) => {
        doc.ref.delete();
      });
    }

    return res.status(200).json({ message: `Successfully deleted ${postId}!` });
  } catch (error) {
    return res
      .status(status)
      .json({ ...error, message: "Unable to delete, Please try later!" });
  }
};

const createLike = async (req, res) => {
  const { postId } = req.params;
  let status = 500;
  try {
    const post = await db.doc(`posts/${postId}`).get();
    if (!post.exists) {
      status = 404;
      throw new Error("Selected post does not exists!");
    }
    const selectedPost = post.data();
    const likeDocs = await db
      .collection("likes")
      .where("likedBy", "==", req.user.username)
      .where("postId", "==", postId)
      .limit(1)
      .get();
    if (!likeDocs.empty) {
      status = 403;
      throw new Error("Already liked!");
    }
    await db
      .collection("likes")
      .add({ postId: postId, likedBy: req.user.username });
    selectedPost.likeCount++;
    await db
      .doc(`posts/${postId}`)
      .update({ likeCount: selectedPost.likeCount });
    return res.status(200).json(selectedPost);
  } catch (error) {
    return res
      .status(status)
      .json({ message: error.message || "Something went wrong!" });
  }
};

const removeLike = async (req, res) => {
  const { postId } = req.params;
  let status = 500;
  try {
    const post = await db.doc(`posts/${postId}`).get();
    if (!post.exists) {
      status = 404;
      throw new Error("Selected post does not exists!");
    }
    const selectedPost = post.data();
    const likeDocs = await db
      .collection("likes")
      .where("likedBy", "==", req.user.username)
      .where("postId", "==", postId)
      .limit(1)
      .get();
    if (likeDocs.empty) {
      status = 400;
      throw new Error("Post isn't liked!");
    } else {
      const likeDoc = likeDocs.docs[0];
      await db.doc(`/likes/${likeDoc.id}`).delete();
      if (selectedPost.likeCount > 0) {
        selectedPost.likeCount--;
        await db
          .doc(`posts/${postId}`)
          .update({ likeCount: selectedPost.likeCount });
        return res.json(selectedPost);
      } else {
        status = 400;
        throw new Error("Likes count can't be less then 0!");
      }
    }
  } catch (error) {
    res.status(status).json({ errors: { message: error.message } });
  }
};

const getSelectedPost = async (req, res) => {
  const { postId } = req.params;
  let selectedPost = {};
  try {
    const doc = await db.doc(`/posts/${postId}`).get();
    if (!doc.exists) {
      throw new Error("Post does not exists!");
    }
    selectedPost = doc.data();
    selectedPost.postId = doc.id;
    const commDocs = await db
      .collection("comments")
      .orderBy("createdAt", "asc")
      .where("postId", "==", postId)
      .get();
    selectedPost.comments = [];
    commDocs.forEach((doc) => {
      selectedPost.comments.push({ ...doc.data(), commentId: doc.id });
    });
    return res.status(200).json(selectedPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createComment = async (req, res) => {
  const { postId } = req.params;
  let status = 500;

  const newComment = {
    content: req.body.content,
    createdAt: new Date().toISOString(),
    createdBy: req.user.username,
    fullName: `${req.user.firstName} ${req.user.lastName}`,
    creatorImageUrl: req.user.imageUrl,
    postId: postId,
  };
  if (isEmpty(newComment.content)) {
    status = 400;
    throw new Error("Comment must not be empty!");
  }
  try {
    const post = await db.doc(`posts/${postId}`).get();
    if (!post.exists) {
      status = 404;
      throw new Error("Selected post does not exists!");
    }

    const commDoc = await db.collection("comments").add(newComment);
    await post.ref.update({ commentCount: post.data().commentCount + 1 });
    return res.status(201).json({ ...newComment, commentId: commDoc.id });
  } catch (error) {
    res.status(status).json({ errors: { message: error.message } });
  }
};

const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  let status = 500;
  try {
    const post = await db.doc(`posts/${postId}`).get();
    if (!post.exists) {
      status = 404;
      throw new Error("Selected post does not exists!");
    }

    const commentDoc = db.doc(`comments/${commentId}`);

    const selectedComment = await commentDoc.get();
    if (!selectedComment.exists) {
      status = 404;
      throw new Error("No comment found!");
    }
    if (
      selectedComment.data().createdBy === req.user.username &&
      post.data().commentCount > 0
    ) {
      await commentDoc.delete();
      await post.ref.update({ commentCount: post.data().commentCount - 1 });
    } else {
      status = 403;
      throw new Error("Unauthorized access!");
    }
    return res.status(201).json({ message: "Successully deleted!" });
  } catch (error) {
    res.status(status).json({ errors: { message: error.message } });
  }
};

module.exports = {
  getAllPosts,
  addPost,
  getSelectedPost,
  createComment,
  createLike,
  removeLike,
  deleteComment,
  deleleteSeletedPost,
  editPost,
};
