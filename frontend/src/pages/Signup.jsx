import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageSquare, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(fullName, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(0.13_0.005_260)] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[oklch(0.65_0.2_250)] flex items-center justify-center mb-4 shadow-lg shadow-[oklch(0.65_0.2_250)]/20">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Create account</h1>
          <p className="text-sm text-[oklch(0.65_0_0)] mt-1">Join Chatify today</p>
        </div>

        {/* Form */}
        <div className="bg-[oklch(0.17_0.005_260)] rounded-2xl p-8 border border-[oklch(0.28_0.005_260)]">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Arnav Bansal"
                required
                className="w-full px-4 py-3 rounded-xl bg-[oklch(0.22_0.005_260)] border border-[oklch(0.28_0.005_260)] text-white placeholder-[oklch(0.45_0_0)] text-sm focus:outline-none focus:border-[oklch(0.65_0.2_250)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-[oklch(0.22_0.005_260)] border border-[oklch(0.28_0.005_260)] text-white placeholder-[oklch(0.45_0_0)] text-sm focus:outline-none focus:border-[oklch(0.65_0.2_250)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-[oklch(0.22_0.005_260)] border border-[oklch(0.28_0.005_260)] text-white placeholder-[oklch(0.45_0_0)] text-sm focus:outline-none focus:border-[oklch(0.65_0.2_250)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.55_0_0)] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[oklch(0.65_0.2_250)] text-white font-medium text-sm hover:bg-[oklch(0.60_0.2_250)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[oklch(0.55_0_0)] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[oklch(0.65_0.2_250)] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
