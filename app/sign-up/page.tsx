import { AuthForm } from '@/components/auth-form'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Sign Up - Nino',
  description: 'Create a new Nino account',
}

export default async function SignUpPage() {
  const { auth } = await import('@/lib/auth')
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Nino</h1>
          <p className="text-muted-foreground">Your AI learning companion</p>
        </div>
        <AuthForm mode="sign-up" />
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <a href="/sign-in" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
