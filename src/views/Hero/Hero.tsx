import { motion, type Variants } from 'framer-motion';
import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import './Hero.css';

export function Hero() {
  // Evita que Framer Motion agregue translateZ(0) que arruina el ClearType en Windows
  const textTransformTemplate = ({ x, y, rotate, scale }: any) => {
    return `translate(${x || 0}, ${y || 0}) rotate(${rotate || 0}deg) scale(${scale || 1})`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      },
      transitionEnd: {
        transform: "none",
        WebkitTransform: "none"
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      },
      transitionEnd: {
        transform: "none",
        WebkitTransform: "none"
      }
    }
  };

  const statsVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.2
      },
      transitionEnd: {
        transform: "none",
        WebkitTransform: "none"
      }
    }
  };

  return (
    <section id="inicio" className="hero">
      <div className="container hero__container">
        <motion.div
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="hero__badge"
            variants={itemVariants}
            transformTemplate={textTransformTemplate}
          >
            <Icon name="sparkles" size="sm" />
            <span>Servicio profesional de limpieza</span>
          </motion.div>

          <motion.h1
            className="hero__title"
            variants={itemVariants}
            transformTemplate={textTransformTemplate}
          >
            Limpieza que{' '}
            <span className="hero__title-highlight">inspira</span> confianza
          </motion.h1>

          <motion.p
            className="hero__description"
            variants={itemVariants}
            transformTemplate={textTransformTemplate}
          >
            En ZENIT SOLUTIONS transformamos tus espacios con servicios de limpieza
            profesionales, ecológicos y personalizados. Resultados impecables
            que superan tus expectativas.
          </motion.p>

          <motion.div
            className="hero__actions"
            variants={itemVariants}
          >
            <a href="#contacto">
              <Button variant="primary" size="lg">
                Solicitar Cotización
                <Icon name="arrow-right" size="md" />
              </Button>
            </a>
            <a href="#servicios">
              <Button variant="outline" size="lg">
                Ver Servicios
              </Button>
            </a>
          </motion.div>

          <motion.div
            className="hero__stats"
            variants={statsVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="hero__stat"
              variants={itemVariants}
              transformTemplate={textTransformTemplate}
            >
              <span className="hero__stat-value">500+</span>
              <span className="hero__stat-label">Clientes Felices</span>
            </motion.div>
            <motion.div
              className="hero__stat"
              variants={itemVariants}
              transformTemplate={textTransformTemplate}
            >
              <span className="hero__stat-value">98%</span>
              <span className="hero__stat-label">Satisfacción</span>
            </motion.div>
            <motion.div
              className="hero__stat"
              variants={itemVariants}
              transformTemplate={textTransformTemplate}
            >
              <span className="hero__stat-value">10+</span>
              <span className="hero__stat-label">Años Exp.</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__visual"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: "easeOut"
          }}
        >
          <motion.div
            className="hero__image-wrapper"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="hero__image-placeholder">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
                alt="Servicio profesional de limpieza ZENIT SOLUTIONS"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-xl)' }}
              />
            </div>
          </motion.div>

          <motion.div
            className="hero__floating-card hero__floating-card--1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <Icon name="check" size="sm" />
            <span>100% Ecológico</span>
          </motion.div>

          <motion.div
            className="hero__floating-card hero__floating-card--2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <Icon name="shield" size="sm" />
            <span>Personal Verificado</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
