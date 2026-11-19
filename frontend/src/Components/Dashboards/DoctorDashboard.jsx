import { useEffect, useState } from 'react';

const iconPaths = {
    calendar: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z'],
    check: ['m5 12 4 4L19 6'],
    clock: ['M12 8v4l3 2', 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z'],
    heart: ['M16.5 3a5.5 5.5 0 0 0-4.5 2.3A5.5 5.5 0 0 0 2 8.5C2 15 12 21 12 21s10-6 10-12.5A5.5 5.5 0 0 0 16.5 3Z'],
    user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
};

const weekdays = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
};
const weekDays = Object.entries(weekdays).map(([value, label]) => ({
    value: Number(value),
    label,
}));

function createScheduleDraft(schedules, defaultDuration = 30) {
    return Object.fromEntries(weekDays.map(({ value }) => {
        const schedule = schedules.find((item) => Number(item.day_of_week) === value);
        const profileDuration = [15, 20, 30, 60].includes(Number(defaultDuration))
            ? Number(defaultDuration)
            : 30;

        return [
            value,
            {
                is_active: Boolean(schedule?.is_active),
                start_time: schedule?.start_time?.slice(0, 5) || '09:00',
                end_time: schedule?.end_time?.slice(0, 5) || '17:00',
                slot_duration_minutes: Number(schedule?.slot_duration_minutes || profileDuration),
            },
        ];
    }));
}

function Icon({ name, className = 'h-5 w-5' }) {
    return (
        <svg
            aria-hidden="true"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {iconPaths[name].map((path) => <path key={path} d={path} />)}
        </svg>
    );
}

function formatDate(value) {
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

function formatTime(value) {
    if (!value) {
        return 'Time unavailable';
    }

    const [hours, minutes] = value.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(date);
}

function DoctorDashboard() {
    const [dashboardData, setDashboardData] = useState({
        doctor: null,
        schedules: [],
        appointments: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isScheduleEditorOpen, setIsScheduleEditorOpen] = useState(false);
    const [scheduleDraft, setScheduleDraft] = useState({});
    const [isSavingSchedule, setIsSavingSchedule] = useState(false);
    const [scheduleMessage, setScheduleMessage] = useState('');
    const [scheduleError, setScheduleError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function loadDashboard() {
            try {
                const token = localStorage.getItem('Auth_token');
                if (!token) {
                    throw new Error('You must sign in to load your doctor dashboard.');
                }

                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
                if (!apiBaseUrl) {
                    throw new Error('VITE_API_BASE_URL is not configured.');
                }

                const response = await fetch(
                    `${apiBaseUrl.replace(/\/$/, '')}/doctor/dashboard`,
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
                    !data?.doctor
                    || !Array.isArray(data.schedules)
                    || !Array.isArray(data.appointments)
                ) {
                    throw new Error('The doctor dashboard response has an invalid format.');
                }

                setDashboardData(data);
                setError('');
            } catch (requestError) {
                if (requestError.name !== 'AbortError') {
                    setError(requestError.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        loadDashboard();

        return () => controller.abort();
    }, []);

    const doctor = dashboardData.doctor;
    const profile = doctor?.profile;
    const appointments = dashboardData.appointments;
    const schedules = dashboardData.schedules;
    const pendingCount = appointments.filter((appointment) => appointment.status === 'pending').length;
    const confirmedCount = appointments.filter((appointment) => appointment.status === 'confirmed').length;
    const activeScheduleCount = schedules.filter((schedule) => schedule.is_active).length;
    const initials = (doctor?.name || 'Doctor')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');

    function openScheduleEditor() {
        setScheduleDraft(createScheduleDraft(schedules, profile?.slot_duration));
        setScheduleMessage('');
        setScheduleError('');
        setIsScheduleEditorOpen(true);
    }

    async function saveWeeklySchedule() {
        if (!profile?.id || !profile?.tenant_id) {
            setScheduleError('Your doctor profile or clinic is missing. Contact your clinic administrator.');
            return;
        }

        setIsSavingSchedule(true);
        setScheduleError('');
        setScheduleMessage('');
        let savedSchedules = [...schedules];

        try {
            const token = localStorage.getItem('Auth_token');
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            if (!token || !apiBaseUrl) {
                throw new Error(!token
                    ? 'You must sign in to save your weekly hours.'
                    : 'VITE_API_BASE_URL is not configured.');
            }

            for (const { value: dayOfWeek } of weekDays) {
                const draft = scheduleDraft[dayOfWeek];
                const existing = savedSchedules.find(
                    (schedule) => Number(schedule.day_of_week) === dayOfWeek,
                );

                if (!existing && !draft.is_active) {
                    continue;
                }

                const payload = existing
                    ? {
                        day_of_week: dayOfWeek,
                        start_time: draft.start_time,
                        end_time: draft.end_time,
                        slot_duration_minutes: Number(draft.slot_duration_minutes),
                        is_active: draft.is_active,
                    }
                    : {
                        doctor_profile_id: profile.id,
                        tenant_id: profile.tenant_id,
                        day_of_week: dayOfWeek,
                        start_time: draft.start_time,
                        end_time: draft.end_time,
                        slot_duration_minutes: Number(draft.slot_duration_minutes),
                        is_active: true,
                    };
                const endpoint = existing
                    ? `/doctor-schedules/${existing.id}`
                    : '/doctor-schedules';
                const response = await fetch(
                    `${apiBaseUrl.replace(/\/$/, '')}${endpoint}`,
                    {
                        method: existing ? 'PATCH' : 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload),
                    },
                );
                const result = await response.json();

                if (!response.ok) {
                    const validationMessage = Object.values(result.errors || {})
                        .flat()
                        .find((message) => typeof message === 'string');
                    throw new Error(validationMessage || result.message || `Could not save ${weekdays[dayOfWeek]} hours (HTTP ${response.status}).`);
                }

                const savedSchedule = result.data || result;
                savedSchedules = existing
                    ? savedSchedules.map((schedule) => (
                        schedule.id === existing.id ? savedSchedule : schedule
                    ))
                    : [...savedSchedules, savedSchedule];
                setDashboardData((current) => ({
                    ...current,
                    schedules: savedSchedules,
                }));
            }

            setScheduleMessage('Your weekly working hours have been saved.');
            setIsScheduleEditorOpen(false);
        } catch (requestError) {
            setDashboardData((current) => ({
                ...current,
                schedules: savedSchedules,
            }));
            setScheduleError(`${requestError.message} Any earlier days saved successfully are kept.`);
        } finally {
            setIsSavingSchedule(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f7f8ff] text-slate-900">
            <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-5 px-4 sm:px-7">
                    <a href="/" className="flex shrink-0 items-center gap-3 text-[#073f39] no-underline">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#064b42] text-white">
                            <Icon name="heart" className="h-7 w-7" />
                        </span>
                        <span>
                            <span className="block text-lg font-bold leading-tight">HealthPulse</span>
                            <span className="block text-[10px] font-semibold tracking-wider text-slate-500">CLINICAL WORKSPACE</span>
                        </span>
                    </a>
                    <nav aria-label="Doctor dashboard navigation" className="hidden items-center gap-2 rounded-2xl bg-[#f1f3fc] p-1.5 md:flex">
                        <a href="#overview" className="rounded-xl bg-[#07584e] px-4 py-3 text-sm font-semibold text-white no-underline">Overview</a>
                        <a href="#appointments" className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 no-underline hover:bg-white">Appointments</a>
                        <a href="#schedule" className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 no-underline hover:bg-white">Schedule</a>
                        <a href="#clinical-data" className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 no-underline hover:bg-white">Clinical Data</a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <span className="hidden rounded-full bg-[#e8edff] px-3 py-2 text-xs font-medium text-[#07584e] sm:inline-flex">
                            Doctor account
                        </span>
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d6f7f1] text-sm font-bold text-[#07584e]">
                            {initials || 'D'}
                        </span>
                        <span className="hidden max-w-40 text-right text-xs sm:block">
                            <span className="block truncate font-semibold">{doctor?.name || 'Doctor'}</span>
                            <span className="block truncate text-slate-500">{profile?.specialty || 'Specialty unavailable'}</span>
                        </span>
                    </div>
                </div>
            </header>

            <main id="overview" className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 lg:py-8">
                <section className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                        <div>
                            <span className="inline-flex rounded-full bg-[#d6f7f1] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#07584e]">
                                Doctor Dashboard
                            </span>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Welcome, {doctor?.name || 'Doctor'}
                            </h1>
                            <p className="mt-2 text-sm text-slate-600">
                                {profile?.specialty || 'Your clinical workspace'}{profile?.fee != null && ` • Consultation fee: ${profile.fee}`}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {profile?.slot_duration != null && (
                                <span className="rounded-full bg-[#f1f3fc] px-3 py-2 text-slate-700">
                                    Slot duration: {profile.slot_duration} min
                                </span>
                            )}
                            {profile?.tenant_id != null && (
                                <span className="rounded-full bg-[#f1f3fc] px-3 py-2 text-slate-700">
                                    Clinic ID: {profile.tenant_id}
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                {isLoading && (
                    <p className="mb-5 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-600" role="status">
                        Loading your dashboard data…
                    </p>
                )}
                {error && (
                    <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                        {error}
                    </p>
                )}

                <section aria-label="Doctor dashboard summary" className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { title: 'Total Appointments', value: appointments.length, detail: 'Appointments assigned to you', icon: 'calendar', color: 'bg-[#e4eaff] text-[#07584e]' },
                        { title: 'Pending', value: pendingCount, detail: 'Awaiting appointment status update', icon: 'clock', color: 'bg-rose-100 text-rose-700' },
                        { title: 'Confirmed', value: confirmedCount, detail: 'Confirmed appointments', icon: 'check', color: 'bg-[#d6f7f1] text-[#07584e]' },
                        { title: 'Active Schedule Slots', value: activeScheduleCount, detail: `${schedules.length} schedule entries returned`, icon: 'calendar', color: 'bg-[#e4eaff] text-[#07584e]' },
                    ].map((item) => (
                        <article key={item.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.title}</h2>
                                <span className={`grid h-10 w-10 place-items-center rounded-xl ${item.color}`}>
                                    <Icon name={item.icon} />
                                </span>
                            </div>
                            <p className="mt-3 text-4xl font-semibold tracking-tight">{item.value}</p>
                            <p className="mt-2 text-xs text-slate-500">{item.detail}</p>
                        </article>
                    ))}
                </section>

                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
                    <section id="appointments" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-xl font-semibold">
                                    <Icon name="user" className="text-[#07584e]" />
                                    Patient Appointments
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">Appointments assigned to your doctor profile.</p>
                            </div>
                            <span className="rounded-full bg-[#f1f3fc] px-3 py-1.5 text-xs font-medium text-slate-700">
                                {appointments.length} total
                            </span>
                        </div>
                        <div className="space-y-3">
                            {appointments.map((appointment) => (
                                <article key={appointment.id} className="rounded-xl bg-[#f1f3fc] p-4 sm:p-5">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#d6f7f1] text-sm font-bold text-[#07584e]">
                                                {(appointment.patient?.name || 'P').split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
                                            </span>
                                            <div>
                                                <h3 className="text-sm font-semibold">{appointment.patient?.name || 'Patient details unavailable'}</h3>
                                                <p className="mt-1 text-xs text-slate-600">{formatDate(appointment.appointment_date)}</p>
                                            </div>
                                        </div>
                                        <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold capitalize text-[#07584e]">
                                            {appointment.status || 'Status unavailable'}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/80 pt-3">
                                        <p className="text-xs text-slate-600">
                                            {formatTime(appointment.start_time)}–{formatTime(appointment.end_time)}
                                        </p>
                                        <p className="text-xs text-slate-700">
                                            {appointment.notes ? `Notes: ${appointment.notes}` : 'No appointment notes.'}
                                        </p>
                                    </div>
                                </article>
                            ))}
                            {!appointments.length && !isLoading && (
                                <p className="rounded-xl bg-[#f1f3fc] p-5 text-sm text-slate-600">
                                    No appointments are currently assigned to you.
                                </p>
                            )}
                        </div>
                    </section>

                    <aside className="space-y-5">
                        <section id="schedule" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                                        <Icon name="calendar" className="text-[#07584e]" />
                                        My Schedule
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Set the weekly hours patients can book.
                                    </p>
                                </div>
                                <span className="text-xs text-slate-500">{activeScheduleCount} active</span>
                            </div>
                            <div className="space-y-2">
                                {schedules.map((schedule) => (
                                    <div key={schedule.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f1f3fc] px-3 py-3 text-xs">
                                        <span className="font-semibold">{weekdays[schedule.day_of_week] || `Day ${schedule.day_of_week}`}</span>
                                        <span className="text-slate-600">{formatTime(schedule.start_time)}–{formatTime(schedule.end_time)}</span>
                                        <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${schedule.is_active ? 'bg-[#d6f7f1] text-[#07584e]' : 'bg-slate-200 text-slate-600'}`}>
                                            {schedule.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                ))}
                                {!schedules.length && !isLoading && (
                                    <p className="rounded-xl bg-[#f1f3fc] p-4 text-sm text-slate-600">
                                        No schedule entries are available.
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={openScheduleEditor}
                                disabled={!profile?.id || !profile?.tenant_id || isLoading}
                                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#07584e] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#06443d] disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                Set weekly working hours
                            </button>
                            {scheduleMessage && (
                                <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
                                    {scheduleMessage}
                                </p>
                            )}
                            {scheduleError && (
                                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                                    {scheduleError}
                                </p>
                            )}
                            {isScheduleEditorOpen && (
                                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                                    <p className="text-sm leading-5 text-slate-600">
                                        Choose the days you work and set the hours patients may book. Each day uses one continuous time range.
                                    </p>
                                    {weekDays.map(({ value, label }) => {
                                        const draft = scheduleDraft[value];
                                        return (
                                            <div key={value} className="rounded-xl bg-[#f7f8ff] p-3">
                                                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800">
                                                    <input
                                                        type="checkbox"
                                                        checked={draft?.is_active || false}
                                                        onChange={(event) => {
                                                            setScheduleDraft((current) => ({
                                                                ...current,
                                                                [value]: {
                                                                    ...current[value],
                                                                    is_active: event.target.checked,
                                                                },
                                                            }));
                                                        }}
                                                        className="h-4 w-4 accent-[#07584e]"
                                                    />
                                                    {label}
                                                </label>
                                                {draft?.is_active && (
                                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                                        <label className="text-xs text-slate-600">
                                                            Start time
                                                            <input
                                                                type="time"
                                                                value={draft.start_time}
                                                                onChange={(event) => setScheduleDraft((current) => ({
                                                                    ...current,
                                                                    [value]: { ...current[value], start_time: event.target.value },
                                                                }))}
                                                                className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-800"
                                                            />
                                                        </label>
                                                        <label className="text-xs text-slate-600">
                                                            End time
                                                            <input
                                                                type="time"
                                                                value={draft.end_time}
                                                                onChange={(event) => setScheduleDraft((current) => ({
                                                                    ...current,
                                                                    [value]: { ...current[value], end_time: event.target.value },
                                                                }))}
                                                                className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-800"
                                                            />
                                                        </label>
                                                        <label className="col-span-2 text-xs text-slate-600">
                                                            Appointment slot length
                                                            <select
                                                                value={draft.slot_duration_minutes}
                                                                onChange={(event) => setScheduleDraft((current) => ({
                                                                    ...current,
                                                                    [value]: {
                                                                        ...current[value],
                                                                        slot_duration_minutes: Number(event.target.value),
                                                                    },
                                                                }))}
                                                                className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-800"
                                                            >
                                                                {[15, 20, 30, 60].map((minutes) => (
                                                                    <option key={minutes} value={minutes}>{minutes} minutes</option>
                                                                ))}
                                                            </select>
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <div className="flex gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={saveWeeklySchedule}
                                            disabled={isSavingSchedule}
                                            className="min-h-11 flex-1 rounded-xl bg-[#07584e] px-4 text-sm font-semibold text-white hover:bg-[#06443d] disabled:cursor-wait disabled:opacity-60"
                                        >
                                            {isSavingSchedule ? 'Saving hours…' : 'Save working hours'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsScheduleEditorOpen(false)}
                                            disabled={isSavingSchedule}
                                            className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-60"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section id="clinical-data" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="flex items-center gap-2 text-lg font-semibold">
                                <Icon name="heart" className="text-[#07584e]" />
                                Clinical Data
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                This dashboard endpoint currently provides your doctor profile, schedules, and appointments. AI intake and consultation records are not included in its response yet.
                            </p>
                        </section>
                    </aside>
                </div>
            </main>

            <footer className="mt-8 border-t border-slate-100 bg-white">
                <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-7">
                    <span className="font-semibold text-[#07584e]">HealthPulse Clinical Workspace</span>
                    <span>Doctor dashboard</span>
                </div>
            </footer>
        </div>
    );
}

export default DoctorDashboard;
