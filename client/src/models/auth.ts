export interface Error {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  message?: string;
}

export interface LoggedInUser {
  username: string;
  userId: string;
  fullName: string;
  email: string;
  imageUrl: string;
  expirationTime: number;
}

export interface AuthState {
  token: string;
  loggedInUser: LoggedInUser;
  loading: boolean;
  error: Error;
}

export interface Response {
  config: any;
  data: any;
  headers: any;
  request: any;
  status: number;
  statusText: string;
}
