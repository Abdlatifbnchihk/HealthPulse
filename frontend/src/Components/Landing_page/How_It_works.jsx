const features = [
    {
        number: '01',
        category: 'Routing',
        title: 'AI Symptom Routing',
        description:
            'Plain-language symptoms, intelligent clinical specialty and priority routing. Trained against peer-reviewed triage protocols to pinpoint the exact care setting needed.',
        metricLabel: 'Clinical accuracy',
        metricValue: '99.1%',
        icon: (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                    d="M12 3.5a7.5 7.5 0 0 0-4.8 13.3c.8.7 1.3 1.4 1.5 2.2h6.6c.2-.8.7-1.5 1.5-2.2A7.5 7.5 0 0 0 12 3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                />
                <path
                    d="M9.5 22h5M9 10.5h2l1-2.5 1.5 5 1-2.5h1.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        iconClassName: 'bg-[#d9f1eb] text-[#07584e]',
    },
    {
        number: '02',
        category: 'Integration',
        title: 'Live Verified Availability',
        description:
            'Direct integration to clinic EHRs means slots reflect real clinical calendars with zero double-booking. When you confirm, the slot is instantly locked in hospital systems.',
        metricLabel: 'Slot latency',
        metricValue: '<350ms',
        icon: (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <rect
                    x="4"
                    y="5"
                    width="16"
                    height="16"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                />
                <path
                    d="M8 3v4m8-4v4M4 10h16m-9 4 2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        iconClassName: 'bg-[#b8f5e8] text-[#047767]',
    },
    {
        number: '03',
        category: 'Security',
        title: 'Enterprise Patient Privacy',
        description:
            'End-to-end encrypted clinical logs, private clinic silo design, and strict medical confidentiality. Your triage prompts and diagnostic notes are never monetized or exposed.',
        metricLabel: 'Encryption protocol',
        metricValue: 'AES-256 GCM',
        icon: (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                    d="M12 3 19 6v5c0 4.8-3 8-7 10-4-2-7-5.2-7-10V6l7-3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                />
                <rect
                    x="9"
                    y="10"
                    width="6"
                    height="5"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                />
                <path
                    d="M10.5 10V8.5a1.5 1.5 0 0 1 3 0V10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </svg>
        ),
        iconClassName: 'bg-[#e6ecff] text-[#35517f]',
    },
];

function HowItWorks() {
    return (
        <section
            id="how-it-works"
            aria-labelledby="how-it-works-heading"
            className="bg-[#f8f9ff] py-16 sm:py-20 lg:py-[88px]"
        >
            <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
                <div className="max-w-[620px]">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#087565]">
                        Architected for clinical rigor
                    </p>
                    <h2
                        id="how-it-works-heading"
                        className="m-0 text-[clamp(1.9rem,3.8vw,3rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-[#111827]"
                    >
                        How HealthPulse transforms modern patient discovery.
                    </h2>
                    <p className="mb-0 mt-4 max-w-[590px] text-sm leading-6 text-[#647080] sm:text-[15px]">
                        Engineered to eliminate administrative friction, protect patient
                        confidentiality, and ensure clinical matching accuracy without
                        cognitive overload.
                    </p>
                </div>

                <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:mt-12">
                    {features.map((feature) => (
                        <article
                            key={feature.number}
                            className="flex min-h-[300px] flex-col rounded-2xl border border-white bg-white p-5 shadow-[0_8px_20px_rgba(27,50,73,0.06)] sm:p-6"
                        >
                            <span
                                className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconClassName}`}
                            >
                                {feature.icon}
                            </span>

                            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#087565]">
                                {feature.number} / {feature.category}
                            </p>
                            <h3 className="m-0 text-lg font-semibold tracking-[-0.025em] text-[#17212d]">
                                {feature.title}
                            </h3>
                            <p className="mb-6 mt-3 flex-1 text-[13px] leading-[1.65] text-[#647080]">
                                {feature.description}
                            </p>

                            <div className="flex items-center justify-between gap-3 border-t border-[#edf0f5] pt-4 text-[10px]">
                                <span className="flex items-center gap-2 text-[#7b8792]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#087565]" />
                                    {feature.metricLabel}
                                </span>
                                <span className="text-right font-semibold text-[#183b39]">
                                    {feature.metricValue}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;