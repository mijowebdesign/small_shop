import React, { useActionState, useEffect, useRef, useState } from 'react';
import { User, Lock, Loader2, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { action } from './utils/actions';
import { useAuth } from '@/context/AuthContext';

const LoginForm: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(action, null);
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    useEffect(() => {
        if (state?.formData) {
            const performLogin = async () => {
                setIsSubmitting(true);
                setLoginError(null);
                try {
                    await login(state.formData);
                    navigate('/admin-panel');
                } catch (err: any) {
                    setLoginError(err.response?.data?.message || 'Prijava nije uspela. Proverite podatke.');
                } finally {
                    setIsSubmitting(false);
                }
            };
            performLogin();
        }
    }, [state, login, navigate]);

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-indigo-600 p-8 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm mb-4">
                        <LogIn className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Dobrodošli</h1>
                    <p className="text-indigo-100 text-sm mt-1">Unesite podatke za pristup</p>
                </div>

                <div className="p-8">
                    <form 
                        noValidate
                        ref={formRef}
                        action={formAction}
                        className="space-y-5"
                    >
                        {(loginError || state?.errors?.email) && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-700">
                                {loginError || state?.errors?.email}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Email adresa</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="admin@test.com"
                                />
                                {state?.errors?.email && <p className="text-red-600 text-xs mt-1">{state.errors.email}</p>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Lozinka</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="sifra123"
                                />
                                {state?.errors?.password && <p className="text-red-600 text-xs mt-1">{state.errors.password}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                                isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5" /> Provera...
                                </>
                            ) : (
                                'Prijavi se'
                            )}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300"></span>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">ili nastavi putem</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/google`}
                            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Google
                        </button>

                        <Link to="/register" className="block text-center text-sm text-indigo-600 hover:text-indigo-800 mt-4">
                            Nemate nalog? Registrujte se
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
