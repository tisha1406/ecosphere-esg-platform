import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../app/providers/AuthProvider"
import { apiClient } from "../../shared/lib/api-client"
import { Button } from "../../shared/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../shared/components/ui/form"
import { Input } from "../../shared/components/ui/input"
import { toast } from "sonner"
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  remember_me: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<any>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember_me: false,
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    try {
      const res = await apiClient.post<any, { access_token: string }>(
        "/api/v1/auth/login",
        data
      )
      await login(res.access_token)
      toast.success("Welcome back!")
      navigate("/")
    } catch (error: any) {
      const msg = error?.message || "Failed to sign in"
      toast.error(msg)
      if (msg.includes("Too many")) {
        form.setError("email", { message: "Account temporarily locked. Try again in 15 min." })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-green-500/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      {/* Brand mark */}
      <div className="absolute top-6 left-6 flex items-center gap-2.5">
        <div className="rounded-lg bg-green-600/10 p-1.5">
          <Leaf className="h-5 w-5 text-green-600" />
        </div>
        <span className="text-lg font-bold tracking-tight">EcoSphere</span>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md mx-4">
        <div className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10 dark:shadow-black/40">
          {/* Card header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600/10 ring-1 ring-green-600/20">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to your EcoSphere dashboard
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="login-email"
                          placeholder="name@company.com"
                          type="email"
                          autoComplete="email"
                          className="h-10 rounded-lg border-input/80 bg-background/60 transition-colors focus:border-green-500/60 focus:ring-green-500/20"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="text-xs font-medium text-green-600 hover:text-green-700 hover:underline transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            className="h-10 rounded-lg border-input/80 bg-background/60 pr-10 transition-colors focus:border-green-500/60 focus:ring-green-500/20"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remember Me */}
                <FormField
                  control={form.control}
                  name="remember_me"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2.5">
                      <FormControl>
                        <input
                          id="remember-me"
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-input accent-green-600 cursor-pointer"
                        />
                      </FormControl>
                      <FormLabel htmlFor="remember-me" className="text-sm font-normal text-muted-foreground cursor-pointer select-none">
                        Remember me for 30 days
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  id="login-submit"
                  type="submit"
                  className="h-10 w-full rounded-lg bg-green-600 font-medium text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-[0.99] disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>

            {/* Divider + register link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-green-600 hover:text-green-700 hover:underline transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
