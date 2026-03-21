import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { ResetPasswordContent } from "./reset-password-content"

export const metadata = {
  title: "Reset Password",
}

export default function ResetPasswordPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Reset your account password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="flex justify-center py-8"><LoadingSpinner /></div>}>
          <ResetPasswordContent />
        </Suspense>
      </CardContent>
    </Card>
  )
}
