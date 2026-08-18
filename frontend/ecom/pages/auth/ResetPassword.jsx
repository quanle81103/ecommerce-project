import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { resetPasswordSchema } from "../../utils/authSchema";
import { responseResetPassword } from "../../services/authService";
import { toast } from "sonner";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();

    const rawToken = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    async function handleResetPassword() {
        const result = resetPasswordSchema.safeParse({password, confirmPassword});

        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        try {
            const res = await responseResetPassword(rawToken, password);
            toast.message("Đổi mật khẩu thành công");
        } catch (error) {
            console.log(error.message);
            toast.error("Đổi mật khẩu thất bại");
        }
    }

    return (
        <div className="h-full flex justify-center items-center bg-cyan-100">
            <div className="w-96 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
                <h1 className="text-2xl text-center font-bold">
                    Reset Password
                </h1>

                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    className="border p-2 rounded"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    className="border p-2 rounded"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    className="bg-cyan-600 text-white p-2 rounded"
                    onClick={handleResetPassword}
                >
                    Xác nhận
                </button>
            </div>
        </div>
    )
}