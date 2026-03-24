import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OwnerLoginForm } from "@/components/forms/owner-login-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign In — Tattooista",
  description: "Sign in to your Tattooista studio account.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Tattooista</h1>
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <OwnerLoginForm />
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have a studio yet?{" "}
              <Link href="/" className="text-primary hover:underline">
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
