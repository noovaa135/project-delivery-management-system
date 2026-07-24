"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, Boxes } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, type SignInInput } from "@/schemas/auth";
import { cn } from "@/lib/utils";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "admin@pdms.local", password: "AdminPass1234!" },
  });

  async function onSubmit(values: SignInInput) {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
      callbackUrl,
    });
    setIsSubmitting(false);

    if (result?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Signed in successfully");
    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.08)_0%,_transparent_60%)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl shadow-2xl">
          <div className="p-8 space-y-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20"
            >
              <Boxes className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground/60">Sign in to your PDMS account</p>
            </div>
          </div>

          <div className="px-8 pb-8">
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-muted-foreground/70">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={cn(
                    "h-11 rounded-xl border-border/30 bg-muted/20 focus-visible:ring-primary/30",
                    form.formState.errors.email && "border-destructive",
                  )}
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-muted-foreground/70">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={cn(
                      "h-11 rounded-xl border-border/30 bg-muted/20 pr-10 focus-visible:ring-primary/30",
                      form.formState.errors.password && "border-destructive",
                    )}
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl text-base font-medium" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-2 rounded-xl border border-border/20 bg-muted/20 p-4">
              <p className="text-xs font-medium text-muted-foreground/60">Demo Credentials</p>
              <div className="space-y-1 text-xs text-muted-foreground/50">
                <p>Email: <span className="font-medium text-foreground/70">admin@pdms.local</span></p>
                <p>Password: <span className="font-medium text-foreground/70">AdminPass1234!</span></p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
