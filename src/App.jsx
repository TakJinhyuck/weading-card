import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Phone, MessageSquare, MapPin, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, X, Copy, Check, Link2,
  Train, Car, Bus, Navigation, Heart
} from 'lucide-react';

// ─────────────────────────────────────────
// 웨딩 설정 데이터
// ─────────────────────────────────────────
const CONFIG = {
  groom: {
    name: '탁진혁',
    father: '탁병철',
    mother: '김남덕',
    phone: '01038925193',
    accounts: [
      { bank: '국민은행', number: '123-456-789-00', holder: '탁진혁', label: '' },
      { bank: '신한은행', number: '110-123-456789', holder: '탁병철', label: '부' },
      { bank: '우리은행', number: '1002-345-678901', holder: '김남덕', label: '모' },
    ],
  },
  bride: {
    name: '조수민',
    father: '조규성',
    mother: '우선희',
    phone: '01050290347',
    accounts: [
      { bank: '카카오뱅크', number: '3333-01-2345678', holder: '조수민', label: '' },
      { bank: '하나은행', number: '123-456789-01011', holder: '조규성', label: '부' },
      { bank: '농협은행', number: '302-0123-4567-81', holder: '우선희', label: '모' },
    ],
  },
  wedding: {
    date: new Date('2026-09-13T11:00:00'),
    year: 2026,
    month: 9,
    day: 13,
    dayOfWeek: '일요일',
    time: '오전 11시 00분',
    venue: '잠실 더컨벤션',
    hall: '그랜드볼룸',
    address: '서울 송파구 올림픽로 319 3F',
    addressEng: '319 Olympic-ro 3F, Songpa-gu, Seoul',
    kakaoMapUrl: 'https://map.kakao.com/link/to/잠실더컨벤션그랜드볼룸,37.5126,127.0983',
    naverMapUrl: 'https://map.naver.com/v5/search/%EC%9E%A0%EC%8B%A4%20%EB%8D%94%EC%BB%A8%EB%B2%A4%EC%85%98',
  },
  gallery: [
    '/images/gallery-1.jpg',
    '/images/gallery-2.jpg',
    '/images/gallery-3.jpg',
    '/images/gallery-4.jpg',
    '/images/gallery-5.jpg',
    '/images/gallery-6.jpg',
    '/images/gallery-7.jpg',
    '/images/gallery-8.jpg',
    '/images/gallery-9.jpg',
    '/images/gallery-10.jpg',
    '/images/gallery-11.jpg',
  ],
};

// ─────────────────────────────────────────
// 공통: Fade-in 래퍼
// ─────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────
// 섹션 구분선
// ─────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <div className="h-px w-12 bg-rose-200" />
      <span className="text-rose-300 text-xs">✦</span>
      <div className="h-px w-12 bg-rose-200" />
    </div>
  );
}

// ─────────────────────────────────────────
// 벚꽃 SVG 꽃잎
// ─────────────────────────────────────────
const PETAL_COLORS = ['#ffb7c5', '#ffc0cb', '#ffccd5', '#ff91a4', '#ffe4ea', '#ffd6df'];

function CherryPetalSVG({ id, size, color }) {
  const gId = `cpg${id}`;
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 32 42" style={{ filter: 'drop-shadow(0 1px 2px rgba(255,150,170,0.3))' }}>
      <defs>
        <radialGradient id={gId} cx="45%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="55%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </radialGradient>
      </defs>
      {/* 꽃잎 몸체 — 상단에 살짝 오목한 하트형 */}
      <path
        d="M16,2 C12,2 4,7 3,15 C2,25 8,36 16,40 C24,36 30,25 29,15 C28,7 20,2 16,2 Z"
        fill={`url(#${gId})`}
      />
      {/* 중심 맥 */}
      <path d="M16,5 Q16,22 16,39" stroke="white" strokeWidth="0.9" strokeOpacity="0.45" fill="none" strokeLinecap="round" />
      {/* 옆 맥 */}
      <path d="M16,14 Q21,18 27,17" stroke="white" strokeWidth="0.6" strokeOpacity="0.3" fill="none" />
      <path d="M16,14 Q11,18 5,17"  stroke="white" strokeWidth="0.6" strokeOpacity="0.3" fill="none" />
      <path d="M16,24 Q22,27 27,25" stroke="white" strokeWidth="0.5" strokeOpacity="0.25" fill="none" />
      <path d="M16,24 Q10,27 5,25"  stroke="white" strokeWidth="0.5" strokeOpacity="0.25" fill="none" />
    </svg>
  );
}

// ─────────────────────────────────────────
// 1. 메인 커버
// ─────────────────────────────────────────
function CoverSection() {
  const [petals] = useState(() => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: 2 + Math.random() * 92,
      delay: Math.random() * 14,
      duration: 11 + Math.random() * 9,
      size: 10 + Math.random() * 18,
      color: PETAL_COLORS[i % PETAL_COLORS.length],
      initRotate: Math.random() * 360,
      swayX: (Math.random() - 0.5) * 110,
      vh,
    }));
  });

  return (
    <section className="relative w-full h-screen overflow-hidden bg-stone-100">
      {/* Hero Image */}
      <img
        src="/images/cover.jpg"
        alt="웨딩 커버"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />

      {/* 벚꽃 꽃잎 */}
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{ left: `${p.left}%`, top: '-60px' }}
          animate={{
            y: [0, p.vh * 0.2, p.vh * 0.5, p.vh * 0.8, p.vh + 70],
            x: [0, p.swayX * 0.5, p.swayX, p.swayX * 0.3, p.swayX * 0.7],
            rotate: [p.initRotate, p.initRotate + 120, p.initRotate + 240, p.initRotate + 300, p.initRotate + 360],
            opacity: [0, 0.95, 0.95, 0.75, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
            x: { ease: 'easeInOut', duration: p.duration, delay: p.delay, repeat: Infinity },
            opacity: { times: [0, 0.08, 0.8, 0.94, 1], duration: p.duration, delay: p.delay, repeat: Infinity },
          }}
        >
          <CherryPetalSVG id={p.id} size={p.size} color={p.color} />
        </motion.div>
      ))}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-gothic text-xs tracking-[0.3em] text-rose-200 mb-4 uppercase">
            Wedding Invitation
          </p>
          <h1 className="font-myeongjo text-4xl font-bold mb-1 tracking-wide">
            탁진혁 <span className="text-rose-300 font-normal mx-2">&</span> 조수민
          </h1>
          <p className="font-myeongjo text-base text-white/80 mt-1 tracking-widest">
            JinHyuk Tak &amp; SuMin Jo
          </p>
          <div className="mt-5 space-y-1">
            <p className="font-gothic text-sm text-white/90 tracking-wider">
              2026년 9월 13일 일요일 오전 11시
            </p>
            <p className="font-gothic text-sm text-white/75 tracking-wide">
              잠실 더컨벤션 · 그랜드볼룸
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="text-white/60" size={22} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// 2. 인사말 섹션
// ─────────────────────────────────────────
function GreetingSection() {
  return (
    <section className="px-8 py-16 bg-white">
      <FadeIn>
        <div className="text-center mb-8">
          <p className="font-gothic text-xs text-rose-400 tracking-[0.25em] uppercase mb-6">Greeting</p>
          <p className="font-myeongjo text-stone-700 text-[15px] leading-9 tracking-wide">
            서로가 마주보며 다져온 사랑을<br />
            이제 함께 한 곳을 바라보며<br />
            걸어가고자 합니다.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="text-center mt-6">
          <p className="font-gothic text-stone-500 text-[13px] leading-8">
            저희 두 사람이 사랑으로 만나<br />
            이제 한 가정을 이루게 되었습니다.<br />
            오셔서 축복해 주시면 감사하겠습니다.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <SectionDivider />
        <div className="mt-6 space-y-4">
          {/* Groom Family */}
          <div className="text-center">
            <p className="font-gothic text-stone-400 text-[11px] tracking-widest mb-1">신랑측</p>
            <p className="font-myeongjo text-stone-700 text-sm tracking-wide">
              <span className="text-stone-500">탁병철 · 김남덕</span>의 아들{' '}
              <span className="font-bold">탁진혁</span>
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-px w-8 bg-rose-200" />
            <Heart size={14} className="mx-3 text-rose-300 fill-rose-300" />
            <div className="h-px w-8 bg-rose-200" />
          </div>
          {/* Bride Family */}
          <div className="text-center">
            <p className="font-gothic text-stone-400 text-[11px] tracking-widest mb-1">신부측</p>
            <p className="font-myeongjo text-stone-700 text-sm tracking-wide">
              <span className="text-stone-500">조규성 · 우선희</span>의 딸{' '}
              <span className="font-bold">조수민</span>
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

// ─────────────────────────────────────────
// 3. 연락하기 섹션
// ─────────────────────────────────────────
function ContactModal({ person, data, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        className="relative bg-white rounded-t-3xl w-full max-w-[430px] px-8 py-8 pb-12"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-6" />
        <p className="font-myeongjo text-center text-stone-700 text-lg mb-6">
          {person}에게 연락하기
        </p>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${data.phone}`}
            className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-rose-50 active:bg-rose-100 transition-colors"
          >
            <Phone size={24} className="text-rose-400" />
            <span className="font-gothic text-sm text-stone-600">전화하기</span>
          </a>
          <a
            href={`sms:${data.phone}`}
            className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-stone-50 active:bg-stone-100 transition-colors"
          >
            <MessageSquare size={24} className="text-stone-400" />
            <span className="font-gothic text-sm text-stone-600">문자 보내기</span>
          </a>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-2xl border border-stone-200 font-gothic text-sm text-stone-400 active:bg-stone-50 transition-colors"
        >
          닫기
        </button>
      </motion.div>
    </motion.div>
  );
}

function ContactSection() {
  const [modal, setModal] = useState(null);

  return (
    <section className="px-6 py-12 bg-stone-50">
      <FadeIn>
        <p className="font-gothic text-xs text-rose-400 tracking-[0.25em] uppercase text-center mb-6">Contact</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setModal('groom')}
            className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-white shadow-sm border border-stone-100 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
              <Phone size={18} className="text-rose-400" />
            </div>
            <span className="font-myeongjo text-stone-700 text-sm">신랑 탁진혁</span>
            <span className="font-gothic text-stone-400 text-xs">연락하기</span>
          </button>
          <button
            onClick={() => setModal('bride')}
            className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-white shadow-sm border border-stone-100 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
              <Phone size={18} className="text-rose-400" />
            </div>
            <span className="font-myeongjo text-stone-700 text-sm">신부 조수민</span>
            <span className="font-gothic text-stone-400 text-xs">연락하기</span>
          </button>
        </div>
      </FadeIn>

      <AnimatePresence>
        {modal === 'groom' && (
          <ContactModal person="신랑 탁진혁" data={CONFIG.groom} onClose={() => setModal(null)} />
        )}
        {modal === 'bride' && (
          <ContactModal person="신부 조수민" data={CONFIG.bride} onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// ─────────────────────────────────────────
// 4. 날짜 & D-Day 섹션
// ─────────────────────────────────────────
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS_KR = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function buildCalendar(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function CalendarSection() {
  const { year, month, day } = CONFIG.wedding;
  const cells = buildCalendar(year, month);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = CONFIG.wedding.date - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, mins, secs });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="px-6 py-14 bg-white">
      <FadeIn>
        <p className="font-gothic text-xs text-rose-400 tracking-[0.25em] uppercase text-center mb-1">Date</p>
        <p className="font-myeongjo text-center text-stone-700 text-xl mb-8">
          {year}년 {MONTHS_KR[month - 1]} {day}일
        </p>

        {/* Calendar */}
        <div className="rounded-2xl border border-stone-100 p-4 bg-stone-50">
          <p className="font-gothic text-center text-stone-500 text-sm mb-3 tracking-wider">
            {year}.{String(month).padStart(2, '0')}
          </p>
          <div className="grid grid-cols-7 gap-0 mb-1">
            {WEEKDAYS.map((w, i) => (
              <div key={w} className={`text-center font-gothic text-[11px] py-1 ${i === 0 ? 'text-rose-400' : i === 6 ? 'text-blue-400' : 'text-stone-400'}`}>
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((d, idx) => {
              const isWedding = d === day;
              const colIdx = idx % 7;
              let textColor = 'text-stone-600';
              if (colIdx === 0) textColor = 'text-rose-400';
              if (colIdx === 6) textColor = 'text-blue-400';
              return (
                <div key={idx} className="aspect-square flex items-center justify-center">
                  {d ? (
                    isWedding ? (
                      <div className="w-8 h-8 rounded-full bg-rose-400 flex items-center justify-center shadow-md">
                        <span className="font-gothic text-white text-xs font-bold">{d}</span>
                      </div>
                    ) : (
                      <span className={`font-gothic text-xs ${textColor}`}>{d}</span>
                    )
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* D-Day */}
        <div className="mt-8 text-center">
          <p className="font-gothic text-stone-400 text-xs tracking-widest mb-4">
            탁진혁 · 조수민 예식일이 <span className="text-rose-400 font-bold">D-{countdown.days}</span>일 남았습니다
          </p>
          <div className="flex justify-center gap-3">
            {[
              { label: '일', value: countdown.days },
              { label: '시', value: countdown.hours },
              { label: '분', value: countdown.mins },
              { label: '초', value: countdown.secs },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-stone-800 flex items-center justify-center shadow-sm">
                  <motion.span
                    key={value}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-myeongjo text-white text-xl font-bold"
                  >
                    {pad(value)}
                  </motion.span>
                </div>
                <span className="font-gothic text-stone-400 text-[10px] mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

// ─────────────────────────────────────────
// 5. 갤러리 (Lightbox)
// ─────────────────────────────────────────
function GallerySection() {
  const [lightbox, setLightbox] = useState(null);
  const startXRef = useRef(null);

  const handleSwipe = useCallback((dir) => {
    if (lightbox === null) return;
    const next = lightbox + dir;
    if (next >= 0 && next < CONFIG.gallery.length) setLightbox(next);
  }, [lightbox]);

  const onTouchStart = (e) => { startXRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (startXRef.current === null) return;
    const diff = startXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) handleSwipe(diff > 0 ? 1 : -1);
    startXRef.current = null;
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') handleSwipe(1);
      if (e.key === 'ArrowLeft') handleSwipe(-1);
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSwipe]);

  return (
    <section className="py-14 bg-stone-50">
      <FadeIn>
        <p className="font-gothic text-xs text-rose-400 tracking-[0.25em] uppercase text-center mb-8">Gallery</p>
        <div className="grid grid-cols-3 gap-0.5 px-0.5">
          {CONFIG.gallery.map((src, i) => (
            <motion.button
              key={i}
              onClick={() => setLightbox(i)}
              className="aspect-square overflow-hidden"
              whileTap={{ scale: 0.97 }}
            >
              <img
                src={src}
                alt={`웨딩 사진 ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </motion.button>
          ))}
        </div>
      </FadeIn>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X size={20} className="text-white" />
            </button>

            {/* Counter */}
            <p className="absolute top-5 left-0 right-0 text-center font-gothic text-white/60 text-xs">
              {lightbox + 1} / {CONFIG.gallery.length}
            </p>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightbox}
                src={CONFIG.gallery[lightbox]}
                alt=""
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>

            {/* Prev/Next */}
            {lightbox > 0 && (
              <button
                onClick={() => handleSwipe(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <ChevronLeft size={22} className="text-white" />
              </button>
            )}
            {lightbox < CONFIG.gallery.length - 1 && (
              <button
                onClick={() => handleSwipe(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <ChevronRight size={22} className="text-white" />
              </button>
            )}

            {/* Dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5">
              {CONFIG.gallery.map((_, i) => (
                <button key={i} onClick={() => setLightbox(i)}>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all ${i === lightbox ? 'bg-white w-4' : 'bg-white/40'}`} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─────────────────────────────────────────
// 6. 오시는 길
// ─────────────────────────────────────────
const TRANSPORT_TABS = [
  { id: 'subway', label: '지하철', icon: Train },
  { id: 'car', label: '자차', icon: Car },
  { id: 'bus', label: '버스', icon: Bus },
];

const TRANSPORT_INFO = {
  subway: [
    { line: '2호선', info: '잠실역 8번 출구에서 도보 5분' },
    { line: '8호선', info: '잠실역 9번 출구에서 도보 1분' },
  ],
  car: [
    { line: '내비게이션', info: '"잠실 더컨벤션" 검색' },
    { line: '주차', info: '건물 내 주차장 이용 (2시간 무료)' },
    { line: '발렛', info: '정문 앞 발렛파킹 서비스 운영' },
  ],
  bus: [
    { line: '간선버스', info: '30-5, 303, 320번' },
    { line: '지선버스', info: '2412, 3216, 3217번' },
    { line: '정류장', info: '잠실역 정류장 하차 후 도보 2분' },
  ],
};

function LocationSection() {
  const [tab, setTab] = useState('subway');
  const { venue, hall, address, kakaoMapUrl, naverMapUrl } = CONFIG.wedding;

  return (
    <section className="px-6 py-14 bg-white">
      <FadeIn>
        <p className="font-gothic text-xs text-rose-400 tracking-[0.25em] uppercase text-center mb-8">Location</p>

        {/* Venue Info */}
        <div className="text-center mb-6">
          <p className="font-myeongjo text-stone-800 text-xl mb-1">{venue}</p>
          <p className="font-gothic text-stone-400 text-xs mb-1">{hall}</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <MapPin size={12} className="text-rose-300" />
            <p className="font-gothic text-stone-500 text-xs">{address}</p>
          </div>
        </div>

        {/* Static Map */}
        <div className="rounded-2xl overflow-hidden border border-stone-100 mb-4 relative">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
            alt="지도"
            className="w-full h-44 object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-rose-400" />
                <span className="font-gothic text-stone-700 text-sm">{venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <a
            href={kakaoMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-400 active:bg-yellow-500 transition-colors"
          >
            <Navigation size={15} className="text-yellow-900" />
            <span className="font-gothic text-yellow-900 text-sm">카카오맵</span>
          </a>
          <a
            href={naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 active:bg-green-600 transition-colors"
          >
            <Navigation size={15} className="text-white" />
            <span className="font-gothic text-white text-sm">네이버지도</span>
          </a>
        </div>

        {/* Transport Tabs */}
        <div className="rounded-2xl bg-stone-50 overflow-hidden border border-stone-100">
          <div className="flex border-b border-stone-100">
            {TRANSPORT_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-gothic transition-all ${
                  tab === id
                    ? 'bg-white text-rose-500 border-b-2 border-rose-400'
                    : 'text-stone-400'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 space-y-2.5"
            >
              {TRANSPORT_INFO[tab].map(({ line, info }) => (
                <div key={line} className="flex gap-3">
                  <span className="font-gothic text-rose-400 text-xs whitespace-nowrap min-w-[56px]">{line}</span>
                  <span className="font-gothic text-stone-600 text-xs">{info}</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </FadeIn>
    </section>
  );
}

// ─────────────────────────────────────────
// 7. 마음 전하실 곳 (축의금)
// ─────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all ${
        copied ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-400 active:bg-stone-200'
      }`}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? '복사됨' : '복사'}
    </button>
  );
}

function GiftAccordion({ side, name, accounts }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-stone-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white active:bg-stone-50 transition-colors"
      >
        <span className="font-myeongjo text-stone-700 text-[15px]">{side} · {name}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="text-stone-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3 bg-stone-50">
              {accounts.map((acc, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-gothic text-stone-700 text-sm">{acc.holder}</span>
                      {acc.label && (
                        <span className="font-gothic text-[10px] text-white bg-rose-300 px-1.5 py-0.5 rounded-full">{acc.label}</span>
                      )}
                    </div>
                    <p className="font-gothic text-stone-400 text-[11px]">{acc.bank}</p>
                    <p className="font-gothic text-stone-600 text-[13px] mt-0.5 tracking-wider">{acc.number}</p>
                  </div>
                  <CopyButton text={acc.number} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GiftSection() {
  return (
    <section className="px-6 py-14 bg-stone-50">
      <FadeIn>
        <p className="font-gothic text-xs text-rose-400 tracking-[0.25em] uppercase text-center mb-2">Gift</p>
        <p className="font-myeongjo text-stone-600 text-center text-sm mb-8">마음 전하실 곳</p>
        <div className="space-y-3">
          <GiftAccordion
            side="신랑측"
            name={CONFIG.groom.name}
            accounts={CONFIG.groom.accounts}
          />
          <GiftAccordion
            side="신부측"
            name={CONFIG.bride.name}
            accounts={CONFIG.bride.accounts}
          />
        </div>
      </FadeIn>
    </section>
  );
}

// ─────────────────────────────────────────
// 8. 공유하기
// ─────────────────────────────────────────
function ShareSection() {
  const [linkCopied, setLinkCopied] = useState(false);
  const [kakaoState, setKakaoState] = useState('idle'); // 'idle' | 'fallback'

  const handleLinkCopy = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleKakaoShare = async () => {
    const shareData = {
      title: '탁진혁 ♥ 조수민 결혼합니다',
      text: '2026년 9월 13일 일요일 오전 11시\n잠실 더컨벤션 그랜드볼룸',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        if (e.name === 'AbortError') return; // 사용자가 직접 닫음
      }
    }
    // navigator.share 미지원 (PC 등) → 링크 복사 후 안내
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
    setKakaoState('fallback');
    setTimeout(() => setKakaoState('idle'), 3500);
  };

  return (
    <section className="px-6 py-14 bg-white">
      <FadeIn>
        <p className="font-gothic text-xs text-rose-400 tracking-[0.25em] uppercase text-center mb-2">Share</p>
        <p className="font-myeongjo text-stone-600 text-center text-sm mb-8">소중한 분들과 함께 나눠주세요</p>
        <div className="space-y-3">
          <button
            onClick={handleKakaoShare}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all ${
              kakaoState === 'fallback'
                ? 'bg-green-400 active:bg-green-500'
                : 'bg-yellow-400 active:bg-yellow-500'
            }`}
          >
            {kakaoState === 'fallback' ? (
              <Check size={20} className="text-white" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 5.813 2 10.5c0 2.994 1.94 5.623 4.88 7.14l-.93 3.43a.375.375 0 0 0 .548.415L10.5 19.07c.493.05.997.077 1.5.077 5.523 0 10-3.813 10-8.5S17.523 2 12 2z" fill="#3C1E1E"/>
              </svg>
            )}
            <span className={`font-gothic font-bold text-sm ${kakaoState === 'fallback' ? 'text-white' : 'text-yellow-900'}`}>
              {kakaoState === 'fallback' ? '링크 복사됨! 카카오톡에 붙여넣기 하세요' : '카카오톡으로 공유하기'}
            </span>
          </button>
          <button
            onClick={handleLinkCopy}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all ${
              linkCopied ? 'border-green-300 bg-green-50' : 'border-stone-200 bg-white'
            }`}
          >
            {linkCopied ? <Check size={18} className="text-green-500" /> : <Link2 size={18} className="text-stone-400" />}
            <span className={`font-gothic text-sm ${linkCopied ? 'text-green-600' : 'text-stone-500'}`}>
              {linkCopied ? '링크가 복사되었습니다!' : '링크 주소 복사'}
            </span>
          </button>
        </div>
      </FadeIn>
    </section>
  );
}

// ─────────────────────────────────────────
// Footer
// ─────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-stone-800 py-10 text-center">
      <p className="font-myeongjo text-white/80 text-lg tracking-widest mb-1">
        탁진혁 · 조수민
      </p>
      <p className="font-gothic text-white/40 text-xs tracking-wider mb-4">
        2026. 09. 13
      </p>
      <Heart size={14} className="text-rose-400 fill-rose-400 mx-auto" />
    </footer>
  );
}

// ─────────────────────────────────────────
// Main App
// ─────────────────────────────────────────
export default function App() {
  return (
    <div className="flex justify-center w-full bg-stone-200 min-h-screen">
      <div className="mobile-container">
        <CoverSection />

        <div className="w-full">
          {/* Section separator */}
          <div className="py-8 bg-white flex flex-col items-center gap-1">
            <SectionDivider />
          </div>

          <GreetingSection />

          <div className="h-px bg-stone-100 mx-6" />

          <ContactSection />

          <div className="h-px bg-stone-100 mx-6" />

          <CalendarSection />

          <div className="h-2 bg-stone-100" />

          <GallerySection />

          <div className="h-2 bg-stone-100" />

          <LocationSection />

          <div className="h-2 bg-stone-100" />

          <GiftSection />

          <div className="h-2 bg-stone-100" />

          <ShareSection />

          <Footer />
        </div>
      </div>
    </div>
  );
}
