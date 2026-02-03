import { CreateUserDTO, UpdateUserDTO } from "../../dtos/user.dto";
import { Request, Response, NextFunction } from "express";
import z from "zod";
import { AdminUserService } from "../../service/admin/admin.service";

const adminUserService = new AdminUserService();

export class AdminUserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) });
      }

      if (req.file) {
        parsedData.data.profilePicture = `/uploads/${req.file.filename}`;
      }

      const newUser = await adminUserService.createUser(parsedData.data);

      return res
        .status(201)
        .json({ success: true, message: "User Created", data: newUser });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await adminUserService.getAllUsers();
      return res
        .status(200)
        .json({ success: true, data: users });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id as string;

      const parsedData = UpdateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) });
      }

      if (req.file) {
        parsedData.data.profilePicture = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await adminUserService.updateUser(
        userId,
        parsedData.data
      );

      return res
        .status(200)
        .json({ success: true, message: "User Updated", data: updatedUser });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id as string;

      const deleted = await adminUserService.deleteUser(userId);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "User Deleted" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id as string;

      const user = await adminUserService.getUserById(userId);
      return res
        .status(200)
        .json({ success: true, data: user });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
