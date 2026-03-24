"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateStudioForm } from "@/components/forms/create-studio-form"
import { OwnerLoginForm } from "@/components/forms/owner-login-form"

export function PlatformLanding() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Tattooista</h1>
          <p className="mt-2 text-muted-foreground">
            {showLogin
              ? "Sign in to your studio"
              : "Create your tattoo studio in minutes"}
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {showLogin ? "Welcome back" : "Create your studio"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showLogin ? (
              <>
                <OwnerLoginForm />
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Don&apos;t have a studio yet?{" "}
                  <button
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="text-primary hover:underline"
                  >
                    Create one
                  </button>
                </p>
              </>
            ) : (
              <>
                <CreateStudioForm />
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have a studio?{" "}
                  <button
                    type="button"
                    onClick={() => setShowLogin(true)}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
