import { Like, Post } from "./post";

export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public username: string,
    public password: string,
    public confirmPassword: string,
    public gender: string
  ) {}
}

export interface Notification {
  createdAt: string;
  nId: string;
  postId: string;
  read: boolean;
  recipient: string;
  sender: string;
  type: string;
}

export interface UserData {
  connections: any;
  createdAt: string;
  email: string;
  firstName: string;
  gender: string;
  imageUrl: string;
  lastName: string;
  likes: Like[];
  notifications: Notification[];
  posts: Post[];
  userId: string;
  username: string;
  bio?: string;
  location?: string;
  phone?: string;
  website: string;
}

export interface OtherUser {
  createdAt: string;
  email: string;
  firstName: string;
  gender: string;
  imageUrl: string;
  lastName: string;
  posts: Post[];
  userId: string;
  username: string;
  bio?: string;
  location?: string;
  phone?: string;
  website: string;
}

export interface UserState {
  user: UserData;
  loading: boolean;
  error: Error;
  otherUser: OtherUser;

  imageLoading: boolean;
  userUpdateLoading: boolean;
}
