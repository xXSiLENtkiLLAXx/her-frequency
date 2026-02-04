import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type AuthMode = "login" | "signup" | "reset";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mode, setMode] = useState<AuthMode>("login");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setTimeout(() => {
            checkAdminAndRedirect(session.user.id);
          }, 0);
        } else {
          setCheckingAuth(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkAdminAndRedirect(session.user.id);
      } else {
        setCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminAndRedirect = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });

      if (error) throw error;

      if (data) {
        navigate("/events/admin");
      } else {
        setError("You don't have admin access. Please contact the administrator.");
        await supabase.auth.signOut();
        setCheckingAuth(false);
      }
    } catch (err) {
      console.error("Error checking admin role:", err);
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Please verify your email address before logging in.");
        } else {
          setError(authError.message);
        }
        return;
      }

      if (data.user) {
        const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
          _user_id: data.user.id,
          _role: 'admin'
        });

        if (roleError) throw roleError;

        if (isAdmin) {
          toast.success("Welcome back!");
          navigate("/events/admin");
        } else {
          setError("You don't have admin access. Please contact the administrator.");
          await supabase.auth.signOut();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/events/admin/login`,
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("This email is already registered. Please sign in instead.");
        } else {
          setError(authError.message);
        }
        return;
      }

      setSuccess("Account created! Please check your email to verify your account, then contact the administrator to grant admin access.");
      setMode("login");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/events/admin/login`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <Layout>
        <section className="section-padding bg-gradient-soft min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Checking authentication...</span>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding bg-gradient-soft min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              {mode === "reset" ? (
                <Mail className="h-6 w-6 text-primary" />
              ) : (
                <Lock className="h-6 w-6 text-primary" />
              )}
            </div>
            <CardTitle className="font-display text-2xl">
              {mode === "login" && "Admin Login"}
              {mode === "signup" && "Create Admin Account"}
              {mode === "reset" && "Reset Password"}
            </CardTitle>
            <CardDescription>
              {mode === "login" && "Sign in to access the event administration dashboard"}
              {mode === "signup" && "Create your account to request admin access"}
              {mode === "reset" && "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handlePasswordReset} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription className="text-primary">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {mode !== "reset" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {mode === "login" && "Signing in..."}
                    {mode === "signup" && "Creating account..."}
                    {mode === "reset" && "Sending reset email..."}
                  </>
                ) : (
                  <>
                    {mode === "login" && "Sign In"}
                    {mode === "signup" && "Create Account"}
                    {mode === "reset" && "Send Reset Email"}
                  </>
                )}
              </Button>

              <div className="text-center space-y-2 pt-2">
                {mode === "login" && (
                  <>
                    <button
                      type="button"
                      onClick={() => { setMode("reset"); setError(null); setSuccess(null); }}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot your password?
                    </button>
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
                        className="text-primary hover:underline"
                      >
                        Sign up
                      </button>
                    </p>
                  </>
                )}
                {mode === "signup" && (
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                      className="text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
                {mode === "reset" && (
                  <button
                    type="button"
                    onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                    className="text-sm text-primary hover:underline"
                  >
                    Back to sign in
                  </button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default AdminAuth;
