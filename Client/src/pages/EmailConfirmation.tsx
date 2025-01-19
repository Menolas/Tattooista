import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";
import {verifyEmail} from "../redux/Auth/auth-reducer";

const EmailVerified = () => {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState<string>("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }

        // @ts-ignore
        dispatch(verifyEmail(token));
    }, [searchParams, navigate]);

    return (
        <div className="email-verified-container">
            {status === "loading" && <p>Verifying your email...</p>}
            {status === "success" && <p className="success">{message}</p>}
            {status === "error" && <p className="error">{message}</p>}
        </div>
    );
};

export default EmailVerified;
