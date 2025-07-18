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
import { X, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Forgot password response status:', response.status);
      console.log('Forgot password response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Forgot password success data:', data);
        setSuccess(true);
        setEmail("");
      } else {
        console.log('Forgot password error response status:', response.status);
        const errorData = await response.json();
        console.log('Forgot password error data:', errorData);
        setError(errorData.error || "Failed to send reset email. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      setError(`Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setSuccess(false);
    setError("");
    onClose();
  };

  const handleBackToLogin = () => {
    setEmail("");
    setSuccess(false);
    setError("");
    onBackToLogin();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {success ? "Check your email" : "Reset your password"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {success ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Email sent!</h3>
                <p className="text-gray-600 text-sm">
                  We've sent a password reset link to your email address.
                  Check your inbox and click the link to reset your password.
                </p>
                <p className="text-gray-500 text-xs">
                  The link will expire in 1 hour for security reasons.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleBackToLogin}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Back to login
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Forgot your password?</h2>
                <p className="text-gray-600 text-sm">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="resetEmail" className="text-sm font-medium">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="resetEmail"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your email"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white font-medium disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending email...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-black underline"
                  onClick={handleBackToLogin}
                >
                  Back to login
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
