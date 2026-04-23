import { config } from '../../config/index.js';
import { Icon } from '../Icon/Icon.js';
import './Footer.css';

const socialLinks = [
  { name: 'Facebook', icon: 'facebook', href: config.social.facebook },
  { name: 'Instagram', icon: 'instagram', href: config.social.instagram },
  { name: 'Twitter', icon: 'twitter', href: config.social.twitter },
  { name: 'LinkedIn', icon: 'linkedin', href: config.social.linkedin },
];

const contactItems = [
  { icon: 'phone', label: config.contact.phone, href: `tel:${config.contact.phone}` },
  { icon: 'mail', label: config.contact.email, href: `mailto:${config.contact.email}` },
  { icon: 'location', label: config.contact.address, href: '#' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Logo y descripción */}
          <div className="footer__brand">
            <span className="footer__logo">SteamClean</span>
            <p className="footer__description">{config.app.description}</p>
            <div className="footer__social">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="footer__social-link"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name={social.icon as any} size="md" />
                </a>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div className="footer__section">
            <h4 className="footer__title">Contacto</h4>
            <ul className="footer__list">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="footer__link">
                    <Icon name={item.icon as any} size="sm" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Horarios */}
          <div className="footer__section">
            <h4 className="footer__title">Horarios</h4>
            <ul className="footer__list">
              <li className="footer__list-item">{config.business.hours.weekdays}</li>
              <li className="footer__list-item">{config.business.hours.saturday}</li>
              <li className="footer__list-item">{config.business.hours.sunday}</li>
            </ul>
          </div>

          {/* Links rápidos */}
          <div className="footer__section">
            <h4 className="footer__title">Enlaces</h4>
            <ul className="footer__list">
              <li>
                <a href="#servicios" className="footer__link">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#galeria" className="footer__link">
                  Galería
                </a>
              </li>
              <li>
                <a href="#testimonios" className="footer__link">
                  Testimonios
                </a>
              </li>
              <li>
                <a href="#contacto" className="footer__link">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} {config.app.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
