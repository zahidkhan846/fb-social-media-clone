export interface Post {
  postId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  creatorFullName: string;
  creatorImageUrl: string;
  likeCount: number;
  commentCount: number;
}

export interface SinglePost {
  postId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  creatorFullName: string;
  creatorImageUrl: string;
  likeCount: number;
  commentCount: number;
  comments: Comment[];
}

export interface Comment {
  content: string;
  createdAt: string;
  createdBy: string;
  creatorImageUrl: string;
  postId: string;
  commentId: string;
  fullName: string;
}

export interface PostState {
  loading: boolean;
  error: any;
  posts: Post[];
  singlePost: SinglePost;

  addPostLoading: boolean;
  addPostErr: any;

  deletePostLoading: boolean;
  deletePostErr: any;

  editPostLoading: boolean;
  editPostErr: boolean;

  activityOnPostLoading: boolean;
  activityOnPostErr: any;

  currPostId: string;
  message: string;
}

export interface Like {
  postId: string;
  likedBy: string;
}
