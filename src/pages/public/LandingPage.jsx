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
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import bukkaScreenshot from '../../assets/bukkaaiscreenshot.png';
import bukkaScreenshot2 from '../../assets/bukkaaiscreenshot2.png';

const steps = [
  {
    title: 'Student Scans QR',
    description:
      'Place our smart acrylic QR code on your tables. Students scan to open WhatsApp instantly.',
    icon: QrCode,
  },
  {
    title: 'AI Takes the Order',
    description:
      'Auntie Chioma chats in relatable Pidgin, cross-sells drinks, and builds the cart.',
    icon: MessageCircle,
  },
  {
    title: 'Green Alert Payments',
    description:
      'Funds are routed directly to your bank account via Paystack. You only cook when the alert drops.',
    icon: Wallet,
  },
];

const highlights = [
  {
    title: 'Zero fake transfer anxiety',
    description: 'Only cook after the green alert hits your account.',
    icon: ShieldCheck,
  },
  {
    title: 'Faster queues, happier students',
    description: 'Reduce wait times with instant menu capture.',
    icon: Clock,
  },
  {
    title: 'Upsell built-in',
    description: 'AI recommends drinks, sides, and combos in-chat.',
    icon: TrendingUp,
  },
  {
    title: 'Works on any WhatsApp',
    description: 'No new app. Just the WhatsApp your customers already use.',
    icon: Zap,
  },
];

const testimonials = [
  {
    name: 'Aunty Sade',
    role: 'Main Gate Bukka',
    quote:
      'My WhatsApp used to be chaos. Now orders are clean, paid, and ready before I even shout.',
  },
  {
    name: 'Tosin',
    role: 'Hall 3 Canteen',
    quote:
      'Students order in Pidgin and it just works. The AI even reminds them to add drinks.',
  },
  {
    name: 'Bayo',
    role: 'Campus Grill',
    quote: 'We stopped cooking for fake transfers. Every order is a green alert.',
  },
];

const faqs = [
  {
    question: 'Do I need a new WhatsApp number?',
    answer: 'No. We connect to your existing number and configure the AI flow for you.',
  },
  {
    question: 'How do I get paid?',
    answer: 'Payments are collected via Paystack and sent straight to your bank account.',
  },
  {
    question: 'Can I update my menu anytime?',
    answer: 'Yes. Update items, prices, and availability from your dashboard in seconds.',
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
      className="flex flex-col items-center justify-center max-w-xs sm:max-w-sm mx-auto w-full group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full flex justify-center items-center py-2">
        <div className="relative w-full max-w-[280px] sm:max-w-[300px] overflow-hidden rounded-[2.2rem] shadow-2xl border border-gray-200 dark:border-gray-800">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {screenshots.map((img, idx) => (
              <div key={idx} className="w-full flex-shrink-0 flex justify-center items-center bg-gray-50 dark:bg-[#111] p-1">
                <img
                  src={img}
                  alt={`Bukka AI App Preview ${idx + 1}`}
                  className="w-full h-auto object-contain rounded-[2rem]"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous screenshot"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-lg"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next screenshot"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-lg"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {screenshots.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? 'w-8 bg-[#FA6131] shadow-sm'
                : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
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
    <div className="bg-gray-50 dark:bg-bukka-dark-surface text-gray-900 dark:text-gray-100 min-h-screen">
      {/* 1. Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white leading-tight">
                Stop missing orders. Let <span className="text-bukka-cyan">Auntie Chioma</span> handle your WhatsApp chats.
              </h1>
              <p className="mt-6 text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                Bukka AI turns your WhatsApp into an autonomous sales machine.
                Accept orders in Pidgin, calculate totals instantly, and get paid
                with zero fake transfer anxiety.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/2349012345678"
                  className="bg-[#FA6131] text-white hover:bg-[#E65100] transition-colors duration-200 rounded-full font-bold px-8 py-3 text-center text-lg"
                >
                  Join the Beta
                </a>
                <a
                  href="#how-it-works"
                  className="px-8 py-3 font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-bukka-card-surface border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-[#2A3142] transition-colors duration-200 text-center text-lg"
                >
                  See How It Works
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-gray-400" />
                  <span className="font-medium">120+ active bukkas</span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`star-${index}`} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                  <span className="ml-1">4.9/5 vendor rating</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Clock size={18} className="text-gray-400" />
                  <span>Avg 45s order time</span>
                </div>
              </div>
            </div>

            <ScreenshotCarousel screenshots={screenshots} />
          </div>
        </div>
      </section>

      {/* 2. How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-bukka-card-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-bukka-soft-white">
              How Bukka AI Works
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
              From scan to payment, the full ordering flow is handled by Auntie Chioma
              without extra apps or hardware.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex flex-col text-left"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg">
                    {index + 1}
                  </span>
                  <step.icon size={28} className="text-gray-900 dark:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features / Why Bukka AI */}
      <section id="features" className="py-20 md:py-28 bg-gray-50 dark:bg-bukka-dark-surface border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-bukka-soft-white leading-tight">
                Turn WhatsApp into your fastest sales channel
              </h2>
              <p className="mt-6 text-gray-600 dark:text-gray-400 text-lg">
                We combine conversational AI, payments, and order management so
                you can focus on cooking, not chatting.
              </p>
              
              <div className="mt-12 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white mb-4">Frequently Asked Questions</h3>
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-bukka-card-surface p-4 cursor-pointer"
                  >
                    <summary className="list-none font-semibold text-gray-900 dark:text-bukka-soft-white flex items-center justify-between">
                      {faq.question}
                      <ChevronDown size={18} className="text-gray-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-bukka-card-surface p-6 flex flex-col"
                >
                  <div className="w-10 h-10 flex items-center mb-4">
                    <highlight.icon className="text-gray-900 dark:text-white" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-bukka-soft-white mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials */}
      <section id="testimonials" className="py-20 md:py-28 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-bukka-card-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-bukka-soft-white">
              Vendors love the clarity
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
              Clean orders, instant payments, and happier students.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-bukka-dark-surface p-8 flex flex-col"
              >
                <div className="flex items-center gap-1 text-yellow-500 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1 text-lg">"{testimonial.quote}"</p>
                <div className="mt-8">
                  <div className="font-bold text-gray-900 dark:text-bukka-soft-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-bukka-dark-surface border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-bukka-soft-white">
            Ready to scale your Bukka?
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            Onboard in minutes and start collecting green alerts today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://wa.me/2349012345678"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 font-bold text-white bg-[#FA6131] hover:bg-[#E65100] transition-colors duration-200 rounded-full text-lg"
            >
              <Wallet size={20} />
              Get Started Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
