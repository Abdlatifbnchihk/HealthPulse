import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from './Landing_page/Header';

function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDate(date) {
    if (!date) {
        return '';
    }

    const dateOnly = date.slice(0, 10);
    return new Date(`${dateOnly}T00:00:00`).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function getSavedUserRole() {
    try {
        const user = JSON.parse(localStorage.getItem('Auth_user') || 'null');
        return user?.role || null;
    } catch (error) {
        console.error('Unable to read the saved user role for doctor details.', error);
        return null;
    }
}

function DoctorAvatar({ name }) {
    const initials = (name || 'Doctor')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <div
            aria-hidden="true"
            className="grid h-24 w-24 shrink-0 place-items-center rounded-[28px] bg-gradient-to-br from-[#d8f4ec] to-[#e8edff] text-3xl font-bold tracking-wide text-[#07584e] ring-1 ring-inset ring-[#d9e8e4] sm:h-28 sm:w-28"
        >
            {initials}
        </div>
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

const weekdays = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
};

function DoctorDetails() {
    const { doctorId } = useParams();
    const userRole = getSavedUserRole();
    const today = getLocalDateString();
    const [doctor, setDoctor] = useState(null);
    const [isDoctorLoading, setIsDoctorLoading] = useState(true);
    const [doctorError, setDoctorError] = useState('');
    const [selectedDate, setSelectedDate] = useState(today);
    const [slots, setSlots] = useState([]);
    const [hasScheduleForDate, setHasScheduleForDate] = useState(null);
    const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
    const [availabilityError, setAvailabilityError] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [appointmentNotes, setAppointmentNotes] = useState('');
    const [bookingError, setBookingError] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadDoctor() {
            setIsDoctorLoading(true);
            setDoctorError('');

            try {
                const token = localStorage.getItem('Auth_token');
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
                if (!token) {
                    throw new Error('You must sign in to view doctor details.');
                }
                if (!apiBaseUrl) {
                    throw new Error('VITE_API_BASE_URL is not configured.');
                }

                const response = await fetch(
                    `${apiBaseUrl.replace(/\/$/, '')}/doctor-directory/${encodeURIComponent(doctorId)}`,
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
                    throw new Error(result.message || `Could not load doctor details (HTTP ${response.status}).`);
                }
                if (!result.data || !result.data.id || !result.data.name) {
                    throw new Error('The doctor profile response has an invalid format.');
                }

                setDoctor(result.data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setDoctorError(error.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsDoctorLoading(false);
                }
            }
        }

        loadDoctor();
        return () => controller.abort();
    }, [doctorId]);

    useEffect(() => {
        if (userRole !== 'patient' || !doctorId || !selectedDate) {
            setSlots([]);
            setHasScheduleForDate(null);
            setSelectedSlot(null);
            setIsAvailabilityLoading(false);
            return undefined;
        }

        const controller = new AbortController();

        async function loadAvailability() {
            setIsAvailabilityLoading(true);
            setAvailabilityError('');
            setSelectedSlot(null);
            setHasScheduleForDate(null);

            try {
                const token = localStorage.getItem('Auth_token');
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
                if (!token || !apiBaseUrl) {
                    throw new Error(!token
                        ? 'You must sign in to check appointment availability.'
                        : 'VITE_API_BASE_URL is not configured.');
                }

                const params = new URLSearchParams({ date: selectedDate });
                const response = await fetch(
                    `${apiBaseUrl.replace(/\/$/, '')}/doctor-directory/${encodeURIComponent(doctorId)}/availability?${params.toString()}`,
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
                    throw new Error(result.message || `Could not load availability (HTTP ${response.status}).`);
                }
                if (
                    !Array.isArray(result.data?.slots)
                    || typeof result.data.has_schedule !== 'boolean'
                ) {
                    throw new Error('The availability response has an invalid format.');
                }

                setSlots(result.data.slots);
                setHasScheduleForDate(result.data.has_schedule);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setAvailabilityError(error.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsAvailabilityLoading(false);
                }
            }
        }

        loadAvailability();
        return () => controller.abort();
    }, [doctorId, selectedDate, userRole]);

    async function handleBooking() {
        if (!doctor || !selectedSlot || isBooking) {
            return;
        }

        setIsBooking(true);
        setBookingError('');

        try {
            const token = localStorage.getItem('Auth_token');
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            if (!token || !apiBaseUrl) {
                throw new Error(!token
                    ? 'Your session has expired. Please sign in again.'
                    : 'VITE_API_BASE_URL is not configured.');
            }

            const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/appointments`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    doctor_profile_id: doctor.id,
                    appointment_date: selectedDate,
                    start_time: selectedSlot.start,
                    end_time: selectedSlot.end,
                    notes: appointmentNotes.trim() || null,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                const firstValidationError = Object.values(result.errors || {})
                    .flat()
                    .find((message) => typeof message === 'string');
                throw new Error(firstValidationError || result.message || `Could not book the appointment (HTTP ${response.status}).`);
            }
            if (!result.data?.id) {
                throw new Error('The booking response did not include an appointment.');
            }

            setAppointment(result.data);
            setSelectedSlot(null);
            setAppointmentNotes('');
        } catch (error) {
            setBookingError(error.message);
        } finally {
            setIsBooking(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f0f2ff] text-[#172b2a]">
            <Header />

            <main className="mx-auto max-w-[1440px] px-5 pb-12 pt-6 sm:px-8 lg:px-10">
                <Link
                    to="/find-doctor"
                    className="inline-flex items-center gap-2 rounded-full px-1 py-2 text-sm font-medium text-[#07584e] hover:text-[#08766b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08766b]"
                >
                    <span aria-hidden="true">←</span>
                    Back to Find a Doctor
                </Link>

                {isDoctorLoading && (
                    <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.95fr]">
                        <div className="h-[360px] animate-pulse rounded-2xl bg-white" />
                        <div className="h-[500px] animate-pulse rounded-2xl bg-white" />
                    </div>
                )}

                {doctorError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
                        <p>{doctorError}</p>
                        <Link to="/find-doctor" className="mt-3 inline-flex font-semibold underline">
                            Return to the doctor directory
                        </Link>
                    </div>
                )}

                {!isDoctorLoading && doctor && (
                    <>
                        <div className="mb-5 mt-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm text-[#687574]">
                                Doctor directory <span className="px-1 text-[#aab4b1]">/</span>
                                <span className="font-medium text-[#344b48]">Profile details</span>
                            </div>
                            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#687574]">
                                HealthPulse doctor profile
                            </span>
                        </div>

                        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
                            <div className="space-y-5">
                                <section className="overflow-hidden rounded-2xl border border-[#e7eaf3] bg-white shadow-sm">
                                    <div className="h-2 bg-gradient-to-r from-[#078b79] via-[#3dc6ac] to-[#dce9ff]" />
                                    <div className="p-5 sm:p-8">
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                            <DoctorAvatar name={doctor.name} />
                                            <div className="min-w-0">
                                                <p className="inline-flex rounded-full bg-[#e7f7f3] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#08766b]">
                                                    {doctor.specialty || 'Specialty not listed'}
                                                </p>
                                                <h1 className="mt-3 break-words text-3xl font-bold tracking-tight text-[#064b42] sm:text-4xl">
                                                    {doctor.name}
                                                </h1>
                                                <p className="mt-2 flex items-center gap-2 text-sm text-[#596966]">
                                                    <ClinicIcon />
                                                    <span>{doctor.clinic || 'Clinic not specified'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-7 grid gap-3 border-t border-[#e7eaf3] pt-5 sm:grid-cols-2">
                                            <div className="rounded-xl bg-[#f0f3ff] p-4">
                                                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#687574]">
                                                    Consultation fee
                                                </p>
                                                <p className="mt-1 text-2xl font-bold text-[#064b42]">
                                                    {doctor.fee}
                                                </p>
                                                <p className="mt-1 text-xs text-[#687574]">As listed in the doctor profile</p>
                                            </div>
                                            <div className="rounded-xl bg-[#f0f3ff] p-4">
                                                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#687574]">
                                                    Appointment length
                                                </p>
                                                <p className="mt-1 text-2xl font-bold text-[#064b42]">
                                                    {doctor.slot_duration} minutes
                                                </p>
                                                <p className="mt-1 text-xs text-[#687574]">Based on the saved profile duration</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-[#e7eaf3] bg-white p-5 shadow-sm sm:p-7">
                                    <h2 className="text-xl font-bold text-[#064b42]">Practice information</h2>
                                    <p className="mt-2 text-sm leading-6 text-[#687574]">
                                        This profile displays the professional and clinic information currently available in HealthPulse.
                                    </p>
                                    <dl className="mt-5 divide-y divide-[#e7eaf3] border-y border-[#e7eaf3]">
                                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between sm:gap-4">
                                            <dt className="text-sm text-[#687574]">Specialty</dt>
                                            <dd className="text-sm font-semibold text-[#173c38]">{doctor.specialty || 'Not listed'}</dd>
                                        </div>
                                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between sm:gap-4">
                                            <dt className="text-sm text-[#687574]">Clinic</dt>
                                            <dd className="text-sm font-semibold text-[#173c38]">{doctor.clinic || 'Not listed'}</dd>
                                        </div>
                                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between sm:gap-4">
                                            <dt className="text-sm text-[#687574]">Appointment length</dt>
                                            <dd className="text-sm font-semibold text-[#173c38]">{doctor.slot_duration} minutes</dd>
                                        </div>
                                    </dl>
                                    {userRole === 'doctor' && doctor.is_own_profile && (
                                        <Link
                                            to="/doctorDashboard"
                                            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-[#cbded9] px-5 text-sm font-semibold text-[#07584e] hover:bg-[#f3faf8]"
                                        >
                                            Go to your doctor dashboard
                                        </Link>
                                    )}
                                </section>

                                <section className="rounded-2xl border border-[#e7eaf3] bg-white p-5 shadow-sm sm:p-7">
                                    <h2 className="text-xl font-bold text-[#064b42]">Weekly working hours</h2>
                                    <p className="mt-2 text-sm leading-6 text-[#687574]">
                                        These are the doctor’s regular hours. Appointment times still depend on the selected date and existing bookings.
                                    </p>
                                    {doctor.weekly_schedule?.length ? (
                                        <dl className="mt-4 divide-y divide-[#e7eaf3] border-y border-[#e7eaf3]">
                                            {doctor.weekly_schedule.map((schedule) => (
                                                <div
                                                    key={`${schedule.day_of_week}-${schedule.start_time}`}
                                                    className="flex items-center justify-between gap-4 py-3 text-sm"
                                                >
                                                    <dt className="font-medium text-[#344b48]">
                                                        {weekdays[schedule.day_of_week] || 'Day unavailable'}
                                                    </dt>
                                                    <dd className="text-right font-semibold text-[#173c38]">
                                                        {schedule.start_time}–{schedule.end_time}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    ) : (
                                        <p className="mt-4 rounded-xl bg-[#f0f3ff] p-4 text-sm leading-5 text-[#596966]">
                                            This doctor hasn’t added their availability yet
                                        </p>
                                    )}
                                </section>

                                <div className="rounded-2xl border border-[#dce5fc] bg-[#e8edff] p-5 text-sm leading-6 text-[#465d59]">
                                    Only information saved in the HealthPulse profile is shown. Credentials, ratings, and additional practice details are not currently available in this profile.
                                </div>
                            </div>

                            <aside className="space-y-4 lg:sticky lg:top-24">
                                <section className="rounded-2xl border border-[#e7eaf3] bg-white p-5 shadow-sm sm:p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#078b79]">
                                                Appointment booking
                                            </p>
                                            <h2 className="mt-1 text-xl font-bold text-[#102b28]">
                                                Check availability
                                            </h2>
                                        </div>
                                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#53d5bd]" aria-hidden="true" />
                                    </div>

                                    {userRole === 'patient' ? (
                                        <>
                                            {appointment ? (
                                                <div className="mt-5 rounded-xl border border-[#b8e3d9] bg-[#effaf6] p-4" role="status">
                                                    <p className="font-semibold text-[#07584e]">Appointment booked</p>
                                                    <p className="mt-1 text-sm leading-5 text-[#45615d]">
                                                        {formatDate(appointment.appointment_date || selectedDate)} at {(appointment.start_time || '').slice(0, 5) || 'the selected time'}.
                                                    </p>
                                                    <Link
                                                        to="/patientDashboard"
                                                        className="mt-3 inline-flex font-semibold text-[#07584e] underline"
                                                    >
                                                        View patient dashboard
                                                    </Link>
                                                </div>
                                            ) : (
                                                <>
                                                    <label htmlFor="appointment-date" className="mt-5 block text-xs font-bold uppercase tracking-[0.08em] text-[#687574]">
                                                        Choose a date
                                                    </label>
                                                    <input
                                                        id="appointment-date"
                                                        type="date"
                                                        min={today}
                                                        value={selectedDate}
                                                        onChange={(event) => {
                                                            setSelectedDate(event.target.value);
                                                            setBookingError('');
                                                        }}
                                                        className="mt-2 min-h-12 w-full rounded-xl border border-[#e2e7f2] bg-white px-4 text-sm font-medium text-[#173c38] outline-none focus:border-[#078b79] focus:ring-2 focus:ring-[#078b79]/15"
                                                    />

                                                    <div className="mt-5 flex items-center justify-between gap-3">
                                                        <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#687574]">
                                                            Available times
                                                        </h3>
                                                        {selectedDate && <span className="text-xs text-[#687574]">{formatDate(selectedDate)}</span>}
                                                    </div>

                                                    {isAvailabilityLoading && (
                                                        <p className="mt-4 rounded-xl bg-[#f0f3ff] px-4 py-3 text-sm text-[#596966]" role="status">
                                                            Checking this doctor’s schedule...
                                                        </p>
                                                    )}
                                                    {availabilityError && (
                                                        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                                                            {availabilityError}
                                                        </p>
                                                    )}
                                                    {!isAvailabilityLoading && !availabilityError && hasScheduleForDate === false && doctor.weekly_schedule?.length > 0 && (
                                                        <p className="mt-4 rounded-xl bg-[#f0f3ff] px-4 py-3 text-sm leading-5 text-[#596966]">
                                                            This doctor doesn’t have working hours on this day. Choose a date on one of their scheduled days.
                                                        </p>
                                                    )}
                                                    {!isAvailabilityLoading && !availabilityError && hasScheduleForDate === false && !doctor.weekly_schedule?.length && (
                                                        <p className="mt-4 rounded-xl bg-[#f0f3ff] px-4 py-3 text-sm leading-5 text-[#596966]">
                                                            This doctor hasn’t added their availability yet
                                                        </p>
                                                    )}
                                                    {!isAvailabilityLoading && !availabilityError && hasScheduleForDate === true && slots.length === 0 && (
                                                        <p className="mt-4 rounded-xl bg-[#f0f3ff] px-4 py-3 text-sm leading-5 text-[#596966]">
                                                            There are no bookable appointment times on this date. Try another date.
                                                        </p>
                                                    )}
                                                    {!isAvailabilityLoading && !availabilityError && slots.length > 0 && (
                                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                                            {slots.map((slot) => {
                                                                const isSelected = selectedSlot?.start === slot.start;
                                                                return (
                                                                    <button
                                                                        key={`${slot.start}-${slot.end}`}
                                                                        type="button"
                                                                        disabled={!slot.available}
                                                                        aria-pressed={isSelected}
                                                                        onClick={() => {
                                                                            setSelectedSlot(slot);
                                                                            setBookingError('');
                                                                        }}
                                                                        className={`min-h-11 rounded-xl border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-[#f6f7fa] disabled:text-[#a0a9a7] disabled:line-through ${
                                                                            isSelected
                                                                                ? 'border-[#064b42] bg-[#064b42] text-white'
                                                                                : 'border-[#dfe6f3] bg-[#f5f7ff] text-[#173c38] hover:border-[#93c8ba] hover:bg-[#effaf6]'
                                                                        }`}
                                                                    >
                                                                        {slot.start}
                                                                        {!slot.available && <span className="ml-1 text-[10px] font-medium no-underline">Booked</span>}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {selectedSlot && !isAvailabilityLoading && (
                                                        <div className="mt-5 rounded-xl bg-[#f0f3ff] p-4">
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#687574]">
                                                                Appointment summary
                                                            </p>
                                                            <p className="mt-2 text-sm font-semibold text-[#173c38]">
                                                                {formatDate(selectedDate)} · {selectedSlot.start}–{selectedSlot.end}
                                                            </p>
                                                            <p className="mt-1 text-sm text-[#596966]">
                                                                Consultation fee: {doctor.fee}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <label htmlFor="appointment-notes" className="mt-5 block text-xs font-bold uppercase tracking-[0.08em] text-[#687574]">
                                                        Notes for the doctor <span className="font-medium normal-case">(optional)</span>
                                                    </label>
                                                    <textarea
                                                        id="appointment-notes"
                                                        value={appointmentNotes}
                                                        onChange={(event) => setAppointmentNotes(event.target.value)}
                                                        maxLength={1000}
                                                        rows={3}
                                                        placeholder="Enter any notes you want to share with the doctor."
                                                        className="mt-2 w-full resize-y rounded-xl border border-[#e2e7f2] bg-white px-4 py-3 text-sm text-[#173c38] outline-none placeholder:text-[#899492] focus:border-[#078b79] focus:ring-2 focus:ring-[#078b79]/15"
                                                    />
                                                    <p className="mt-1 text-right text-xs text-[#7a8885]">
                                                        {appointmentNotes.length}/1000
                                                    </p>

                                                    {bookingError && (
                                                        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                                                            {bookingError}
                                                        </p>
                                                    )}

                                                    <button
                                                        type="button"
                                                        disabled={!selectedSlot || isBooking || isAvailabilityLoading}
                                                        onClick={handleBooking}
                                                        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#064b42] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#086357] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08766b] disabled:cursor-not-allowed disabled:bg-[#9aadaa]"
                                                    >
                                                        {isBooking ? 'Booking appointment...' : 'Book consultation'}
                                                        {!isBooking && <span aria-hidden="true">→</span>}
                                                    </button>
                                                    <p className="mt-2 text-center text-xs text-[#7a8885]">
                                                        Your appointment is confirmed after the booking request succeeds.
                                                    </p>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="mt-5 rounded-xl bg-[#f0f3ff] p-4">
                                            <p className="text-sm leading-6 text-[#596966]">
                                                Appointment booking is available to patient accounts. Your schedule and profile can be reviewed from the doctor dashboard.
                                            </p>
                                            {doctor.is_own_profile && (
                                                <Link to="/doctorDashboard" className="mt-3 inline-flex font-semibold text-[#07584e] underline">
                                                    Open doctor dashboard
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </section>

                                <div className="rounded-2xl border border-[#e7eaf3] bg-white p-4 text-xs leading-5 text-[#687574] shadow-sm">
                                    Appointment dates and times are generated from the doctor’s saved schedule. A slot may be taken by another patient before booking is completed.
                                </div>
                            </aside>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default DoctorDetails;
