const footerGroups = [
    {
        title: 'Patients',
        links: [
            { label: 'Find a Specialist', href: '#doctors' },
            { label: 'Virtual Urgent Care', href: '#urgent-care' },
            { label: 'Lab Results & Records', href: '#patient-records' },
            { label: 'Prescription Refills', href: '#prescriptions' },
        ],
    },
    {
        title: 'Practitioners',
        links: [
            { label: 'Clinical Workspace', href: '#clinical-workspace' },
            { label: 'EHR Integration', href: '#ehr-documentation' },
            { label: 'Partner Hospitals', href: '#for-clinics' },
            { label: 'Clinical Trials', href: '#clinical-trials' },
        ],
    },
    {
        title: 'Organization',
        links: [
            { label: 'Medical Ethics Board', href: '#medical-ethics' },
            { label: 'Research & Insights', href: '#research' },
            { label: 'Privacy Safeguards', href: '#privacy' },
            { label: 'Contact Operations', href: '#contact' },
        ],
    },
];

function BrandMark() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 32 32"
            fill="none"
            className="h-8 w-8 text-[#064b42]"
        >
            <rect x="1" y="1" width="30" height="30" rx="9" fill="currentColor" />
            <path
                d="M16 25s-8.5-5.3-8.5-11a4.9 4.9 0 0 1 8.5-3.2 4.9 4.9 0 0 1 8.5 3.2c0 5.7-8.5 11-8.5 11Z"
                stroke="white"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path
                d="M9.5 15.5h4l1.5-3 2.2 6 1.6-3h3.7"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function Footer() {
    return (
        <footer className="bg-[#eef2ff] text-[#263634]">
            <div className="mx-auto max-w-[1440px] px-6 pb-6 pt-10 sm:px-8 sm:pt-12 lg:px-10">
                <div className="grid gap-8 border-b border-[#dce3f2] pb-8 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-10">
                    <div className="max-w-[310px]">
                        <a
                            href="/"
                            aria-label="HealthPulse home"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#123d38] no-underline"
                        >
                            <BrandMark />
                            <span>HealthPulse</span>
                        </a>
                        <p className="mb-0 mt-4 text-xs leading-5 text-[#657180]">
                            High-trust clinical diagnostics, certified practitioner
                            networks, and AI-triage workflows engineered for modern
                            patient and clinic clarity.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d7eee8] px-2.5 py-1 text-[9px] font-semibold text-[#175b51]">
                                <span aria-hidden="true">✓</span>
                                HIPAA Compliant
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dfe8ff] px-2.5 py-1 text-[9px] font-semibold text-[#405b8a]">
                                <span aria-hidden="true">◇</span>
                                256-Bit Encrypted
                            </span>
                        </div>
                    </div>

                    {footerGroups.map((group) => (
                        <nav
                            key={group.title}
                            aria-label={`${group.title} footer links`}
                        >
                            <h2 className="mb-4 mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#52606b]">
                                {group.title}
                            </h2>
                            <ul className="m-0 list-none space-y-3 p-0">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            className="text-[11px] text-[#647080] no-underline transition-colors hover:text-[#087565]"
                                            href={link.href}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                <div className="flex flex-col gap-4 pt-5 text-[9px] text-[#788391] sm:flex-row sm:items-center sm:justify-between">
                    <p className="m-0">
                        © {new Date().getFullYear()} HealthPulse Digital Care, Inc. All
                        clinical rights reserved.
                    </p>
                    <nav aria-label="Legal links" className="flex flex-wrap gap-x-5 gap-y-2">
                        <a className="text-inherit no-underline hover:text-[#087565]" href="#patient-rights">
                            Patient Rights
                        </a>
                        <a className="text-inherit no-underline hover:text-[#087565]" href="#terms">
                            Terms of Clinical Service
                        </a>
                        <a className="text-inherit no-underline hover:text-[#087565]" href="#security">
                            Security Protocol
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

export default Footer;