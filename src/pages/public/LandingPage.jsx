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
    <div className="relative bg-gradient-to-b from-white via-gray-50 to-white text-gray-900">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(18,140,126,0.12),_transparent_45%),radial-gradient(circle_at_80%_30%,_rgba(230,81,0,0.10),_transparent_40%)]" />
      <div className="pointer-events-none absolute left-0 top-1/3 -z-10 h-72 w-72 rounded-full bg-bukka-green/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 -z-10 h-64 w-64 rounded-full bg-bukka-green/10 blur-3xl" />

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-white to-bukka-green/10 py-20 md:py-28">
        <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-bukka-green/10 blur-3xl" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-bukka-green/20 bg-bukka-green/10 px-4 py-1 text-xs font-semibold text-bukka-green">
                Built for campus bukkas
              </span>
              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-tight">
                Stop Missing Orders. Let{' '}
                <span className="text-bukka-green">Auntie Chioma</span> Handle Your
                WhatsApp Chats.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
                Bukka AI turns your WhatsApp into an autonomous sales machine.
                Accept orders in Pidgin, calculate totals instantly, and get paid
                with zero fake transfer anxiety.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="px-10 py-4 font-semibold text-white bg-bukka-green rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Join the Beta
                </a>
                <a
                  href="#"
                  className="px-10 py-4 font-semibold text-bukka-green border-2 border-bukka-green rounded-xl hover:bg-bukka-green/10 transition-all"
                >
                  Watch Demo
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-gray-600">
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

            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    WhatsApp Orders
                  </p>
                  <p className="text-xs text-gray-500">Live preview</p>
                </div>
                <span className="rounded-full bg-bukka-green/10 px-3 py-1 text-xs font-semibold text-bukka-green">
                  Auntie Chioma AI
                </span>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <div className="rounded-2xl bg-gray-100 px-4 py-3 text-gray-700">
                  Abeg I wan 2 plates of jollof + chicken.
                </div>
                <div className="ml-auto rounded-2xl bg-bukka-green/10 px-4 py-3 text-gray-700">
                  No wahala. Add drink? Coke or Fanta?
                </div>
                <div className="rounded-2xl bg-gray-100 px-4 py-3 text-gray-700">
                  Coke. How much total?
                </div>
                <div className="ml-auto rounded-2xl bg-bukka-green/10 px-4 py-3 text-gray-700">
                  ₦2,400. Tap to pay and I go send your order to the kitchen.
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Order Total</span>
                  <span className="font-semibold text-gray-900">₦2,400</span>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full rounded-xl bg-bukka-green py-2 text-sm font-semibold text-white shadow-md"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-white to-bukka-green/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
              >
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">How Bukka AI Works</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            From scan to payment, the full ordering flow is handled by Auntie Chioma
            without extra apps or hardware.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bukka-green/10 text-bukka-green font-semibold">
                    {index + 1}
                  </span>
                  <step.icon size={24} className="text-bukka-green" />
                </div>
                <h3 className="text-xl font-bold mt-6 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-bukka-green/20 bg-bukka-green/10 px-4 py-1 text-xs font-semibold text-bukka-green">
                Why vendors choose Bukka AI
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
                Turn WhatsApp into your fastest sales channel
              </h2>
              <p className="mt-4 text-gray-600">
                We combine conversational AI, payments, and order management so
                you can focus on cooking, not chatting.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Instant payment confirmation before cooking',
                  'Structured order tickets for your kitchen',
                  'Better upsells without extra effort',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="text-bukka-green" size={18} />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm"
                >
                  <highlight.icon className="text-bukka-green" size={24} />
                  <h3 className="mt-4 font-semibold text-gray-900">
                    {highlight.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Vendors love the clarity</h2>
            <p className="mt-3 text-gray-600">
              Clean orders, instant payments, and happier students.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 text-bukka-green">
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                </div>
                <p className="mt-4 text-gray-700">"{testimonial.quote}"</p>
                <div className="mt-4 text-sm font-semibold text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-xs text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Frequently asked questions
              </h2>
              <p className="mt-3 text-gray-600">
                Everything you need to know before onboarding.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-gray-100 bg-gray-50 p-5"
                >
                  <summary className="cursor-pointer list-none font-semibold text-gray-900 flex items-center justify-between">
                    {faq.question}
                    <span className="text-bukka-green font-bold">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600">{faq.answer}</p>
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
                className="inline-flex items-center justify-center gap-2 px-10 py-4 font-semibold text-bukka-green bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Wallet size={18} />
                Get Started Now
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 font-semibold text-white border-2 border-white/60 rounded-xl hover:bg-white/10 transition-all"
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
