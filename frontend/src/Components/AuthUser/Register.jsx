import { useState, useEffect } from 'react';
import axios from 'axios';


const registrationTypes = [
    {
        id: 'patient',
        title: 'Patient',
        badge: 'Standard',
        description: 'Book visits, manage prescriptions, and track your health.',
    },
    {
        id: 'doctor',
        title: 'Doctor',
        badge: 'Healthcare provider',
        description: 'Manage your clinical schedule, appointments, and patient care.',
    },
];

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

function InputIcon({ type }) {
    if (type === 'email') {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                <path
                    d="M16 16v-5a4 4 0 1 0-1.2 2.8c.5 1.3 2.2 1.6 3.2.6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
            </svg>
        );
    }

    if (type === 'password') {
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

    if (type === 'phone') {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <rect
                    x="7"
                    y="2.5"
                    width="10"
                    height="19"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                />
                <path
                    d="M10 5h4m-3 13.5h2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
            </svg>
        );
    }

    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <rect
                x="4"
                y="5"
                width="16"
                height="15"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path
                d="M6.5 16a2.5 2.5 0 0 1 5 0m3-6h3m-3 3h3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function SecurityBadge({ children }) {
    return (
        <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-[10px] font-semibold text-white">
            <span className="text-[#80e9d8]">
                <CheckIcon />
            </span>
            {children}
        </div>
    );
}

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [clinics, setClinics] = useState([]);
    const [clinicsLoading, setClinicsLoading] = useState(false);
    const [clinicsError, setClinicsError] = useState('');
    const [isSubmitting , setIsSubmitting] = useState(false);
    const [formAlert, setFormAlert] = useState(null);
    const [registrationInputs, setRegistrationInputs] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'patient',
        tenant_id: '',
        specialty: '',
        fee: '',
        slot_duration: '',
        phone: '',
    });

    // Load the clinics
    useEffect(() => {
        if (registrationInputs.role !== 'doctor') return;

        const controller = new AbortController();

        async function loadClinics() {
            setClinicsLoading(true);
            setClinicsError('');

            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL;
                if (!baseUrl) throw new Error('VITE_API_BASE_URL is not configured.');

                const response = await fetch(
                    `${baseUrl.replace(/\/$/, '')}/clinics`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error(`Could not load clinics (HTTP ${response.status}).`);
                }

                const { data = [] } = await response.json();
                setClinics(data);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setClinicsError(
                        error instanceof Error ? error.message : 'Could not load clinics.',
                    );
                }
            } finally {
                if (!controller.signal.aborted) setClinicsLoading(false);
            }
        }

        loadClinics();
        return () => controller.abort();
    }, [registrationInputs.role]);


    // Display error or success message
    useEffect(() => {
        if (formAlert?.type !== 'success') return;

        const timer = setTimeout(() => setFormAlert(null), 5000);
        return () => clearTimeout(timer);
    }, [formAlert]);


    // submite new user registration
    async function handleSubmit(event) {
        event.preventDefault();

        setIsSubmitting(false);

        if (registrationInputs.password !== registrationInputs.password_confirmation) {
            setFormAlert('Passwords do not match.');
            return;
        }

        const payload = {
            first_name: registrationInputs.first_name,
            last_name: registrationInputs.last_name,
            email: registrationInputs.email,
            password: registrationInputs.password,
            password_confirmation: registrationInputs.password_confirmation,
            role: registrationInputs.role,
            phone: registrationInputs.phone,
            ...(registrationInputs.role === 'doctor' && {
                tenant_id: Number(registrationInputs.tenant_id),
                specialty: registrationInputs.specialty,
                fee: Number(registrationInputs.fee),
                slot_duration: Number(registrationInputs.slot_duration),
            }),
        };

        try {
            setIsSubmitting(true)
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            if (!baseUrl) throw new Error('VITE_API_BASE_URL is not configured.');

            const response = await axios.post(
            `${baseUrl}/auth/register`,
            payload,
            {
                headers: {
                    Accept: 'application/json',
                },
            },);

            if (!response.status === 200) {
                throw new Error(`Could not load clinics (HTTP ${response.status}).`);
            }

            setRegistrationInputs({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: 'patient',
                tenant_id: '',
                specialty: '',
                fee: '',
                slot_duration: '',
                phone: '',
            });

            setFormAlert({
                type: 'success',
                message: response.data.message || 'Account created successfully.',
            });

        } catch(error) {
            const fieldErrors = error.response?.data?.errors ?? {};

            setFormAlert({
                type: 'error',
                message: error.response?.data?.message || 'Registration failed. Check the fields and try again.',
                errors: fieldErrors,
            });
        }
    };

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
                            href="/login"
                            className="text-[#34413f] no-underline hover:text-[#087565]"
                        >
                            Sign In
                        </a>
                        <a
                            href="/Register"
                            aria-current="page"
                            className="rounded-full bg-[#0b665a] px-4 py-2 font-semibold text-white no-underline"
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
                <aside className="relative flex min-h-[540px] flex-col overflow-hidden bg-[#004f45] px-7 py-9 text-white sm:px-10 lg:min-h-[900px] lg:px-14 lg:py-12">
                    <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#147b6d]/40 blur-3xl" />

                    <div className="relative flex items-center justify-between gap-4">
                        <a
                            href="/"
                            className="inline-flex items-center gap-3 text-xl font-semibold text-white no-underline"
                        >
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#80e9d8]">
                                <HeartPulseIcon />
                            </span>
                            HealthPulse
                        </a>
                        <span className="rounded-full bg-[#0d685d] px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-[#a9e3da]">
                            v2.4 Clinical Portal
                        </span>
                    </div>

                    <div className="relative mt-14 max-w-[570px] lg:mt-16">
                        <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-[#9bd9cf]">
                            Intelligent Clinical Care System
                        </span>
                        <h1 className="mb-0 mt-6 text-[clamp(2.5rem,5vw,4.4rem)] font-semibold leading-[1.03] tracking-[-0.05em]">
                            Join HealthPulse today.
                        </h1>
                        <p className="mb-0 mt-5 text-lg leading-8 text-[#9bd9cf] sm:text-xl">
                            Patients book faster. Doctors spend less time on paperwork.
                            Trusted by health networks.
                        </p>
                    </div>

                    <div className="relative mt-10 space-y-6">
                        <div className="flex gap-4">
                            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#11786c] text-[#a3f2e4]">
                                <CheckIcon />
                            </span>
                            <div>
                                <h2 className="m-0 text-base font-semibold">
                                    Booking with live availability
                                </h2>
                                <p className="mb-0 mt-1 text-sm leading-6 text-[#9bd9cf]">
                                    Instant slot locking across outpatient hubs and
                                    telemedicine suites.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#11786c] text-[#a3f2e4]">
                                <CheckIcon />
                            </span>
                            <div>
                                <h2 className="m-0 text-base font-semibold">
                                    AI-assisted symptom triage
                                </h2>
                                <p className="mb-0 mt-1 text-sm leading-6 text-[#9bd9cf]">
                                    Pre-visit differential insights calibrated against
                                    clinical triage criteria.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#11786c] text-[#a3f2e4]">
                                <CheckIcon />
                            </span>
                            <div>
                                <h2 className="m-0 text-base font-semibold">
                                    Private, isolated clinic data
                                </h2>
                                <p className="mb-0 mt-1 text-sm leading-6 text-[#9bd9cf]">
                                    Zero-trust architecture for healthcare practice data.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-10 rounded-2xl bg-white/5 p-5 sm:mt-12">
                        <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-wide text-[#9bd9cf]">
                            <span>Network uptime & triage latency</span>
                            <span>99.98% real-time</span>
                        </div>
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 560 64"
                            fill="none"
                            className="mt-3 h-12 w-full"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0 34h110l24-17 16 32 18-21 20 18 18-12h122l20-15 17 30 18-17h177"
                                stroke="#80e9d8"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <div className="relative mt-auto pt-12">
                        <div className="grid grid-cols-3 gap-2">
                            <SecurityBadge>HIPAA Certified</SecurityBadge>
                            <SecurityBadge>SOC2 Type II</SecurityBadge>
                            <SecurityBadge>256-bit AES</SecurityBadge>
                        </div>
                        <p className="mb-0 mt-3 text-[10px] font-medium text-[#80c9bd]">
                            © 2025 HealthPulse Digital Care Technologies. Protected
                            clinical environment.
                        </p>
                    </div>
                </aside>

                <section
                    aria-labelledby="register-heading"
                    className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-12 lg:py-16"
                >
                    <div className="w-full max-w-[700px]">
                        <h2
                            id="register-heading"
                            className="m-0 text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-tight tracking-[-0.05em] text-[#111827]"
                        >
                            Create your account
                        </h2>
                        <p className="mb-0 mt-2 text-base leading-6 text-[#66716f]">
                            It takes less than a minute. Choose your profile type to
                            configure your workspace.
                        </p>

                        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <fieldset className="border-0 p-0">
                            <legend className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#4c5755]">
                                I am registering as
                            </legend>
                            <select
                                id="registration-type"
                                name="role"
                                required
                                value={registrationInputs.role}
                                onChange={(event) =>
                                    setRegistrationInputs((previous) => {
                                        const role = event.target.value;

                                        return {
                                            ...previous,
                                            role,
                                            tenant_id:
                                            role === 'doctor' ? previous.tenant_id : '',
                                            specialty:
                                            role === 'doctor' ? previous.specialty : '',
                                            fee:
                                            role === 'doctor' ? previous.fee : '',
                                            slot_duration:
                                            role === 'doctor' ? previous.slot_duration : '',
                                        };
                                    })
                                }
                                className="min-h-[58px] w-full rounded-xl border border-[#e7eaf1] bg-white px-4 text-sm text-[#17212d] shadow-sm outline-none transition focus:border-[#78b9ad] focus:ring-2 focus:ring-[#78b9ad]/20"
                            >
                                {registrationTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.title} — {type.badge}
                                    </option>
                                ))}
                            </select>
                        </fieldset>

                        {registrationInputs.role === 'doctor' && (
                            <div className="space-y-4">
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-[#17212d]">
                                    Clinic / organization ID
                                </span>
                                <select
                                    name="tenant_id"
                                    required
                                    value={registrationInputs.tenant_id}
                                    disabled={clinicsLoading || clinics.length === 0}
                                    onChange={(event) =>
                                        setRegistrationInputs((previous) => ({
                                            ...previous,
                                            tenant_id: event.target.value,
                                        }))
                                    }
                                    className="min-h-[58px] w-full rounded-xl border border-[#e7eaf1] bg-white px-4 text-sm text-[#17212d] shadow-sm outline-none focus:border-[#78b9ad]">
                                        <option value="">
                                            {clinicsLoading ? 'Loading clinics…' : 'Choose a clinic'}
                                        </option>

                                        {clinics.map((clinic) => (
                                            <option key={clinic.id} value={clinic.id}>
                                                {clinic.name}
                                            </option>
                                        ))}
                                </select>

                                    {clinicsError && (
                                        <p role="alert" className="mt-2 text-sm text-red-700">
                                            {clinicsError}
                                        </p>
                                    )}

                                    {!clinicsLoading && !clinicsError && clinics.length === 0 && (
                                        <p className="mt-2 text-sm text-[#66716f]">
                                            No eligible clinics are currently available.
                                        </p>
                                    )}
                                <span
                                    id="tenant-id-help"
                                    className="mt-2 block text-xs leading-5 text-[#66716f]"
                                >
                                    Enter the numeric ID supplied by your clinic administrator.
                                    This form does not verify whether the ID exists.
                                </span>
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-[#17212d]">
                                    Medical specialty
                                </span>
                                <input
                                    className="min-h-[58px] w-full rounded-xl border border-[#e7eaf1] bg-white px-4 text-sm text-[#17212d] shadow-sm outline-none focus:border-[#78b9ad]"
                                    type="text"
                                    name="specialty"
                                    value={registrationInputs.specialty}
                                    maxLength={255}
                                    placeholder="e.g. Cardiology"
                                    required
                                    onChange={(event) =>
                                        setRegistrationInputs((previous) => ({
                                            ...previous,
                                            specialty: event.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-[#17212d]">
                                        Consultation fee
                                    </span>
                                    <input
                                        className="min-h-[58px] w-full rounded-xl border border-[#e7eaf1] bg-white px-4 text-sm text-[#17212d] shadow-sm outline-none focus:border-[#78b9ad]"
                                        type="number"
                                        name="fee"
                                        value={registrationInputs.fee}
                                        min="0"
                                        max="999999.99"
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                        onChange={(event) =>
                                            setRegistrationInputs((previous) => ({
                                                ...previous,
                                                fee: event.target.value,
                                            }))
                                        }
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-[#17212d]">
                                        Appointment slot duration
                                    </span>
                                    <select
                                        className="min-h-[58px] w-full rounded-xl border border-[#e7eaf1] bg-white px-4 text-sm text-[#17212d] shadow-sm outline-none focus:border-[#78b9ad]"
                                        name="slot_duration"
                                        value={registrationInputs.slot_duration}
                                        required
                                        onChange={(event) =>
                                            setRegistrationInputs((previous) => ({
                                                ...previous,
                                                slot_duration: event.target.value,
                                            }))
                                        }
                                    >
                                        <option value="">Choose duration</option>
                                        {[15, 20, 30, 60].map((duration) => (
                                            <option key={duration} value={duration}>
                                                {duration} minutes
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            </div>
                        )}

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-[#17212d]">
                                    First name
                                </span>
                                <span className="flex min-h-[58px] items-center gap-3 rounded-xl border border-[#e7eaf1] bg-white px-4 shadow-sm focus-within:border-[#78b9ad]">
                                    <span className="text-[#687571]">
                                        <InputIcon type="first name" />
                                    </span>
                                    <input
                                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17212d] outline-none placeholder:text-[#89939d]"
                                        type="text"
                                        name="first_name"
                                        value={registrationInputs.first_name}
                                        autoComplete="given-name"
                                        placeholder="Jane"
                                        maxLength={100}
                                        required
                                        onChange={(event) =>
                                            setRegistrationInputs((previous) => ({
                                                ...previous,
                                                first_name: event.target.value,
                                            }))
                                        }
                                    />
                                </span>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-[#17212d]">
                                    Last name
                                </span>
                                <span className="flex min-h-[58px] items-center gap-3 rounded-xl border border-[#e7eaf1] bg-white px-4 shadow-sm focus-within:border-[#78b9ad]">
                                    <span className="text-[#687571]">
                                        <InputIcon type="last name" />
                                    </span>
                                    <input
                                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17212d] outline-none placeholder:text-[#89939d]"
                                        type="text"
                                        name="last_name"
                                        autoComplete="family-name"
                                        placeholder="Doe"
                                        value={registrationInputs.last_name}
                                        maxLength={100}
                                        required
                                        onChange={(event) => setRegistrationInputs((previous) => ({
                                            ...previous,
                                            last_name: event.target.value,
                                        }))}
                                    />
                                </span>
                            </label>

                            <label className="block">
                                <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-[#17212d]">
                                    <span>Email address</span>
                                    <span className="text-xs text-[#66716f]">
                                        Used for two-factor verification
                                    </span>
                                </span>
                                <span className="flex min-h-[58px] items-center gap-3 rounded-xl border border-[#e7eaf1] bg-white px-4 shadow-sm focus-within:border-[#78b9ad]">
                                    <span className="text-[#687571]">
                                        <InputIcon type="email" />
                                    </span>
                                    <input
                                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17212d] outline-none placeholder:text-[#89939d]"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={registrationInputs.email}
                                        placeholder="you@hospital-group.com"
                                        maxLength={150}
                                        required
                                        onChange={(event) => setRegistrationInputs((previous) => ({
                                            ...previous,
                                            email: event.target.value,
                                        }))}
                                    />
                                </span>
                            </label>

                            <label className="block">
                                <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-[#17212d]">
                                    <span>Password</span>
                                    <span className="text-xs text-[#66716f]">Min. 8 characters</span>
                                </span>
                                <span className="flex min-h-[58px] items-center gap-3 rounded-xl border border-[#e7eaf1] bg-white px-4 shadow-sm focus-within:border-[#78b9ad]">
                                    <span className="text-[#687571]">
                                        <InputIcon type="password" />
                                    </span>
                                    <input
                                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17212d] outline-none placeholder:text-[#89939d]"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        autoComplete="new-password"
                                        placeholder="Create a secure password"
                                        value={registrationInputs.password}
                                        minLength={8}
                                        required
                                        onChange={(event) => {
                                            setRegistrationInputs((previous) => ({
                                                ...previous,
                                                password: event.target.value,
                                            }));
                                            setFormMessage('');
                                        }}
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        onClick={() => setShowPassword((visible) => !visible)}
                                        className="text-[#687571] hover:text-[#07584e]"
                                    >
                                        <EyeIcon visible={showPassword} />
                                    </button>
                                </span>
                                <span className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
                                    <span className="h-1.5 rounded-full bg-[#dbe5ff]" />
                                    <span className="h-1.5 rounded-full bg-[#dbe5ff]" />
                                    <span className="h-1.5 rounded-full bg-[#dbe5ff]" />
                                    <span className="h-1.5 rounded-full bg-[#dbe5ff]" />
                                </span>
                                <span className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#66716f]">
                                    <span>Security criteria: lowercase, uppercase, number & symbol</span>
                                    <span className="font-semibold text-[#087565]">Standard</span>
                                </span>
                            </label>

                            <label className="block">
                                <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-[#17212d]">
                                    <span>Password Confirmation</span>
                                    <span className="text-xs text-[#66716f]">Min. 8 characters</span>
                                </span>
                                <span className="flex min-h-[58px] items-center gap-3 rounded-xl border border-[#e7eaf1] bg-white px-4 shadow-sm focus-within:border-[#78b9ad]">
                                    <span className="text-[#687571]">
                                        <InputIcon type="password" />
                                    </span>
                                    <input
                                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17212d] outline-none placeholder:text-[#89939d]"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        placeholder="Enter your password again"
                                        value={registrationInputs.password_confirmation}
                                        minLength={8}
                                        required
                                        onChange={(event) => {
                                            setRegistrationInputs((previous) => ({
                                                ...previous,
                                                password_confirmation: event.target.value,
                                            }));
                                            setFormMessage('');
                                        }}
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        onClick={() => setShowPassword((visible) => !visible)}
                                        className="text-[#687571] hover:text-[#07584e]"
                                    >
                                        <EyeIcon visible={showPassword} />
                                    </button>
                                </span>
                                {/* <span className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
                                    <span className="h-1.5 rounded-full bg-[#dbe5ff]" />
                                    <span className="h-1.5 rounded-full bg-[#dbe5ff]" />
                                    <span className="h-1.5 rounded-full bg-[#dbe5ff]" />
                                    <span className="h-1.5 rounded-full bg-[#dbe5ff]" />
                                </span>
                                <span className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#66716f]">
                                    <span>Security criteria: lowercase, uppercase, number & symbol</span>
                                    <span className="font-semibold text-[#087565]">Standard</span>
                                </span> */}
                            </label>

                            <label className="block">
                                <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-[#17212d]">
                                    <span>Mobile phone (SMS instant dispatch)</span>
                                    <span className="text-xs text-[#66716f]">Required</span>
                                </span>
                                <span className="flex min-h-[58px] items-center gap-3 rounded-xl border border-[#e7eaf1] bg-white px-4 shadow-sm focus-within:border-[#78b9ad]">
                                    <span className="text-[#687571]">
                                        <InputIcon type="phone" />
                                    </span>
                                    <input
                                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17212d] outline-none placeholder:text-[#89939d]"
                                        type="tel"
                                        name="phone"
                                        autoComplete="tel"
                                        placeholder="+1 (555) 019-2834"
                                        value={registrationInputs.phone}
                                        maxLength={20}
                                        required
                                        onChange={(event) => setRegistrationInputs((previous) => ({
                                            ...previous,
                                            phone: event.target.value,
                                        }))}
                                    />
                                </span>
                            </label>

                            <label className="flex items-start gap-3 pt-1 text-sm leading-6 text-[#4f5b59]">
                                <input
                                    className="mt-1 h-4 w-4 shrink-0 accent-[#07584e]"
                                    type="checkbox"
                                    name="terms_accepted"
                                    checked={termsAccepted}
                                    required
                                    onChange={(event) => setTermsAccepted(event.target.checked)}
                                />
                                <span>
                                    I agree to the{' '}
                                    <a className="font-medium text-[#07584e] underline" href="#terms">
                                        Terms of Service
                                    </a>{' '}
                                    and acknowledge the{' '}
                                    <a className="font-medium text-[#07584e] underline" href="#privacy">
                                        HIPAA Privacy Policy & Protected Health Data Practices
                                    </a>
                                    .
                                </span>
                            </label>

                            <button
                                className="inline-flex min-h-[62px] w-full items-center justify-center gap-3 rounded-xl bg-[#004f45] px-6 text-base font-semibold text-white shadow-[0_5px_12px_rgba(0,79,69,0.18)] transition-colors hover:bg-[#07685b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087565]"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating account…' : 'Create account'}
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

                            <p className="m-0 text-center text-sm text-[#66716f]">
                                Healthcare provider accounts may require organization review.
                            </p>
                        </form>

                        <p className="mb-0 mt-8 text-center text-sm text-[#66716f]">
                            Already have an account?{' '}
                            <a className="font-semibold text-[#07584e] underline" href="/login">
                                Log in
                            </a>
                        </p>
                    </div>
                </section>
            </main>

            <footer className="bg-[#eef2ff]">
                <div className="mx-auto flex max-w-[1536px] flex-col gap-3 px-5 py-5 text-[10px] text-[#4f5b59] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                    <span className="inline-flex items-center gap-2 font-medium">
                        <span className="text-[#087565]">
                            <CheckIcon />
                        </span>
                        HIPAA & ISO-27001 clinical privacy compliant
                    </span>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <a className="text-inherit no-underline hover:text-[#087565]" href="#support">
                            Help Center
                        </a>
                        <span>© 2025 HealthPulse Digital Care. All rights reserved.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Register;