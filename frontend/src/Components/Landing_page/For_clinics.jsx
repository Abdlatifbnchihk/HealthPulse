function ForClinics() {
    return (
        <section
            id="for-clinics"
            aria-labelledby="for-clinics-heading"
            className="overflow-hidden bg-[#004f45] text-white"
        >
            <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-12 sm:px-8 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-[68px]">
                <div className="max-w-[660px]">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[9px] font-semibold tracking-wide text-[#b8f5e8]">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="h-3 w-3"
                        >
                            <path
                                d="M10 2.5 16 5v4.3c0 3.8-2.6 6.4-6 8.2-3.4-1.8-6-4.4-6-8.2V5l6-2.5Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="m7.5 9.8 1.7 1.7 3.5-3.7"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Standardized quality protocol
                    </span>

                    <h2
                        id="for-clinics-heading"
                        className="m-0 text-[clamp(1.8rem,3.8vw,3rem)] font-semibold leading-[1.08] tracking-[-0.045em]"
                    >
                        Are you a clinic director or health system network?
                    </h2>
                    <p className="mb-0 mt-4 max-w-[640px] text-sm leading-6 text-[#b8d7d2] sm:text-[15px]">
                        Integrate HealthPulse’s intelligent triage layer into your existing
                        Epic, Cerner, or AthenaHealth EHR to help reduce intake misroutes.
                    </p>
                </div>

                <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[300px]">
                    <a
                        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-5 text-xs font-semibold text-[#123b36] no-underline transition-colors hover:bg-[#eaf7f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        href="#contact"
                    >
                        Request Health System Demo
                    </a>
                    <a
                        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/10 px-5 text-xs font-semibold text-white no-underline transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        href="#ehr-documentation"
                    >
                        Review EHR Documentation
                    </a>
                </div>
            </div>
        </section>
    );
}

export default ForClinics;