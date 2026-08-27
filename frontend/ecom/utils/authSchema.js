import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().email("Email không đúng định dạng"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự")
});

export const registerSchema = z.object({
    firstName: z.string().trim().min(1, "Vui lòng nhập tên"),
    lastName: z.string().trim().min(1, "Vui lòng nhập họ"),
    email: z.string().trim().email("Email không đúng định dạng"),
    phone: z.string().trim().regex(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ"),
    place: z.string().trim().min(3, "Vui lòng nhập địa chỉ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"]
});

export const forgetPasswordSchema = z.object({
    email: z.string().trim().email("Email không đúng định dạng")
});

export const resetPasswordSchema = z.object({
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"]
});
