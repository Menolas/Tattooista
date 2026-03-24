import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyEmail } from "@/lib/actions/auth"
import { CheckCircle, XCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address.",
}

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams
  const token = params.token

  if (!token) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Invalid Link</CardTitle>
          <CardDescription className="text-center">
            This verification link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/?mode=login">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const result = await verifyEmail(token)

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {result.success ? "Email Verified!" : "Verification Failed"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.success ? (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {result.message}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{result.error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center">
          <Button asChild>
            <Link href="/?mode=login">Go to Login</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
