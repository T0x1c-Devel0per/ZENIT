import { motion } from 'framer-motion';
import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import './Hero.css';

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section id="inicio" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <motion.div
          className="hero__shape hero__shape--1"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="hero__shape hero__shape--2"
          animate={{
            x: [0, 10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="hero__shape hero__shape--3"
          animate={{
            y: [0, 15, 0],
            x: [0, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>

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
          >
            <Icon name="sparkles" size="sm" />
            <span>Servicio profesional de limpieza</span>
          </motion.div>

          <motion.h1
            className="hero__title"
            variants={itemVariants}
          >
            Limpieza que{' '}
            <span className="hero__title-highlight">inspira</span> confianza
          </motion.h1>

          <motion.p
            className="hero__description"
            variants={itemVariants}
          >
            En SteamClean transformamos tus espacios con servicios de limpieza
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
            >
              <span className="hero__stat-value">500+</span>
              <span className="hero__stat-label">Clientes Felices</span>
            </motion.div>
            <motion.div
              className="hero__stat"
              variants={itemVariants}
            >
              <span className="hero__stat-value">98%</span>
              <span className="hero__stat-label">Satisfacción</span>
            </motion.div>
            <motion.div
              className="hero__stat"
              variants={itemVariants}
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
              <Icon name="sparkles" size="xl" />
              <span>Espacios Impecables</span>
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
