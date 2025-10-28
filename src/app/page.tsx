"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/ui/plan-card";

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);

  const onHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tx = ((x / rect.width) - 0.5) * 12;
    const ty = ((y / rect.height) - 0.5) * 12;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);
  };

  const onHeroMouseLeave = () => {
    const el = heroRef.current;
    if (!el) return;
    el.style.setProperty('--tx', '0px');
    el.style.setProperty('--ty', '0px');
  };

  // Collage images (served from public/images/collage)
  const collageImages = [
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457169.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457180.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457206.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457218.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457225.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457240.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457253.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457606.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457610.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457625.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457632.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/P1457651.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/Photo%20Oct%2007%202025,%2010%2049%2033%20AM.jpg',
    'https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/collage/Photo%20Oct%2007%202025,%2011%2003%2017%20AM.jpg'
  ];

  // Only render images that successfully load to avoid empty frames
  const [validCollageImages, setValidCollageImages] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const verify = (src: string) => new Promise<string | null>((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);
      img.src = src;
    });
    Promise.all(collageImages.map(verify)).then(results => {
      if (!isMounted) return;
      setValidCollageImages(results.filter((r): r is string => Boolean(r)));
    });
    return () => { isMounted = false; };
  }, []);

  // Up to 14 collage positions; we will only render as many as we have images (no repeats)
  const collagePositions = [
    { pos: 'top-[5%] left-[10%]', rot: '-rotate-6', z: 1 },
    { pos: 'top-[15%] right-[12%]', rot: 'rotate-3', z: 2 },
    { pos: 'bottom-[20%] left-[15%]', rot: '-rotate-3', z: 3 },
    { pos: 'top-[8%] left-[35%]', rot: 'rotate-6', z: 4 },
    { pos: 'top-[45%] left-[8%]', rot: '-rotate-2', z: 5 },
    { pos: 'bottom-[15%] right-[18%]', rot: 'rotate-4', z: 6 },
    { pos: 'top-[25%] right-[25%]', rot: '-rotate-4', z: 7 },
    { pos: 'bottom-[30%] right-[8%]', rot: 'rotate-2', z: 8 },
    { pos: 'top-[40%] left-[40%]', rot: '-rotate-5', z: 9 },
    { pos: 'bottom-[10%] left-[38%]', rot: 'rotate-1', z: 10 },
    { pos: 'top-[20%] left-[22%]', rot: 'rotate-5', z: 11 },
    { pos: 'bottom-[40%] left-[50%]', rot: '-rotate-1', z: 12 },
    { pos: 'top-[35%] right-[15%]', rot: 'rotate-7', z: 13 },
    { pos: 'bottom-[35%] left-[28%]', rot: '-rotate-3', z: 14 },
  ];

  return (
    <div className="bg-[var(--color-porcelain)]">
      {/* Hero */}
      <section
        ref={heroRef}
        onMouseMove={onHeroMouseMove}
        onMouseLeave={onHeroMouseLeave}
        className="min-h-[85vh] sm:min-h-screen flex items-center justify-center pt-20 sm:pt-28 lg:pt-40 pb-14 sm:pb-20 lg:pb-32 -mt-20 sm:-mt-20 md:-mt-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover will-change-transform hero-zoom"
            style={{
              backgroundImage: "url(https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/P1457240.jpg)",
              transform: "translate3d(var(--tx,0), var(--ty,0), 0) scale(1.06)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute inset-0 pointer-events-none hero-light" />
        </div>
        {/* Watermark - Nutmeg (bottom left) */}
        <img 
          src="/logo/nutmeg.png" 
          alt="" 
          className="absolute bottom-4 left-4 w-16 h-16 sm:w-24 sm:h-24 lg:w-40 lg:h-40 opacity-15 sm:opacity-20 pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-3xl text-white">
            <p className="kicker !text-white/80 mb-4 sm:mb-6">Brown Girl Club</p>
            <h1 className="text-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-md mb-6 sm:mb-8 leading-[1.1]">
              Welcome Home.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed mb-8 sm:mb-12 max-w-2xl">
              A coffee membership crafted for rhythm — daily coffee, real connection, and small luxuries that make big days softer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                variant="primary"
                onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Join the Club
              </Button>
              {/* <Button variant="secondary">Learn More</Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Band */}
      <FeatureBandSection />

      {/* Subscribe Today – inspired by WatchHouse */}
      <SubscribeSection />

      {/* Story */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Watermark - Nutmeg (bottom right) */}
        <img 
          src="/logo/nutmeg.png" 
          alt="" 
          className="absolute bottom-4 right-4 w-20 h-20 sm:w-28 sm:h-28 lg:w-44 lg:h-44 opacity-10 sm:opacity-15 pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-serif text-3xl sm:text-4xl md:text-5xl text-[var(--color-accent)] mb-8 sm:mb-10 md:mb-12 leading-tight">
            Built for balance.
          </h2>
          <div className="space-y-5 sm:space-y-6 md:space-y-8 text-base sm:text-lg md:text-xl text-[var(--color-ink)]/80 leading-relaxed">
            <p>
              Brown Girl Club began at a single café table — where study breaks turned into conversations and coffee became a ritual.
            </p>
            <p>
              We built a membership that makes that feeling last.
            </p>
            <p>
              Less rush, more rhythm. Less noise, more belonging.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--color-accent)] mb-4 leading-tight">
              Simple. Thoughtful. Effortless.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-8">
            <Step number="1" title="Scan to Join">
              Tap the QR in-store or online. Checkout in seconds.
            </Step>
            <Step number="2" title="Get your membership">
              Activation happens at the counter after payment.
            </Step>
            <Step number="3" title="Scan & Enjoy">
              Redeem drinks, track your balance, and get receipts.
            </Step>
            <Step number="4" title="Reset Monthly">
              Your plan renews automatically — pause or resume anytime.
            </Step>
          </div>
        </div>
      </section>

      {/* Signature Coffees – horizontal scroll */}
      <CoffeeScrollSection />

      {/* Who It's For */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 relative overflow-hidden">
        {/* Watermark - Nutmeg (top right) */}
        <img 
          src="/logo/nutmeg.png" 
          alt="" 
          className="absolute top-4 right-4 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 opacity-15 sm:opacity-20 pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-serif text-3xl sm:text-4xl md:text-5xl text-[var(--color-accent)] mb-8 sm:mb-10 md:mb-12 leading-tight">
            For students, creators, and doers.
          </h2>
          <div className="space-y-5 sm:space-y-6 md:space-y-8 text-base sm:text-lg md:text-xl text-[var(--color-ink)]/80 leading-relaxed">
            <p>
              Brown Girl Club isn't a loyalty program. It's a quiet space between the chaos — a reminder to take a break, meet your people, and refuel.
            </p>
            <p>
              If you thrive on intention and community, you belong here.
            </p>
          </div>
        </div>
      </section>

      {/* Polaroid Collage */}
      <section className="py-8 sm:py-12 lg:py-20 overflow-visible">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 overflow-visible">
          {/* Mobile: Simple grid view using local images */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            {validCollageImages.slice(0, 14).map((src, idx) => (
              <Polaroid key={idx} image={src} caption="" rotate="" zIndex={1} />
            ))}
          </div>
          {/* Tablet and Desktop: Collage view with local images */}
          <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] items-center justify-center overflow-visible hidden md:flex">
            {collagePositions.slice(0, Math.min(validCollageImages.length, 14)).map((conf, idx) => (
              <div key={idx} className={`absolute ${conf.pos}`}>
            <Polaroid
                  image={validCollageImages[idx]}
                  caption=""
                  rotate={conf.rot}
                  zIndex={conf.z}
            />
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Watermark - Nutmeg (bottom left) */}
        <img 
          src="/logo/nutmeg.png" 
          alt="" 
          className="absolute bottom-4 left-4 w-20 h-20 sm:w-28 sm:h-28 lg:w-44 lg:h-44 opacity-10 sm:opacity-15 pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-serif text-3xl sm:text-4xl md:text-5xl text-[var(--color-accent)] mb-10 sm:mb-12 md:mb-16 text-center">
            Common Questions
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <FAQItem question="Can I pause my plan?">
              Yes, anytime in your portal.
            </FAQItem>
            <FAQItem question="Do I need an app?">
              No — your membership is managed in your account.
            </FAQItem>
            <FAQItem question="How do I track usage?">
              Your dashboard shows your remaining balance.
            </FAQItem>
            <FAQItem question="What if I need help?">
              Visit your dashboard or contact support.
            </FAQItem>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-16 sm:py-20 md:py-28 lg:py-40 relative overflow-hidden">
        {/* Watermark - Nutmeg (top left) */}
        <img 
          src="/logo/nutmeg.png" 
          alt="" 
          className="absolute top-4 left-4 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 opacity-15 sm:opacity-20 pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="kicker mb-4 sm:mb-6">Ready to slow down?</p>
          <h2 className="text-serif text-4xl sm:text-5xl md:text-6xl text-[var(--color-accent)] mb-6 sm:mb-8 leading-tight">
            At Brown Girl, You are Family.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[var(--color-ink)]/80 leading-relaxed mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
            Join a community built on rhythm, taste, and good energy. Scan in-store or sign up online — your pass arrives in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              variant="primary"
              onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              Join Now
            </Button>
            <Button 
              variant="secondary"
              onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              View Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureBandSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Update active index based on scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.offsetWidth;
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="sm:w-8 sm:h-8">
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="18" y="10" width="28" height="18" rx="2"/>
            <path d="M18 28v10c0 6 4 10 10 10h8c6 0 10-4 10-10V28"/>
            <path d="M12 20h8M44 20h8"/>
          </g>
        </svg>
      ),
      title: "Globally sourced. Locally crafted.",
      description: "A warm cup from across the world, made to feel like home right here at Brown Girl Café."
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="sm:w-8 sm:h-8">
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="12" y="12" width="40" height="28" rx="3"/>
            <path d="M22 50h20M28 44v6M36 44v6"/>
          </g>
        </svg>
      ),
      title: "Modern Coffee. Holistic approach.",
      description: "More than coffee. It’s a space to breathe, connect, and feel grounded when you’re far from home."
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="sm:w-8 sm:h-8">
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 26h24v10c0 6-4 10-10 10h-4c-6 0-10-4-10-10V26z"/>
            <path d="M44 26h6c3 0 6 3 6 6s-3 6-6 6h-6"/>
            <path d="M26 18s2-2 6-2 6 2 6 2"/>
          </g>
        </svg>
      ),
      title: "No two Houses the same.",
      description: "Each Brown Girl Café has its own rhythm, but every one welcomes you like home."
    }
  ];

  return (
    <section className="bg-[var(--color-espresso)] py-6 sm:py-8 lg:py-10 border-t border-white/10">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 items-start">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="shrink-0 text-[var(--color-oat)]">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-serif text-base sm:text-lg lg:text-xl text-[var(--color-oat)] leading-tight">
                  {feature.title}
                </h3>
                <p className="mt-1.5 sm:mt-2 text-sm lg:text-base text-[var(--color-oat)]/80 leading-snug">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Scrollable with Indicators */}
        <div className="md:hidden">
          <div 
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 w-full flex-shrink-0 snap-center px-2"
                >
                  <div className="shrink-0 text-[var(--color-oat)]">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-serif text-base sm:text-lg text-[var(--color-oat)] leading-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 sm:mt-2 text-sm text-[var(--color-oat)]/80 leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center gap-1.5 mt-3">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollRef.current) {
                    const itemWidth = scrollRef.current.offsetWidth;
                    scrollRef.current.scrollTo({
                      left: itemWidth * index,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === index 
                    ? 'bg-[var(--color-oat)]' 
                    : 'bg-[var(--color-oat)]/30'
                }`}
                style={{
                  width: activeIndex === index ? '6px' : '4px',
                  height: '4px',
                  minWidth: activeIndex === index ? '6px' : '4px',
                  minHeight: '4px'
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SubscribeSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<'coffee' | 'meal'>('coffee');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 320 : 460; // Smaller scroll on mobile
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Define plans for both categories and switch based on selection
  const coffeePlans = [
    {
      title: "The Chill Mode",
      description: "Take it slow, sip it right. For the ones who live for good vibes and lazy mornings. Three coffees a week to keep life flavorful, not frantic.",
      price: "$74 USD ($199 EC)",
      savings: "save $65",
      benefits: [
        "Food specials & discounts",
        "Pause, skip or cancel at any time.",
        "Member-only perks"
      ],
      buttonText: "SUBSCRIBE NOW",
      bgColor: "#E7D4AF",
      onButtonClick: () => window.location.href = '/join?plan=3-coffees',
    },
    {
      title: "The Daily Fix",
      description: "Your everyday dose of happy. One coffee a day to keep your mood lifted and your hustle smooth. No day starts without it.",
      price: "$148 USD ($400 EC)",
      savings: "save $216",
      benefits: [
        "1 coffee per day",
        "20% off food items",
        "1 free dessert per week"
      ],
      buttonText: "SUBSCRIBE NOW",
      bgColor: "#F6EBDD",
      onButtonClick: () => window.location.href = '/join?plan=daily-coffee',
    },
    {
      title: "The Double Shot Life",
      description: "Twice the coffee, twice the vibe. Morning grind, afternoon unwind. For the movers, shakers, and dream chasers who need that extra boost.",
      price: "$352 USD ($950 EC)",
      savings: "save $282",
      benefits: [
        "Up to 2 coffees per day (shared)",
        "20% off food items",
        "1 free lunch per week"
      ],
      buttonText: "SUBSCRIBE NOW",
      bgColor: "#E7C1AC",
      onButtonClick: () => window.location.href = '/join?plan=creator',
    },
    {
      title: "The Caffeine Royalty",
      description: "All day. Every day. Own it. Four cups a day — bold, unapologetic, and absolutely on brand for the coffee-obsessed. You don't just drink coffee; you reign with it.",
      price: "$556 USD ($1500 EC)",
      benefits: [
        "Up to 4 coffees per day (shared)",
        "20% off food items",
        "Choice: 1 free breakfast or 1 free lunch per week"
      ],
      buttonText: "SUBSCRIBE NOW",
      bgColor: "#5B3A2F",
      isDark: true,
      onButtonClick: () => window.location.href = '/join?plan=unlimited',
    },
  ] as const;

  const mealPlans = [
    {
      title: "5-Day Meal Prep",
      description: "Five chef-prepared meals for the week. Easy, balanced, and delicious.",
      price: "$446 EC",
      benefits: [
        "$89 EC per day",
        "Pause, skip or cancel at any time.",
        "Member-only perks"
      ],
      buttonText: "SUBSCRIBE NOW",
      bgColor: "#D7E8D4",
      onButtonClick: () => window.location.href = '/join?plan=meal-5',
    },
    {
      title: "10-Day Meal Prep",
      description: "Ten meals to cover two solid weeks of good eating.",
      price: "$837 EC",
      benefits: [
        "$84 EC per day",
        "Flexible scheduling",
        "Member-only perks"
      ],
      buttonText: "SUBSCRIBE NOW",
      bgColor: "#E0F3F1",
      onButtonClick: () => window.location.href = '/join?plan=meal-10',
    },
    {
      title: "15-Day Meal Prep",
      description: "Fifteen meals for consistent rhythm and value.",
      price: "$1175 EC",
      benefits: [
        "$78 EC per day",
        "Pause or skip as needed",
        "Member-only perks"
      ],
      buttonText: "SUBSCRIBE NOW",
      bgColor: "#F3E3F1",
      onButtonClick: () => window.location.href = '/join?plan=meal-15',
    },
    {
      title: "20-Day Meal Prep",
      description: "Twenty meals. Best for full routine coverage.",
      price: "$1458 EC",
      benefits: [
        "$73 EC per day",
        "Flexible scheduling",
        "Member-only perks"
      ],
      buttonText: "SUBSCRIBE NOW",
      bgColor: "#D4E1F7",
      onButtonClick: () => window.location.href = '/join?plan=meal-20',
    },
  ] as const;

  const plansToRender = selectedCategory === 'coffee' ? coffeePlans : mealPlans;

  return (
    <section id="subscribe" className="py-12 sm:py-14 md:py-16 lg:py-24 bg-[var(--color-porcelain)] relative overflow-hidden">
      {/* Watermark - Nutmeg (top left) */}
      <img 
        src="/logo/nutmeg.png" 
        alt="" 
        className="absolute top-3 left-3 w-20 h-20 sm:w-28 sm:h-28 lg:w-44 lg:h-44 opacity-15 sm:opacity-20 pointer-events-none"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Intro + Toggle */}
        <div className="mb-8 sm:mb-10 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--color-accent)] leading-[1.1] mb-4 sm:mb-6">
              Subscribe<br />Today & Save
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[var(--color-ink)]/70 leading-relaxed max-w-lg">
              Subscribe for a never‑ending cup and member perks. Calm, effortless, good value.
            </p>
          </div>
          <div className="md:mb-1">
            <div className="inline-flex items-center bg-white border border-[var(--color-accent)]/20 rounded-full p-1">
              <button
                onClick={() => setSelectedCategory('coffee')}
                className={`${selectedCategory === 'coffee' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-accent)]'} px-4 py-2 rounded-full text-sm font-semibold transition-colors`}
                aria-pressed={selectedCategory === 'coffee'}
              >
                Coffee
              </button>
              <button
                onClick={() => setSelectedCategory('meal')}
                className={`${selectedCategory === 'meal' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-accent)]'} px-4 py-2 rounded-full text-sm font-semibold transition-colors`}
                aria-pressed={selectedCategory === 'meal'}
              >
                Meal Prep
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Cards with Navigation */}
        <div className="relative">
          {/* Mobile: Full width scroll container with gradient hint */}
          <div className="md:hidden relative -mx-5">
            <div 
              ref={scrollRef}
              className="overflow-x-scroll overflow-y-hidden pb-4 snap-x snap-mandatory"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="flex gap-4 px-5">
                {plansToRender.map((plan, idx) => (
                  <CleanSubscriptionCard
                    key={`mobile-${selectedCategory}-${idx}`}
                    title={plan.title}
                    description={plan.description}
                    price={plan.price}
                    savings={(plan as any).savings}
                    benefits={plan.benefits as any}
                    buttonText={plan.buttonText}
                    bgColor={plan.bgColor}
                    isDark={(plan as any).isDark}
                    onButtonClick={plan.onButtonClick}
                  />
                ))}
              </div>
            </div>
            {/* Scroll indicator gradient - right edge */}
            <div className="absolute top-0 right-0 bottom-4 w-16 bg-gradient-to-l from-[var(--color-porcelain)] via-[var(--color-porcelain)]/70 to-transparent pointer-events-none" />
            {/* Animated scroll hint */}
            <div className="absolute bottom-10 right-6 flex items-center gap-1.5 text-[var(--color-accent)]/50 text-[11px] font-medium animate-pulse">
              <span className="tracking-wide">Swipe</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce-x">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Tablet/Desktop: Container with arrows */}
          <div className="hidden md:flex items-center gap-2 sm:gap-4">
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 flex items-center justify-center transition-all duration-200 text-[var(--color-accent)]"
              aria-label="Scroll left"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Scroll Container */}
            <div 
              ref={scrollRef}
              className="overflow-x-auto overflow-y-hidden flex-grow pb-4 sm:pb-6 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-4 sm:gap-5 md:gap-6 min-w-max">
                {plansToRender.map((plan, idx) => (
                  <CleanSubscriptionCard
                    key={`desktop-${selectedCategory}-${idx}`}
                    title={plan.title}
                    description={plan.description}
                    price={plan.price}
                    savings={(plan as any).savings}
                    benefits={plan.benefits as any}
                    buttonText={plan.buttonText}
                    bgColor={plan.bgColor}
                    isDark={(plan as any).isDark}
                    onButtonClick={plan.onButtonClick}
                  />
                ))}
              </div>
          </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 flex items-center justify-center transition-all duration-200 text-[var(--color-accent)]"
              aria-label="Scroll right"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-porcelain)]/50 rounded-xl p-5 sm:p-6 lg:p-8">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-base sm:text-lg font-semibold mb-4 sm:mb-5">
        {number}
      </div>
      <h3 className="text-serif text-lg sm:text-xl lg:text-2xl text-[var(--color-accent)] mb-2 sm:mb-3 font-normal">
        {title}
      </h3>
      <p className="text-sm lg:text-base text-[var(--color-ink)]/70 leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function PerkItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] mt-3 flex-shrink-0" />
      <span className="text-xl text-[var(--color-ink)]/80 leading-relaxed">{children}</span>
          </li>
  );
}

function Testimonial({ author, children }: { author: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-[var(--color-accent)]/10">
      <p className="text-lg text-[var(--color-ink)] leading-relaxed mb-6 italic">
        "{children}"
      </p>
      <p className="text-sm font-bold text-[var(--color-accent)] uppercase tracking-wide">
        {author}
      </p>
    </div>
  );
}

function FAQItem({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--color-accent)]/10 pb-6 sm:pb-8">
      <h3 className="text-lg sm:text-xl font-bold text-[var(--color-accent)] mb-2 sm:mb-3">
        {question}
      </h3>
      <p className="text-base sm:text-lg text-[var(--color-ink)]/70 leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function CoffeeScrollSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--color-accent)] leading-tight mb-4 sm:mb-6">
            Our signature coffees.
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-ink)]/80 leading-relaxed max-w-2xl">
            From smooth Rituals to expressive Horizons — a calm, modern spectrum of flavour.
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 flex items-center justify-center transition-all duration-200 text-[var(--color-accent)]"
            aria-label="Scroll left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Horizontal scroll container */}
          <div 
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden flex-grow pb-4 sm:pb-6 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 sm:gap-5 lg:gap-8 min-w-max">
              <CoffeeCard 
                image="https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/P1457231.jpg"
                name="Grenadian Mocha"
              />
              <CoffeeCard 
                image="https://eouiynfsgaiavzvlfwpa.supabase.co/storage/v1/object/public/club_img/aerochino.jpg"
                name="Aerochino"
              />
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 flex items-center justify-center transition-all duration-200 text-[var(--color-accent)]"
            aria-label="Scroll right"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function CleanSubscriptionCard({
  title,
  description,
  price,
  savings,
  benefits,
  buttonText,
  bgColor,
  isDark = false,
  onButtonClick,
}: {
  title: string;
  description: string;
  price: string;
  savings?: string;
  benefits: string[];
  buttonText: string;
  bgColor: string;
  isDark?: boolean;
  onButtonClick?: () => void;
}) {
  const textColor = isDark ? "text-white" : "text-[var(--color-accent)]";
  const secondaryTextColor = isDark ? "text-white/80" : "text-[var(--color-ink)]/70";
  const borderColor = isDark ? "border-white/20" : "border-[var(--color-ink)]/15";
  const iconColor = isDark ? "text-white" : "text-[var(--color-accent)]";

  // Split price to render EC value smaller if provided in brackets
  const priceParts = price.match(/^(.*?)(\s*\(.*\))$/);
  const priceMain = priceParts ? priceParts[1].trim() : price;
  const priceBracket = priceParts ? priceParts[2] : '';
  const ecText = priceBracket ? priceBracket.replace(/^\s*\(|\)\s*$/g, '') : '';

  // Derive conversion rate from displayed price, and compute savings per currency
  const usdMatch = priceMain.match(/\$\s*([0-9]+(?:\.[0-9]+)?)\s*USD/i);
  const ecMatch = ecText.match(/\$\s*([0-9]+(?:\.[0-9]+)?)\s*EC/i);
  const usdPrice = usdMatch ? parseFloat(usdMatch[1]) : undefined;
  const ecPrice = ecMatch ? parseFloat(ecMatch[1]) : undefined;
  const rateEcPerUsd = usdPrice && ecPrice && usdPrice > 0 ? (ecPrice / usdPrice) : 2.7;

  // Savings provided are in EC; compute both
  const ecSavingsMatch = (savings || '').match(/([0-9]+(?:\.[0-9]+)?)/);
  const ecSavings = ecSavingsMatch ? parseFloat(ecSavingsMatch[1]) : undefined;
  const usdSavings = ecSavings !== undefined && rateEcPerUsd > 0 ? Math.round(ecSavings / rateEcPerUsd) : undefined;

  return (
    <div
      className="rounded-2xl sm:rounded-3xl flex flex-col w-[85vw] sm:w-[320px] md:w-[380px] lg:w-[450px] flex-shrink-0 snap-start"
      style={{ backgroundColor: bgColor }}
    >
      {/* Content Section */}
      <div className="p-6 sm:p-7 md:p-8 lg:p-10 flex flex-col h-full">
        <div className="flex-grow">
          <h3 className={`text-serif text-xl sm:text-2xl lg:text-3xl ${textColor} mb-3 sm:mb-4 leading-tight`}>
            {title}
          </h3>
          <p className={`text-sm sm:text-base ${secondaryTextColor} leading-relaxed mb-5 sm:mb-6`}>
            {description}
          </p>
          <div className="flex items-baseline gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div>
              <p className={`text-2xl sm:text-3xl lg:text-4xl ${textColor} font-light`}>
                {priceMain}
                {usdSavings !== undefined && (
                  <span className={`ml-2 align-baseline text-xs sm:text-sm ${secondaryTextColor}`}>save ${usdSavings} USD</span>
                )}
              </p>
              {ecText && (
                <p className={`mt-0.5 text-xs sm:text-sm ${secondaryTextColor}`}>
                  {ecText}
                  {ecSavings !== undefined && (
                    <span className="ml-2">save ${Math.round(ecSavings)} EC</span>
              )}
                </p>
            )}
            </div>
          </div>

          {/* Subscribe Today Section */}
          <div className={`border-t ${borderColor} pt-5 sm:pt-6 mb-5 sm:mb-6`}>
            <h4 className={`text-serif text-lg sm:text-xl ${textColor} mb-4 sm:mb-5`}>
              Subscribe today & Save
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2.5 sm:gap-3">
                  <svg 
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor} flex-shrink-0 mt-0.5`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <span className={`text-xs sm:text-sm lg:text-base ${secondaryTextColor} leading-relaxed`}>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Button */}
        <button 
          onClick={onButtonClick}
          className={`w-full ${isDark ? 'bg-white text-[var(--color-accent)] hover:bg-white/90' : 'bg-[var(--color-porcelain)] text-[var(--color-accent)] hover:bg-white'} font-bold text-xs sm:text-sm tracking-widest py-3.5 sm:py-4 px-5 sm:px-6 rounded-full transition-colors duration-200`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

// Lightweight parallax card (CSS only – performant)
function ParallaxCard({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-[var(--color-accent)]/10 bg-white">
      <div
        className="h-[38vh] lg:h-[48vh] bg-center bg-cover will-change-transform"
        style={{ backgroundImage: `url(${image})`, backgroundAttachment: "fixed" }}
      />
      <div className="p-6">
        <h3 className="text-serif text-2xl text-[var(--color-accent)] mb-1">{title}</h3>
        <p className="text-[var(--color-ink)]/70">{subtitle}</p>
      </div>
    </div>
  );
}

// Plain parallax image block with rounded frame
function ParallaxImage({
  image,
  alt,
  heightClass,
}: {
  image: string;
  alt: string;
  heightClass?: string;
}) {
  return (
    <div className="overflow-hidden">
      <div
        role="img"
        aria-label={alt}
        className={`${heightClass ?? "h-[60vh]"} bg-center bg-cover will-change-transform`}
        style={{ backgroundImage: `url(${image})`, backgroundAttachment: "fixed" }}
      />
    </div>
  );
}

function Polaroid({
  image,
  caption,
  rotate,
  zIndex,
}: {
  image: string;
  caption: string;
  rotate?: string;
  zIndex?: number;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const img = new window.Image();
    img.onload = () => { if (isMounted) setIsLoaded(true); };
    img.onerror = () => { if (isMounted) setIsLoaded(false); };
    img.src = image;
    return () => { isMounted = false; };
  }, [image]);

  if (!isLoaded) return null;
  return (
    <figure 
      className={`relative bg-white p-2.5 sm:p-3 md:p-4 border border-[var(--color-ink)]/10 rounded-sm transition-transform duration-200 ease-out cursor-pointer hover:scale-110 sm:hover:scale-[1.4] hover:rotate-0 hover:!z-[1000] will-change-transform ${rotate ?? ''}`}
      style={{ 
        zIndex: zIndex ?? 1,
      }}
    >
      <img
        src={image}
        alt=""
        className="w-full aspect-[4/5] sm:w-[160px] sm:h-[200px] md:w-[200px] md:h-[240px] object-cover object-center block"
        loading="eager"
        decoding="async"
      />
      <figcaption className="text-[9px] sm:text-[10px] md:text-xs text-[var(--color-ink)]/70 mt-1.5 sm:mt-2 text-center">
        {caption}
      </figcaption>
    </figure>
  );
}

function CoffeeCard({
  image,
  name,
}: {
  image: string;
  name: string;
}) {
  return (
    <div className="flex-none w-[85vw] sm:w-[75vw] md:w-[60vw] lg:w-[50vw]">
      <div 
        className="h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[75vh] bg-cover bg-center rounded-lg overflow-hidden"
        style={{ backgroundImage: `url("${encodeURI(image)}")` }}
      />
      <div className="mt-3 sm:mt-4">
        <h3 className="text-serif text-xl sm:text-2xl lg:text-3xl text-[var(--color-accent)]">
          {name}
        </h3>
      </div>
    </div>
  );
}
