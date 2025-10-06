import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"

export function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("[v0] Login attempt:", { email, rememberMe })
        // Add your authentication logic here
    }

    return (
        <div className="space-y-8">
            {/* Logo/Brand */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 login-logo rounded flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-primary-foreground"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="text-xl font-semibold text-foreground">PORTAL</span>
                </div>

                <h2 className="text-4xl font-serif text-foreground text-balance leading-tight">Sign in to your account</h2>
                <p className="text-muted-foreground leading-relaxed">Enter your credentials to access your workspace</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium text-foreground">
                            Password
                        </Label>
                        <a href="#" className="text-sm text-primary hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked)}
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                        Remember me for 30 days
                    </Label>
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 text-base login-button"
                >
                    Sign in
                </Button>
            </form>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">

                </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">


            </div>

            {/* Sign up link */}

        </div>
    )
}
