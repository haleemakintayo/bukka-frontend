import React from 'react';
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
} from 'lucide-react';

const stats = [
  { label: 'Avg. order time', value: '45s' },
  { label: 'Sales lift', value: '+32%' },
  { label: 'Active bukkas', value: '120+' },
];

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

const LandingPage = () => {
  return (
    <div className="relative bg-gradient-to-b from-white via-gray-50 to-white dark:from-bukka-dark-surface dark:via-bukka-dark-surface dark:to-bukka-dark-surface text-gray-900 dark:text-bukka-soft-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(18,140,126,0.12),_transparent_45%),radial-gradient(circle_at_80%_30%,_rgba(230,81,0,0.10),_transparent_40%)]" />
      <div className="pointer-events-none absolute left-0 top-1/3 -z-10 h-72 w-72 rounded-full bg-bukka-green/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 -z-10 h-64 w-64 rounded-full bg-bukka-green/10 blur-3xl" />

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-white to-bukka-green/5 dark:from-bukka-dark-surface dark:via-bukka-dark-surface dark:to-bukka-cyan/5 py-24 md:py-32">
        <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-bukka-green/10 blur-3xl" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6600]/20 bg-[#FF6600]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6600]">
                Built for campus bukkas
              </span>
              <h1 className="mt-8 text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase leading-[1.1]">
                stop missing orders. let{' '}
                <span className="text-[#0F6B43] dark:text-bukka-cyan">auntie chioma</span> handle your
                whatsapp chats.
              </h1>
              <p className="mt-6 text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                Bukka AI turns your WhatsApp into an autonomous sales machine.
                Accept orders in Pidgin, calculate totals instantly, and get paid
                with zero fake transfer anxiety.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="bg-bukka-orange text-white hover:bg-[#0c5736] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 rounded-full font-bold px-8 py-4"
                >
                  Join the Beta
                </a>
                <a
                  href="#"
                  className="px-8 py-4 font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-bukka-card-surface border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:bg-bukka-dark-surface hover:shadow-md transition-all duration-300 shadow-sm"
                >
                  Watch Demo
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-bukka-green" />
                  <span>Trusted by vendors across 6 campuses</span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`star-${index}`} size={16} className="text-bukka-green" />
                  ))}
                  <span className="ml-1">4.9/5 vendor rating</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-bukka-card-surface rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl p-6 max-w-md mx-auto w-full">
              <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bukka-orange flex items-center justify-center text-white font-bold tracking-tighter">AC</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-bukka-soft-white leading-tight">WhatsApp Orders</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Live preview</p>
                  </div>
                </div>
                <span className="rounded-full bg-bukka-orange/10 px-3 py-1.5 text-xs font-bold tracking-tight text-[#0F6B43] dark:text-bukka-cyan">
                  Auntie Chioma AI
                </span>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <div className="rounded-2xl bg-gray-100 dark:bg-gray-800 px-4 py-3 text-gray-700 dark:text-gray-300">
                  Abeg I wan 2 plates of jollof + chicken.
                </div>
                <div className="ml-auto rounded-2xl bg-bukka-green/10 px-4 py-3 text-gray-700 dark:text-gray-300">
                  No wahala. Add drink? Coke or Fanta?
                </div>
                <div className="rounded-2xl bg-gray-100 dark:bg-gray-800 px-4 py-3 text-gray-700 dark:text-gray-300">
                  Coke. How much total?
                </div>
                <div className="ml-auto rounded-2xl bg-bukka-green/10 px-4 py-3 text-gray-700 dark:text-gray-300">
                  ₦2,400. Tap to pay and I go send your order to the kitchen.
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-bukka-dark-surface px-4 py-3">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Order Total</span>
                  <span className="font-semibold text-gray-900 dark:text-bukka-soft-white">₦2,400</span>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-full bg-bukka-orange py-3 text-sm font-bold text-white shadow-md hover:bg-[#0c5736] transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-bukka-dark-surface dark:to-bukka-dark-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl bg-white dark:bg-bukka-card-surface border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="mt-3 text-4xl font-extrabold text-gray-900 dark:text-bukka-soft-white tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-bukka-dark-surface">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase">how bukka ai works</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            From scan to payment, the full ordering flow is handled by Auntie Chioma
            without extra apps or hardware.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="bg-white dark:bg-bukka-card-surface p-10 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50 dark:border-gray-800">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6600]/10 text-[#FF6600] font-bold text-lg">
                    {index + 1}
                  </span>
                  <step.icon size={28} className="text-[#0F6B43] dark:text-bukka-cyan" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase mb-3">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-bukka-card-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0F6B43]/20 bg-bukka-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0F6B43] dark:text-bukka-cyan">
                Why vendors choose Bukka AI
              </span>
              <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase leading-[1.1]">
                turn whatsapp into your fastest sales channel
              </h2>
              <p className="mt-6 text-gray-500 dark:text-gray-400 text-lg">
                We combine conversational AI, payments, and order management so
                you can focus on cooking, not chatting.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Instant payment confirmation before cooking',
                  'Structured order tickets for your kitchen',
                  'Better upsells without extra effort',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <CheckCircle2 className="text-[#0F6B43] dark:text-bukka-cyan flex-shrink-0" size={24} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-bukka-card-surface p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-bukka-orange/10 flex items-center justify-center mb-6">
                    <highlight.icon className="text-[#0F6B43] dark:text-bukka-cyan" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-bukka-soft-white text-lg leading-tight">
                    {highlight.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-bukka-dark-surface dark:via-bukka-dark-surface dark:to-bukka-dark-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase">vendors love the clarity</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">
              Clean orders, instant payments, and happier students.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-bukka-card-surface p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-center gap-1.5 text-[#FF6600]">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                </div>
                <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed italic flex-1">"{testimonial.quote}"</p>
                <div className="mt-6 border-t border-gray-50 dark:border-gray-800 pt-4">
                  <div className="text-sm font-bold text-gray-900 dark:text-bukka-soft-white">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-1">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-bukka-card-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-bukka-soft-white">
                Frequently asked questions
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Everything you need to know before onboarding.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-bukka-dark-surface p-5"
                >
                  <summary className="cursor-pointer list-none font-semibold text-gray-900 dark:text-bukka-soft-white flex items-center justify-between">
                    {faq.question}
                    <span className="text-bukka-green font-bold">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl bg-bukka-green px-6 py-12 text-center text-white md:px-12">
            <h2 className="text-3xl font-bold">Ready to scale your Bukka?</h2>
            <p className="mt-3 text-sm md:text-base text-white/80">
              Onboard in minutes and start collecting green alerts today.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 font-semibold text-bukka-green bg-white dark:bg-bukka-card-surface rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Wallet size={18} />
                Get Started Now
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 font-semibold text-white border-2 border-white/60 rounded-xl hover:bg-white dark:bg-bukka-card-surface/10 transition-all"
              >
                <Zap size={18} />
                Talk to Sales
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
