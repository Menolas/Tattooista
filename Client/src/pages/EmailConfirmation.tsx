import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyEmail } from "../redux/Auth/auth-reducer";

const EmailVerified = () => {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState<string>("");
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get('token') || localStorage.getItem('verificationToken');
        console.log('Decoded Token:', token);

        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }

        // Persist the token for fallback
        localStorage.setItem('verificationToken', token);

        // Dispatch the verifyEmail action
        // @ts-ignore
        dispatch(verifyEmail(decodeURIComponent(token)))
            .then(() => {
                setStatus("success");
                setMessage("Email verified successfully!");
            })
            .catch(() => {
                setStatus("error");
                setMessage("Failed to verify email.");
            });
    }, [searchParams, dispatch]);

    return (
        <div className="email-verified-container">
            {status === "loading" && <p>Verifying your email...</p>}
            {status === "success" && <p>{message}</p>}
            {status === "error" && <p>{message}</p>}
        </div>
    );
};

export default EmailVerified;
