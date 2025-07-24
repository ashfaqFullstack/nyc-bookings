"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup, onForgotPassword }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        onClose();
        setFormData({ email: "", password: "" });
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Log in</DialogTitle>
            {/* <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Welcome to NewYorkCityBookings</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="loginEmail" className="text-sm font-medium">Email</label>
                <Input
                  id="loginEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="loginPassword" className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    id="loginPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="h-12 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm underline text-black"
                  onClick={onForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#2575b8] hover:bg-[#2575b8]/80 text-white font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-black underline"
                onClick={onSwitchToSignup}
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
