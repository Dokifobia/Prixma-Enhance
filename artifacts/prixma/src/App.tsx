import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { Code2, Settings2, Zap, Bot, MessageCircle, CheckCircle2, ChevronRight, Star, Menu, X, Clock, TrendingUp, Users } from "lucide-react";
import { SiWhatsapp, SiInstagram } from "react-icons/si";

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return { count, ref };
}

function AnimatedStat({ num, suffix = "", label }: { num: number; suffix?: string; label: string }) {
  const { count, ref } = useCountUp(num, 2000);
  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl font-black text-[#00c8ff] mb-2 font-sans tracking-tight">{count}{suffix}</div>
      <div className="text-xs text-[#8899bb] font-bold uppercase tracking-widest">{label}</div>
    </div>
  );
}

function AnimatedStepNum({ num }: { num: number }) {
  const { count, ref } = useCountUp(num, 1500);
  return <span ref={ref}>{count}</span>;
}

function StaggeredText({ text, className }: { text: string; className?: string }) {
  return (
    <motion.h1
      className={className}
      style={{
        backgroundImage: "linear-gradient(135deg, #00c8ff 0%, #ffffff 55%, #6644ff 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
      initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.h1>
  );
}

/* ── Custom Cursor ─────────────────────────────────────────── */
function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 300, damping: 20 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only apply custom cursor on fine pointer devices (desktop)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 5);
      cursorY.set(e.clientY - 5);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{ x: smoothX, y: smoothY }}
      className="hidden md:block fixed top-0 left-0 w-[10px] h-[10px] bg-[#00c8ff] rounded-full pointer-events-none z-[9999] opacity-70 blur-[1px] shadow-[0_0_10px_#00c8ff]"
    />
  );
}

/* ── Floating Bot Widget ───────────────────────────────────── */
const BOT_MESSAGES = [
  "¡Hola! ¿Te ayudo a digitalizar tu negocio? 👋",
  "¿Qué servicio te interesa? 🌐 Web o 🤖 IA",
  "Entrega en solo 5 días. ¿Hablamos? ⚡",
  "¿Listo para automatizar? ¡Escríbenos! 🚀",
];

function FloatingBot() {
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleClosed, setBubbleClosed] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const idx =
      scrollY < 400 ? 0 :
      scrollY < 900 ? 1 :
      scrollY < 1800 ? 2 : 3;
    if (idx !== msgIndex) {
      setMsgIndex(idx);
      if (bubbleClosed) {
        setBubbleClosed(false);
      }
    }
  }, [scrollY, msgIndex, bubbleClosed]);

  const handleClick = () => {
    const msg = encodeURIComponent("¡Hola PRIXMA! Me gustaría saber más sobre sus servicios 😊");
    window.open(`https://wa.me/573108131732?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence mode="wait">
        {showBubble && !bubbleClosed && (
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, x: 20, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: 16, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="pointer-events-auto relative max-w-[220px] rounded-2xl rounded-br-[4px] px-4 py-3 text-sm text-white shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #0d1530 0%, #111827 100%)",
              border: "1px solid rgba(0,200,255,0.25)",
              boxShadow: "0 0 24px rgba(0,200,255,0.12), 0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            {BOT_MESSAGES[msgIndex]}
            <span
              className="absolute -bottom-[7px] right-4 w-3 h-3 rotate-45"
              style={{
                background: "#111827",
                borderRight: "1px solid rgba(0,200,255,0.25)",
                borderBottom: "1px solid rgba(0,200,255,0.25)",
              }}
            />
            <button
              onClick={() => setBubbleClosed(true)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#1a2540] border border-white/20 text-[10px] text-white/60 hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        className="pointer-events-auto relative w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer select-none"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Hablar con un experto"
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.55, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle, rgba(0,200,255,0.5) 0%, transparent 70%)" }}
        />
        <motion.svg
          className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 80 80"
        >
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke="url(#botRingGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="botRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#6644ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00c8ff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </motion.svg>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, #00c8ff 0%, #0070cc 50%, #6644ff 100%)",
            boxShadow: "0 4px 24px rgba(0,200,255,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset",
          }}
        />
        <Bot size={26} className="relative z-10 text-white drop-shadow-md" />
        <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#080c18] z-20" />
      </motion.button>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#080c18] text-white overflow-x-hidden relative">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Servicios />
      <ComoFunciona />
      <PorQue />
      <Precios />
      <Testimonios />
      <Contacto />
      <Footer />
      <FloatingBot />
    </div>
  );
}

function PrixmaWordmark({ inline = false }: { inline?: boolean }) {
  if (inline) {
    return (
      <div className="flex items-center gap-2.5">
        <img
          src="/logo-prixma.png"
          alt="PRIXMA"
          style={{ width: 34, height: 34, objectFit: "contain" }}
          className="rounded-sm"
        />
        <span className="font-bold text-xl tracking-[0.18em] text-white" style={{ letterSpacing: "0.18em" }}>
          PRIXMA
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src="/logo-prixma.png"
        alt="PRIXMA"
        style={{ width: 80, height: 80, objectFit: "contain" }}
        className="rounded-md"
      />
      <div className="flex flex-col items-center gap-1">
        <span className="font-bold text-2xl tracking-[0.22em] text-white">
          PRIXMA
        </span>
        <p className="text-[#8899bb] tracking-widest text-xs uppercase">Automatiza • Convierte • Escala</p>
      </div>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#080c18]/85 backdrop-blur-xl py-4"
            : "bg-transparent py-6"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {scrolled && (
          <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-[#00c8ff]/40 to-transparent animate-shimmer" />
          </div>
        )}
        <div className="container mx-auto px-6 flex items-center justify-between relative z-10">
          <a href="#" className="flex items-center gap-0 group" data-testid="link-home" onClick={() => setMobileOpen(false)}>
            <PrixmaWordmark inline />
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#servicios" className="text-sm font-medium text-[#8899bb] hover:text-[#00c8ff] transition-colors" data-testid="link-servicios">Servicios</a>
            <a href="#como-funciona" className="text-sm font-medium text-[#8899bb] hover:text-[#00c8ff] transition-colors" data-testid="link-como-funciona">Cómo funciona</a>
            <a href="#precios" className="text-sm font-medium text-[#8899bb] hover:text-[#00c8ff] transition-colors" data-testid="link-precios">Precios</a>
            <a href="#contacto" className="text-sm font-medium text-[#8899bb] hover:text-[#00c8ff] transition-colors" data-testid="link-contacto">Contacto</a>
          </div>

          <a
            href="https://wa.me/573108131732"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-2 bg-[#00c8ff] hover:bg-[#00b0e0] px-6 py-2.5 rounded-full text-sm font-bold text-[#080c18] transition-all shadow-[0_0_15px_rgba(0,200,255,0.3)] hover:shadow-[0_0_25px_rgba(0,200,255,0.5)]"
            data-testid="button-nav-cta"
          >
            Hablar con un experto
          </a>

          <button 
            className="md:hidden text-white p-2" 
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#080c18]/95 backdrop-blur-2xl flex flex-col p-6 md:hidden"
          >
            <div className="flex items-center justify-between mb-12">
              <PrixmaWordmark inline />
              <button onClick={() => setMobileOpen(false)} className="text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <motion.div 
              initial="hidden" animate="visible" exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: { transition: { staggerChildren: 0.05 } }
              }}
              className="flex flex-col gap-6 text-2xl font-medium"
            >
              {[
                { name: 'Servicios', id: 'servicios' },
                { name: 'Cómo funciona', id: 'como-funciona' },
                { name: 'Precios', id: 'precios' },
                { name: 'Contacto', id: 'contacto' }
              ].map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="text-white hover:text-[#00c8ff] transition-colors border-b border-white/5 pb-4"
                >
                  {item.name}
                </motion.a>
              ))}
              
              <motion.a
                href="https://wa.me/573108131732"
                target="_blank"
                rel="noreferrer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="mt-8 bg-[#00c8ff] text-[#080c18] py-4 rounded-xl text-center font-bold shadow-[0_0_20px_rgba(0,200,255,0.4)]"
              >
                Hablar con un experto
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden" id="hero">
      
      {/* Background Circuit Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-5" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 200, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 255, 1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Hero Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] max-w-[800px] aspect-square rounded-full bg-[radial-gradient(circle,rgba(0,200,255,0.12)_0%,transparent_60%)] blur-[80px]"
        />
        <motion.div 
          animate={{ y: [0, 50, 0], x: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[20%] -right-[10%] w-[70vw] max-w-[900px] aspect-square rounded-full bg-[radial-gradient(circle,rgba(102,68,255,0.12)_0%,transparent_60%)] blur-[80px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 relative inline-flex items-center gap-2 rounded-full bg-[#080c18] px-4 py-1.5 backdrop-blur-xl border border-[#00c8ff]/20 shadow-[0_0_20px_rgba(0,200,255,0.15)]"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
            <span className="text-[#00c8ff] text-sm font-medium tracking-wide">LIVE · Powered by AI</span>
          </motion.div>

          <StaggeredText
            text="Tu negocio en piloto automático"
            className="font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight mb-6 max-w-2xl leading-tight pb-2"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg md:text-xl text-[#8899bb] max-w-xl mb-12"
          >
            Creamos páginas web profesionales y automatizamos tus procesos con inteligencia artificial. Más clientes, menos trabajo manual.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#contacto"
              className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-[#00c8ff] text-[#080c18] font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(0,200,255,0.4)] overflow-hidden"
              data-testid="button-hero-web"
            >
              <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-slide" />
              <span className="relative z-10">Quiero mi página web</span>
            </a>
            <a
              href="#contacto"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-[#6644ff]/50 text-white font-semibold text-lg transition-all hover:bg-white/10 hover:border-[#6644ff] shadow-[0_0_15px_rgba(102,68,255,0.2)] hover:shadow-[0_0_25px_rgba(102,68,255,0.4)]"
              data-testid="button-hero-auto"
            >
              Automatizar mi negocio
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-14 flex flex-col md:flex-row items-center gap-4 md:gap-6 text-xs text-[#8899bb] font-medium tracking-wide"
          >
            <span>✦ +50 negocios digitalizados</span>
            <span className="hidden md:block w-px h-4 bg-[#8899bb]/30"></span>
            <span>✦ 5 días promedio de entrega</span>
            <span className="hidden md:block w-px h-4 bg-[#8899bb]/30"></span>
            <span>✦ 100% satisfacción garantizada</span>
          </motion.div>
        </div>

        {/* Right Content: Floating Dashboard */}
        <div className="hidden lg:flex items-center justify-center relative h-full">
           <motion.div
             animate={{ y: [-15, 15, -15] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="w-full max-w-[480px] relative z-10"
           >
              <div className="bg-[#0d1225]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00c8ff] to-[#6644ff]" />
                 <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#00c8ff]/20 flex items-center justify-center">
                        <Bot size={16} className="text-[#00c8ff]" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">PRIXMA AI</div>
                        <div className="text-[#8899bb] text-xs">Sistema Activo</div>
                      </div>
                   </div>
                   <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold flex items-center gap-1.5 border border-green-500/20">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> ONLINE
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-4">
                   <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                     <div className="text-[#8899bb] text-xs mb-1">Leads Captados</div>
                     <div className="text-2xl font-black text-white">1,248</div>
                     <div className="text-green-400 text-[10px] font-bold mt-1 flex items-center gap-1"><TrendingUp size={10} /> +12% semana</div>
                   </div>
                   <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                     <div className="text-[#8899bb] text-xs mb-1">Citas Agendadas</div>
                     <div className="text-2xl font-black text-white">342</div>
                     <div className="text-green-400 text-[10px] font-bold mt-1 flex items-center gap-1"><TrendingUp size={10} /> +8% semana</div>
                   </div>
                 </div>

                 <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-4 relative overflow-hidden">
                   <div className="absolute -right-4 -bottom-4 opacity-[0.03]"><MessageCircle size={100} /></div>
                   <div className="text-[#8899bb] text-xs mb-1">Respuestas Automáticas</div>
                   <div className="text-3xl font-black text-[#00c8ff]">8,905</div>
                   <div className="text-white/60 text-xs mt-2">Ahorro estimado: 148 horas</div>
                 </div>

                 <div className="space-y-2">
                   {[
                     { user: "María G.", action: "Agendó cita", time: "Hace 2 min" },
                     { user: "Carlos R.", action: "Dejó sus datos", time: "Hace 5 min" },
                     { user: "Laura V.", action: "Preguntó precios", time: "Hace 12 min" },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                       <div className="flex items-center gap-3">
                         <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">{item.user[0]}</div>
                         <div className="text-sm text-white/80">{item.user} <span className="text-[#8899bb] ml-1">{item.action}</span></div>
                       </div>
                       <div className="text-[10px] text-[#8899bb]">{item.time}</div>
                     </div>
                   ))}
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
}

function Servicios() {
  return (
    <section className="py-24 relative" id="servicios">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-widest text-[#00c8ff] mb-3 font-bold">Servicios</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Servicios</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#00c8ff] to-[#6644ff] mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <CardReveal>
            <div className="group h-full bg-[rgba(255,255,255,0.03)] border border-[#00c8ff]/20 rounded-2xl p-8 transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] hover:border-[#00c8ff]/60 hover:shadow-[0_0_30px_rgba(0,200,255,0.15)] hover:-translate-y-1 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent to-[#00c8ff]" />
              
              <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 pointer-events-none">
                <div className="relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,255,0.4)_0%,transparent_60%)] scale-[3]" />
                  <Code2 size={160} color="#00c8ff" className="opacity-10 group-hover:opacity-20 transition-opacity" />
                </div>
              </div>

              <div className="relative z-10 w-16 h-16 rounded-xl bg-[#00c8ff]/10 flex items-center justify-center mb-6 border border-[#00c8ff]/30 group-hover:scale-110 transition-transform">
                <Code2 size={32} className="text-[#00c8ff]" />
              </div>
              <h3 className="relative z-10 text-2xl font-bold mb-4">Páginas Web Profesionales</h3>
              <p className="relative z-10 text-[#8899bb] mb-6 leading-relaxed">
                Diseñamos tu página web con IA en tiempo récord. Diseño premium, optimizada para vender, con dominio propio.
              </p>
              
              <div className="relative z-10 flex flex-wrap gap-2 mb-8">
                {["React", "Next.js", "Vercel"].map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-md bg-[#080c18] border border-white/10 text-[11px] text-[#8899bb] font-bold uppercase tracking-widest">{tag}</span>
                ))}
              </div>

              <ul className="relative z-10 space-y-3 mb-10 flex-grow">
                {["Diseño personalizado", "SEO incluido", "Formulario de contacto", "Adaptada a móviles", "Entrega en 5 días"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                    <CheckCircle2 size={18} className="text-[#00c8ff]" /> {item}
                  </li>
                ))}
              </ul>
              
              <a
                href="#contacto"
                className="relative z-10 inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-transparent border-2 border-[#00c8ff] text-[#00c8ff] font-semibold transition-all duration-300 hover:bg-[#00c8ff]/10 hover:shadow-[0_0_20px_rgba(0,200,255,0.5),0_0_40px_rgba(0,200,255,0.2)]"
                data-testid="button-service-web"
              >
                Quiero mi web <ChevronRight size={18} />
              </a>
            </div>
          </CardReveal>

          <CardReveal delay={0.2}>
            <div className="group h-full bg-[rgba(255,255,255,0.03)] border border-[#6644ff]/20 rounded-2xl p-8 transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] hover:border-[#6644ff]/60 hover:shadow-[0_0_30px_rgba(102,68,255,0.15)] hover:-translate-y-1 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent to-[#6644ff]" />

              <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 pointer-events-none">
                <div className="relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(102,68,255,0.4)_0%,transparent_60%)] scale-[3]" />
                  <Settings2 size={160} color="#6644ff" className="opacity-10 group-hover:opacity-20 transition-opacity" />
                </div>
              </div>

              <div className="relative z-10 w-16 h-16 rounded-xl bg-[#6644ff]/10 flex items-center justify-center mb-6 border border-[#6644ff]/30 group-hover:scale-110 transition-transform">
                <Settings2 size={32} className="text-[#6644ff]" />
              </div>
              <h3 className="relative z-10 text-2xl font-bold mb-4">Automatizaciones con IA</h3>
              <p className="relative z-10 text-[#8899bb] mb-6 leading-relaxed">
                Automatizamos las tareas repetitivas de tu negocio: respuestas automáticas, agendamiento, seguimiento de clientes y más.
              </p>
              
              <div className="relative z-10 flex flex-wrap gap-2 mb-8">
                {["GPT-4", "n8n", "WhatsApp API"].map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-md bg-[#080c18] border border-white/10 text-[11px] text-[#8899bb] font-bold uppercase tracking-widest">{tag}</span>
                ))}
              </div>

              <ul className="relative z-10 space-y-3 mb-10 flex-grow">
                {["Chatbot WhatsApp/Instagram", "Respuestas 24/7", "Agenda y recordatorios", "Reportes automáticos", "Integración de apps"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                    <CheckCircle2 size={18} className="text-[#00c8ff]" /> {item}
                  </li>
                ))}
              </ul>
              
              <a
                href="#contacto"
                className="relative z-10 inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-transparent border-2 border-[#00c8ff] text-[#00c8ff] font-semibold transition-all duration-300 hover:bg-[#00c8ff]/10 hover:shadow-[0_0_20px_rgba(0,200,255,0.5),0_0_40px_rgba(0,200,255,0.2)]"
                data-testid="button-service-auto"
              >
                Automatizar mi negocio <ChevronRight size={18} />
              </a>
            </div>
          </CardReveal>
        </div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  const steps = [
    { title: "Nos contactas", desc: "Cuéntanos qué necesita tu negocio", num: "01" },
    { title: "Diseñamos la solución", desc: "Creamos tu página o automatización a medida", num: "02" },
    { title: "Lanzamos y escalas", desc: "Tu negocio trabaja solo mientras tú creces", num: "03" },
  ];

  const lineRef = useRef(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-50px" });

  return (
    <section className="py-24 relative overflow-hidden" id="como-funciona">
      <div className="absolute inset-0 bg-[#0d1225] z-0" />
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#8899bb 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Cómo Funciona</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#00c8ff] to-[#6644ff] mx-auto rounded-full"></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Desktop horizontal line */}
          <div ref={lineRef} className="hidden md:block absolute top-[52px] left-[16.66%] right-[16.66%] h-[3px] overflow-hidden rounded-full z-0">
            <motion.div
              className="h-full w-full bg-gradient-to-r from-[#00c8ff] via-[#6644ff] to-[#9933ff]"
              initial={{ scaleX: 0, transformOrigin: "left" }}
              animate={lineInView ? { scaleX: 1, transformOrigin: "left" } : { scaleX: 0, transformOrigin: "left" }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
              style={{ boxShadow: "0 0 12px rgba(0, 200, 255, 0.6), 0 0 30px rgba(102, 68, 255, 0.4)" }}
            />
          </div>

          {/* Mobile vertical line */}
          <div className="md:hidden absolute top-[10%] bottom-[10%] left-1/2 -translate-x-1/2 w-[3px] overflow-hidden rounded-full z-0">
            <motion.div
              className="w-full h-full bg-gradient-to-b from-[#00c8ff] via-[#6644ff] to-[#9933ff]"
              initial={{ scaleY: 0, transformOrigin: "top" }}
              animate={lineInView ? { scaleY: 1, transformOrigin: "top" } : { scaleY: 0, transformOrigin: "top" }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
              style={{ boxShadow: "0 0 12px rgba(0, 200, 255, 0.6)" }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <CardReveal key={i} delay={i * 0.2}>
                <div className="relative bg-[#080c18] border border-white/10 rounded-2xl p-8 text-center h-full z-10 hover:border-[#00c8ff]/30 transition-colors">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-white/5 pointer-events-none select-none font-sans">
                    {step.num}
                  </div>
                  
                  <div className="flex flex-col items-center mb-6">
                    <div className="text-6xl md:text-7xl font-black bg-gradient-to-br from-[#00c8ff] to-[#6644ff] bg-clip-text text-transparent leading-none">
                      <AnimatedStepNum num={i + 1} />
                    </div>
                    <div className="w-[40px] h-1 bg-gradient-to-r from-[#00c8ff] to-[#6644ff] rounded-full mt-3" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 relative z-10">{step.title}</h3>
                  <p className="text-[#8899bb] text-sm relative z-10">{step.desc}</p>
                </div>
              </CardReveal>
            ))}
          </div>

          <motion.div 
            className="text-center mt-16 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <a href="#contacto" className="inline-flex items-center gap-2 text-[#8899bb] hover:text-[#00c8ff] transition-colors font-medium">
              ¿Tienes dudas? <span className="text-[#00c8ff] flex items-center">Habla con nosotros <ChevronRight size={16} /></span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PorQue() {
  const features = [
    {
      icon: <Zap size={40} />,
      title: "Entrega rápida",
      desc: "Tu proyecto listo en días, no meses",
      color: "#00c8ff",
      glow: "rgba(0, 200, 255, 0.35)",
      bg: "rgba(0, 200, 255, 0.12)",
      border: "rgba(0, 200, 255, 0.4)",
    },
    {
      icon: <Bot size={40} />,
      title: "Potenciado con IA",
      desc: "Tecnología de punta al alcance de tu negocio",
      color: "#a855f7",
      glow: "rgba(168, 85, 247, 0.35)",
      bg: "rgba(168, 85, 247, 0.12)",
      border: "rgba(168, 85, 247, 0.4)",
    },
    {
      icon: <MessageCircle size={40} />,
      title: "Soporte cercano",
      desc: "Te acompañamos en todo el proceso, en español",
      color: "#22d3ee",
      glow: "rgba(34, 211, 238, 0.35)",
      bg: "rgba(34, 211, 238, 0.12)",
      border: "rgba(34, 211, 238, 0.4)",
    },
  ];

  return (
    <section className="py-24" id="por-que">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">¿Por qué PRIXMA?</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#00c8ff] to-[#6644ff] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
          <AnimatedStat num={50} suffix="+" label="negocios servidos" />
          <AnimatedStat num={5} suffix=" días" label="tiempo de entrega promedio" />
          <AnimatedStat num={24} suffix="/7" label="soporte automatizado" />
        </div>
      </div>

      {/* Marquee Band */}
      <div className="relative w-full overflow-hidden mb-20 py-8 bg-[#080c18] border-y border-white/5 flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080c18] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080c18] to-transparent z-10" />
        
        <div className="flex w-max animate-marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 px-8 items-center text-xl font-bold text-[#8899bb]/30 uppercase tracking-widest whitespace-nowrap">
              <span>OpenAI</span> <span>·</span> <span>WhatsApp Business API</span> <span>·</span> <span>n8n</span> <span>·</span> <span>React</span> <span>·</span> <span>Vercel</span> <span>·</span> <span>Meta Business</span> <span>·</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <CardReveal key={i} delay={i * 0.1}>
              <div className="text-center p-8 group">
                <div
                  className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: f.bg,
                    border: `1.5px solid ${f.border}`,
                    boxShadow: `0 0 20px ${f.glow}, 0 0 40px ${f.glow.replace("0.35", "0.15")}`,
                    color: f.color,
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-[#8899bb]">{f.desc}</p>
              </div>
            </CardReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Precios() {
  const [tab, setTab] = useState<"web" | "auto">("web");

  const webPlanes = [
    {
      nombre: "Esencial",
      precio: "$800.000 COP",
      tipo: "pago único",
      popular: false,
      items: [
        "Landing page profesional",
        "Dominio incluido",
        "Formulario de contacto",
        "Optimización móvil",
        "Entrega en 5 días",
      ],
      cta: "Empezar",
      ctaStyle: "normal" as const,
    },
    {
      nombre: "Pro",
      precio: "$1.500.000 COP",
      tipo: "pago único",
      popular: true,
      items: [
        "Landing page profesional",
        "Dominio incluido",
        "Formulario de contacto",
        "Optimización móvil",
        "Entrega en 5 días",
        "Blog o catálogo de productos",
        "Chat integrado",
        "SEO avanzado",
        "Google Analytics",
      ],
      cta: "Empezar",
      ctaStyle: "featured" as const,
    },
    {
      nombre: "Full",
      precio: "$2.800.000 COP",
      tipo: "pago único",
      popular: false,
      items: [
        "Todo lo del Pro",
        "Tienda online",
        "Pasarela de pagos",
        "Panel de administración",
        "Soporte 3 meses incluido",
      ],
      cta: "Empezar",
      ctaStyle: "normal" as const,
    },
  ];

  const autoPlanes = [
    {
      nombre: "Starter",
      setup: "$500.000",
      mensual: "$150.000/mes",
      popular: false,
      items: [
        "Bot responde 24/7 por Instagram y Facebook",
        "Agenda citas automático",
        "Confirmación instantánea al cliente",
        "Recordatorio 1 hora antes",
        "Soporte básico mensual",
      ],
      cta: "Cotizar",
      ctaStyle: "normal" as const,
    },
    {
      nombre: "Pro",
      setup: "$900.000",
      mensual: "$280.000/mes",
      popular: true,
      items: [
        "Bot con IA que habla como humano",
        "WhatsApp + Instagram + Facebook",
        "Agenda citas automático",
        "Confirmación y recordatorios automáticos",
        "Pide reseñas en Google automático",
        "CRM con historial de clientes",
        "Soporte mensual",
      ],
      cta: "Cotizar",
      ctaStyle: "featured" as const,
    },
    {
      nombre: "Full",
      setup: "$1.800.000",
      mensual: "$500.000/mes",
      popular: false,
      items: [
        "Bot con IA que habla como humano",
        "WhatsApp + Instagram + Facebook",
        "Agenda citas automático",
        "Confirmación y recordatorios automáticos",
        "Pide reseñas en Google automático",
        "CRM con historial de clientes",
        "Campañas de reactivación de clientes",
        "Reportes semanales de citas agendadas",
        "Integración con pagos",
        "Soporte prioritario 7 días",
      ],
      cta: "Cotizar",
      ctaStyle: "normal" as const,
    },
  ];

  const checkColor = tab === "web" ? "text-[#00c8ff]" : "text-[#6644ff]";

  return (
    <section className="py-24 bg-[#0d1225]" id="precios">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Planes y Precios</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#00c8ff] to-[#6644ff] mx-auto rounded-full mb-10"></div>

          <div className="inline-flex items-center bg-[#080c18] border border-white/10 rounded-2xl p-1.5 gap-1">
            <button
              onClick={() => setTab("web")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                tab === "web"
                  ? "bg-[#00c8ff]/15 text-[#00c8ff] border border-[#00c8ff]/40 shadow-[0_0_16px_rgba(0,200,255,0.2)]"
                  : "text-[#8899bb] hover:text-white"
              }`}
            >
              🌐 Páginas Web
            </button>
            <button
              onClick={() => setTab("auto")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                tab === "auto"
                  ? "bg-[#6644ff]/15 text-[#6644ff] border border-[#6644ff]/40 shadow-[0_0_16px_rgba(102,68,255,0.2)]"
                  : "text-[#8899bb] hover:text-white"
              }`}
            >
              🤖 Automatización IA
            </button>
          </div>
        </div>

        {tab === "web" && (
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {webPlanes.map((plan, i) => (
              <CardReveal key={plan.nombre} delay={i * 0.15}>
                <div
                  className={`relative h-full rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                    plan.popular
                      ? "bg-gradient-to-b from-[rgba(0,200,255,0.06)] to-transparent border-2 border-[#00c8ff] shadow-[0_0_30px_rgba(0,200,255,0.15)] lg:scale-105 z-10"
                      : "bg-[#080c18] border border-white/10 hover:border-white/30"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 overflow-hidden w-[100px] h-[100px] rounded-tr-2xl z-20 pointer-events-none">
                      <div className="absolute top-5 -right-8 bg-gradient-to-r from-[#00c8ff] to-[#0090ff] text-[#080c18] text-[10px] font-extrabold py-1.5 w-36 text-center rotate-45 shadow-lg flex items-center justify-center gap-1 uppercase tracking-wider">
                        <Star size={10} fill="currentColor" /> MÁS POPULAR
                      </div>
                    </div>
                  )}
                  <h3 className={`relative z-10 text-2xl font-bold mb-1 ${plan.popular ? "text-[#00c8ff]" : "text-white"}`}>
                    {plan.nombre}
                  </h3>
                  <span className="relative z-10 text-xs text-[#8899bb] mb-6 block">{plan.tipo}</span>
                  <div className="relative z-10 mb-8">
                    <div className="text-3xl font-bold text-white">{plan.precio}</div>
                  </div>
                  <motion.ul 
                    className="relative z-10 space-y-3 mb-8 flex-grow"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  >
                    {plan.items.map((item, j) => (
                      <motion.li 
                        key={j} 
                        variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                        className="flex items-start gap-3 text-sm text-white/80"
                      >
                        <CheckCircle2 size={16} className={`${checkColor} shrink-0 mt-0.5`} />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <a
                    href="#contacto"
                    className={`relative z-10 block w-full py-3 text-center rounded-xl font-bold transition-colors ${
                      plan.popular
                        ? "bg-[#00c8ff] text-[#080c18] hover:bg-[#0090ff] hover:text-white"
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </CardReveal>
            ))}
          </div>
        )}

        {tab === "auto" && (
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {autoPlanes.map((plan, i) => (
              <CardReveal key={plan.nombre} delay={i * 0.15}>
                <div
                  className={`relative h-full rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                    plan.popular
                      ? "bg-gradient-to-b from-[rgba(102,68,255,0.06)] to-transparent border-2 border-[#6644ff] shadow-[0_0_30px_rgba(102,68,255,0.15)] lg:scale-105 z-10"
                      : "bg-[#080c18] border border-white/10 hover:border-white/30"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 overflow-hidden w-[100px] h-[100px] rounded-tr-2xl z-20 pointer-events-none">
                      <div className="absolute top-5 -right-8 bg-gradient-to-r from-[#6644ff] to-[#5533ee] text-white text-[10px] font-extrabold py-1.5 w-36 text-center rotate-45 shadow-lg flex items-center justify-center gap-1 uppercase tracking-wider">
                        <Star size={10} fill="currentColor" /> MÁS POPULAR
                      </div>
                    </div>
                  )}
                  <h3 className={`relative z-10 text-2xl font-bold mb-1 ${plan.popular ? "text-[#a077ff]" : "text-white"}`}>
                    {plan.nombre}
                  </h3>
                  <span className="relative z-10 text-xs text-[#8899bb] mb-5 block">Setup + mensualidad</span>
                  <div className="relative z-10 mb-8 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-[#8899bb]">Setup:</span>
                      <span className="text-2xl font-bold text-white">{plan.setup}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-[#8899bb]">Mensual:</span>
                      <span className="text-xl font-semibold text-[#a077ff]">{plan.mensual}</span>
                    </div>
                  </div>
                  <motion.ul 
                    className="relative z-10 space-y-3 mb-8 flex-grow"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  >
                    {plan.items.map((item, j) => (
                      <motion.li 
                        key={j} 
                        variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                        className="flex items-start gap-3 text-sm text-white/80"
                      >
                        <CheckCircle2 size={16} className={`${checkColor} shrink-0 mt-0.5`} />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <a
                    href="#contacto"
                    className={`relative z-10 block w-full py-3 text-center rounded-xl font-bold transition-colors ${
                      plan.popular
                        ? "bg-[#6644ff] text-white hover:bg-[#5533ee]"
                        : "bg-white/5 border border-[#6644ff]/30 text-white hover:bg-[#6644ff]/10 hover:border-[#6644ff]"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </CardReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Testimonios() {
  const testimonios = [
    {
      nombre: "Carlos Mendoza",
      negocio: "Restaurante El Fogón Paisa",
      ciudad: "Medellín",
      iniciales: "CM",
      color: "#00c8ff",
      glow: "rgba(0,200,255,0.25)",
      comentario:
        "Con PRIXMA armamos la página del restaurante en menos de una semana. Ahora los clientes reservan directo desde ahí y el bot de WhatsApp nos ahorra horas de atención. ¡Brutal!",
    },
    {
      nombre: "Valentina Ríos",
      negocio: "Peluquería Styles V",
      ciudad: "Bogotá",
      iniciales: "VR",
      color: "#a855f7",
      glow: "rgba(168,85,247,0.25)",
      comentario:
        "Antes perdía clientes por no responder a tiempo. Ahora el chatbot agenda citas solo, yo solo llego y corto. La página quedó muy profesional, mis clientas me preguntaban dónde la hice.",
    },
    {
      nombre: "Andrés Castillo",
      negocio: "Tienda de Ropa ModaYa",
      ciudad: "Cali",
      iniciales: "AC",
      color: "#22d3ee",
      glow: "rgba(34,211,238,0.25)",
      comentario:
        "Tenía miedo de que fuera complicado, pero el proceso fue muy fácil. Me explicaron todo paso a paso y en 5 días ya tenía mi catálogo online. Las ventas por redes subieron un montón.",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="testimonios">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#6644ff]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00c8ff]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#00c8ff] to-[#6644ff] mx-auto rounded-full mb-12"></div>

          <div className="flex flex-col items-center justify-center mb-16 relative z-10">
            <div className="flex gap-2 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={28} className="fill-[#00c8ff] text-[#00c8ff] drop-shadow-[0_0_8px_rgba(0,200,255,0.5)]" />)}
            </div>
            <div className="text-2xl font-black text-white mb-2">5.0 / 5.0</div>
            <div className="text-[#8899bb] text-sm font-bold uppercase tracking-widest">Basado en 50+ proyectos</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonios.map((t, i) => (
            <CardReveal key={i} delay={i * 0.15}>
              <div
                className="relative h-full bg-[rgba(255,255,255,0.02)] border border-white/10 rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300 overflow-hidden group hover:border-white/20"
                style={{ boxShadow: `0 0 0 0 transparent` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 25px ${t.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 transparent`;
                }}
              >
                <div 
                  className="absolute -top-10 -left-2 text-[10rem] font-serif leading-none select-none transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105 pointer-events-none" 
                  style={{ color: t.color, opacity: 0.15 }}
                >
                  "
                </div>

                <motion.div 
                  className="flex gap-1 relative z-10 mt-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                  {[...Array(5)].map((_, si) => (
                    <motion.div key={si} variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}>
                      <Star size={16} fill={t.color} color={t.color} />
                    </motion.div>
                  ))}
                </motion.div>

                <p className="text-white/90 text-base leading-relaxed flex-grow italic relative z-10 mt-2">
                  "{t.comentario}"
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-white/10 relative z-10">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      backgroundColor: `${t.color}20`,
                      border: `1.5px solid ${t.color}60`,
                      color: t.color,
                      boxShadow: `0 0 12px ${t.glow}`,
                    }}
                  >
                    {t.iniciales}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.nombre}</div>
                    <div className="text-[#8899bb] text-xs">{t.negocio}</div>
                    <div className="text-[#8899bb] text-xs">{t.ciudad}</div>
                  </div>
                </div>
              </div>
            </CardReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contacto() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleWhatsApp = () => {
    const serviceLabels: Record<string, string> = {
      web: "Página Web Profesional",
      auto: "Automatización IA",
    };
    const selected = selectedServices.map((s) => serviceLabels[s]).join(" y ");
    if (!selected) {
      alert("Por favor selecciona al menos un servicio 😊");
      return;
    }
    const texto = `¡Hola! Estoy interesado en: *${selected}*\n\n${messageText ? "Sobre mi negocio: " + messageText : ""}`;
    const url = `https://wa.me/573108131732?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-24 relative overflow-hidden" id="contacto">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00c8ff]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6644ff]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">¿Qué necesita tu negocio?</h2>
          <p className="text-xl text-[#8899bb]">Cuéntanos en qué podemos ayudarte y te respondemos en menos de 2 horas</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-8 max-w-5xl mx-auto relative z-10">
          
          {/* Form (Glassmorphism) */}
          <div className="bg-[#ffffff05] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.5)] relative">
            <div className="mb-8">
              <h3 className="text-white font-medium mb-4">Selecciona los servicios de interés:</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => toggleService("web")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                    selectedServices.includes("web")
                      ? "border-[#00c8ff] bg-[#00c8ff]/10 scale-[1.02] shadow-[0_0_20px_rgba(0,200,255,0.15)]"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                  data-testid="toggle-service-web"
                >
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="font-bold text-white mb-1">Página Web Profesional</div>
                  <div className="text-xs text-[#8899bb]">Quiero presencia online profesional</div>
                </button>

                <button
                  onClick={() => toggleService("auto")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                    selectedServices.includes("auto")
                      ? "border-[#6644ff] bg-[#6644ff]/10 scale-[1.02] shadow-[0_0_20px_rgba(102,68,255,0.15)]"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                  data-testid="toggle-service-auto"
                >
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-bold text-white mb-1">Automatización IA</div>
                  <div className="text-xs text-[#8899bb]">Quiero ahorrar tiempo y atender más clientes</div>
                </button>
              </div>
            </div>

            <div className="mb-8">
              <label className={`block font-medium mb-4 transition-colors duration-300 ${isFocused ? 'text-[#00c8ff]' : 'text-white'}`} htmlFor="message">
                Cuéntanos sobre tu negocio:
              </label>
              <textarea
                id="message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ej: Tengo un restaurante y me gustaría una página web para mostrar el menú y un bot que tome reservas..."
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-[#8899bb]/50 focus:outline-none focus:border-[#00c8ff] focus:ring-1 focus:ring-[#00c8ff] transition-all resize-none min-h-[120px]"
                data-testid="input-contact-message"
              />
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleWhatsApp}
                className="w-full sm:w-auto px-10 py-5 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 mx-auto transition-all transform hover:scale-105 shadow-lg relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  boxShadow: "0 0 20px rgba(37,211,102,0.3)",
                }}
                data-testid="button-contact-whatsapp"
              >
                <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer-slide" />
                <SiWhatsapp size={24} className="relative z-10" /> <span className="relative z-10">Enviar por WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Panel (Reasons) */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 bg-black/20 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-xl">
            <h4 className="text-xl font-bold text-white mb-2">¿Por qué contactarnos?</h4>
            <div className="space-y-6">
              {[
                { icon: <Clock size={20} className="text-[#00c8ff]"/>, text: "Respuesta en menos de 2 horas" },
                { icon: <CheckCircle2 size={20} className="text-[#6644ff]"/>, text: "Sin compromisos" },
                { icon: <Users size={20} className="text-[#00c8ff]"/>, text: "Equipo colombiano en español" },
                { icon: <Star size={20} className="text-[#6644ff]"/>, text: "+50 proyectos entregados" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">{item.icon}</div>
                  <span className="text-[15px] text-[#8899bb] font-medium leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-sm text-[#8899bb]">
                También estamos en Instagram:<br/>
                <a href="https://instagram.com/prixma" target="_blank" rel="noreferrer" className="text-white hover:text-[#00c8ff] transition-colors mt-2 inline-block font-medium">
                  @prixma
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <>
      <div className="w-full py-20 border-t border-white/5 bg-gradient-to-b from-transparent to-[#00c8ff]/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_center,#00c8ff_0%,transparent_60%)] mix-blend-screen" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight" style={{
            background: "linear-gradient(135deg, #fff 0%, #8899bb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Digitaliza tu negocio hoy. <br className="hidden md:block"/> <span className="text-[#00c8ff]">No mañana.</span>
          </h2>
        </div>
      </div>
      <footer className="bg-[#080c18] pt-16 pb-8 border-t border-[#00c8ff]/20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left mb-16 relative z-10">
            
            <div className="flex flex-col items-center md:items-start">
              <span className="font-bold text-3xl tracking-widest text-white mb-2">PRIXMA</span>
              <span className="text-[#8899bb] text-sm tracking-wide">Automatiza • Convierte • Escala</span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a href="#servicios" className="text-sm font-medium text-[#8899bb] hover:text-white transition-colors">Servicios</a>
              <a href="#como-funciona" className="text-sm font-medium text-[#8899bb] hover:text-white transition-colors">Cómo funciona</a>
              <a href="#precios" className="text-sm font-medium text-[#8899bb] hover:text-white transition-colors">Precios</a>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-4">
              <a
                href="https://wa.me/573108131732"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#25D366] hover:text-white transition-all hover:scale-110"
              >
                <SiWhatsapp size={20} />
              </a>
              <a
                href="https://instagram.com/prixma"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#E1306C] hover:text-white transition-all hover:scale-110"
              >
                <SiInstagram size={20} />
              </a>
            </div>
          </div>

          <div className="w-full h-px mb-8 opacity-50 relative z-10" style={{ background: 'linear-gradient(to right, transparent, #00c8ff 25%, transparent 50%, #6644ff 75%, transparent)' }} />

          <div className="text-center relative z-10">
            <p className="text-xs text-[#8899bb]/50">
              © {new Date().getFullYear()} PRIXMA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function CardReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
