'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AuthPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialMode = searchParams.get('mode') === 'signup';
    const [isSignUp, setIsSignUp] = useState(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // OTP Verification State
    const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [emailForOTP, setEmailForOTP] = useState('');
    const [lastPath, setLastPath] = useState('/');
    const [canResendOTP, setCanResendOTP] = useState(true);
    const [resendTimeout, setResendTimeout] = useState(0);
    const otpInputRefs = useRef([]);
    const modalRef = useRef(null);

    // Password strength
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false
    });

    // Animation variants
    const formVariants = {
        hidden: { opacity: 0, x: isSignUp ? 50 : -50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: isSignUp ? -50 : 50 }
    };

    // Track last visited page before auth
    useEffect(() => {
        setLastPath(sessionStorage.getItem('lastPath') || '/');
    }, []);

    // Update URL when auth mode changes
    useEffect(() => {
        const newUrl = `${window.location.pathname}?mode=${isSignUp ? 'signup' : 'signin'}`;
        if (window.location.search !== `?mode=${isSignUp ? 'signup' : 'signin'}`) {
            window.history.replaceState(null, '', newUrl);
        }
    }, [isSignUp]);

    // Handle password strength calculation
    useEffect(() => {
        if (isSignUp) {
            setPasswordStrength({
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                specialChar: /[^A-Za-z0-9]/.test(password)
            });
        }
    }, [password, isSignUp]);

    // Handle OTP input changes
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5 && otpInputRefs.current[index + 1]) {
            otpInputRefs.current[index + 1].focus();
        }
    };

    // Handle OTP paste
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').trim();
        if (/^\d{6}$/.test(pasteData)) {
            const pasteArray = pasteData.split('');
            setOtp(pasteArray.slice(0, 6));
        }
    };

    // Auto-submit when OTP is complete
    useEffect(() => {
        if (otp.join('').length === 6) {
            verifyOTP();
        }
    }, [otp]);

    // Handle OTP resend timer
    useEffect(() => {
        let timer;
        if (resendTimeout > 0) {
            timer = setInterval(() => {
                setResendTimeout(prev => prev - 1);
            }, 1000);
        } else if (resendTimeout === 0 && !canResendOTP) {
            setCanResendOTP(true);
        }
        return () => clearInterval(timer);
    }, [resendTimeout, canResendOTP]);

    // Click outside handler for modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                event.stopPropagation();
            }
        };

        if (isOTPModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOTPModalOpen]);

    const toggleAuthMode = () => {
        setIsSignUp(prev => !prev);
        setError('');
        setEmail('');
        setPassword('');
        setName('');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateInputs()) return;

        setIsLoading(true);

        try {
            if (isSignUp) {
                // For sign-up
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: name,
                        email,
                        password
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }

                // Show OTP for sign-up
                setEmailForOTP(email);
                setIsOTPModalOpen(true);
                setCanResendOTP(false);
                setResendTimeout(30);
            } else {
                // For sign-in
                const response = await fetch('/api/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Login failed');
                }

                const data = await response.json();

                // Set cookies for authentication
                document.cookie = `accessToken=Bearer ${data.accessToken}; path=/; secure; samesite=lax`;
                document.cookie = `refreshToken=${data.refreshToken}; path=/auth/refresh; secure; samesite=lax`;

                // Redirect to last path or home
                router.replace(lastPath);
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = async () => {
        setError('');
        setIsLoading(true);

        try {
            const otpString = otp.join('');
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailForOTP.trim(),
                    otp: otpString.trim()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Verification failed');
            }

            if (isSignUp) {
                // For signup verification
                const data = await response.json();
                const accessToken = data.accessToken.toString('hex');
                console.log("accessToken : " + accessToken);

                document.cookie = `accessToken=Bearer ${(accessToken)}; path=/; secure; samesite=lax`;
                document.cookie = `refreshToken=${data.refreshToken}; path=/auth/refresh; secure; samesite=lax`;

                sessionStorage.setItem('showWelcome', 'true');
            }

            router.replace(lastPath);
        } catch (err) {
            setError(err.message || 'Verification failed. Please try again.');
            setOtp(['', '', '', '', '', '']);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResendOTP) return;

        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailForOTP }),
            });

            // First check response content type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(text.includes('<!DOCTYPE html>')
                    ? 'Server error occurred'
                    : text);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to resend OTP');
            }

            setCanResendOTP(false);
            setResendTimeout(30);
            toast.success('New OTP sent successfully');

        } catch (err) {
            console.error('Resend error:', err);
            toast.error(err.message || 'Failed to resend OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const validateInputs = () => {
        if (!email || !password) {
            setError('Email and password are required');
            return false;
        }

        if (isSignUp) {
            if (!name || name.length < 3) {
                setError('Username must be at least 3 characters');
                return false;
            }
            if (password.length < 8) {
                setError('Password must be at least 8 characters');
                return false;
            }
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    // Calculate password strength score (0-5)
    const passwordScore = Object.values(passwordStrength).filter(Boolean).length;

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')" }}>

            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            {/* Main Auth Container */}
            <div className="relative z-10 w-full max-w-md px-4">
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
                        <div className="flex justify-center items-center space-x-2">
                            <span className="text-3xl font-bold text-white">Belle</span>
                            <span className="text-3xl font-bold text-white">Mart</span>
                        </div>
                        <h2 className="mt-2 text-xl font-semibold text-white">
                            {isSignUp ? 'Create Your Account' : 'Welcome Back!'}
                        </h2>
                    </div>

                    {/* Forms */}
                    <div className="p-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 bg-red-50/90 border-l-4 border-red-500 p-4 rounded"
                            >
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-red-700">{error}</span>
                                </div>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            <motion.form
                                key={isSignUp ? 'signup' : 'signin'}
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label htmlFor="name" className="block text-sm font-medium text-white">
                                            Full Name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-white/30 bg-white/20 py-2 px-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </motion.div>
                                )}

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label htmlFor="email" className="block text-sm font-medium text-white">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-white/30 bg-white/20 py-2 px-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <label htmlFor="password" className="block text-sm font-medium text-white">
                                        Password
                                        {isSignUp && (
                                            <span className="float-right text-xs font-normal">
                                                Strength:
                                                <span className={`ml-1 font-medium ${passwordScore < 2 ? 'text-red-400' :
                                                    passwordScore < 4 ? 'text-yellow-400' : 'text-green-400'
                                                    }`}>
                                                    {passwordScore}/5
                                                </span>
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete={isSignUp ? "new-password" : "current-password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-white/30 bg-white/20 py-2 px-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                        placeholder={isSignUp ? "At least 8 characters" : "Enter your password"}
                                    />

                                    {isSignUp && (
                                        <div className="mt-2 text-xs text-white/80">
                                            <div className="grid grid-cols-2 gap-1">
                                                <div className={`flex items-center ${passwordStrength.length ? 'text-green-300' : ''}`}>
                                                    {passwordStrength.length ? '✓' : '•'} 8+ characters
                                                </div>
                                                <div className={`flex items-center ${passwordStrength.uppercase ? 'text-green-300' : ''}`}>
                                                    {passwordStrength.uppercase ? '✓' : '•'} Uppercase
                                                </div>
                                                <div className={`flex items-center ${passwordStrength.lowercase ? 'text-green-300' : ''}`}>
                                                    {passwordStrength.lowercase ? '✓' : '•'} Lowercase
                                                </div>
                                                <div className={`flex items-center ${passwordStrength.number ? 'text-green-300' : ''}`}>
                                                    {passwordStrength.number ? '✓' : '•'} Number
                                                </div>
                                                <div className={`flex items-center ${passwordStrength.specialChar ? 'text-green-300' : ''}`}>
                                                    {passwordStrength.specialChar ? '✓' : '•'} Special char
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                {isSignUp && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="flex items-start"
                                        >
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="terms"
                                                    name="terms"
                                                    type="checkbox"
                                                    required
                                                    className="h-4 w-4 rounded border-white/30 bg-white/20 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="terms" className="text-white">
                                                    I agree to the{' '}
                                                    <Link href="/terms" className="font-medium text-white hover:text-indigo-100 underline">
                                                        Terms
                                                    </Link>{' '}
                                                    and{' '}
                                                    <Link href="/privacy" className="font-medium text-white hover:text-indigo-100 underline">
                                                        Privacy Policy
                                                    </Link>
                                                </label>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.45 }}
                                            className="flex items-start"
                                        >
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="newsletter"
                                                    name="newsletter"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-white/30 bg-white/20 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="newsletter" className="text-white">
                                                    Subscribe to our newsletter
                                                </label>
                                            </div>
                                        </motion.div>
                                    </>
                                )}

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ${isLoading ? 'opacity-80' : ''}`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {isSignUp ? 'Creating account...' : 'Signing in...'}
                                            </>
                                        ) : isSignUp ? 'Create Account' : 'Sign In'}
                                    </button>
                                </motion.div>
                            </motion.form>
                        </AnimatePresence>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/30"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-2 bg-transparent text-sm text-white/80">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="inline-flex justify-center items-center py-2 px-4 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                    </svg>
                                    <span className="ml-2">GitHub</span>
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center items-center py-2 px-4 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                    <span className="ml-2">Twitter</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={toggleAuthMode}
                                className="text-sm font-medium text-white hover:text-indigo-100 transition-colors"
                            >
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                                <span className="font-semibold underline">
                                    {isSignUp ? 'Sign in' : 'Sign up'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Verification Modal */}
            <AnimatePresence>
                {isOTPModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
                        <div className="relative z-10 w-full max-w-md p-4">
                            <motion.div
                                ref={modalRef}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-lg shadow-xl overflow-hidden"
                            >
                                <div className="px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Verify Your Email
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        We've sent a 6-digit code to <span className="font-semibold">{emailForOTP}</span>
                                    </p>

                                    <div className="mb-4">
                                        <div className="flex justify-center space-x-2">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => (otpInputRefs.current[index] = el)}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength="1"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onPaste={handleOtpPaste}
                                                    onFocus={(e) => e.target.select()}
                                                    className="w-12 h-12 text-2xl text-center text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="mb-4 text-sm text-red-600">{error}</div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={handleResendOTP}
                                            disabled={!canResendOTP || isLoading}
                                            className={`text-sm font-medium ${canResendOTP ? 'text-indigo-600 hover:text-indigo-500' : 'text-gray-400'}`}
                                        >
                                            {resendTimeout > 0 ? `Resend in ${resendTimeout}s` : 'Resend Code'}
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsOTPModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        onClick={verifyOTP}
                                        disabled={isLoading || otp.join('').length !== 6}
                                        className={`px-4 py-2 bg-indigo-600 text-sm font-medium text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${(isLoading || otp.join('').length !== 6) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}