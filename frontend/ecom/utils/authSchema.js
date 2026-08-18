import { data } from "react-router-dom";
import { email, z } from "zod";

export const loginSchema = z.object({

    email: z.string().email("Email không đúng định dạng"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 kí tự") 
    
});

export const forgetPasswordSchema = z.object({
    email: z.string().email("Email không đúng định dạng")
});

export const resetPasswordSchema = z.object({
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 kí tự"),

    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"]
});