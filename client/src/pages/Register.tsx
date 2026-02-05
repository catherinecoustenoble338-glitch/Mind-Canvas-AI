import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, User } from 'lucide-react';
import { useRegister } from '@/hooks/useAuth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setLocation] = useLocation();
  const register = useRegister();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Derive username from email (before @)
    const username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
    register.mutate({ username, email, name, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-blue-200 shadow-lg">
              Of
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-slate-800">Create an account</CardTitle>
          <CardDescription className="text-center text-slate-500">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {register.error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {register.error.message.includes("409")
                  ? "Email or username already taken"
                  : "Something went wrong. Please try again."}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-9 bg-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  className="pl-9 bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  className="pl-9 bg-white"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={register.isPending}>
              {register.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <div className="text-sm text-slate-500">
            Already have an account?{" "}
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() => setLocation('/login')}
            >
              Sign in
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
