"use client";
import { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { imageData } from "@/data/imageData";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineClose,
} from "react-icons/ai";
import Link from "next/link";
import "./signmodal.css";

const getRandomImage = () => {
  const categories = Object.keys(imageData.hashtags);
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  const images = imageData.hashtags[randomCategory].images;
  return images[Math.floor(Math.random() * images.length)];
};

const SignInSignUpModal = (props) => {
  const [isSignUp, setIsSignUp] = useState(props.landing || false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(props.username || "");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const recaptchaRef = useRef();

  useEffect(() => {
    if (isSignUp) {
      setAvatar(getRandomImage());
    }
  }, [isSignUp]);

  useEffect(() => {
    if (props.logIsOpen && props.username) {
      setUsername(props.username);
    }
  }, [props.logIsOpen, props.username]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    router.refresh();
  };

  const handleSignUp = async () => {
    setError("");
    setLoading(true);

    const captchaToken = recaptchaRef.current.getValue();
    if (!captchaToken) {
      setError("Please complete the CAPTCHA.");
      setLoading(false);
      return;
    }
    recaptchaRef.current.reset();

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      setError(
        "Username must be 3–30 characters and contain only letters, numbers, or underscores."
      );
      setLoading(false);
      return;
    }

    const payload = {
      email,
      password,
      username,
      avatar,
      captchaToken,
      ...(props.refer &&
        /^[a-zA-Z0-9_]{3,30}$/.test(props.refer) && { refer: props.refer }),
    };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.message);

    await signIn("credentials", { email, password, redirect: false });
  };

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) setError(result.error);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) return setError("Enter your email to reset password");
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.message);
    alert("Password reset email sent! Check your inbox.");
  };

  return (
    <div
      className="modal"
      style={{
        zIndex: props.logIsOpen ? 100 : -100,
        opacity: props.logIsOpen ? 1 : 0,
      }}
      onClick={() => props.setLogIsOpen(false)}
    >
      <div
        className="modal-content"
        style={{
          position: "relative",
          transform: props.logIsOpen ? "translateX(0px)" : "translateX(1000px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => props.setLogIsOpen(false)}
          className="close-button"
          aria-label="Close"
        >
          <AiOutlineClose />
        </button>

        {session ? (
          <>
            <p className="heddio">Welcome, {session.user.username}!</p>
            <img
              src={session.user.avatar.replace(
                "https://img.flawlessfiles.com/_r/100x100/100/avatar/",
                "https://cdn.noitatnemucod.net/avatar/100x100/"
              )}
              alt="Profile"
              className="profile-avatar"
            />
            {props.landing ? (
              <Link href="/home" className="start-earning-btn">
                Start Earning
              </Link>
            ) : (
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="start-earning-btn"
              >
                {loading ? "Signing Out..." : "Sign Out"}
              </button>
            )}
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              isSignUp ? handleSignUp() : handleSignIn();
            }}
            autoComplete="on"
          >
            <div className="heddp">
              <h2 className="heddio">
                {isSignUp ? "Create an Account" : "Welcome back!"}
              </h2>
            </div>

            {isSignUp && (
              <div className="midO">
                <div className="midOT">USERNAME</div>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  className="midOI"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div className="midO">
              <div className="midOT">EMAIL ADDRESS</div>
              <input
                type="email"
                name="email"
                autoComplete="email"
                className="midOI"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="midO">
              <div className="midOT">PASSWORD</div>
              <div className="relati">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="midOI midN"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="icon-position"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="midI">
              <label className="kinto">
                <input
                  type="checkbox"
                  className="checki"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="kinto forget-pass"
              >
                Forgot Password?
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "20px 0",
              }}
            >
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                size="normal"
                theme="light"
              />
            </div>

            {error && (
              <p style={{ color: "#ff9999", marginBottom: "10px" }}>{error}</p>
            )}

            <div className="btiom">
              <button type="submit" className="btio" disabled={loading}>
                {loading ? "Hang in there..." : isSignUp ? "Register" : "Login"}
              </button>
            </div>

            <div className="line-up">
              <div className="kinto">
                <div>
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </div>
                <div className="forget-pass" onClick={toggleMode}>
                  {isSignUp ? "Login" : "Register"}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignInSignUpModal;
