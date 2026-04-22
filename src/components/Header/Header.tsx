import { useState } from 'react';
import { cn } from '../../utils/helpers.js';
import { useScrollPosition } from '../../hooks/index.js';
import { Icon } from '../Icon/Icon.js';
import { Button } from '../Button/Button.js';
import ThemeToggle from '../ThemeToggle.js';
import './Header.css';

const navItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

export function Header() {
  const scrollPosition = useScrollPosition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = scrollPosition > 50;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={cn('header', isScrolled && 'header--scrolled')}>
      <div className="container header__container">
        <a href="#inicio" className="header__logo" onClick={closeMenu}>
          <span className="header__logo-text">SteamClean</span>
        </a>

        <nav className={cn('nav', isMenuOpen && 'nav--open')} aria-label="Navegación principal">
          <ul className="nav__list">
            {navItems.map((item) => (
              <li key={item.href} className="nav__item">
                <a href={item.href} className="nav__link" onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <ThemeToggle />
          <a href="#contacto" className="header__cta">
            <Button variant="primary" size="sm">
              Cotizar Ahora
            </Button>
          </a>
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} size="lg" />
          </button>
        </div>
      </div>
    </header>
  );
}
