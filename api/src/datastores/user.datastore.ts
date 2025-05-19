import { FastifyInstance } from "fastify";
import { IUser, IUserCreate, IUserUpdate } from "../interfaces/user.interface";

export class UserDatastore {
  constructor(private fastify: FastifyInstance) {}

  async create(userData: IUserCreate): Promise<IUser> {
    return this.fastify.prisma.user.create({
      data: userData,
    });
  }

  async findById(id: string): Promise<IUser | null> {
    return this.fastify.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.fastify.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, userData: IUserUpdate): Promise<IUser> {
    return this.fastify.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.fastify.prisma.user.delete({
      where: { id },
    });
  }

  async findAll(): Promise<IUser[]> {
    return this.fastify.prisma.user.findMany();
  }
}
