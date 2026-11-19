import { useEffect, useState } from 'react';

const iconPaths = {
    activity: ['M3 12h4l3-8 4 16 3-8h4'],
    arrow: ['M5 12h14', 'm12 5 7 7-7 7'],
    calendar: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z'],
    check: ['m5 12 4 4L19 6'],
    chevron: ['m9 18 6-6-6-6'],
    clock: ['M12 8v4l3 2', 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z'],
    download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm7 10 5 5 5-5', 'M12 15V3'],
    file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z', 'M14 2v6h6', 'M8 13h8', 'M8 17h8'],
    heart: ['M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z'],
    message: ['M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z'],
    pill: ['m10.5 6.5 7 7', 'M6.5 17.5l11-11', 'M19.8 4.2a5 5 0 0 1 0 7l-8.6 8.6a5 5 0 0 1-7-7l8.6-8.6a5 5 0 0 1 7 0Z'],
    shield: ['M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z', 'm9 12 2 2 4-4'],
    users: ['M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M20 21v-2a4 4 0 0 0-3-3.9', 'M16 3.1a4 4 0 0 1 0 7.8'],
    video: ['m23 7-7 5 7 5V7Z', 'M1 5h15v14H1z'],
};

const patientNavigationLinks = [
    { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
    { id: 'consultations', label: 'Appointments', href: '#consultations' },
    { id: 'triage', label: 'AI Health Triage', href: '#triage' },
    { id: 'records', label: 'Medical Records', href: '#records' },
    { id: 'medications', label: 'Prescriptions', href: '#medications' },
    { id: 'care-team', label: 'Messages', href: '#care-team' },
];

function Icon({ name, className = 'h-5 w-5' }) {
    return (
        <svg
            aria-hidden="true"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {iconPaths[name].map((path) => <path key={path} d={path} />)}
        </svg>
    );
}

function SectionTitle({ icon, children, action }) {
    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                <Icon name={icon} className="h-5 w-5 text-[#07584e]" />
                {children}
            </h2>
            {action && (
                <a className="inline-flex items-center gap-1 text-xs font-medium text-[#064b42] no-underline hover:underline" href="#records">
                    {action}
                    <Icon name="arrow" className="h-4 w-4" />
                </a>
            )}
        </div>
    );
}

function formatAppointmentDate(value) {
    if (!value) {
        return 'Date unavailable';
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
}

function PatientDashboard({ activePage = 'dashboard' }) {
    let patient = {};
    const storedPatient = localStorage.getItem('Auth_user');
    if (storedPatient) {
        try {
            patient = JSON.parse(storedPatient);
        } catch {
            patient = {};
        }
    }
    const patientName = patient.name || 'Patient';
    const firstName = patientName.split(' ')[0];
    const patientInitials = patientName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((namePart) => namePart[0].toUpperCase())
        .join('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        appointments: [],
        ai_intakes: [],
        consultation_records: [],
    });
    const [isDashboardLoading, setIsDashboardLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function loadDashboard() {
            try {
                const token = localStorage.getItem('Auth_token');
                if (!token) {
                    throw new Error('You must sign in to load your patient dashboard.');
                }

                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
                if (!apiBaseUrl) {
                    throw new Error('VITE_API_BASE_URL is not configured.');
                }

                const response = await fetch(
                    `${apiBaseUrl.replace(/\/$/, '')}/patient/dashboard`,
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        signal: controller.signal,
                    },
                );
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || `Could not load dashboard (HTTP ${response.status}).`,
                    );
                }

                const data = result.data;
                if (
                    !data
                    || !Array.isArray(data.appointments)
                    || !Array.isArray(data.ai_intakes)
                    || !Array.isArray(data.consultation_records)
                ) {
                    throw new Error('The patient dashboard response has an invalid format.');
                }

                setDashboardData(data);
                setDashboardError('');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setDashboardError(error.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsDashboardLoading(false);
                }
            }
        }

        loadDashboard();

        return () => controller.abort();
    }, []);

    return (
        <div className="min-h-screen bg-[#f7f8ff] text-slate-900">
            <header className="sticky top-0 z-[1000] w-full border-b border-[#e8edf0] bg-white text-[#172b2a] shadow-[0_2px_10px_rgba(13,43,41,0.04)]">
                <div className="relative mx-auto flex min-h-[76px] w-[calc(100%-32px)] max-w-[1440px] items-center justify-between gap-4 sm:w-[calc(100%-48px)]">
                    <a href="/" className="flex shrink-0 items-center gap-2 text-[#073f39] no-underline">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#064b42] text-white">
                            <Icon name="activity" className="h-6 w-6" />
                        </span>
                        <span className="leading-tight">
                            <span className="block text-sm font-bold">HealthPulse</span>
                            <span className="block text-[9px] font-medium tracking-[0.12em]">PATIENT PORTAL</span>
                        </span>
                    </a>

                    <nav aria-label="Patient navigation" className="hidden items-center justify-center gap-[clamp(4px,1vw,16px)] xl:flex">
                        {patientNavigationLinks.map(({ id, label, href }) => (
                            <a
                                key={id}
                                href={href}
                                aria-current={activePage === id ? 'page' : undefined}
                                className={`whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium no-underline transition-colors ${
                                    activePage === id
                                        ? 'bg-[#064b42] text-white'
                                        : 'text-[#263634] hover:bg-[#f3faf8] hover:text-[#08766b]'
                                }`}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex shrink-0 items-center gap-3">
                        <button type="button" aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100">
                            <span aria-hidden="true" className="text-xl">♧</span>
                            <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-red-500" />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d9f4ef] text-xs font-bold text-[#07584e]">{patientInitials || 'P'}</span>
                            <span className="hidden text-right text-[11px] leading-4 sm:block">
                                <span className="block font-semibold">{patientName}</span>
                                <span className="block text-[#08766b]">{patient.role || 'patient'}</span>
                            </span>
                        </div>
                        <button
                            type="button"
                            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={isMenuOpen}
                            aria-controls="patient-mobile-navigation"
                            onClick={() => setIsMenuOpen((open) => !open)}
                            className="grid h-[42px] w-[42px] place-items-center rounded-full border border-[#dce7e4] bg-white text-[#064b42] xl:hidden"
                        >
                            <span aria-hidden="true" className="text-xl leading-none">{isMenuOpen ? '×' : '☰'}</span>
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <nav
                        id="patient-mobile-navigation"
                        aria-label="Patient navigation"
                        className="mx-auto flex w-[calc(100%-32px)] flex-col border-t border-[#edf1f0] py-2 sm:w-[calc(100%-48px)] xl:hidden"
                    >
                        {patientNavigationLinks.map(({ id, label, href }) => (
                            <a
                                key={id}
                                href={href}
                                aria-current={activePage === id ? 'page' : undefined}
                                onClick={() => setIsMenuOpen(false)}
                                className={`rounded-lg px-3 py-3 text-sm font-medium no-underline ${
                                    activePage === id
                                        ? 'bg-[#064b42] text-white'
                                        : 'text-[#263634] hover:bg-[#f3faf8] hover:text-[#08766b]'
                                }`}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            <main id="dashboard" className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-7 lg:pt-8">
                <section className="mb-6">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#d6f7f1] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#07584e]">Patient account</span>
                        <span className="rounded-full bg-[#e8edff] px-2.5 py-1 text-[10px] font-medium capitalize text-slate-700">Role: {patient.role || 'patient'}</span>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                                Welcome back, <span className="text-[#07584e]">{firstName}</span>
                            </h1>
                            <p className="mt-1 max-w-2xl text-sm text-slate-600">
                                Your patient account and available clinical records.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-slate-100 bg-white px-3 py-2 text-[11px] text-slate-700">
                                <span className="mr-1 text-[#0ba997]">●</span> Signed in as {patient.role || 'patient'}
                            </span>
                            <span className="rounded-full bg-[#e8edff] px-4 py-2 text-xs font-medium text-slate-700">Clinical summary unavailable</span>
                        </div>
                    </div>
                </section>

                {isDashboardLoading && (
                    <p className="mb-5 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-600" role="status">
                        Loading your dashboard data…
                    </p>
                )}
                {dashboardError && (
                    <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                        {dashboardError}
                    </p>
                )}

                <section aria-label="Backend data sections" className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { icon: 'calendar', title: 'Appointments', detail: `${dashboardData.appointments.length} records`, href: '#consultations' },
                        { icon: 'activity', title: 'AI Patient Intake', detail: `${dashboardData.ai_intakes.length} records`, href: '#triage' },
                        { icon: 'file', title: 'Consultation Records', detail: `${dashboardData.consultation_records.length} records`, href: '#records' },
                        { icon: 'users', title: 'Patient Account', detail: 'Name, email, and role', href: '#account' },
                    ].map((item) => (
                        <a key={item.title} href={item.href} className="group flex min-h-[66px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-slate-900 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#e4f5f2] text-[#07584e]"><Icon name={item.icon} /></span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-xs font-semibold">{item.title}</span>
                                <span className="block text-[10px] text-slate-500">{item.detail}</span>
                            </span>
                            <Icon name="chevron" className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5" />
                        </a>
                    ))}
                </section>

                <section aria-label="Available backend data" className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-slate-700">
                            Appointment Status
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e5f3f0] text-[#07584e]"><Icon name="calendar" className="h-5 w-5" /></span>
                        </div>
                        <p className="mt-3 text-base font-semibold">{dashboardData.appointments.length}</p>
                        <p className="mt-2 text-[10px] text-slate-500">Appointments in your account</p>
                    </article>
                    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-slate-700">
                            AI Intake Urgency
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e5f3f0] text-[#07584e]"><Icon name="activity" /></span>
                        </div>
                        <p className="mt-3 text-base font-semibold">{dashboardData.ai_intakes.length}</p>
                        <p className="mt-2 text-[10px] text-slate-500">AI intake records</p>
                    </article>
                    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-slate-700">
                            Consultation Records
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#d6f7f1] text-[#07584e]"><Icon name="file" /></span>
                        </div>
                        <p className="mt-3 text-base font-semibold">{dashboardData.consultation_records.length}</p>
                        <p className="mt-2 text-[10px] text-slate-500">Consultation records</p>
                    </article>
                    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-slate-700">
                            Prescriptions
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700"><Icon name="pill" /></span>
                        </div>
                        <p className="mt-3 text-base font-semibold">Not supported</p>
                        <p className="mt-2 text-[10px] text-slate-500">There is no prescription model or API route.</p>
                    </article>
                </section>

                <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.9fr)]">
                    <div className="space-y-5">
                        <section id="consultations" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                            <SectionTitle icon="calendar">Appointments</SectionTitle>
                            {dashboardData.appointments.length ? (
                                <div className="space-y-3">
                                    {dashboardData.appointments.map((appointment) => (
                                        <article key={appointment.id} className="rounded-xl bg-[#f2f5ff] p-4 sm:p-5">
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="max-w-2xl text-sm font-semibold leading-5 text-slate-900">
                                                        {appointment.notes || 'Appointment'}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-slate-600">{formatAppointmentDate(appointment.appointment_date)}</p>
                                                </div>
                                                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-medium capitalize text-[#07584e]">{appointment.status}</span>
                                            </div>
                                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                                                <span>{appointment.start_time}–{appointment.end_time}</span>
                                                <span>
                                                    Doctor: {appointment.doctor?.name || 'Details unavailable'}
                                                    {appointment.doctor?.specialty && ` • ${appointment.doctor.specialty}`}
                                                </span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <p className="rounded-xl bg-[#f2f5ff] p-5 text-sm text-slate-600">
                                    {isDashboardLoading ? 'Loading appointments…' : 'You have no appointments yet.'}
                                </p>
                            )}
                        </section>

                        <section id="triage" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <SectionTitle icon="activity">AI Patient Intake</SectionTitle>
                                    <p className="-mt-3 text-[10px] text-slate-600">Backend fields: symptoms, AI summary, and urgency.</p>
                                </div>
                                <span className="rounded-full bg-[#e8edff] px-3 py-1.5 text-[10px] font-medium text-slate-700">{dashboardData.ai_intakes.length} records</span>
                            </div>
                            {dashboardData.ai_intakes.length ? (
                                <div className="space-y-3">
                                    {dashboardData.ai_intakes.map((intake) => (
                                        <article key={intake.id} className="rounded-xl bg-[#f0f3ff] p-4">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                                                    Intake #{intake.id}{intake.appointment_id ? ` • Appointment #${intake.appointment_id}` : ''}
                                                </span>
                                                <span className="rounded-full bg-[#c9f5ee] px-2.5 py-1 text-[10px] capitalize text-[#07584e]">
                                                    {intake.urgency || 'Urgency not set'}
                                                </span>
                                            </div>
                                            {intake.row_symptoms && (
                                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                                    <span className="font-semibold">Symptoms: </span>
                                                    {intake.row_symptoms}
                                                </p>
                                            )}
                                            {intake.ai_summary && (
                                                <p className="mt-3 text-xs leading-5 text-slate-600">
                                                    <span className="font-semibold">AI summary: </span>
                                                    {intake.ai_summary}
                                                </p>
                                            )}
                                            {intake.created_at && <p className="mt-3 text-[10px] text-slate-500">Submitted {formatAppointmentDate(intake.created_at)}</p>}
                                            {!intake.row_symptoms && !intake.ai_summary && <p className="mt-2 text-xs text-slate-600">No intake details were recorded.</p>}
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <p className="rounded-xl bg-[#f0f3ff] p-4 text-sm text-slate-600">
                                    {isDashboardLoading ? 'Loading AI patient intakes…' : 'You have no AI patient intakes yet.'}
                                </p>
                            )}
                        </section>

                        <section id="records" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                            <SectionTitle icon="file">Consultation Records</SectionTitle>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] text-left text-xs">
                                    <thead className="bg-[#f7f8ff] text-[9px] font-medium uppercase tracking-wide text-slate-700">
                                        <tr>
                                            <th className="rounded-l-lg px-3 py-3">Appointment</th>
                                            <th className="px-3 py-3">Clinical Notes</th>
                                            <th className="px-3 py-3">Assessment</th>
                                            <th className="px-3 py-3">Plan</th>
                                            <th className="rounded-r-lg px-3 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {dashboardData.consultation_records.length ? dashboardData.consultation_records.map((record) => (
                                            <tr key={record.id}>
                                                <td className="px-3 py-4 font-medium">Appointment #{record.appointment_id}</td>
                                                <td className="px-3 py-4 text-slate-600">{record.row_notes || record.soap_subjective || '—'}</td>
                                                <td className="px-3 py-4 text-slate-600">{record.soap_assessment || '—'}</td>
                                                <td className="px-3 py-4 text-slate-600">{record.soap_plan || '—'}</td>
                                                <td className="px-3 py-4 capitalize text-slate-600">{record.soap_status || '—'}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="px-3 py-8 text-center text-slate-600">
                                                    {isDashboardLoading ? 'Loading consultation records…' : 'You have no consultation records yet.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-5">
                        <section id="care-team" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <SectionTitle icon="users">Doctor Profiles</SectionTitle>
                            <div className="rounded-xl bg-[#f6f7ff] p-4 text-xs leading-5 text-slate-600">
                                Doctor profiles contain specialty, fee, and appointment slot duration. The backend does not currently provide a patient-facing doctor list.
                            </div>
                        </section>

                        <section id="medications" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <SectionTitle icon="pill">Medications</SectionTitle>
                            <div className="rounded-xl bg-[#f2f5ff] p-4 text-xs leading-5 text-slate-600">
                                Medication and prescription data are not part of the current backend.
                            </div>
                        </section>

                        <section id="account" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d6f7f1] text-[#07584e]"><Icon name="shield" /></span>
                                <div><h2 className="text-sm font-semibold">Patient Account</h2><p className="mt-1 text-[10px] text-[#08766b]">Details returned by login</p></div>
                            </div>
                            <p className="mt-3 break-all text-[11px] leading-5 text-slate-600">{patient.email || 'Email is not available.'}</p>
                            <ul className="mt-3 space-y-2 text-[10px]">
                                <li className="flex justify-between gap-2"><span className="text-slate-600">Account ID</span><span>{patient.id || 'Not available'}</span></li>
                                <li className="flex justify-between gap-2"><span className="text-slate-600">Role</span><span className="capitalize">{patient.role || 'patient'}</span></li>
                            </ul>
                        </section>
                    </aside>
                </div>
            </main>

            <footer className="border-t border-slate-100 bg-white">
                <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-4 py-6 text-[10px] text-slate-600 sm:flex-row sm:px-7">
                    <a href="/" className="flex items-center gap-2 font-semibold text-[#073f39] no-underline"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#064b42] text-white"><Icon name="activity" className="h-4 w-4" /></span>HealthPulse</a>
                    <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                        <a href="#consultations" className="text-inherit no-underline hover:text-[#07584e]">Appointments</a>
                        <a href="#triage" className="text-inherit no-underline hover:text-[#07584e]">Patient Intake</a>
                        <a href="#records" className="text-inherit no-underline hover:text-[#07584e]">Consultation Records</a>
                        <a href="#account" className="text-inherit no-underline hover:text-[#07584e]">Account</a>
                    </nav>
                    <span>HealthPulse Patient Portal</span>
                </div>
            </footer>
        </div>
    );
}

export default PatientDashboard;
