import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Landing_page/Header';

function SearchIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
            <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    );
}

function ClinicIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M4 20V5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5V20M2.5 20h19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M9 8h6M12 5v6M8 15h1m6 0h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function DoctorAvatar({ name }) {
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <div
            aria-hidden="true"
            className="relative grid h-[76px] w-[76px] shrink-0 place-items-center rounded-[22px] bg-gradient-to-br from-[#d8f4ec] to-[#e8edff] text-2xl font-bold tracking-wide text-[#07584e] ring-1 ring-inset ring-[#d9e8e4]"
        >
            {initials}
            <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-[3px] border-white bg-[#08766b] text-sm font-bold text-white">
                +
            </span>
        </div>
    );
}

function DoctorCard({ doctor }) {
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#e3e8f1] bg-white shadow-[0_5px_18px_rgba(27,42,76,0.07)] transition duration-200 hover:-translate-y-0.5 hover:border-[#c5ddd7] hover:shadow-[0_12px_28px_rgba(27,72,65,0.12)]">
            <div className="h-1.5 bg-gradient-to-r from-[#078b79] via-[#3dc6ac] to-[#dce9ff]" />
            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    <DoctorAvatar name={doctor.name || 'Doctor'} />
                    <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f7f3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#08766b]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#119982]" />
                                Listed profile
                            </span>
                        </div>
                        <h2 className="mt-2 break-words text-xl font-bold leading-tight text-[#064b42] sm:text-[22px]">
                            {doctor.name || 'Doctor profile'}
                        </h2>
                        <p className="mt-1.5 text-sm font-semibold text-[#118579]">
                            {doctor.specialty || 'Specialty not listed'}
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex min-h-[58px] items-center gap-3 rounded-xl bg-[#f7f9fc] px-4 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#08766b] shadow-sm">
                        <ClinicIcon />
                    </span>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7a8885]">
                            Clinic
                        </p>
                        <p className="mt-0.5 truncate text-sm font-medium text-[#344b48]">
                            {doctor.clinic || 'Clinic not specified'}
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 divide-x divide-[#e7eaf3] rounded-xl border border-[#e7eaf3]">
                    <div className="px-4 py-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7a8885]">
                            Consultation fee
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#064b42]">
                            {doctor.fee}
                        </p>
                    </div>
                    <div className="px-4 py-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7a8885]">
                            Visit length
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#064b42]">
                            {doctor.slot_duration} <span className="text-xs font-semibold">min</span>
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-5">
                    <Link
                        to={`/doctors/${doctor.id}`}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#064b42] px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#086357] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08766b]"
                    >
                        View doctor details
                        <span aria-hidden="true" className="text-base transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                    <p className="mt-2 text-center text-[11px] text-[#7a8885]">
                        Profile details provided by the clinic
                    </p>
                </div>
            </div>
        </article>
    );
}

function DoctorDirectory() {
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [clinicId, setClinicId] = useState('');
    const [page, setPage] = useState(1);
    const [doctors, setDoctors] = useState([]);
    const [metadata, setMetadata] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        specialties: [],
        clinics: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 250);

        return () => window.clearTimeout(timeoutId);
    }, [searchInput]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadDoctors() {
            setIsLoading(true);
            setError('');

            try {
                const token = localStorage.getItem('Auth_token');
                if (!token) {
                    throw new Error('You must sign in to view the doctor directory.');
                }

                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
                if (!apiBaseUrl) {
                    throw new Error('VITE_API_BASE_URL is not configured.');
                }

                const params = new URLSearchParams();
                if (search) params.set('search', search);
                if (specialty) params.set('specialty', specialty);
                if (clinicId) params.set('clinic_id', clinicId);
                params.set('page', String(page));

                const response = await fetch(
                    `${apiBaseUrl.replace(/\/$/, '')}/doctor-directory?${params.toString()}`,
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
                        result.message || `Could not load the doctor directory (HTTP ${response.status}).`,
                    );
                }

                if (
                    !Array.isArray(result.data)
                    || !result.meta
                    || !Array.isArray(result.meta.specialties)
                    || !Array.isArray(result.meta.clinics)
                ) {
                    throw new Error('The doctor directory response has an invalid format.');
                }

                setDoctors(result.data);
                setMetadata(result.meta);
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

        loadDoctors();
        return () => controller.abort();
    }, [search, specialty, clinicId, page]);

    const updateSpecialty = (event) => {
        setSpecialty(event.target.value);
        setPage(1);
    };

    const updateClinic = (event) => {
        setClinicId(event.target.value);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-[#f0f2ff] text-[#172b2a]">
            <Header />

            <main>
                <section className="border-b border-[#e4e9fa] bg-[#f0f2ff]">
                    <div className="mx-auto max-w-[1440px] px-5 pb-9 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10">
                        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-[#dfe8ff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#07584e]">
                                    <span className="h-2 w-2 rounded-full bg-[#078b79]" />
                                    HealthPulse doctor directory
                                </span>
                                <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#064b42] sm:text-5xl">
                                    Find a Doctor
                                </h1>
                                <p className="mt-3 max-w-2xl text-base leading-7 text-[#596966] sm:text-lg">
                                    Explore doctors across HealthPulse clinics and learn about their specialties and consultation details.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="rounded-2xl border border-white bg-white px-5 py-3 shadow-sm">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#687574]">
                                        Listed doctors
                                    </p>
                                    <p className="mt-1 text-xl font-bold text-[#102b28]">
                                        {metadata.total}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white bg-white px-5 py-3 shadow-sm">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#687574]">
                                        Clinics
                                    </p>
                                    <p className="mt-1 text-xl font-bold text-[#102b28]">
                                        {metadata.clinics.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
                    <div className="rounded-2xl border border-[#e7eaf3] bg-white p-4 shadow-sm sm:p-5">
                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(190px,0.7fr)_minmax(190px,0.7fr)]">
                            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#e2e7f2] bg-white px-4 focus-within:border-[#078b79] focus-within:ring-2 focus-within:ring-[#078b79]/15">
                                <span className="text-[#71807d]"><SearchIcon /></span>
                                <span className="sr-only">Search doctors by name, specialty, or clinic</span>
                                <input
                                    type="search"
                                    value={searchInput}
                                    onChange={(event) => setSearchInput(event.target.value)}
                                    placeholder="Search by doctor name, specialty, or clinic..."
                                    className="min-w-0 flex-1 bg-transparent text-sm text-[#173c38] outline-none placeholder:text-[#899492]"
                                />
                            </label>

                            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#e2e7f2] px-4">
                                <span className="sr-only">Filter by specialty</span>
                                <select
                                    value={specialty}
                                    onChange={updateSpecialty}
                                    className="w-full bg-transparent text-sm font-medium text-[#344b48] outline-none"
                                >
                                    <option value="">All specialties</option>
                                    {metadata.specialties.map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#e2e7f2] px-4">
                                <ClinicIcon />
                                <span className="sr-only">Filter by clinic</span>
                                <select
                                    value={clinicId}
                                    onChange={updateClinic}
                                    className="w-full bg-transparent text-sm font-medium text-[#344b48] outline-none"
                                >
                                    <option value="">All clinics</option>
                                    {metadata.clinics.map((clinic) => (
                                        <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#193b37]" aria-live="polite">
                            {isLoading
                                ? 'Loading doctors...'
                                : `Showing ${doctors.length} of ${metadata.total} doctors`}
                        </p>
                        <p className="text-xs text-[#72807e]">
                            Profile information is provided by the listed clinics.
                        </p>
                    </div>

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                            {error}
                        </div>
                    )}

                    {!error && isLoading && (
                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
                            ))}
                        </div>
                    )}

                    {!error && !isLoading && doctors.length > 0 && (
                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            {doctors.map((doctor) => (
                                <DoctorCard
                                    key={doctor.id}
                                    doctor={doctor}
                                />
                            ))}
                        </div>
                    )}

                    {!error && !isLoading && doctors.length === 0 && (
                        <div className="mt-5 rounded-2xl border border-dashed border-[#cbd4e4] bg-white px-6 py-14 text-center">
                            <h2 className="text-xl font-semibold text-[#173c38]">No doctors found</h2>
                            <p className="mt-2 text-sm text-[#687574]">
                                Try changing your search or clearing one of the filters.
                            </p>
                        </div>
                    )}

                    {!error && !isLoading && metadata.last_page > 1 && (
                        <nav className="mt-6 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm" aria-label="Doctor directory pages">
                            <p className="text-sm text-[#687574]">
                                Page {metadata.current_page} of {metadata.last_page}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                                    disabled={metadata.current_page <= 1}
                                    className="rounded-lg border border-[#e2e7f2] px-4 py-2 text-sm font-semibold text-[#173c38] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPage((current) => Math.min(metadata.last_page, current + 1))}
                                    disabled={metadata.current_page >= metadata.last_page}
                                    className="rounded-lg bg-[#064b42] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </nav>
                    )}
                </section>

                <section className="border-t border-[#e4e9fa] bg-[#e9edff]">
                    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10">
                        <div className="rounded-2xl border border-white bg-white p-6 shadow-sm sm:p-8">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#078b79]">
                                About this directory
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-[#064b42]">
                                Doctor profiles across HealthPulse clinics
                            </h2>
                            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#596966]">
                                The directory lists registered doctor profiles and the clinic, specialty, consultation fee, and appointment length currently associated with each profile. It does not display credentials or verification claims that are not recorded in the profile.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}

export default DoctorDirectory;
