import { FastifyInstance } from "fastify";
import { UserDatastore } from "../datastores/user.datastore";
import { IUser, IUserCreate, IUserUpdate } from "../interfaces/user.interface";

export class UserService {
  private userDatastore: UserDatastore;

  constructor(private fastify: FastifyInstance) {
    this.userDatastore = new UserDatastore(fastify);
  }

  async createUser(userData: IUserCreate): Promise<IUser> {
    const existingUser = await this.userDatastore.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // In a real app, you would hash the password here
    return this.userDatastore.create(userData);
  }

  async getUser(id: string): Promise<IUser> {
    const user = await this.userDatastore.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(id: string, userData: IUserUpdate): Promise<IUser> {
    await this.getUser(id); // Check if user exists

    if (userData.email) {
      const existingUser = await this.userDatastore.findByEmail(userData.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("Email is already in use");
      }
    }

    // In a real app, you would hash the password here if it's being updated
    return this.userDatastore.update(id, userData);
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUser(id); // Check if user exists
    await this.userDatastore.delete(id);
  }

  async getAllUsers(): Promise<IUser[]> {
    return this.userDatastore.findAll();
  }
}
