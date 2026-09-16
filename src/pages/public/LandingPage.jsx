import React, { useState, useEffect } from 'react';
import {
  QrCode,
  MessageCircle,
  Wallet,
  ShieldCheck,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';
import bukkaScreenshot from '../../assets/bukkaaiscreenshot.png';
import bukkaScreenshot2 from '../../assets/bukkaaiscreenshot2.png';

const steps = [
  {
    stepNumber: '01',
    title: 'Student Scans QR',
    description:
      'Place our smart acrylic QR code on your tables. Students scan to open WhatsApp instantly with no app downloads required.',
    icon: QrCode,
    bgColor: 'bg-[#FEF08A] dark:bg-[#1C2230]', // Neo Pastel Yellow
    iconBg: 'bg-[#FFE600]',
    badgeBg: 'bg-[#FFE600] text-black',
  },
  {
    stepNumber: '02',
    title: 'AI Takes the Order',
    description:
      'Auntie Chioma chats in relatable Pidgin or English, calculates combos, cross-sells cold drinks, and builds the verified cart.',
    icon: MessageCircle,
    bgColor: 'bg-[#BAE6FD] dark:bg-[#1C2230]', // Neo Pastel Cyan
    iconBg: 'bg-[#2CD6EB]',
    badgeBg: 'bg-[#2CD6EB] text-black',
  },
  {
    stepNumber: '03',
    title: 'Green Alert Payments',
    description:
      'Funds are routed directly to your bank account via Paystack. You only hear the ring and cook when the verified alert drops.',
    icon: Wallet,
    bgColor: 'bg-[#BBF7D0] dark:bg-[#1C2230]', // Neo Pastel Green
    iconBg: 'bg-[#25D366]',
    badgeBg: 'bg-[#25D366] text-black',
  },
];

const highlights = [
  {
    title: 'Zero fake transfer anxiety',
    description: 'Instant automated reconciliation. Only prepare food after the real green alert confirms.',
    icon: ShieldCheck,
    tag: 'SECURITY',
    tagColor: 'bg-[#25D366] text-black',
    accentBorder: 'border-l-4 border-l-[#25D366]',
  },
  {
    title: 'Faster queues, happier students',
    description: 'Slash customer wait time by 60%. Eliminate lunch-hour bottlenecks at your front counter.',
    icon: Clock,
    tag: 'SPEED',
    tagColor: 'bg-[#FFE600] text-black',
    accentBorder: 'border-l-4 border-l-[#FFE600]',
  },
  {
    title: 'Upsell built-in with every meal',
    description: 'Auntie Chioma automatically suggests chilled drinks, extra proteins, and combos right in chat.',
    icon: TrendingUp,
    tag: 'REVENUE',
    tagColor: 'bg-[#FA6131] text-white',
    accentBorder: 'border-l-4 border-l-[#FA6131]',
  },
  {
    title: 'Works on any WhatsApp',
    description: 'No tablet, POS hardware, or complex POS machine needed. Just the WhatsApp already in your pocket.',
    icon: Zap,
    tag: 'SIMPLE',
    tagColor: 'bg-[#2CD6EB] text-black',
    accentBorder: 'border-l-4 border-l-[#2CD6EB]',
  },
];

const testimonials = [
  {
    name: 'Aunty Sade',
    role: 'Main Gate Bukka',
    campus: 'Unilag',
    quote:
      'My WhatsApp used to be pure chaos. Now orders are clean, paid, and ready before I even shout. It has saved me from fake alert boys!',
  },
  {
    name: 'Tosin',
    role: 'Hall 3 Canteen',
    campus: 'OAU',
    quote:
      'Students order in Pidgin and it just works seamlessly. The AI even reminds them to add extra meat and Chapman to their order.',
  },
  {
    name: 'Bayo',
    role: 'Campus Grill House',
    campus: 'FUTA',
    quote:
      'We stopped cooking on promises. Every order printed on our queue is a verified Paystack green alert. Revenue is up 35%.',
  },
];

const faqs = [
  {
    question: 'Do I need a new WhatsApp number?',
    answer: 'No! We connect directly to your existing business or personal WhatsApp number and configure Auntie Chioma for your menu.',
  },
  {
    question: 'How do I get paid for orders?',
    answer: 'All payments are processed securely via Paystack and deposited straight into your Nigerian bank account with instant settlement.',
  },
  {
    question: 'Can I update my menu and prices anytime?',
    answer: 'Yes. You have full control from your vendor portal to add dishes, change prices, or toggle sold-out items in real time.',
  },
  {
    question: 'What if a student wants something not on the menu?',
    answer: 'Auntie Chioma politely explains what is available today and recommends the closest matching delicious combo.',
  },
];

const ScreenshotCarousel = ({ screenshots }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, screenshots.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center max-w-xs sm:max-w-sm mx-auto w-full group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Neo-Brutalist Badges floating on preview */}
      <div className="absolute -top-3 -right-2 sm:-right-4 z-20 px-3 py-1 bg-[#25D366] text-black font-display font-black text-xs uppercase tracking-wider rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000] rotate-3">
        💬 Live in WhatsApp
      </div>
      <div className="absolute -bottom-2 -left-2 sm:-left-4 z-20 px-3 py-1 bg-[#FFE600] text-black font-display font-black text-xs uppercase tracking-wider rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000] -rotate-3">
        ⚡ Paystack Verified
      </div>

      <div className="relative w-full flex justify-center items-center py-2">
        <div className="relative w-full max-w-[280px] sm:max-w-[305px] overflow-hidden rounded-[2.2rem] border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#2CD6EB] bg-white dark:bg-[#111]">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {screenshots.map((img, idx) => (
              <div key={idx} className="w-full flex-shrink-0 flex justify-center items-center bg-[#FAF7EE] dark:bg-[#111] p-1.5">
                <img
                  src={img}
                  alt={`Bukka AI App Preview ${idx + 1}`}
                  className="w-full h-auto object-contain rounded-[1.8rem]"
                />
              </div>
            ))}
          </div>

          {/* Carousel Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous screenshot"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-white dark:bg-[#1C2230] text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center transition-all cursor-pointer z-10"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next screenshot"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-white dark:bg-[#1C2230] text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center transition-all cursor-pointer z-10"
          >
            <ChevronRight size={20} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Chunky Neo-Brutalist Dot Indicators */}
      <div className="mt-5 flex items-center gap-2">
        {screenshots.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-3 rounded-md border-2 border-black dark:border-white transition-all duration-200 cursor-pointer ${
              currentIndex === idx
                ? 'w-8 bg-[#FA6131] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]'
                : 'w-3 bg-white dark:bg-[#1C2230] hover:bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const screenshots = [bukkaScreenshot, bukkaScreenshot2];

  return (
    <div className="bg-[#FAF7EE] dark:bg-[#11141D] text-gray-950 dark:text-gray-100 min-h-screen selection:bg-[#FFE600] selection:text-black">
      
      {/* 1. Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
            <div>
              {/* Sticker Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border-2 border-black dark:border-white bg-[#FFE600] text-black font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] mb-6">
                <Sparkles size={14} className="fill-black" />
                <span>Autonomous WhatsApp Sales For Campus Bukkas</span>
              </div>

              {/* High-Impact Neo-Brutalist Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-gray-950 dark:text-white leading-[1.12]">
                Stop missing orders. Let{' '}
                <span className="relative inline-block px-2.5 py-0.5 mx-1 bg-[#2CD6EB] text-black border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] -rotate-1">
                  Auntie Chioma
                </span>{' '}
                handle your WhatsApp chats.
              </h1>

              {/* Body Text */}
              <p className="mt-6 text-gray-800 dark:text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
                Bukka AI turns your existing WhatsApp into an autonomous sales machine.
                Accept customer orders in Pidgin or English, calculate totals instantly, and get paid
                with <span className="font-bold underline decoration-wavy decoration-[#FA6131]">zero fake transfer anxiety</span>.
              </p>

              {/* Tactile CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/2349060251750"
                  className="inline-flex items-center justify-center gap-2 font-display font-extrabold text-lg uppercase tracking-wide bg-[#FA6131] hover:bg-[#ff7244] text-white px-8 py-3.5 rounded-xl border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  <span>Join the Beta</span>
                  <ArrowRight size={20} className="stroke-[3]" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center font-display font-bold text-lg text-black dark:text-white bg-white dark:bg-[#1C2230] hover:bg-gray-100 dark:hover:bg-[#262C3A] px-8 py-3.5 rounded-xl border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  See How It Works
                </a>
              </div>

              {/* Neo-Brutalist Metrics & Proof Chips */}
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#1C2230] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
                  <Users size={18} className="text-[#FA6131] stroke-[2.5]" />
                  <span className="font-display font-extrabold text-sm">120+ Active Bukkas</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-black dark:border-white bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={`star-${index}`} size={14} className="text-black fill-black" />
                    ))}
                  </div>
                  <span className="font-display font-black text-sm ml-1">4.9/5 Rating</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-black dark:border-white bg-[#2CD6EB] text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
                  <Clock size={18} className="stroke-[2.5]" />
                  <span className="font-display font-extrabold text-sm">Avg 45s Order Time</span>
                </div>
              </div>
            </div>

            {/* Carousel Column */}
            <ScreenshotCarousel screenshots={screenshots} />
          </div>
        </div>
      </section>

      {/* Marquee Ticker Banner (Neo-Brutalist Signature Element) */}
      <div className="overflow-hidden bg-[#FFE600] text-black border-y-3 border-black py-3 select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-display font-black uppercase text-sm md:text-base tracking-wider">
          <span>✦ ZERO FAKE TRANSFERS</span>
          <span>✦ 100% PIDGIN & ENGLISH AI</span>
          <span>✦ DIRECT PAYSTACK SETTLEMENT</span>
          <span>✦ NO EXTRA HARDWARE NEEDED</span>
          <span>✦ SMART TABLE ACRYLIC QR</span>
          <span>✦ 45-SECOND CHECKOUT</span>
          <span>✦ BUILT FOR NIGERIAN CAMPUSES</span>
          <span>✦ ZERO FAKE TRANSFERS</span>
          <span>✦ 100% PIDGIN & ENGLISH AI</span>
          <span>✦ DIRECT PAYSTACK SETTLEMENT</span>
          <span>✦ NO EXTRA HARDWARE NEEDED</span>
          <span>✦ SMART TABLE ACRYLIC QR</span>
          <span>✦ 45-SECOND CHECKOUT</span>
          <span>✦ BUILT FOR NIGERIAN CAMPUSES</span>
        </div>
      </div>

      {/* 2. How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 bg-[#FAF7EE] dark:bg-[#11141D] border-b-3 border-black dark:border-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-md border-2 border-black dark:border-white bg-[#2CD6EB] text-black font-display font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] mb-3">
              THE 3-STEP FLOW
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-gray-950 dark:text-white">
              How Bukka AI Works
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg font-medium">
              From table scan to direct bank alert, Auntie Chioma handles every interaction smoothly with zero new apps or hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.title}
                className={`rounded-2xl border-3 border-black dark:border-white ${step.bgColor} p-7 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl border-2 border-black ${step.iconBg} text-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]`}>
                      <step.icon size={28} className="stroke-[2.5]" />
                    </div>
                    <span className={`px-3 py-1 rounded-md border-2 border-black font-display font-black text-xs tracking-wider shadow-[2px_2px_0px_0px_#000] ${step.badgeBg}`}>
                      STEP {step.stepNumber}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-2xl text-black dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="font-sans text-gray-800 dark:text-gray-300 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features / Why Bukka AI Section */}
      <section id="features" className="py-20 md:py-28 bg-[#FAF7EE] dark:bg-[#11141D] border-b-3 border-black dark:border-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column: Heading & Neo FAQ */}
            <div>
              <span className="inline-block px-3 py-1 rounded-md border-2 border-black dark:border-white bg-[#FF80BF] text-black font-display font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] mb-3">
                BUILT FOR KITCHEN MASTERY
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-gray-950 dark:text-white leading-[1.15]">
                Turn WhatsApp into your fastest sales channel
              </h2>
              <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed">
                We combine conversational AI, instant Paystack reconciliation, and live queue tracking so
                you can focus on cooking hot meals, not texting back and forth.
              </p>
              
              {/* FAQ Accordion in Neo-Brutalist Cards */}
              <div className="mt-12 space-y-4">
                <h3 className="font-display font-black text-xl text-gray-950 dark:text-white mb-4 flex items-center gap-2">
                  <span>Frequently Asked Questions</span>
                </h3>
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-xl border-3 border-black dark:border-white bg-white dark:bg-[#1C2230] p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#2CD6EB] transition-all cursor-pointer"
                  >
                    <summary className="list-none font-display font-bold text-gray-950 dark:text-white flex items-center justify-between text-base">
                      <span>{faq.question}</span>
                      <div className="w-7 h-7 rounded-md border-2 border-black dark:border-white bg-[#FFE600] text-black flex items-center justify-center shadow-[1px_1px_0px_0px_#000] group-open:rotate-180 transition-transform">
                        <ChevronDown size={18} className="stroke-[3]" />
                      </div>
                    </summary>
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed pt-3 border-t-2 border-black/10 dark:border-white/10">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* Right Column: 4 Feature Highlight Cards */}
            <div className="grid sm:grid-cols-2 gap-5">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-2xl border-3 border-black dark:border-white bg-white dark:bg-[#1C2230] p-6 flex flex-col justify-between shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#FA6131] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl border-2 border-black dark:border-white bg-[#FAF7EE] dark:bg-[#121620] text-black dark:text-white flex items-center justify-center shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
                        <highlight.icon className="stroke-[2.5]" size={24} />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-display font-black tracking-wider border-2 border-black shadow-[1px_1px_0px_0px_#000] ${highlight.tagColor}`}>
                        {highlight.tag}
                      </span>
                    </div>
                    <h3 className="font-display font-black text-lg text-gray-950 dark:text-white mb-2 leading-snug">
                      {highlight.title}
                    </h3>
                    <p className="font-sans text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28 bg-[#FAF7EE] dark:bg-[#11141D] border-b-3 border-black dark:border-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-md border-2 border-black dark:border-white bg-[#25D366] text-black font-display font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] mb-3">
              CAMPUS TESTED & APPROVED
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-gray-950 dark:text-white">
              Vendors Love the Clarity
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg font-medium">
              Real bukkas making real money with zero WhatsApp order confusion.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl border-3 border-black dark:border-white bg-white dark:bg-[#1C2230] p-7 flex flex-col justify-between shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="fill-black text-black" />
                    ))}
                  </div>
                  <p className="font-sans text-gray-800 dark:text-gray-200 leading-relaxed text-base font-medium">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="mt-8 pt-4 border-t-2 border-black/10 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-display font-black text-gray-950 dark:text-white text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-0.5">
                      {testimonial.role}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-md border-2 border-black dark:border-white bg-[#2CD6EB] text-black font-display font-extrabold text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                    {testimonial.campus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Neo-Brutalist Billboard CTA Section */}
      <section className="py-20 md:py-28 bg-[#FAF7EE] dark:bg-[#11141D]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl border-4 border-black dark:border-white bg-[#FA6131] text-white p-8 md:p-14 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#2CD6EB] text-center overflow-hidden">
            
            {/* Top Sticker Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FFE600] text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-5">
              <span>🚀 ONBOARD IN 5 MINUTES</span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-tight max-w-2xl mx-auto">
              Ready to scale your Bukka revenue?
            </h2>
            
            <p className="mt-4 text-orange-100 text-lg md:text-xl font-medium max-w-xl mx-auto">
              Equip your tables with smart QR codes and let Auntie Chioma handle the crowd while your bank collects green alerts.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="https://wa.me/2349060251750"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-display font-black text-lg bg-white hover:bg-[#FFE600] text-black rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <Wallet size={22} className="stroke-[2.5]" />
                <span>Get Started on WhatsApp ⚡</span>
              </a>
            </div>

            {/* Micro guarantee badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-display font-bold text-orange-200">
              <Check size={16} className="stroke-[3]" />
              <span>Zero setup fees • Cancel anytime • Direct bank payouts</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;

