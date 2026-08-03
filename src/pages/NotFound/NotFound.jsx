// src/pages/NotFound.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import "./NotFound.css";

const REDIRECT_DELAY = 5;

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(REDIRECT_DELAY);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/", { replace: true });
    }, REDIRECT_DELAY * 1000);

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 1;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer);
    };
  }, [navigate]);

  return (
    <main className="not-found">
      <div className="not-found__content">
        <div className="not-found__icon">
          <SearchOffRoundedIcon sx={{ fontSize: 72 }} />
        </div>

        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p className="not-found__description">
          Looks like Scout searched everywhere, but couldn't find this page.
        </p>

        <p className="not-found__redirect">
          Redirecting to the homepage in <strong>{countdown}</strong>{" "}
          {countdown === 1 ? "second" : "seconds"}...
        </p>

        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    </main>
  );
};

export default NotFound;
