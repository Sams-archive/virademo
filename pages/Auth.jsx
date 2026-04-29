import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Zap } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [showPass, setShowPass] = useState(false);

  const isLogin = mode === "login";
  const isSignup = mode === "signup";

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Demo mode: Auth disabled");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-white text-2xl font-bold">
              VIR<span className="text-accent2">A</span>
            </span>
          </Link>

          <h1 className="text-2xl text-white mb-2">
            {isLogin ? "Welcome back." : "Create account"}
          </h1>
        </div>

        <div className="bg-card border rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {isSignup && (
              <input placeholder="Full name" className="input-field" />
            )}

            <input placeholder="Email" className="input-field" />

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button className="btn-primary w-full">
              {isLogin ? "Sign in" : "Create account"} <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-white/40">
            {isLogin ? "No account?" : "Have account?"}{" "}
            <button onClick={() => setMode(isLogin ? "signup" : "login")}>
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>

          {isSignup && (
            <div className="mt-4 text-xs text-white/50 flex items-center gap-2">
              <Zap size={12} /> Demo plan enabled
            </div>
          )}
        </div>
      </div>
    </div>
  );
}