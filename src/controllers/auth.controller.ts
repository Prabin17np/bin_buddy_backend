import { Request, Response } from "express";
import { UserService } from "../service/user.service";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import z from "zod";

const userService = new UserService();

export class AuthController {
  // REGISTER
  async register(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const newUser = await userService.createUser(parsedData.data);
      return res.status(201).json({
        success: true,
        message: "User created",
        data: newUser,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // LOGIN
  async login(req: Request, res: Response) {
    try {
      const parsedData = LoginUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const { token, user } = await userService.loginUser(parsedData.data);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
        token,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // UPDATE USER
  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not provided",
        });
      }

      const parsedData = UpdateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const updatePayload: any = { ...parsedData.data };
      if (req.file) {
        updatePayload.profilePicture = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await userService.updateUser(userId, updatePayload);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // UPLOAD PROFILE PICTURE
  async uploadProfilePicture(req: Request, res: Response) {
    try {
      const file = req.file as Express.Multer.File;
      const fileName = await userService.uploadProfilePicture(file);
      return res.status(200).json({
        success: true,
        message: "Photo uploaded successfully",
        data: fileName,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // SEND RESET PASSWORD EMAIL
  async sendResetPasswordEmail(req: Request, res: Response) {
    try {
      const rawEmail = req.body.email;
      // Ensure email is a string
      const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail;

      const user = await userService.sendResetPasswordEmail(email);
      return res.status(200).json({
        success: true,
        data: user,
        message: "If the email is registered, a reset link has been sent.",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // RESET PASSWORD
  async resetPassword(req: Request, res: Response) {
    try {
      const rawToken = req.params.token;
      const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

      const rawNewPassword = req.body.newPassword;
      const newPassword = Array.isArray(rawNewPassword)
        ? rawNewPassword[0]
        : rawNewPassword;

      await userService.resetPassword(token, newPassword);

      return res.status(200).json({
        success: true,
        message: "Password has been reset successfully.",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
