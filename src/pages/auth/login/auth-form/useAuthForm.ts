import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { instance } from "@/api/axios";
import { toast } from "react-hot-toast";

export function useAuthForm(isLogin: boolean) {
	const { register, handleSubmit } = useForm();
	const [isLoading, setIsLoading] = useState(false);
	const [failedAttempts, setFailedAttempts] = useState(0);
	const [isLocked, setIsLocked] = useState(false);
	const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
	const navigate = useNavigate();

	const showErrorToast = useCallback((message: string) => {
		toast.dismiss();
		toast.error(message);
	}, []);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isLocked) {
			timer = setInterval(() => {
				setLockoutTimeRemaining((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						setIsLocked(false);
						setFailedAttempts(0);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
		return () => clearInterval(timer);
	}, [isLocked]);

	const onSubmit = async (data: any) => {
		if (isLocked) return;

		setIsLoading(true);
		try {
			const response = await instance.post(
				isLogin ? "/auth/login" : "/auth/register",
				data
			);
			localStorage.setItem("token", response.data.token);
			navigate("/");
		} catch (error) {
			console.error("Authentication error:", error);
			setFailedAttempts((prev) => {
				const newAttempts = prev + 1;
				if (newAttempts > 3) {
					setIsLocked(true);
					setLockoutTimeRemaining(10);
					showErrorToast("Too many failed attempts. Please wait 10 seconds before trying again.");
				} else {
					showErrorToast(isLogin ? "Invalid email or password" : "Registration failed. Please try again.");
				}
				return newAttempts;
				});
		} finally {
			setIsLoading(false);
		}
	};

	return {
		register,
		handleSubmit,
		onSubmit,
		isLoading,
		failedAttempts,
		isLocked,
		lockoutTimeRemaining,
	};
}
