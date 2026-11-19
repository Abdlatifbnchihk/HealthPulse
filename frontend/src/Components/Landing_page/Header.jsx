import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navigationLinks = [
    { label: 'Find a Doctor', href: '/find-doctor' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Specialties', href: '/#specialties' },
    { label: 'For Clinics', href: '/#for-clinics' },
];

function getDashboardHref() {
    const storedUser = localStorage.getItem('Auth_user');

    if (!storedUser) {
        return '/';
    }

    try {
        const user = JSON.parse(storedUser);

        if (user?.role === 'doctor') {
            return '/doctorDashboard';
        }

        if (user?.role === 'patient') {
            return '/patientDashboard';
        }
    } catch (error) {
        console.error('Unable to read the saved user role for dashboard navigation.', error);
    }

    return '/';
}

function BrandIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 32 32"
            fill="none"
            className="h-[31px] w-[31px]"
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

function MenuIcon({ isOpen }) {
    return isOpen ? (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-[21px] w-[21px]"
        >
            <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    ) : (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-[21px] w-[21px]"
        >
            <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function Navigation({ onNavigate, isMobile = false }) {
    const location = useLocation();

    return (
        <nav
            aria-label="Main navigation"
            className={
                isMobile
                    ? 'flex flex-col items-stretch gap-0'
                    : 'flex items-center justify-center gap-[clamp(16px,2.2vw,36px)]'
            }
        >
            {navigationLinks.map(({ label, href }) => (
                <Link
                    key={href}
                    to={href}
                    onClick={onNavigate}
                    aria-current={location.pathname === href ? 'page' : undefined}
                    className={
                        location.pathname === href
                            ? `${isMobile ? 'my-2' : ''} whitespace-nowrap rounded-full bg-[#064b42] px-4 py-2 text-[13px] font-semibold text-white no-underline`
                            : isMobile
                                ? 'border-b border-[#edf1f0] px-1 py-[13px] text-[15px] font-medium text-[#263634] no-underline transition-colors hover:text-[#08766b]'
                                : 'whitespace-nowrap text-[13px] font-medium text-[#263634] no-underline transition-colors hover:text-[#08766b]'
                    }
                >
                    {label}
                </Link>
            ))}
        </nav>
    );
}

function AccountActions({
    isAuthenticated,
    onLogout,
    loginHref,
    registerHref,
    dashboardHref,
    appointmentHref,
    onNavigate,
    isMobile = false,
}) {
    const containerClassName = isMobile
        ? 'flex flex-col items-stretch gap-[10px]'
        : 'flex flex-none items-center gap-[10px]';
    const baseButtonClassName =
        'inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full border border-transparent px-[17px] font-[inherit] text-[13px] font-semibold no-underline transition-colors';
    const secondaryButtonClassName = `${baseButtonClassName} border-[#dce7e4] bg-white text-[#123d38] hover:border-[#8eb9b1] hover:bg-[#f3faf8]`;
    const primaryButtonClassName = `${baseButtonClassName} bg-[#064b42] text-white hover:bg-[#086357]`;
    const mobileButtonClassName = isMobile ? 'w-full min-h-11' : '';

    if (isAuthenticated) {
        return (
            <div className={containerClassName}>
                <a
                    className={`${secondaryButtonClassName} ${mobileButtonClassName}`}
                    href={dashboardHref}
                    onClick={onNavigate}
                >
                    Dashboard
                </a>
                <button
                    className={`${primaryButtonClassName} ${mobileButtonClassName} cursor-pointer`}
                    type="button"
                    onClick={() => {
                        onNavigate?.();
                        onLogout();
                    }}
                >
                    Log out
                </button>
            </div>
        );
    }

    // Register and Login buttons
    return (
        <div className={containerClassName}>
            <Link to={'/Register'}
                className={`${secondaryButtonClassName} ${mobileButtonClassName}`}
                href={registerHref}
                onClick={onNavigate}
            >
                Register
            </Link>
            <Link to={'/login'}
                className={`${secondaryButtonClassName} ${mobileButtonClassName}`}
                href={loginHref}
                onClick={onNavigate}
            >
                Log in
            </Link>
            <a
                className={`${primaryButtonClassName} ${mobileButtonClassName}`}
                href={appointmentHref}
                onClick={onNavigate}
            >
                Book Consultation
            </a>
        </div>
    );
}

function Header({
    loginHref = '/login',
    registerHref = '/register',
    appointmentHref = '#doctors',
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(() =>
        Boolean(localStorage.getItem('Auth_token')),
    );
    const [logoutAlert, setLogoutAlert] = useState(null);
    const navigate = useNavigate();
    const dashboardHref = getDashboardHref();

    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = async () => {
        const token = localStorage.getItem('Auth_token');

        if (token) {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

                if (!apiBaseUrl) {
                    throw new Error('VITE_API_BASE_URL is not configured.');
                }

                const response = await fetch(
                    `${apiBaseUrl.replace(/\/$/, '')}/auth/logout`,
                    {
                        method: 'DELETE',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error(`The server could not revoke your session (HTTP ${response.status}).`);
                }

                setLogoutAlert({
                    type: 'success',
                    message: 'You have been logged out successfully.',
                });
            } catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'The server could not revoke your session.';

                setLogoutAlert({
                    type: 'error',
                    message: `${errorMessage} You have been signed out on this device.`,
                });
            }
        } else {
            setLogoutAlert({
                type: 'success',
                message: 'You have been logged out on this device.',
            });
        }

        localStorage.removeItem('Auth_token');
        localStorage.removeItem('Auth_user');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <>
        <header className="sticky top-0 z-[1000] w-full border-b border-[#e8edf0] bg-white text-[#172b2a] shadow-[0_2px_10px_rgba(13,43,41,0.04)]">
            <div className="relative mx-auto flex min-h-[76px] w-[calc(100%-48px)] max-w-[1440px] items-center justify-between gap-7 max-[900px]:min-h-[68px] max-[900px]:w-[calc(100%-32px)]">
                <a
                    className="inline-flex flex-none items-center gap-[9px] whitespace-nowrap text-[17px] font-bold text-[#073f39] no-underline"
                    href="/"
                    aria-label="HealthPulse home"
                >
                    <BrandIcon />
                    <span>HealthPulse</span>
                </a>

                <div className="max-[900px]:hidden">
                    <Navigation />
                </div>

                <div className="max-[900px]:hidden">
                    <AccountActions
                        isAuthenticated={isAuthenticated}
                        onLogout={handleLogout}
                        loginHref={loginHref}
                        registerHref={registerHref}
                        dashboardHref={dashboardHref}
                        appointmentHref={appointmentHref}
                    />
                </div>

                <button
                    className="hidden h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full border border-[#dce7e4] bg-white text-[#064b42] max-[900px]:inline-flex"
                    type="button"
                    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={isMenuOpen}
                    aria-controls="hp-mobile-menu"
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    <MenuIcon isOpen={isMenuOpen} />
                </button>

                {isMenuOpen && (
                    <div
                        id="hp-mobile-menu"
                        className="absolute left-0 right-0 top-full flex flex-col gap-5 rounded-b-2xl border border-t-0 border-[#e8edf0] bg-white px-4 pb-[22px] pt-5 shadow-[0_12px_24px_rgba(13,43,41,0.1)] min-[901px]:hidden"
                    >
                        <Navigation onNavigate={closeMenu} isMobile />
                        <AccountActions
                            isAuthenticated={isAuthenticated}
                            onLogout={handleLogout}
                            loginHref={loginHref}
                            registerHref={registerHref}
                            dashboardHref={dashboardHref}
                            appointmentHref={appointmentHref}
                            onNavigate={closeMenu}
                            isMobile
                        />
                    </div>
                )}
            </div>
        </header>
        {logoutAlert && (
            <div
                className={`mx-auto mt-3 flex w-[calc(100%-32px)] max-w-[1440px] items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm ${
                    logoutAlert.type === 'success'
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-red-200 bg-red-50 text-red-700'
                }`}
                role={logoutAlert.type === 'success' ? 'status' : 'alert'}
            >
                <p>{logoutAlert.message}</p>
                <button
                    type="button"
                    className="shrink-0 cursor-pointer font-semibold"
                    aria-label="Dismiss logout message"
                    onClick={() => setLogoutAlert(null)}
                >
                    Dismiss
                </button>
            </div>
        )}
        </>
    );
}

export default Header;
