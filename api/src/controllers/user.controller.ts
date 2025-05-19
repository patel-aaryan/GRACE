import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UserService } from "../services/user.service";
import { IUserCreate, IUserUpdate } from "../interfaces/user.interface";

export class UserController {
  private userService: UserService;

  constructor(private fastify: FastifyInstance) {
    this.userService = new UserService(fastify);
  }

  async createUser(
    request: FastifyRequest<{ Body: IUserCreate }>,
    reply: FastifyReply
  ) {
    try {
      const user = await this.userService.createUser(request.body);
      const { password, ...userWithoutPassword } = user;
      return reply.code(201).send(userWithoutPassword);
    } catch (error) {
      request.log.error(error);
      return reply.code(400).send({ message: (error as Error).message });
    }
  }

  async getUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const user = await this.userService.getUser(request.params.id);
      const { password, ...userWithoutPassword } = user;
      return reply.code(200).send(userWithoutPassword);
    } catch (error) {
      request.log.error(error);
      return reply.code(404).send({ message: (error as Error).message });
    }
  }

  async updateUser(
    request: FastifyRequest<{ Params: { id: string }; Body: IUserUpdate }>,
    reply: FastifyReply
  ) {
    try {
      const user = await this.userService.updateUser(
        request.params.id,
        request.body
      );
      const { password, ...userWithoutPassword } = user;
      return reply.code(200).send(userWithoutPassword);
    } catch (error) {
      request.log.error(error);
      return reply.code(400).send({ message: (error as Error).message });
    }
  }

  async deleteUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      await this.userService.deleteUser(request.params.id);
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(404).send({ message: (error as Error).message });
    }
  }

  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await this.userService.getAllUsers();
      const usersWithoutPasswords = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      return reply.code(200).send(usersWithoutPasswords);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: "Internal server error" });
    }
  }
}
