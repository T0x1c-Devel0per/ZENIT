import { Routes, Route, useLocation } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout/index.js';
import { Loading } from './components/Loading/index.js';
import { BackgroundParticles } from './components/BackgroundParticles/index.js';

// Lazy loaded views
const Hero = lazy(() => import('./views/Hero/index.js').then(m => ({ default: m.Hero })));
const Services = lazy(() => import('./views/Services/index.js').then(m => ({ default: m.Services })));
const Gallery = lazy(() => import('./views/Gallery/index.js').then(m => ({ default: m.Gallery })));
const Testimonials = lazy(() => import('./views/Testimonials/index.js').then(m => ({ default: m.Testimonials })));
const About = lazy(() => import('./views/About/index.js').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./views/Contact/index.js').then(m => ({ default: m.Contact })));

const AdminDashboard = lazy(() => import('./views/AdminDashboard.js'));
const LoginPage = lazy(() => import('./views/LoginPage.js'));

import AdminNav from './components/AdminNav.js';
import './styles/global.css';

function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<Loading />}>
      <BackgroundParticles />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Layout>
              <Hero />
              <Services />
              <Gallery />
              <Testimonials />
              <About />
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <AdminNav />
              <AdminDashboard />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <AdminNav />
              <LoginPage />
            </>
          }
        />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
