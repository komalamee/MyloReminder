"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, LoaderCircle, Slack, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

type FormStatus = "idle" | "loading" | "success" | "error"

interface OnboardingFormData {
  slackWebhook: string
  email: string
}

interface OnboardingPageProps {
  onSubmit?: (data: OnboardingFormData) => Promise<{ success: boolean; error?: string }>
  title?: string
  description?: string
}

function OnboardingPage({
  onSubmit,
  title = "Welcome to Mylo Reminder",
  description = "Let's get you set up with your integrations to start receiving smart reminders."
}: OnboardingPageProps) {
  const [formState, setFormState] = useState({
    slackWebhook: "",
    email: "",
    status: "idle" as FormStatus,
    message: "",
  })

  const isLoading = formState.status === "loading"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSubmit) return

    setFormState((prev) => ({ ...prev, status: "loading", message: "" }))

    try {
      const result = await onSubmit({
        slackWebhook: formState.slackWebhook,
        email: formState.email,
      })
      
      if (!result.success) {
        setFormState((prev) => ({
          ...prev,
          status: "error",
          message: result.error || "Something went wrong",
        }))
      } else {
        setFormState((prev) => ({
          ...prev,
          status: "success",
          message: "Setup completed successfully!",
        }))
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        status: "error",
        message: error instanceof Error ? error.message : "Failed to complete setup",
      }))
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Setup Your Integrations</CardTitle>
            <CardDescription>
              Connect your accounts to receive personalized reminders across your favorite platforms.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Slack Integration */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Slack className="h-5 w-5 text-purple-600" />
                  <Label htmlFor="slack-webhook" className="text-base font-medium">
                    Slack Webhook URL
                  </Label>
                </div>
                <Input
                  id="slack-webhook"
                  type="url"
                  placeholder="https://hooks.slack.com/services/..."
                  value={formState.slackWebhook}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, slackWebhook: e.target.value }))
                  }
                  disabled={isLoading}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Get reminders directly in your Slack workspace. 
                  <a href="#" className="text-primary hover:underline ml-1">
                    Learn how to create a webhook
                  </a>
                </p>
              </div>

              {/* Email Integration */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <Label htmlFor="email" className="text-base font-medium">
                    Email Address
                  </Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={isLoading}
                  className="w-full"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Receive important reminders and notifications via email.
                </p>
              </div>

              {/* Future Integrations Placeholder */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-muted-foreground">
                  Coming Soon
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg bg-muted/20 opacity-60">
                    <p className="font-medium text-sm">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">Direct messaging reminders</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-muted/20 opacity-60">
                    <p className="font-medium text-sm">Calendar Integration</p>
                    <p className="text-xs text-muted-foreground">Smart meeting reminders</p>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {formState.message && (
                <div
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg text-sm",
                    formState.status === "error"
                      ? "bg-destructive/10 text-destructive border border-destructive/20"
                      : "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
                  )}
                  role="alert"
                  aria-live="polite"
                >
                  {formState.status === "error" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {formState.message}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full group relative"
                disabled={isLoading || !formState.email}
                size="lg"
              >
                <span className={cn(
                  "inline-flex items-center",
                  isLoading && "text-transparent"
                )}>
                  Complete Setup
                  <ArrowRight
                    className="-me-1 ms-2 h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoaderCircle
                      className="animate-spin"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need help? Check out our{" "}
            <a href="#" className="text-primary hover:underline">
              setup guide
            </a>{" "}
            or{" "}
            <a href="#" className="text-primary hover:underline">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Mock function for demo
async function mockOnboardingSubmit(data: OnboardingFormData) {
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  if (!data.email) {
    return { success: false, error: 'Email is required' }
  }
  
  if (data.slackWebhook && !data.slackWebhook.includes('hooks.slack.com')) {
    return { success: false, error: 'Invalid Slack webhook URL' }
  }
  
  return { success: true }
}

function OnboardingDemo() {
  return (
    <OnboardingPage 
      onSubmit={mockOnboardingSubmit}
    />
  )
}

export default OnboardingDemo
