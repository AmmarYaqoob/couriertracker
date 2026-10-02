import type { Request, Response } from "express";
import { sendSuccess } from "../http/apiResponse";
import type { UserService } from "../services/user.service";

function queryValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export class UserController {
  constructor(private readonly users: UserService) {}

  listRoles = (_req: Request, res: Response): void => {
    sendSuccess(res, 200, "Roles loaded", { roles: this.users.listRoles() });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const users = await this.users.list({
      role: queryValue(req.query.role),
      search: queryValue(req.query.search),
      active: queryValue(req.query.active),
    });
    sendSuccess(res, 200, "Users loaded", { users });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const user = await this.users.getById(req.params.id);
    sendSuccess(res, 200, "User loaded", { user });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const user = await this.users.create(req.body);
    sendSuccess(res, 201, "User created", { user });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const user = await this.users.update(req.params.id, req.body);
    sendSuccess(res, 200, "User updated", { user });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.users.remove(req.params.id);
    sendSuccess(res, 200, "User removed", null);
  };
}
