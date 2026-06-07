import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Settings2, Zap, Bot, MessageCircle, CheckCircle2, ChevronRight, Star } from "lucide-react";
import { SiWhatsapp, SiInstagram } from "react-icons/si";

export default function App() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#080c18] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Servicios />
      <ComoFunciona />
      <PorQue />
      <Precios />
      <Testimonios />
      <Contacto />
      <Footer />
    </div>
  );
}

function PrixmaLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  const logoSize = size;
  const textSize = size <= 32 ? "text-xl" : "text-2xl";
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <img
        src="/logo-prixma.png"
        alt="PRIXMA logo"
        style={{ width: logoSize, height: logoSize, objectFit: "contain" }}
        className="rounded-sm"
      />
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
        <span className="font-bold text-xl tracking-[0.18em] text-white" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.18em" }}>
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
        <span className="font-bold text-2xl tracking-[0.22em] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
          PRIXMA
        </span>
        <p className="text-[#8899bb] tracking-widest text-xs uppercase">Automatiza • Convierte • Escala</p>
      </div>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080c18]/80 backdrop-blur-xl border-b border-[#00c8ff]/10 py-4"
          : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-0 group" data-testid="link-home">
          <PrixmaWordmark inline />
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#servicios" className="text-sm font-medium text-[#8899bb] hover:text-[#00c8ff] transition-colors" data-testid="link-servicios">Servicios</a>
          <a href="#como-funciona" className="text-sm font-medium text-[#8899bb] hover:text-[#00c8ff] transition-colors" data-testid="link-como-funciona">Cómo funciona</a>
          <a href="#precios" className="text-sm font-medium text-[#8899bb] hover:text-[#00c8ff] transition-colors" data-testid="link-precios">Precios</a>
          <a href="#contacto" className="text-sm font-medium text-[#8899bb] hover:text-[#00c8ff] transition-colors" data-testid="link-contacto">Contacto</a>
        </div>

        <a
          href="https://wa.me/573118070620"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-[#00c8ff]/30 hover:border-[#00c8ff] px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(0,200,255,0.1)] hover:shadow-[0_0_25px_rgba(0,200,255,0.3)]"
          data-testid="button-nav-cta"
        >
          Hablar con un experto
        </a>
      </div>
    </motion.nav>
  );
}

function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const particles: { x: number; y: number; r: number; a: number; va: number }[] = [];
    const cols = Math.floor(window.innerWidth / 50);
    const rows = Math.floor(window.innerHeight / 50);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (Math.random() > 0.4) continue;
        particles.push({
          x: i * 50 + (Math.random() * 20 - 10),
          y: j * 50 + (Math.random() * 20 - 10),
          r: Math.random() * 1.5 + 0.5,
          a: Math.random() * Math.PI * 2,
          va: (Math.random() - 0.5) * 0.02,
        });
      }
    }

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.a += p.va;
        const alpha = ((Math.sin(p.a) + 1) / 2) * 0.8 + 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden" id="hero">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,255,0.05)_0%,rgba(8,12,24,0)_70%)] z-0 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 px-4 py-1.5 rounded-full border border-[#00c8ff]/40 bg-[#00c8ff]/5 shadow-[0_0_15px_rgba(0,200,255,0.2)]"
        >
          <span className="text-[#00c8ff] text-sm font-medium flex items-center gap-2">
            <SparklesIcon className="w-4 h-4" /> ✦ Powered by AI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6 max-w-5xl bg-clip-text text-transparent bg-gradient-to-br from-[#00c8ff] via-white to-[#4444ff] leading-tight pb-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Tu negocio en piloto automático
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-[#8899bb] max-w-2xl mb-12"
        >
          Creamos páginas web profesionales y automatizamos tus procesos con inteligencia artificial. Más clientes, menos trabajo manual.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#contacto"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#00c8ff] to-[#0090ff] text-white font-semibold text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(0,200,255,0.4)]"
            data-testid="button-hero-web"
          >
            Quiero mi página web
          </a>
          <a
            href="#contacto"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-[#6644ff]/50 text-white font-semibold text-lg transition-all hover:bg-white/10 hover:border-[#6644ff] shadow-[0_0_15px_rgba(102,68,255,0.2)] hover:shadow-[0_0_25px_rgba(102,68,255,0.4)]"
            data-testid="button-hero-auto"
          >
            Automatizar mi negocio
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Servicios() {
  return (
    <section className="py-24 relative" id="servicios">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Nuestros Servicios</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#00c8ff] to-[#6644ff] mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <CardReveal>
            <div className="group h-full bg-[rgba(255,255,255,0.03)] border border-[#00c8ff]/20 rounded-2xl p-8 transition-all hover:bg-[rgba(255,255,255,0.05)] hover:border-[#00c8ff]/60 hover:shadow-[0_0_30px_rgba(0,200,255,0.15)] relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Code2 size={120} color="#00c8ff" />
              </div>
              <div className="w-16 h-16 rounded-xl bg-[#00c8ff]/10 flex items-center justify-center mb-6 border border-[#00c8ff]/30 group-hover:scale-110 transition-transform">
                <Code2 size={32} className="text-[#00c8ff]" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Páginas Web Profesionales</h3>
              <p className="text-[#8899bb] mb-8 leading-relaxed">
                Diseñamos tu página web con IA en tiempo récord. Diseño premium, optimizada para vender, con dominio propio.
              </p>
              <ul className="space-y-3 mb-10 flex-grow">
                {["Diseño personalizado", "SEO incluido", "Formulario de contacto", "Adaptada a móviles", "Entrega en 5 días"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                    <CheckCircle2 size={18} className="text-[#00c8ff]" /> {item}
                  </li>
                ))}
              </ul>
              {/* Mejora 1: botón con borde cyan brillante, texto cyan y glow hover */}
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-transparent border-2 border-[#00c8ff] text-[#00c8ff] font-semibold transition-all duration-300 hover:bg-[#00c8ff]/10 hover:shadow-[0_0_20px_rgba(0,200,255,0.5),0_0_40px_rgba(0,200,255,0.2)]"
                data-testid="button-service-web"
              >
                Quiero mi web <ChevronRight size={18} />
              </a>
            </div>
          </CardReveal>

          <CardReveal delay={0.2}>
            <div className="group h-full bg-[rgba(255,255,255,0.03)] border border-[#6644ff]/20 rounded-2xl p-8 transition-all hover:bg-[rgba(255,255,255,0.05)] hover:border-[#6644ff]/60 hover:shadow-[0_0_30px_rgba(102,68,255,0.15)] relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Settings2 size={120} color="#6644ff" />
              </div>
              <div className="w-16 h-16 rounded-xl bg-[#6644ff]/10 flex items-center justify-center mb-6 border border-[#6644ff]/30 group-hover:scale-110 transition-transform">
                <Settings2 size={32} className="text-[#6644ff]" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Automatizaciones con IA</h3>
              <p className="text-[#8899bb] mb-8 leading-relaxed">
                Automatizamos las tareas repetitivas de tu negocio: respuestas automáticas, agendamiento, seguimiento de clientes y más.
              </p>
              <ul className="space-y-3 mb-10 flex-grow">
                {["Chatbot WhatsApp/Instagram", "Respuestas 24/7", "Agenda y recordatorios", "Reportes automáticos", "Integración de apps"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                    <CheckCircle2 size={18} className="text-[#00c8ff]" /> {item}
                  </li>
                ))}
              </ul>
              {/* Mejora 1: botón con borde cyan brillante, texto cyan y glow hover */}
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-transparent border-2 border-[#00c8ff] text-[#00c8ff] font-semibold transition-all duration-300 hover:bg-[#00c8ff]/10 hover:shadow-[0_0_20px_rgba(0,200,255,0.5),0_0_40px_rgba(0,200,255,0.2)]"
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
    <section className="py-24 bg-[#0d1225]" id="como-funciona">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Cómo Funciona</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#00c8ff] to-[#6644ff] mx-auto rounded-full"></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Mejora 3: línea animada con gradiente cyan a púrpura */}
          <div ref={lineRef} className="hidden md:block absolute top-[52px] left-[16.66%] right-[16.66%] h-[3px] overflow-hidden rounded-full z-0">
            <motion.div
              className="h-full w-full bg-gradient-to-r from-[#00c8ff] via-[#6644ff] to-[#9933ff]"
              initial={{ scaleX: 0, transformOrigin: "left" }}
              animate={lineInView ? { scaleX: 1, transformOrigin: "left" } : { scaleX: 0, transformOrigin: "left" }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
              style={{
                boxShadow: "0 0 12px rgba(0, 200, 255, 0.6), 0 0 30px rgba(102, 68, 255, 0.4)",
              }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <CardReveal key={i} delay={i * 0.2}>
                <div className="relative bg-[#080c18] border border-white/10 rounded-2xl p-8 text-center h-full z-10 hover:border-white/30 transition-colors">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-white/5 pointer-events-none select-none" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {step.num}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#0d1225] border-2 border-[#00c8ff] flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(0,200,255,0.3)] text-xl font-bold text-[#00c8ff]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>{step.title}</h3>
                  <p className="text-[#8899bb] text-sm">{step.desc}</p>
                </div>
              </CardReveal>
            ))}
          </div>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>¿Por qué PRIXMA?</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#00c8ff] to-[#6644ff] mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <CardReveal key={i} delay={i * 0.1}>
              <div className="text-center p-8 group">
                {/* Mejora 2: íconos más grandes (w-24 h-24) con colores vibrantes y fondo con glow */}
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
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>{f.title}</h3>
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
  return (
    <section className="py-24 bg-[#0d1225]" id="precios">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Planes y Precios</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#00c8ff] to-[#6644ff] mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          <CardReveal>
            <div className="bg-[#080c18] border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-colors">
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Web Esencial</h3>
              <p className="text-[#8899bb] mb-6">Para negocios que inician</p>
              <div className="mb-8">
                <span className="text-sm text-[#8899bb]">Desde</span>
                <div className="text-3xl font-bold text-white mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>$800.000 COP</div>
              </div>
              <ul className="space-y-4 mb-8">
                {["Landing page profesional", "Dominio incluido", "Formulario de contacto", "Optimización móvil", "Entrega en 5 días"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                    <CheckCircle2 size={18} className="text-[#00c8ff] shrink-0 mt-0.5" /> <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#contacto" className="block w-full py-3 text-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-medium">
                Empezar
              </a>
            </div>
          </CardReveal>

          <CardReveal delay={0.2}>
            <div className="relative bg-[#080c18] border-2 border-[#00c8ff] rounded-2xl p-8 shadow-[0_0_30px_rgba(0,200,255,0.15)] transform lg:scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00c8ff] text-[#080c18] text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-wide">
                <Star size={14} fill="currentColor" /> Más popular
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#00c8ff]" style={{ fontFamily: "'Inter', sans-serif" }}>Web Pro</h3>
              <p className="text-[#8899bb] mb-6">Para negocios en crecimiento</p>
              <div className="mb-8">
                <span className="text-sm text-[#8899bb]">Desde</span>
                <div className="text-3xl font-bold text-white mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>$1.500.000 COP</div>
              </div>
              <ul className="space-y-4 mb-8">
                {["Todo lo de Web Esencial", "Blog o catálogo de productos", "Chat integrado", "SEO avanzado", "Google Analytics"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                    <CheckCircle2 size={18} className="text-[#00c8ff] shrink-0 mt-0.5" /> <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#contacto" className="block w-full py-3 text-center rounded-xl bg-[#00c8ff] text-[#080c18] hover:bg-[#0090ff] hover:text-white transition-colors font-bold">
                Empezar
              </a>
            </div>
          </CardReveal>

          <CardReveal delay={0.4}>
            <div className="bg-[#080c18] border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-colors">
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Automatización IA</h3>
              <p className="text-[#8899bb] mb-6">Procesos en piloto automático</p>
              <div className="mb-8">
                <span className="text-sm text-[#8899bb]">Desde</span>
                <div className="text-3xl font-bold text-white mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>$500.000 <span className="text-lg font-normal text-[#8899bb]">COP/mes</span></div>
              </div>
              <ul className="space-y-4 mb-8">
                {["Chatbot WhatsApp/Instagram", "Respuestas 24/7", "Panel de control", "Soporte mensual"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                    <CheckCircle2 size={18} className="text-[#6644ff] shrink-0 mt-0.5" /> <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#contacto" className="block w-full py-3 text-center rounded-xl bg-white/5 border border-[#6644ff]/30 text-white hover:bg-[#6644ff]/10 hover:border-[#6644ff] transition-colors font-medium">
                Cotizar
              </a>
            </div>
          </CardReveal>
        </div>
      </div>
    </section>
  );
}

/* Mejora 4: Sección de Testimonios */
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Lo que dicen nuestros clientes</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#00c8ff] to-[#6644ff] mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonios.map((t, i) => (
            <CardReveal key={i} delay={i * 0.15}>
              <div
                className="h-full bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-2xl p-8 flex flex-col gap-5 hover:border-white/20 transition-all duration-300"
                style={{
                  boxShadow: `0 0 0 0 transparent`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 25px ${t.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 transparent`;
                }}
              >
                {/* Estrellas */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={16} fill={t.color} color={t.color} />
                  ))}
                </div>

                {/* Comentario */}
                <p className="text-white/80 text-sm leading-relaxed flex-grow">
                  "{t.comentario}"
                </p>

                {/* Avatar + info */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
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
    const url = `https://wa.me/573118070620?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-24 relative overflow-hidden" id="contacto">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00c8ff]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6644ff]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>¿Qué necesita tu negocio?</h2>
          <p className="text-xl text-[#8899bb]">Cuéntanos en qué podemos ayudarte y te respondemos en menos de 24 horas</p>
        </div>

        <div className="max-w-3xl mx-auto bg-[#0d1225]/80 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
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
            <label className="block text-white font-medium mb-4" htmlFor="message">
              Cuéntanos sobre tu negocio:
            </label>
            <textarea
              id="message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Ej: Tengo un restaurante y me gustaría una página web para mostrar el menú y un bot que tome reservas..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-[#8899bb]/50 focus:outline-none focus:border-[#00c8ff] focus:ring-1 focus:ring-[#00c8ff] transition-all resize-none min-h-[120px]"
              data-testid="input-contact-message"
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleWhatsApp}
              className="w-full sm:w-auto px-10 py-5 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 mx-auto transition-all transform hover:scale-105 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                boxShadow: "0 0 20px rgba(37,211,102,0.3)",
              }}
              data-testid="button-contact-whatsapp"
            >
              <SiWhatsapp size={24} /> <span>Enviar por WhatsApp</span>
            </button>
            <p className="mt-6 text-sm text-[#8899bb]">
              También puedes escribirnos directamente a Instagram:{" "}
              <a href="https://instagram.com/prixma" target="_blank" rel="noreferrer" className="text-white hover:text-[#00c8ff] transition-colors">
                @prixma
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#080c18] border-t border-white/10 py-12 text-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center mb-8">
          <PrixmaWordmark />
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
          <a href="#servicios" className="text-sm text-[#8899bb] hover:text-white transition-colors">Servicios</a>
          <a href="#como-funciona" className="text-sm text-[#8899bb] hover:text-white transition-colors">Cómo funciona</a>
          <a href="#precios" className="text-sm text-[#8899bb] hover:text-white transition-colors">Precios</a>
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
          <a
            href="https://wa.me/573118070620"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#25D366] hover:text-white transition-all"
          >
            <SiWhatsapp size={20} />
          </a>
          <a
            href="https://instagram.com/prixma"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#E1306C] hover:text-white transition-all"
          >
            <SiInstagram size={20} />
          </a>
        </div>

        <p className="text-xs text-[#8899bb]/50">
          © {new Date().getFullYear()} PRIXMA. Todos los derechos reservados.
        </p>
      </div>
    </footer>
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
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.64 5.23a.75.75 0 0 1 1.32 0l1.78 3.6a.75.75 0 0 0 .41.41l3.6 1.78a.75.75 0 0 1 0 1.32l-3.6 1.78a.75.75 0 0 0-.41.41l-1.78 3.6a.75.75 0 0 1-1.32 0l-1.78-3.6a.75.75 0 0 0-.41-.41l-3.6-1.78a.75.75 0 0 1 0-1.32l3.6-1.78a.75.75 0 0 0 .41-.41l1.78-3.6Z" />
    </svg>
  );
}
