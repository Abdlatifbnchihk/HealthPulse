import { useState } from 'react';

const specialties = [
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Mental Health',
    'Orthopedics',
];

function SearchIcon({ className = 'h-5 w-5' }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
            <path
                d="m16 16 4.2 4.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
                d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
                d="M4.5 12h14m-5.5-5.5L18.5 12 13 17.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
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

function CalendarIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <rect
                x="4"
                y="6"
                width="16"
                height="15"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <path
                d="M8 3v6m8-6v6M4 10h16"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
}

function DoctorIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-7 w-7">
            <circle cx="12" cy="7.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
            <path
                d="M5 21v-2a7 7 0 0 1 14 0v2M12 11v5m-2.5-2.5h5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function Metric({ icon, value, label }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-[#07584e]">
                {icon}
            </span>
            <div>
                <p className="m-0 text-sm font-bold text-[#142b36]">{value}</p>
                <p className="m-0 text-xs text-[#64748b]">{label}</p>
            </div>
        </div>
    );
}

function Home({ onSearch }) {
    const [symptoms, setSymptoms] = useState('');
    const [location, setLocation] = useState('New York, NY');
    const [selectedSpecialties, setSelectedSpecialties] = useState(['Neurology']);

    const toggleSpecialty = (specialty) => {
        setSelectedSpecialties((current) =>
            current.includes(specialty)
                ? current.filter((item) => item !== specialty)
                : [...current, specialty],
        );
    };

    const handleSearch = (event) => {
        event.preventDefault();
        onSearch?.({
            symptoms: symptoms.trim(),
            location: location.trim(),
            specialties: selectedSpecialties,
        });
    };

    return (
        <main>
            <section className="overflow-hidden bg-[#f7f8fd]">
                <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12 lg:px-10 lg:py-[68px]">
                    <div className="min-w-0">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#d9f1eb] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#07584e]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#08796a]" />
                            AI-powered clinical triage · HIPAA compliant
                        </div>

                        <h1 className="m-0 max-w-[650px] text-[clamp(2.35rem,5vw,4.35rem)] font-semibold leading-[1.04] tracking-[-0.055em] text-[#111827]">
                            Find the right doctor, and book in{' '}
                            <span className="text-[#087565]">minutes.</span>
                        </h1>

                        <p className="mt-5 max-w-[590px] text-base leading-7 text-[#52606b] sm:text-[17px]">
                            Describe how you feel in plain language. Our verified clinical
                            intelligence matches you to the right specialist and books
                            real-time appointments seamlessly.
                        </p>

                        <form
                            className="mt-7 rounded-2xl bg-white p-2 shadow-[0_8px_24px_rgba(27,50,73,0.10)] ring-1 ring-[#e8ebf3]"
                            onSubmit={handleSearch}
                        >
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <label className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e7eaf1] px-3 text-[#52606b] focus-within:border-[#78b9ad]">
                                    <SearchIcon className="h-[18px] w-[18px] shrink-0" />
                                    <span className="sr-only">Describe your symptoms</span>
                                    <input
                                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#142b36] outline-none placeholder:text-[#89939d]"
                                        type="search"
                                        value={symptoms}
                                        onChange={(event) => setSymptoms(event.target.value)}
                                        placeholder="Describe your symptoms"
                                    />
                                </label>

                                <label className="flex min-h-12 items-center gap-2 rounded-xl border border-[#e7eaf1] px-3 text-[#52606b] focus-within:border-[#78b9ad] sm:w-[170px]">
                                    <PinIcon />
                                    <span className="sr-only">Location</span>
                                    <input
                                        className="min-w-0 w-full border-0 bg-transparent text-sm text-[#142b36] outline-none"
                                        type="text"
                                        value={location}
                                        onChange={(event) => setLocation(event.target.value)}
                                        aria-label="Location"
                                    />
                                </label>

                                <button
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#004f45] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#07685b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087565] sm:px-4"
                                    type="submit"
                                >
                                    Search Doctors
                                    <ArrowIcon />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 overflow-x-auto px-1 pb-1 pt-3">
                                <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#87919c]">
                                    Popular:
                                </span>
                                {specialties.map((specialty) => {
                                    const isSelected = selectedSpecialties.includes(specialty);

                                    return (
                                        <button
                                            key={specialty}
                                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087565] ${
                                                isSelected
                                                    ? 'bg-[#d9f1eb] text-[#07584e]'
                                                    : 'bg-[#f3f5fa] text-[#596675] hover:bg-[#e8edf5]'
                                            }`}
                                            type="button"
                                            aria-pressed={isSelected}
                                            onClick={() => toggleSpecialty(specialty)}
                                        >
                                            {specialty}
                                        </button>
                                    );
                                })}
                            </div>
                        </form>

                        <div className="mt-7 grid grid-cols-1 gap-4 min-[420px]:grid-cols-3">
                            <Metric
                                icon={<ShieldIcon />}
                                value="4,800+"
                                label="Board-certified"
                            />
                            <Metric
                                icon={<span className="text-sm">★</span>}
                                value="4.9 / 5"
                                label="140k+ reviews"
                            />
                            <Metric
                                icon={<CalendarIcon />}
                                value="100%"
                                label="Zero double booking"
                            />
                        </div>
                    </div>

                    <aside
                        className="mx-auto w-full max-w-[520px] rounded-[26px] bg-white p-5 shadow-[0_20px_55px_rgba(21,62,70,0.12)] ring-1 ring-[#e8edf3] sm:p-6"
                        aria-label="AI diagnostic copilot example"
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-[#edf0f5] pb-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e1f3ef] text-[#07584e]">
                                    <ShieldIcon />
                                </span>
                                <div className="min-w-0">
                                    <p className="m-0 truncate text-sm font-semibold text-[#142b36]">
                                        Diagnostic Copilot
                                    </p>
                                    <p className="m-0 text-[11px] text-[#788491]">
                                        Clinical v4.2 · Active Triage
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#d9f1eb] px-2.5 py-1 text-[10px] font-semibold text-[#07584e]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#15957f]" />
                                Live Match
                            </span>
                        </div>

                        <div className="mt-4 rounded-xl bg-[#f1f3ff] p-4">
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <p className="m-0 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#768198]">
                                    Analyzed patient statement
                                </p>
                                <span className="text-[9px] font-medium text-[#168071]">
                                    ✓ Parsed
                                </span>
                            </div>
                            <p className="m-0 text-sm italic leading-6 text-[#485467]">
                                “Persistent migraine with light sensitivity and mild fever
                                for 24 hours.”
                            </p>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-[#edf1ff] p-3">
                                <p className="m-0 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#768198]">
                                    Matched specialty
                                </p>
                                <p className="mb-1 mt-1 text-sm font-semibold text-[#172a39]">
                                    Neurology
                                </p>
                                <span className="rounded-full bg-[#d9f1eb] px-2 py-0.5 text-[9px] font-semibold text-[#087565]">
                                    98% confidence
                                </span>
                            </div>
                            <div className="rounded-xl bg-[#edf1ff] p-3">
                                <p className="m-0 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#768198]">
                                    Clinical urgency
                                </p>
                                <p className="mb-0 mt-1 flex items-center gap-2 text-sm font-semibold text-[#172a39]">
                                    <span className="h-2 w-2 rounded-full bg-[#e7a632]" />
                                    Moderate
                                </p>
                                <p className="mb-0 mt-1 text-[9px] text-[#768198]">
                                    Under 15m telehealth wait
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#edf0f5] p-3">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#dbe9e8] text-[#07584e]">
                                <DoctorIcon />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="m-0 truncate text-xs font-semibold text-[#172a39]">
                                    Dr. Sarah Lin, MD
                                </p>
                                <p className="m-0 truncate text-[10px] text-[#647183]">
                                    Chief Neurologist · NYU Langone
                                </p>
                                <p className="m-0 mt-1 text-[9px] font-medium text-[#168071]">
                                    Today · 2:30 PM · Direct EHR lock
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                            <a
                                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#004f45] px-3 text-xs font-semibold text-white no-underline transition-colors hover:bg-[#07685b]"
                                href="#doctors"
                            >
                                Book with Dr. Lin
                            </a>
                            <a
                                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#dfe5ec] bg-white px-3 text-xs font-medium text-[#3d4b5a] no-underline transition-colors hover:bg-[#f7f9fc]"
                                href="#doctors"
                            >
                                All 14 matches
                            </a>
                        </div>

                        <p className="mb-0 mt-3 text-center text-[9px] text-[#7b8792]">
                            ◈ 256-bit encrypted log · Not emergency advice (call 911)
                        </p>
                    </aside>
                </div>
            </section>

            <section
                className="border-y border-[#e5eaf5] bg-[#eef2ff]"
                aria-label="HealthPulse service highlights"
            >
                <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-5 px-6 py-5 sm:px-8 lg:grid-cols-4 lg:px-10">
                    <Metric
                        icon={<CalendarIcon />}
                        value="4.2 min"
                        label="Average triage time"
                    />
                    <Metric
                        icon={<ArrowIcon />}
                        value="34 EHRs"
                        label="Real-time bidirectional sync"
                    />
                    <Metric
                        icon={<ShieldIcon />}
                        value="100% HIPAA"
                        label="Compliant and audited"
                    />
                    <Metric
                        icon={<DoctorIcon />}
                        value="96 specialties"
                        label="Board-certified coverage"
                    />
                </div>
            </section>
        </main>
    );
}

export default Home;