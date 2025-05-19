export interface IUser {
  id: string;
  email: string;
  name?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  email: string;
  name?: string;
  password: string;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
  password?: string;
}
