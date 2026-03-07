import { CreateUserDTO, UpdateUserDTO } from "../../dtos/user.dto";
import { Request, Response, NextFunction } from "express";
import z from "zod";
import { AdminUserService } from "../../service/admin/admin.service";
import { QueryParams } from "../../types/query.type";

let adminUserService = new AdminUserService();

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

      const userData: CreateUserDTO = parsedData.data;
      const newUser = await adminUserService.createUser(userData);

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

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page: rawPage, size: rawSize, search: rawSearch }: QueryParams = req.query;

      const page = Array.isArray(rawPage) ? rawPage[0] : rawPage;
      const size = Array.isArray(rawSize) ? rawSize[0] : rawSize;
      const search = Array.isArray(rawSearch) ? rawSearch[0] : rawSearch;

      const { users, pagination } = await adminUserService.getAllUsers(
        page,
        size,
        search
      );

      return res.status(200).json({
        success: true,
        data: users,
        pagination,
        message: "All Users Retrieved",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const rawUserId = req.params.id;
      const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

      const parsedData = UpdateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) });
      }

      if (req.file) {
        parsedData.data.profilePicture = `/uploads/${req.file.filename}`;
      }

      const updateData: UpdateUserDTO = parsedData.data;
      const updatedUser = await adminUserService.updateUser(userId, updateData);

      return res
        .status(200)
        .json({ success: true, message: "User Updated", data: updatedUser });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const rawUserId = req.params.id;
      const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

      const deleted = await adminUserService.deleteUser(userId);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, message: "User Deleted" });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const rawUserId = req.params.id;
      const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

      const user = await adminUserService.getUserById(userId);
      return res
        .status(200)
        .json({ success: true, data: user, message: "Single User Retrieved" });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
