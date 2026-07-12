import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../shared/components/ui/card"
import { toast } from "sonner"
import { Leaf, ArrowLeft } from "lucide-react"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ForgotPasswordValues) {
    setIsLoading(true)
    try {
      await apiClient.post("/api/v1/auth/forgot-password", data)
      setIsSubmitted(true)
      toast.success("Password reset instructions sent!")
    } catch (error: any) {
      toast.error(error.message || "Failed to process request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Leaf className="h-6 w-6 text-environmental" />
        <span className="font-bold text-xl tracking-tight">EcoSphere</span>
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-muted/50">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="rounded-full bg-environmental/10 p-3">
                <Leaf className="h-6 w-6 text-environmental" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                We've sent a password reset link to <br />
                <span className="font-medium text-foreground">{form.getValues().email}</span>
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending link..." : "Send reset link"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-2">
          <Link to="/login" className="flex items-center text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
