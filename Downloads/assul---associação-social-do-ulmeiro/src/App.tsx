import React, { useState, useEffect } from 'react';
import { 
  Beer, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  ChevronRight, 
  Menu, 
  X, 
  Facebook, 
  Instagram,
  Calendar,
  Users,
  Coffee,
  Trophy,
  Home,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Sobre', href: '#about' },
    { name: 'Atividades', href: '#activities' },
    { name: 'Galeria', href: '#gallery' },
    { name: 'Sócios', href: '#members' },
    { name: 'Aluguer', href: '#booking' },
    { name: 'Críticas', href: '#reviews' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-olive rounded-full flex items-center justify-center text-white font-serif text-xl font-bold group-hover:scale-110 transition-transform">
            A
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-brand-brown">
            ASSUL
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium uppercase tracking-widest text-brand-brown/80 hover:text-brand-olive transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#booking"
            className="bg-brand-olive text-white px-6 py-2 rounded-full text-sm font-medium uppercase tracking-widest hover:bg-brand-brown transition-colors"
          >
            Reservar
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-brand-brown" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl py-8 flex flex-col items-center gap-6 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-serif text-brand-brown"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeading = ({ title, subtitle, light = false }: { title: string, subtitle?: string, light?: boolean }) => (
  <div className="mb-12">
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("text-sm font-medium uppercase tracking-[0.3em]", light ? "text-white/60" : "text-brand-olive")}
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className={cn("text-4xl md:text-5xl lg:text-6xl mt-2", light ? "text-white" : "text-brand-brown")}
    >
      {title}
    </motion.h2>
  </div>
);

export default function App() {
  const [bookingType, setBookingType] = useState<'event' | 'hall'>('event');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isMemberSubmitting, setIsMemberSubmitting] = useState(false);
  const [memberSubmitStatus, setMemberSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const bookingData = {
      name: formData.get('name') as string,
      contact: formData.get('contact') as string,
      date: formData.get('date') as string,
      message: formData.get('message') as string,
      type: bookingType,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'bookings'), bookingData);
      setSubmitStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error adding booking: ", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const handleMemberSubmit = async () => {
    const name = prompt("Por favor, introduza o seu nome completo:");
    const contact = prompt("Por favor, introduza o seu contacto (telefone ou email):");

    if (!name || !contact) return;

    setIsMemberSubmitting(true);
    try {
      await addDoc(collection(db, 'memberRequests'), {
        name,
        contact,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      alert("Pedido de sócio enviado com sucesso! Entraremos em contacto brevemente.");
    } catch (error) {
      console.error("Error adding member request: ", error);
      alert("Ocorreu um erro ao enviar o pedido. Por favor, tente novamente mais tarde.");
    } finally {
      setIsMemberSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-olive selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://storage.googleapis.com/static-content-ais/ais-dev-5ducsyh4edwfxkk45ki7u6-751575544274/input_file_3.png" 
            alt="ASSUL Interior" 
            className="w-full h-full object-cover brightness-50 scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white/80 uppercase tracking-[0.4em] text-sm mb-4 block">Bem-vindo à</span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl text-white mb-8 font-serif leading-tight">
              ASSUL
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-serif italic mb-10 max-w-2xl mx-auto">
              "Onde pode beber uma cerveijinha e jogar as cartas com um copo de vinho."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#about" className="bg-white text-brand-brown px-10 py-4 rounded-full text-sm font-medium uppercase tracking-widest hover:bg-brand-cream transition-all w-full sm:w-auto">
                Descobrir Mais
              </a>
              <a href="#booking" className="bg-brand-olive text-white px-10 py-4 rounded-full text-sm font-medium uppercase tracking-widest hover:bg-brand-brown transition-all w-full sm:w-auto">
                Alugar Salão
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <ChevronRight size={32} className="rotate-90" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-brand-cream">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading title="A Nossa História" subtitle="Sobre a Associação" />
            <div className="space-y-6 text-lg text-brand-brown/80 leading-relaxed">
              <p>
                A ASSUL (Associação Social do Ulmeiro) é mais do que um espaço físico; é o coração pulsante da nossa comunidade em Ulmeiro. Fundada com o propósito de unir as pessoas, oferecemos um ambiente acolhedor onde a tradição e o convívio se encontram.
              </p>
              <p>
                Seja para uma partida de cartas, um jogo de bilhar ou simplesmente para partilhar uma cerveja fresca com os amigos, a ASSUL é o ponto de encontro de gerações. Valorizamos a simplicidade, a amizade e o espírito comunitário que nos define.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-8 border-t border-brand-brown/10 pt-10">
              <div>
                <h4 className="font-serif text-3xl text-brand-brown">Ulmeiro</h4>
                <p className="text-sm uppercase tracking-widest text-brand-olive mt-1">Localização</p>
              </div>
              <div>
                <h4 className="font-serif text-3xl text-brand-brown">21:00</h4>
                <p className="text-sm uppercase tracking-widest text-brand-olive mt-1">Horário de Abertura</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://storage.googleapis.com/static-content-ais/ais-dev-5ducsyh4edwfxkk45ki7u6-751575544274/input_file_0.png" 
              alt="Bar da ASSUL" 
              className="pill-image w-full aspect-[4/5]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-8 -left-8 bg-brand-olive text-white p-8 rounded-[2rem] hidden lg:block shadow-xl">
              <p className="font-serif text-2xl italic">"Um copo de vinho e boa companhia."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="O Que Fazemos" subtitle="Atividades e Convívio" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Beer size={32} />, title: "Bar Social", desc: "Cerveja fresca (Sagres Mini sempre gelada), vinhos da região e petiscos tradicionais." },
              { icon: <Users size={32} />, title: "Jogos de Cartas", desc: "Torneios amigáveis de sueca e momentos de lazer entre amigos." },
              { icon: <Trophy size={32} />, title: "Bilhar", desc: "Uma mesa de bilhar profissional num espaço dedicado ao jogo." },
              { icon: <Calendar size={32} />, title: "Eventos", desc: "Festas temáticas, jantares comunitários e celebrações locais." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-organic group hover:bg-brand-cream transition-colors"
              >
                <div className="text-brand-olive mb-6 group-hover:scale-110 transition-transform inline-block">
                  {item.icon}
                </div>
                <h3 className="text-2xl mb-4 text-brand-brown">{item.title}</h3>
                <p className="text-brand-brown/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-6 bg-brand-cream overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="O Nosso Espaço" subtitle="Galeria de Fotos" />
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {[
              { src: "https://storage.googleapis.com/static-content-ais/ais-dev-5ducsyh4edwfxkk45ki7u6-751575544274/input_file_3.png", alt: "Balcão ASSUL", caption: "O nosso balcão icónico" },
              { src: "https://storage.googleapis.com/static-content-ais/ais-dev-5ducsyh4edwfxkk45ki7u6-751575544274/input_file_2.png", alt: "Bilhar", caption: "Espaço de jogos" },
              { src: "https://storage.googleapis.com/static-content-ais/ais-dev-5ducsyh4edwfxkk45ki7u6-751575544274/input_file_1.png", alt: "Sagres", caption: "Sempre fresca" },
              { src: "https://storage.googleapis.com/static-content-ais/ais-dev-5ducsyh4edwfxkk45ki7u6-751575544274/input_file_0.png", alt: "Cachecóis", caption: "A nossa paixão pelo desporto" },
              { src: "https://storage.googleapis.com/static-content-ais/ais-dev-5ducsyh4edwfxkk45ki7u6-751575544274/input_file_3.png", alt: "Convívio", caption: "Momentos entre amigos" },
              { src: "https://storage.googleapis.com/static-content-ais/ais-dev-5ducsyh4edwfxkk45ki7u6-751575544274/input_file_2.png", alt: "Lazer", caption: "O nosso espaço" },
            ].map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group cursor-pointer overflow-hidden rounded-[2rem]"
              >
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-brown/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <p className="text-white font-serif text-xl italic">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section id="members" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <img 
              src="https://storage.googleapis.com/static-content-ais/ais-dev-5ducsyh4edwfxkk45ki7u6-751575544274/input_file_3.png" 
              alt="Sócios ASSUL" 
              className="pill-image w-full aspect-square"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading title="Torne-se Sócio" subtitle="Comunidade ASSUL" />
            <div className="space-y-6 text-lg text-brand-brown/80 mb-10">
              <p>
                Ser sócio da ASSUL é fazer parte de uma família. Ao juntar-se a nós, contribui para a manutenção deste espaço histórico e para a dinamização de atividades em Ulmeiro.
              </p>
              <div className="grid gap-4">
                {[
                  "Descontos exclusivos no bar e eventos",
                  "Prioridade no aluguer do salão",
                  "Participação em torneios de sócios",
                  "Voz ativa nas decisões da associação"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-brand-olive/10 rounded-full flex items-center justify-center text-brand-olive">
                      <ChevronRight size={16} />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={handleMemberSubmit}
              disabled={isMemberSubmitting}
              className="bg-brand-brown text-white px-10 py-4 rounded-full text-sm font-medium uppercase tracking-widest hover:bg-brand-olive transition-all disabled:opacity-50"
            >
              {isMemberSubmitting ? 'A enviar...' : 'Saber Como Aderir'}
            </button>
          </div>
        </div>
      </section>

      {/* Booking / Rental Section */}
      <section id="booking" className="py-24 px-6 bg-brand-brown text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <img src="https://storage.googleapis.com/static-content-ais/ais-dev-5ducsyh4edwfxkk45ki7u6-751575544274/input_file_0.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionHeading title="Reserve o Nosso Espaço" subtitle="Aluguer e Marcações" light />
              <p className="text-xl text-white/80 mb-8 font-serif italic">
                Precisa de um local para o seu próximo evento? O nosso salão está disponível para aluguer.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Festas de Aniversário",
                  "Jantares de Grupo",
                  "Reuniões Comunitárias",
                  "Eventos Culturais",
                  "Batizados e Celebrações"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90">
                    <div className="w-2 h-2 bg-brand-olive rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="bg-white/10 p-8 rounded-[2rem] backdrop-blur-sm border border-white/10">
                <h4 className="text-2xl font-serif mb-4">Informações Úteis</h4>
                <p className="text-white/70 mb-4">O aluguer inclui acesso ao salão principal, casas de banho e área de apoio. Para detalhes sobre preços e disponibilidade, preencha o formulário.</p>
                <div className="flex items-center gap-4 text-brand-olive">
                  <Phone size={20} />
                  <span className="text-white font-medium">Contacte-nos para urgências</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 text-brand-brown shadow-2xl">
              <div className="flex gap-4 mb-8 p-1 bg-brand-cream rounded-full">
                <button 
                  onClick={() => setBookingType('event')}
                  className={cn(
                    "flex-1 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all",
                    bookingType === 'event' ? "bg-brand-olive text-white shadow-lg" : "text-brand-brown/50 hover:text-brand-brown"
                  )}
                >
                  Evento
                </button>
                <button 
                  onClick={() => setBookingType('hall')}
                  className={cn(
                    "flex-1 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all",
                    bookingType === 'hall' ? "bg-brand-olive text-white shadow-lg" : "text-brand-brown/50 hover:text-brand-brown"
                  )}
                >
                  Alugar Salão
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleBookingSubmit}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-olive">Nome Completo</label>
                    <input name="name" required type="text" className="w-full bg-brand-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-olive outline-none" placeholder="O seu nome" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-olive">Contacto</label>
                    <input name="contact" required type="tel" className="w-full bg-brand-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-olive outline-none" placeholder="Telemóvel" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-olive">Data Pretendida</label>
                  <input name="date" required type="date" className="w-full bg-brand-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-olive outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-olive">Mensagem / Detalhes</label>
                  <textarea name="message" rows={4} className="w-full bg-brand-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-olive outline-none resize-none" placeholder="Diga-nos o que pretende organizar..."></textarea>
                </div>
                
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-2xl">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-medium">Pedido enviado com sucesso!</span>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-2xl">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">Erro ao enviar. Tente novamente.</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-brown text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-brand-olive transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar Pedido
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 px-6 bg-brand-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="O Que Dizem de Nós" subtitle="Críticas do Google" />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Jacinto Primitivo", rating: 5, text: "Excelente ambiente para convívio.", time: "há um ano" },
              { name: "Maria José Silva", rating: 3, text: "Espaço agradável em Ulmeiro.", time: "há 8 meses" },
              { name: "Sergiolopesmartins", rating: 1, text: "Poderia melhorar o atendimento.", time: "há um ano" },
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-organic"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, starI) => (
                    <Star 
                      key={starI} 
                      size={16} 
                      className={cn(starI < review.rating ? "text-brand-olive fill-brand-olive" : "text-brand-brown/20")} 
                    />
                  ))}
                </div>
                <p className="text-brand-brown/80 mb-6 italic">"{review.text}"</p>
                <div className="flex items-center justify-between border-t border-brand-brown/10 pt-4">
                  <span className="font-bold text-brand-brown">{review.name}</span>
                  <span className="text-xs uppercase tracking-widest text-brand-brown/40">{review.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-full shadow-sm">
              <div className="flex items-center gap-1 text-brand-olive">
                <Star size={20} className="fill-brand-olive" />
                <span className="font-bold text-xl">3.0</span>
              </div>
              <div className="w-px h-6 bg-brand-brown/10" />
              <span className="text-brand-brown/60 uppercase tracking-widest text-sm">Média Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <div>
            <SectionHeading title="Fale Connosco" subtitle="Contactos" />
            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-brand-cream rounded-2xl flex items-center justify-center text-brand-olive shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-brown mb-1">Endereço</h4>
                  <p className="text-brand-brown/70">R. Fonte Pública 6, Ulmeiro<br />2495-190, Portugal</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-brand-cream rounded-2xl flex items-center justify-center text-brand-olive shrink-0">
                  <Clock size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-brown mb-1">Horário</h4>
                  <p className="text-brand-brown/70">Abre às 21:00<br />Encerra tardiamente</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-brand-cream rounded-2xl flex items-center justify-center text-brand-olive shrink-0">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-brown mb-1">Telefone</h4>
                  <p className="text-brand-brown/70">Adicione o número de telefone local</p>
                </div>
              </div>
            </div>
            <div className="mt-12 flex gap-4">
              <a href="#" className="w-12 h-12 bg-brand-brown text-white rounded-full flex items-center justify-center hover:bg-brand-olive transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-brand-brown text-white rounded-full flex items-center justify-center hover:bg-brand-olive transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[500px] border-8 border-brand-cream">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3084.654321!2d-8.6!3d39.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDM2JzAwLjAiTiA4wrAzNicwMC4wIlc!5e0!3m2!1spt!2spt!4v1234567890" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-cream py-12 px-6 border-t border-brand-brown/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-olive rounded-full flex items-center justify-center text-white font-serif text-sm font-bold">
              A
            </div>
            <span className="font-serif text-xl font-bold text-brand-brown">ASSUL</span>
          </div>
          <p className="text-brand-brown/50 text-sm">
            © 2026 ASSUL - Associação Social do Ulmeiro. Todos os direitos reservados.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs uppercase tracking-widest text-brand-brown/60 hover:text-brand-olive transition-colors">Privacidade</a>
            <a href="#" className="text-xs uppercase tracking-widest text-brand-brown/60 hover:text-brand-olive transition-colors">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
