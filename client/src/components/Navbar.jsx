import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useTheme from "../hooks/useTheme";

const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/projects", label: "Projects" },
    { to: "/blog", label: "Blogs" },
    { to: "/courses", label: "Courses" },
    { to: "/contact", label: "Contact" },
];

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const linkStyle = ({ isActive }) =>
        `relative text-sm font-medium transition-colors duration-200 ${
            isActive
                ? "text-signal-600 dark:text-signal-400"
                : "text-ink-700 dark:text-paper-100/75 hover:text-ink-950 dark:hover:text-paper-50"
        }`;

    return (
        <nav
            className={`
                sticky top-0 z-50
                bg-paper-50/80 dark:bg-ink-950/80
                backdrop-blur-md
                transition-all duration-300
                ${
                    scrolled
                        ? "border-b border-ink-950/10 dark:border-paper-50/10 shadow-sm"
                        : "border-b border-transparent"
                }
            `}
        >
            <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
                <Link
                    to="/"
                    className="font-[var(--font-display)] text-xl font-semibold text-ink-950 dark:text-paper-50"
                >
                    Bariul
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <NavLink key={item.to} to={item.to} className={linkStyle}>
                            {item.label}
                        </NavLink>
                    ))}

                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="
                            w-9 h-9 flex items-center justify-center
                            rounded-full border border-ink-950/10 dark:border-paper-50/15
                            text-sm transition-colors duration-200
                            hover:border-signal-500
                        "
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>
                </div>

                <div className="md:hidden flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-ink-950/10 dark:border-paper-50/15 text-sm"
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        className="text-2xl text-ink-950 dark:text-paper-50"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden flex flex-col px-6 pb-6 gap-4 bg-paper-50 dark:bg-ink-950 border-t border-ink-950/10 dark:border-paper-50/10">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
