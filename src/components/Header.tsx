"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export function Header() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || false;
  const isAdminLogin = pathname === '/admin/login';
  const isHome = pathname === '/';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [initials, setInitials] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [adminRole, setAdminRole] = useState<'admin' | 'cashier' | null>(null);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    // Always attempt to fetch session-backed user; httpOnly cookies are not visible to JS
    fetch('/api/user/subscription', { credentials: 'same-origin', cache: 'no-store' as RequestCache })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setIsLoggedIn(true);
          const name: string = data.user.name || '';
          if (name) {
            const parts = name.trim().split(/\s+/);
            const first = parts[0]?.[0] || '';
            const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
            setInitials((first + (last || '')).toUpperCase());
          } else {
            const email: string = data.user.email || '';
            setInitials((email?.[0] || 'U').toUpperCase());
          }
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    async function fetchAdminRole() {
      try {
        const res = await fetch('/api/admin/subscribers', { method: 'GET', credentials: 'same-origin' });
        if (res.status === 401) {
          setAdminRole(null);
          return;
        }
        // If this endpoint is accessible, we at least know an admin cookie exists; role can be inferred elsewhere.
        // As a light UI cue, check current path to set a label; deeper access is handled on the server.
        if (pathname?.startsWith('/admin/cashier')) {
          setAdminRole('cashier');
        } else if (pathname?.startsWith('/admin')) {
          setAdminRole('admin');
        }
      } catch {
        setAdminRole(null);
      }
    }
    if (isAdminRoute && !isAdminLogin) fetchAdminRole();
  }, [isAdminRoute, isAdminLogin, pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const isHomeTop = isHome && atTop && !isAdminRoute;

  return (
    <header
      className={`sticky top-0 z-50 py-4 sm:py-5 md:py-6 transition-colors duration-300 ${isHomeTop ? 'bg-transparent' : 'bg-[var(--color-porcelain)]/98 backdrop-blur-md'}`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between">
          {/* Left Nav - Hidden on mobile, visible on md+ */}
          {!isAdminRoute && authChecked && !isLoggedIn && (
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <button 
                onClick={() => scrollToSection('subscribe')}
                className={`text-xs lg:text-sm ${isHomeTop ? 'text-white' : 'text-[var(--color-ink)]'} hover:opacity-70 transition-opacity font-medium cursor-pointer`}
              >
                Join Club.
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className={`text-xs lg:text-sm ${isHomeTop ? 'text-white' : 'text-[var(--color-ink)]'} hover:opacity-70 transition-opacity font-medium cursor-pointer`}
              >
                How It Works.
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className={`text-xs lg:text-sm ${isHomeTop ? 'text-white' : 'text-[var(--color-ink)]'} hover:opacity-70 transition-opacity font-medium cursor-pointer`}
              >
                FAQ.
              </button>
            </div>
          )}

          {/* Mobile Menu Button - Visible only on mobile */}
          {!isAdminRoute && authChecked && !isLoggedIn && (
            <button
              onClick={() => scrollToSection('subscribe')}
              className={`md:hidden text-xs ${isHomeTop ? 'text-white' : 'text-[var(--color-ink)]'} hover:opacity-70 transition-opacity font-bold uppercase tracking-wide`}
            >
              Join
            </button>
          )}

          {/* Center Logo - Text Only */}
          <Link 
            href="/" 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
          >
            <span className={`text-serif text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap ${isHomeTop ? 'text-white drop-shadow' : 'text-[#4B2E22]'}`}>
              Brown Girl Club
            </span>
          </Link>

          {/* Right Icon - Account Only */}
          <div className="flex items-center ml-auto">
            {isAdminRoute && !isAdminLogin ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-xs sm:text-sm font-bold hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                  aria-label="Admin menu"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  {adminRole === 'cashier' ? 'CS' : 'AD'}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-[var(--color-ink)]/10 rounded-xl shadow-lg w-40 py-1 z-50">
                    <button
                      className="w-full text-left block px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-porcelain)]/60"
                      onClick={async () => {
                        try {
                          await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
                        } finally {
                          setMenuOpen(false);
                          window.location.href = '/admin/login';
                        }
                      }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : authChecked && isLoggedIn ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-xs sm:text-sm font-bold hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                  aria-label="Account menu"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  {initials || 'U'}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-[var(--color-ink)]/10 rounded-xl shadow-lg w-40 py-1 z-50">
                    <button
                      className="w-full text-left block px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-porcelain)]/60"
                      onClick={async () => {
                        try {
                          await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
                        } finally {
                          setMenuOpen(false);
                          window.location.href = '/';
                        }
                      }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : !isAdminRoute && authChecked ? (
              <Link 
                href="/login"
                className={`${isHomeTop ? 'text-white' : 'text-[var(--color-ink)]'} hover:opacity-70 transition-opacity`}
                aria-label="Account"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                  <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 17C4 14.2386 6.23858 12 9 12H11C13.7614 12 16 14.2386 16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Link>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
}

