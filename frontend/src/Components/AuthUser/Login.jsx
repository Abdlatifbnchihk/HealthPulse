import { useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
// const accountTypes = [
//     { id: 'patient', label: 'Patient Portal' },
//     { id: 'provider', label: 'Doctor / Clinic Staff' },
// ];

function HeartPulseIcon({ className = 'h-8 w-8' }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 32 32"
            fill="none"
            className={className}
        >
            <path
                d="M16 27s-11-6.7-11-14a6.3 6.3 0 0 1 11-4.2A6.3 6.3 0 0 1 27 13c0 7.3-11 14-11 14Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M7.5 16h5l2-4 3.2 8 2-4H25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
            <path
                d="M5 20a7 7 0 0 1 14 0"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ShieldIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
        >
            <path
                d="M12 3 19 6v5c0 4.8-3 8-7 10-4-2-7-5.2-7-10V6l7-3Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
            <path
                d="m9 12 2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CheckIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
        >
            <path
                d="m5 12 4 4L19 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <path
                d="m4 7 8 6 8-6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <rect
                x="4"
                y="10"
                width="16"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <path
                d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
}

function EyeIcon({ visible }) {
    return visible ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
                d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
            <path
                d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.5 0 9 7 9 7a14.8 14.8 0 0 1-3.1 3.9M6.2 6.2C4.1 7.7 3 12 3 12s3.5 7 9 7c1.1 0 2.1-.2 3-.6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
                d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
        </svg>
    );
}

function GoogleIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
            <path
                fill="#4285F4"
                d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z"
            />
            <path
                fill="#34A853"
                d="M12 22c2.7 0 4.97-.9 6.63-2.4l-3.24-2.52c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.6-4.12H3.05v2.6A10 10 0 0 0 12 22Z"
            />
            <path
                fill="#FBBC05"
                d="M6.4 13.92a6 6 0 0 1 0-3.84v-2.6H3.05a10 10 0 0 0 0 9.04l3.35-2.6Z"
            />
            <path
                fill="#EA4335"
                d="M12 5.96c1.47 0 2.78.5 3.82 1.5l2.87-2.87C16.96 2.97 14.7 2 12 2a10 10 0 0 0-8.95 5.48l3.35 2.6c.8-2.36 3-4.12 5.6-4.12Z"
            />
        </svg>
    );
}

function FingerprintIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
                d="M12 4a7 7 0 0 0-7 7m7-4a4 4 0 0 0-4 4c0 4-1 6-2 8m6-12a4 4 0 0 1 4 4c0 5 1 7 2 9m-6-9c0 5-.5 8-1.5 10m-5-7c0 2-.4 4-1.2 5.8M18 11c0 2 .3 4 1 5.8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function HelpIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
            <path
                d="M8.2 7.7a1.9 1.9 0 1 1 3.2 1.4c-.8.7-1.4 1-1.4 2.1m0 2.3v.1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function SecurityPoint({ children }) {
    return (
        <div className="flex gap-4">
            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#11786c] text-[#a3f2e4]">
                <CheckIcon />
            </span>
            <div>
                <h2 className="m-0 text-base font-semibold">{children.title}</h2>
                <p className="mb-0 mt-1 text-sm leading-6 text-[#9bd9cf]">
                    {children.description}
                </p>
            </div>
        </div>
    );
}

function Login() {
    const [accountType, setAccountType] = useState('patient');
    const [showPassword, setShowPassword] = useState(false);
    const [formAlert, setFormAlert] = useState(null);
    const [loginData, setLoginData] = useState({email: '', password: ''});


    const navigate = useNavigate();
    async function handelSubmite(e){
        e.preventDefault();

        try {
            const payload = {
                email: loginData.email,
                password: loginData.password,
            };

            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            if (!baseUrl) throw new Error('VITE_API_BASE_URL is not configured.');

            const response = await axios.post(
                `${baseUrl}/auth/login`,
                payload,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                },);

            const token = response.data.token;
            localStorage.setItem('Auth_token', token)
            localStorage.setItem('Auth_user', JSON.stringify(response.data.user));
            const role = response.data.user.role;
            handelCheckRole(role);
            const message = response.data.message;
            setFormAlert({
                type: 'success',
                message: message,
            });

            setLoginData({
                email: '',
                password: '',
            })


        } catch(error){
            const fieldErrors = error.response?.data?.errors ?? {};

            setFormAlert({
                type: 'error',
                message: error.response?.data?.message || 'Email or Password does not exist.',
                errors: fieldErrors,
            })
        }
    }

    function handelCheckRole(role){
        if(role === 'doctor') {
            navigate('/doctorDashboard');
        } else if(role === 'patient') {
            navigate('/patientDashboard');
        }
    }

    return (
        <div className="min-h-screen bg-[#f7f8fd] text-[#111827]">
            <header className="border-b border-[#e7eaf1] bg-[#f7f8fd]">
                <div className="mx-auto flex min-h-[76px] max-w-[1536px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
                    <a
                        className="inline-flex items-center gap-3 text-lg font-semibold text-[#073f39] no-underline"
                        href="/"
                        aria-label="HealthPulse home"
                    >
                        <HeartPulseIcon />
                        <span>HealthPulse</span>
                    </a>

                    <nav
                        aria-label="Account navigation"
                        className="flex items-center gap-3 text-sm sm:gap-7"
                    >
                        <a
                            href="/"
                            className="hidden text-[#34413f] no-underline hover:text-[#087565] sm:inline"
                        >
                            Home
                        </a>
                        <a
                            href='/login'
                            aria-current="page"
                            className="rounded-full bg-[#0b665a] px-4 py-2 font-semibold text-white no-underline"
                        >
                            Sign In
                        </a>
                        <a
                            href='/Register'
                            className="hidden text-[#34413f] no-underline hover:text-[#087565] sm:inline"
                        >
                            Register
                        </a>
                        <a
                            href="#support"
                            className="hidden text-[#34413f] no-underline hover:text-[#087565] sm:inline"
                        >
                            Support
                        </a>
                    </nav>

                    <a
                        href="/login"
                        aria-label="Account"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#004f45] text-white"
                    >
                        <UserIcon />
                    </a>
                </div>
            </header>

            <main className="mx-auto grid min-h-[calc(100vh-136px)] max-w-[1536px] grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
                <aside className="relative flex min-h-[620px] flex-col overflow-hidden bg-[#004f45] px-7 py-9 text-white sm:px-10 lg:min-h-[900px] lg:px-14 lg:py-12">
                    <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#147b6d]/40 blur-3xl" />

                    <div className="relative flex items-center justify-between gap-4">
                        <a
                            href="/"
                            className="inline-flex items-center gap-3 text-xl font-semibold text-white no-underline"
                        >
                            <HeartPulseIcon className="h-9 w-9 text-[#80e9d8]" />
                            HealthPulse
                        </a>
                        <span className="rounded-full bg-[#0d685d] px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#a9e3da] sm:px-4">
                            System online · v4.8
                        </span>
                    </div>

                    <div className="relative mt-14 max-w-[570px] lg:mt-16">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-[#9bd9cf]">
                            <ShieldIcon className="h-4 w-4" />
                            Tier 4 Clinical Data Protection
                        </span>
                        <h1 className="mb-0 mt-7 text-[clamp(2.5rem,5vw,4.4rem)] font-semibold leading-[1.03] tracking-[-0.05em]">
                            Care that runs on time.
                        </h1>
                        <p className="mb-0 mt-5 text-lg leading-8 text-[#83d2c6] sm:text-xl">
                            Appointments, live doctor availability, and triage notes
                            unified in one verified clinical workspace.
                        </p>
                    </div>

                    <div className="relative mt-10 space-y-6">
                        <SecurityPoint>
                            {{
                                title: 'Booking with live availability',
                                description:
                                    'Instant calendar synchronization across outpatient and specialty departments.',
                            }}
                        </SecurityPoint>
                        <SecurityPoint>
                            {{
                                title: 'AI-assisted symptom triage',
                                description:
                                    'Pre-encounter analysis helps reduce patient intake delays.',
                            }}
                        </SecurityPoint>
                        <SecurityPoint>
                            {{
                                title: 'Private, isolated clinic data',
                                description:
                                    'Designed to keep clinical information private and protected.',
                            }}
                        </SecurityPoint>
                    </div>

                    <div className="relative mt-10 grid grid-cols-2 gap-3 rounded-2xl bg-white/5 p-5 sm:mt-12 sm:gap-5 sm:p-6">
                        <div>
                            <p className="m-0 text-3xl font-semibold tracking-tight text-[#80e9d8] sm:text-4xl">
                                99.4%
                            </p>
                            <p className="mb-0 mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#83d2c6]">
                                Triage concordance
                            </p>
                        </div>
                        <div>
                            <p className="m-0 text-3xl font-semibold tracking-tight text-[#80e9d8] sm:text-4xl">
                                &lt; 30s
                            </p>
                            <p className="mb-0 mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#83d2c6]">
                                Emergency triage routing
                            </p>
                        </div>
                    </div>

                    <p className="relative mb-0 mt-auto pt-12 text-xs font-medium text-[#80c9bd]">
                        <span className="inline-flex items-center gap-2">
                            <LockIcon />
                            End-to-end cryptographic security
                        </span>
                        <span className="float-right hidden sm:inline">
                            © 2025 HealthPulse Clinical Cloud
                        </span>
                    </p>
                </aside>

                <section
                    aria-labelledby="login-heading"
                    className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-12 lg:py-16"
                >
                    <div className="w-full max-w-[650px]">
                        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#087565]">
                            <ShieldIcon className="h-4 w-4" />
                            Encrypted clinical portal
                        </p>
                        <h2
                            id="login-heading"
                            className="m-0 text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-tight tracking-[-0.05em] text-[#111827]"
                        >
                            Welcome back
                        </h2>
                        <p className="mb-0 mt-2 text-base leading-7 text-[#4f5b59]">
                            Log in to manage your appointments, triage notes, and patient
                            records.
                        </p>

                        {/* <div
                            className="mt-7 grid grid-cols-2 rounded-2xl bg-[#eef2ff] p-1"
                            role="group"
                            aria-label="Choose account type"
                        >
                            {accountTypes.map((type) => {
                                const isActive = accountType === type.id;

                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        aria-pressed={isActive}
                                        onClick={() => setAccountType(type.id)}
                                        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 text-xs font-medium transition-colors sm:text-sm ${
                                            isActive
                                                ? 'bg-white text-[#17212d] shadow-sm'
                                                : 'text-[#43504e] hover:text-[#07584e]'
                                        }`}
                                    >
                                        {type.id === 'patient' ? (
                                            <UserIcon />
                                        ) : (
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-5 w-5"
                                            >
                                                <rect
                                                    x="3"
                                                    y="4"
                                                    width="18"
                                                    height="16"
                                                    rx="2"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                />
                                                <path
                                                    d="M8 8h3v3H8zm6 0h3m-3 4h3m-9 1h3v3H8z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                        )}
                                        {type.label}
                                    </button>
                                );
                            })}
                        </div> */}

                        <div className="mt-5 space-y-3">
                            <button
                                type="button"
                                className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#edf0f5] bg-white px-4 text-left text-sm font-medium text-[#17212d] shadow-sm transition-colors hover:bg-[#fbfcff]"
                            >
                                <span className="flex items-center gap-3">
                                    <ShieldIcon className="h-5 w-5 text-[#087565]" />
                                    Continue with Epic MyChart / EHR
                                </span>
                                <span className="rounded-full bg-[#a5efe1] px-3 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#07584e]">
                                    Fast SSO
                                </span>
                            </button>
                            <button
                                type="button"
                                className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#edf0f5] bg-white px-4 text-sm font-medium text-[#17212d] shadow-sm transition-colors hover:bg-[#fbfcff]"
                            >
                                <GoogleIcon />
                                Sign in with Google Workspace
                            </button>
                        </div>

                        <div className="my-6 flex items-center gap-4">
                            <span className="h-px flex-1 bg-[#dfe4ee]" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#43504e]">
                                Or continue with credentials
                            </span>
                            <span className="h-px flex-1 bg-[#dfe4ee]" />
                        </div>

                        <form
                            className="space-y-5"
                            onSubmit={handelSubmite}
                        >
                            <label className="block">
                                <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-[#17212d]">
                                    <span>Email or HealthPulse ID</span>
                                    <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[10px] font-medium text-[#07584e]">
                                        {accountType === 'patient'
                                            ? 'Personal patient account'
                                            : 'Practitioner account'}
                                    </span>
                                </span>
                                <span className="flex min-h-[58px] items-center gap-3 rounded-xl border border-[#e7eaf1] bg-white px-4 shadow-sm focus-within:border-[#78b9ad]">
                                    <span className="text-[#52615d]">
                                        <MailIcon />
                                    </span>
                                    <input
                                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17212d] outline-none placeholder:text-[#89939d]"
                                        type="email"
                                        name="email"
                                        autoComplete="username"
                                        placeholder="you@example.com"
                                        value={loginData.email}
                                        onChange={(event) => {
                                            setLoginData((previous) => (
                                                {
                                                    ...previous,
                                                    email: event.target.value,
                                                }
                                            ))
                                        }}
                                    />
                                </span>
                            </label>

                            <label className="block">
                                <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-[#17212d]">
                                    <span>Password</span>
                                    <a
                                        href="#forgot-password"
                                        className="font-medium text-[#087565] no-underline hover:underline"
                                    >
                                        Forgot password?
                                    </a>
                                </span>
                                <span className="flex min-h-[58px] items-center gap-3 rounded-xl border border-[#e7eaf1] bg-white px-4 shadow-sm focus-within:border-[#78b9ad]">
                                    <span className="text-[#52615d]">
                                        <LockIcon />
                                    </span>
                                    <input
                                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17212d] outline-none placeholder:text-[#89939d]"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="Enter your security password"
                                        value={loginData.password}
                                        onChange={(event) => {
                                            setLoginData((previous) => (
                                                {
                                                    ...previous,
                                                    password: event.target.value,
                                                }
                                            ))
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        aria-label={
                                            showPassword ? 'Hide password' : 'Show password'
                                        }
                                        onClick={() => setShowPassword((visible) => !visible)}
                                        className="text-[#52615d] hover:text-[#07584e]"
                                    >
                                        <EyeIcon visible={showPassword} />
                                    </button>
                                </span>
                            </label>

                            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#43504e]">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        className="h-4 w-4 accent-[#07584e]"
                                        type="checkbox"
                                        name="remember"
                                    />
                                    Keep me signed in on this device
                                </label>
                                <span className="inline-flex items-center gap-1.5 font-medium text-[#34413f]">
                                    <span className="text-[#087565]">
                                        <FingerprintIcon />
                                    </span>
                                    Biometric ready
                                </span>
                            </div>

                            <button
                                className="inline-flex min-h-[62px] w-full items-center justify-center gap-3 rounded-xl bg-[#075f54] px-6 text-base font-semibold text-white shadow-[0_5px_12px_rgba(0,79,69,0.18)] transition-colors hover:bg-[#07685b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087565]"
                                type="submit"
                            >
                                Log in to HealthPulse
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-5 w-5"
                                >
                                    <path
                                        d="M4.5 12h14m-5.5-5.5L18.5 12 13 17.5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {formAlert && (
                                <div
                                    role={formAlert.type === 'error' ? 'alert' : 'status'}
                                    aria-live={formAlert.type === 'error' ? 'assertive' : 'polite'}
                                    className={`rounded-xl border p-4 ${
                                        formAlert.type === 'success'
                                            ? 'border-[#a8dfd3] bg-[#edf9f5] text-[#07584e]'
                                            : 'border-[#f0c2bd] bg-[#fff3f1] text-[#8f3028]'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="m-0 text-sm font-semibold">
                                                {formAlert.type === 'success' ? 'Success' : 'Please check your information'}
                                            </p>
                                            <p className="mb-0 mt-1 text-sm">{formAlert.message}</p>

                                            {Object.entries(formAlert.errors ?? {}).map(([field, messages]) => (
                                                <p key={field} className="mb-0 mt-2 text-sm">
                                                    <span className="font-semibold">{field.replaceAll('_', ' ')}:</span>{' '}
                                                    {messages.join(' ')}
                                                </p>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setFormAlert(null)}
                                            aria-label="Dismiss message"
                                            className="shrink-0 rounded-md px-2 py-1 text-sm font-medium hover:bg-black/5"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>

                        <div className="mt-7 flex gap-4 rounded-2xl bg-[#eef2ff] p-5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#087565] shadow-sm">
                                <ShieldIcon />
                            </span>
                            <div>
                                <h2 className="m-0 text-sm font-semibold text-[#17212d]">
                                    Protected sign-in
                                </h2>
                                <p className="mb-0 mt-1 text-xs leading-5 text-[#5f6b78]">
                                    Your account and health information should only be
                                    accessed on a device you trust.
                                </p>
                            </div>
                        </div>

                        <p className="mb-0 mt-7 text-center text-sm text-[#66716f]">
                            New to HealthPulse?{' '}
                            <a
                                className="font-semibold text-[#07584e] no-underline hover:underline"
                                href="/register"
                            >
                                Create an account
                            </a>
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[10px] font-semibold tracking-wide text-[#43504e]">
                            <a
                                href="#login-help"
                                className="inline-flex items-center gap-2 text-inherit no-underline hover:text-[#087565]"
                            >
                                <HelpIcon />
                                Need login assistance?
                            </a>
                            <span aria-hidden="true" className="text-[#087565]">
                                •
                            </span>
                            <a
                                href="#urgent-care"
                                className="inline-flex items-center gap-2 text-inherit no-underline hover:text-[#087565]"
                            >
                                <span className="text-sm">✚</span>
                                Urgent triage hotline
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-[#eef2ff]">
                <div className="mx-auto flex max-w-[1536px] flex-col gap-3 px-5 py-5 text-[10px] text-[#4f5b59] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                    <span className="inline-flex items-center gap-2 font-medium">
                        <span className="text-[#087565]">
                            <ShieldIcon className="h-4 w-4" />
                        </span>
                        HIPAA &amp; ISO-27001 clinical privacy compliant
                    </span>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <a
                            className="text-inherit no-underline hover:text-[#087565]"
                            href="#support"
                        >
                            Help Center
                        </a>
                        <span>
                            © 2025 HealthPulse Digital Care. All rights reserved.
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Login;