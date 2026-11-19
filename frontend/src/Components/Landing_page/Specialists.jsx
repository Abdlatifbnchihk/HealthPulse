import { useState } from 'react';

const specialties = [
    'All Specialists',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
];

const doctors = [
    {
        name: 'Dr. Marcus Vance',
        credentials: 'MD, FACC',
        specialty: 'Cardiology',
        focus: 'Cardiovascular Disease',
        rating: '4.9',
        reviews: '340',
        clinic: 'New York Presbyterian',
        availability: 'Today, 4:15 PM',
        fee: '$180',
        portrait: {
            background: '#e8e4d9',
            skin: '#9b6247',
            hair: '#292c2d',
            coat: '#e9eef0',
            shirt: '#315b67',
            initials: 'MV',
        },
    },
    {
        name: 'Dr. Elena Rostova',
        credentials: 'MD, FAAD',
        specialty: 'Dermatology',
        focus: 'Clinical Dermatology',
        rating: '5.0',
        reviews: '412',
        clinic: 'NYU Langone Health',
        availability: 'Tomorrow, 9:00 AM',
        fee: '$160',
        portrait: {
            background: '#e5ece8',
            skin: '#e0b39a',
            hair: '#493b34',
            coat: '#f1f3f0',
            shirt: '#47756f',
            initials: 'ER',
        },
    },
    {
        name: 'Dr. Julian Reed',
        credentials: 'MD, FAAP',
        specialty: 'Pediatrics',
        focus: 'Pediatric Medicine',
        rating: '4.9',
        reviews: '287',
        clinic: 'Mount Sinai Hospital',
        availability: 'Today, 6:00 PM',
        fee: '$140',
        portrait: {
            background: '#eee4d8',
            skin: '#dcae8c',
            hair: '#57473b',
            coat: '#f4f2ee',
            shirt: '#70837a',
            initials: 'JR',
        },
    },
    {
        name: 'Dr. Anita Patel',
        credentials: 'MD, FAAOS',
        specialty: 'Orthopedics',
        focus: 'Orthopedic Surgery',
        rating: '4.8',
        reviews: '196',
        clinic: 'Hospital for Special Surgery',
        availability: 'Thu, 11:30 AM',
        fee: '$210',
        portrait: {
            background: '#e4e9e7',
            skin: '#a96f51',
            hair: '#282727',
            coat: '#edf1ee',
            shirt: '#426f68',
            initials: 'AP',
        },
    },
];

function StarIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
            <path d="m10 1.7 2.45 4.97 5.48.8-3.96 3.86.94 5.46L10 14.21l-4.91 2.58.94-5.46-3.96-3.86 5.48-.8L10 1.7Z" />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3 w-3 shrink-0">
            <path
                d="M16 8.3c0 4.3-6 9.5-6 9.5S4 12.6 4 8.3a6 6 0 1 1 12 0Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <circle cx="10" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
            <rect
                x="3"
                y="4.5"
                width="14"
                height="13"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.4"
            />
            <path
                d="M6.5 2.5v4m7-4v4M3 8h14"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
}

function DoctorPortrait({ portrait, rating }) {
    return (
        <div
            className="relative flex h-[168px] items-end justify-center overflow-hidden sm:h-[184px]"
            style={{ backgroundColor: portrait.background }}
            aria-label={`Illustrated portrait of ${portrait.initials}`}
            role="img"
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(255,255,255,0.65),transparent_58%)]" />
            <svg
                aria-hidden="true"
                viewBox="0 0 240 190"
                className="relative h-full w-full"
                preserveAspectRatio="xMidYMax meet"
            >
                <ellipse cx="120" cy="183" rx="88" ry="15" fill="#263d3b" opacity=".1" />
                <path
                    d="M47 190c4-48 30-70 73-70s69 22 73 70H47Z"
                    fill={portrait.coat}
                />
                <path
                    d="m96 123 24 28 24-28-14-10h-20l-14 10Z"
                    fill={portrait.shirt}
                />
                <path d="M110 118h20v17h-20z" fill={portrait.skin} />
                <ellipse cx="120" cy="74" rx="38" ry="45" fill={portrait.skin} />
                <path
                    d="M82 72c-4-31 13-52 40-52 27 0 42 17 37 53-4-15-10-24-20-30-13 12-33 17-57 14v15Z"
                    fill={portrait.hair}
                />
                <path
                    d="M95 75c4-3 9-3 13 0m24 0c4-3 9-3 13 0"
                    fill="none"
                    stroke="#523d36"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <circle cx="103" cy="81" r="2" fill="#263238" />
                <circle cx="137" cy="81" r="2" fill="#263238" />
                <path
                    d="M111 99c5 4 13 4 18 0"
                    fill="none"
                    stroke="#8c5148"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="m96 123 24 28-26 20-20-34 22-14Zm48 0-24 28 26 20 20-34-22-14Z"
                    fill={portrait.coat}
                />
                <path
                    d="M110 145h20l8 45h-36l8-45Z"
                    fill={portrait.shirt}
                    opacity=".9"
                />
                <path
                    d="M153 144h17v24h-17z"
                    rx="2"
                    fill="#d9e7e4"
                />
                <path
                    d="M157 150h9m-9 5h9m-9 5h6"
                    stroke="#6b9089"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold text-[#07584e] shadow-sm">
                In-Person · Tele
            </span>
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-semibold text-[#334155] shadow-sm">
                <span className="text-[#e7a632]">
                    <StarIcon />
                </span>
                {rating}
            </span>
        </div>
    );
}

function SpecialistCard({ doctor }) {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#e5e9f2] bg-white shadow-[0_6px_18px_rgba(27,50,73,0.07)]">
            <DoctorPortrait portrait={doctor.portrait} rating={doctor.rating} />

            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="m-0 truncate text-sm font-semibold text-[#17212d]">
                            {doctor.name}
                        </h3>
                        <p className="mb-0 mt-1 text-[10px] font-medium text-[#168071]">
                            {doctor.focus}
                        </p>
                    </div>
                    <span className="shrink-0 text-[9px] text-[#647080]">
                        {doctor.credentials}
                    </span>
                </div>

                <div className="mt-2 flex items-center gap-1 text-[10px] text-[#334155]">
                    <span className="text-[#e7a632]">
                        <StarIcon />
                    </span>
                    <span className="font-semibold">{doctor.rating}</span>
                    <span>({doctor.reviews})</span>
                </div>

                <p className="mb-0 mt-2 flex min-h-8 items-start gap-1 text-[10px] leading-4 text-[#647080]">
                    <PinIcon />
                    <span>{doctor.clinic}</span>
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-[#edf0f5] pt-3 text-[9px] text-[#647080]">
                    <span>Consultation fee</span>
                    <span className="font-semibold text-[#263634]">{doctor.fee}</span>
                </div>

                <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-[#f0f7f5] px-2 py-2 text-[9px] font-medium text-[#087565]">
                    <CalendarIcon />
                    <span className="truncate">{doctor.availability}</span>
                    <span className="ml-auto shrink-0 text-[#4c867c]">Next slot</span>
                </div>

                <a
                    className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-[#004f45] px-3 text-xs font-semibold text-white no-underline transition-colors hover:bg-[#07685b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087565]"
                    href="#appointments"
                    aria-label={`Book a slot with ${doctor.name}`}
                >
                    Book Slot
                </a>
            </div>
        </article>
    );
}

function Specialists() {
    const [activeSpecialty, setActiveSpecialty] = useState('All Specialists');
    const visibleDoctors =
        activeSpecialty === 'All Specialists'
            ? doctors
            : doctors.filter((doctor) => doctor.specialty === activeSpecialty);

    return (
        <section
            id="specialties"
            aria-labelledby="specialists-heading"
            className="bg-[#eef2ff] py-16 sm:py-20 lg:py-[88px]"
        >
            <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#087565]">
                            Verified practitioners
                        </p>
                        <h2
                            id="specialists-heading"
                            className="m-0 text-[clamp(1.9rem,3.8vw,3rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-[#111827]"
                        >
                            Top-Rated Medical Specialists
                        </h2>
                        <p className="mb-0 mt-3 max-w-[620px] text-sm leading-6 text-[#647080]">
                            Board-certified department chiefs and clinical specialists
                            with real-time openings.
                        </p>
                    </div>

                    <div
                        className="flex max-w-full gap-2 overflow-x-auto pb-1"
                        aria-label="Filter specialists by specialty"
                    >
                        {specialties.map((specialty) => {
                            const isActive = specialty === activeSpecialty;

                            return (
                                <button
                                    key={specialty}
                                    className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087565] ${
                                        isActive
                                            ? 'bg-[#004f45] text-white'
                                            : 'bg-white text-[#52606b] hover:bg-[#e1e8f7]'
                                    }`}
                                    type="button"
                                    aria-pressed={isActive}
                                    onClick={() => setActiveSpecialty(specialty)}
                                >
                                    {specialty}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-5">
                    {visibleDoctors.map((doctor) => (
                        <SpecialistCard key={doctor.name} doctor={doctor} />
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <a
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#174944] no-underline transition-colors hover:text-[#087565]"
                        href="#doctors"
                    >
                        Browse all 4,800+ board-certified practitioners
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="h-4 w-4"
                        >
                            <path
                                d="M3.5 10h13m-5-5 5 5-5 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}

export default Specialists;