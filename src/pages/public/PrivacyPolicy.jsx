import React, { useEffect } from 'react';
import { ShieldCheck, Mail, ArrowLeft, Trash2, Lock, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const CONTACT_EMAIL = 'hello@bukkaai.com';

export default function PrivacyPolicy() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-[#FAF7EE] dark:bg-[#11141D] py-12 px-4 md:px-8 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#1C2230] text-sm font-display font-extrabold text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <Link
            to="/terms"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black dark:border-white bg-[#FFE600] text-sm font-display font-extrabold text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <FileText size={16} />
            Read Terms of Service
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="rounded-3xl border-3 border-black dark:border-white bg-[#25D366] p-8 md:p-10 text-black shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex-shrink-0">
            <ShieldCheck className="w-10 h-10 text-black" />
          </div>
          <div>
            <span className="inline-block bg-black text-[#FFE600] text-xs px-3 py-1 rounded-md font-display font-black uppercase tracking-wider mb-3">
              Legal &amp; Compliance • NDPA
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-black">
              Privacy Policy
            </h1>
            <p className="text-black/85 max-w-2xl text-base mt-2 font-medium leading-relaxed">
              Bukka AI respects your privacy. This policy explains clearly what information we collect, how we use it to process food orders and run vendor tools, and how you can manage or delete your data.
            </p>
            <p className="text-xs font-display font-bold uppercase tracking-wider text-black/75 mt-3">
              Effective Date: November 20, 2026 • Jurisdiction: Federal Republic of Nigeria
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="rounded-3xl border-3 border-black dark:border-white bg-white dark:bg-[#1C2230] p-7 md:p-11 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] space-y-8 leading-relaxed text-gray-800 dark:text-gray-200">
          <p className="text-base md:text-lg font-medium">
            Bukka AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) provides conversational AI ordering assistance, online storefront menus, and merchant order-management tools (&quot;Services&quot;). This Privacy Policy applies to customers placing food orders via our website or WhatsApp integration, as well as food vendors operating stores on our platform, in compliance with the <strong>Nigeria Data Protection Act (NDPA)</strong>.
          </p>

          {/* 1. Data Controller & Contact */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white">
              1. Who We Are &amp; How to Contact Us
            </h2>
            <p>
              Bukka AI acts as a Data Controller for registered vendor accounts and website operations, and processes customer order and messaging data to connect customers with their chosen food vendors.
            </p>
            <div className="inline-flex items-center gap-3 bg-[#FAF7EE] dark:bg-[#11141D] border-2 border-black dark:border-white p-4 rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
              <Mail className="w-5 h-5 text-[#FA6131] flex-shrink-0" />
              <div className="text-sm">
                <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Privacy &amp; Support Contact
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-black dark:text-white hover:text-[#FA6131] underline font-display font-black text-base"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </section>

          {/* 2. Information We Collect */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white">
              2. Information We Collect
            </h2>
            <p>We collect only the information required to process food orders, route payments, and operate vendor storefronts:</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-[#FAF7EE] dark:bg-[#11141D] p-5 rounded-2xl border-2 border-black dark:border-white">
                <h3 className="font-display font-black text-black dark:text-white text-base mb-1.5">
                  Customer Order &amp; Contact Data
                </h3>
                <p className="text-sm">
                  Your name, phone number or WhatsApp identifier, selected vendor, order items, pickup or delivery preference, delivery area, street/hostel address, and optional delivery notes.
                </p>
              </div>

              <div className="bg-[#FAF7EE] dark:bg-[#11141D] p-5 rounded-2xl border-2 border-black dark:border-white">
                <h3 className="font-display font-black text-black dark:text-white text-base mb-1.5">
                  Conversation &amp; Session Records
                </h3>
                <p className="text-sm">
                  Messages exchanged with our ordering assistant on WhatsApp or supported chat channels, along with active cart and checkout status so your order flows accurately.
                </p>
              </div>

              <div className="bg-[#FAF7EE] dark:bg-[#11141D] p-5 rounded-2xl border-2 border-black dark:border-white">
                <h3 className="font-display font-black text-black dark:text-white text-base mb-1.5">
                  Payment Transaction Metadata
                </h3>
                <p className="text-sm">
                  Payment references, checkout IDs, amounts, and confirmation status (e.g., pending, paid, or failed). <strong>We never collect or store your card numbers, CVV, or bank PINs</strong>—card and transfer payments are handled directly by our licensed payment partners.
                </p>
              </div>

              <div className="bg-[#FAF7EE] dark:bg-[#11141D] p-5 rounded-2xl border-2 border-black dark:border-white">
                <h3 className="font-display font-black text-black dark:text-white text-base mb-1.5">
                  Vendor &amp; Essential Technical Data
                </h3>
                <p className="text-sm">
                  For merchants: store name, owner name, contact phone/chat ID, menu items, rider contacts, and bank payout details verified via payment partners. On the web, we use strictly functional browser storage (theme preference and authenticated session tokens) with no third-party ad trackers.
                </p>
              </div>
            </div>
          </section>

          {/* 3. How We Use Your Information */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-3">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white">
              3. How We Use Your Information
            </h2>
            <p>We use personal data strictly for the following purposes:</p>
            <ul className="space-y-2.5 list-disc pl-5">
              <li>
                <strong>Order Taking &amp; AI Assistance:</strong> Processing your chat messages through real-time automated language understanding so our assistant (&quot;Auntie Chioma&quot;) can answer menu questions, build your cart, and confirm order details. <em>We do not sell your conversations or use your personal chats to train public AI models.</em>
              </li>
              <li>
                <strong>Order Preparation &amp; Delivery:</strong> Transmitting order items, contact numbers, and delivery instructions to your selected food vendor and their assigned delivery rider.
              </li>
              <li>
                <strong>Order Status Notifications:</strong> Sending real-time updates when your payment is verified, accepted by the kitchen, ready for pickup, or out for delivery.
              </li>
              <li>
                <strong>Payments &amp; Merchant Payouts:</strong> Confirming payment settlement and routing order funds to vendors through licensed payment processors.
              </li>
              <li>
                <strong>Security, Fraud Prevention &amp; Support:</strong> Preventing duplicate or fraudulent orders, maintaining reliable service performance, and resolving customer or vendor inquiries sent to {CONTACT_EMAIL}.
              </li>
            </ul>
          </section>

          {/* 4. Lawful Basis Under NDPA */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-3">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white">
              4. Lawful Basis for Processing (NDPA)
            </h2>
            <p>Under the Nigeria Data Protection Act, we process personal data only where at least one lawful basis applies:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Contractual Necessity:</strong> To take, process, confirm, and fulfill food orders you initiate, or to provide vendor storefront services.</li>
              <li><strong>Consent:</strong> When you initiate a WhatsApp conversation or submit your information at checkout or vendor onboarding.</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable Nigerian financial, tax, and regulatory requirements.</li>
              <li><strong>Legitimate Interests:</strong> To prevent fake payment alerts, fraud, and system abuse while keeping the service responsive.</li>
            </ul>
          </section>

          {/* 5. How We Share Information */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-3">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white">
              5. How We Share Information
            </h2>
            <p>We never sell your personal information. We share data only as needed to run the Services with:</p>
            <ul className="space-y-2.5 list-disc pl-5">
              <li>
                <strong>Selected Food Vendors &amp; Dispatch Riders:</strong> The store you order from (and its assigned rider, for deliveries) receives your name, phone number, order items, and delivery address to fulfill your meal.
              </li>
              <li>
                <strong>Messaging Platform Providers:</strong> Meta Platforms, Inc. (WhatsApp Business Platform) and supported messaging channels to send and receive messages you initiate.
              </li>
              <li>
                <strong>Licensed Payment &amp; Banking Partners:</strong> Third-party payment gateways that securely process checkout payments, resolve vendor bank accounts, and disburse vendor payouts.
              </li>
              <li>
                <strong>Cloud Hosting &amp; AI Inference Providers:</strong> Trusted infrastructure and AI processing vendors operating under confidentiality obligations solely to host our application and interpret order messages in real time.
              </li>
              <li>
                <strong>Legal &amp; Regulatory Authorities:</strong> Where strictly required by Nigerian law, court order, or fraud investigation.
              </li>
            </ul>
            <p className="text-sm text-gray-600 dark:text-gray-400 pt-1">
              Some infrastructure and messaging partners operate outside Nigeria. Where cross-border transfers occur, we rely on appropriate contractual and security safeguards required under the NDPA.
            </p>
          </section>

          {/* 6. Data Retention & Security */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-3">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#2CD6EB]" />
              6. Data Retention &amp; Security
            </h2>
            <p>
              We retain order, chat, and vendor account records only for as long as necessary to fulfill orders, support active storefronts, resolve disputes, or meet statutory Nigerian financial record-keeping obligations. All traffic is encrypted in transit (HTTPS/TLS), webhook requests are cryptographically verified, and administrative access is protected by authenticated role controls.
            </p>
          </section>

          {/* 7. Your Rights Under the NDPA */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-3">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white">
              7. Your Privacy Rights
            </h2>
            <p>Under the NDPA, you have the right to:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Request access to a copy of the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete details.</li>
              <li>Request deletion of your personal data (see instructions below).</li>
              <li>Object to or restrict certain processing, or withdraw consent where applicable.</li>
              <li>Lodge a complaint with the <strong>Nigeria Data Protection Commission (NDPC)</strong> if you believe your rights have been infringed.</li>
            </ul>
          </section>

          {/* 8. User Data Deletion Instructions (#data-deletion) */}
          <section
            id="data-deletion"
            className="scroll-mt-28 pt-6 border-t-2 border-black/10 dark:border-white/15"
          >
            <div className="rounded-2xl border-3 border-black dark:border-white bg-[#FEF08A] dark:bg-[#11141D] p-6 md:p-8 text-black dark:text-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFE600] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FA6131] text-white border-2 border-black">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-display font-black">
                  8. User Data Deletion Instructions
                </h2>
              </div>
              <p className="font-medium">
                You can request deletion of your Bukka AI profile, WhatsApp conversation logs, and associated personal data at any time by following these steps:
              </p>
              <ol className="list-decimal pl-5 space-y-2 font-medium">
                <li>
                  Send an email to{' '}
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Data%20Deletion%20Request`}
                    className="underline font-display font-black text-[#FA6131] dark:text-[#FFE600]"
                  >
                    {CONTACT_EMAIL}
                  </a>{' '}
                  with the subject line <strong>&quot;Data Deletion Request&quot;</strong>.
                </li>
                <li>
                  Include the <strong>phone number / WhatsApp number</strong> (for customers) or <strong>store name and registered phone number</strong> (for vendors) so we can verify account ownership and locate your records.
                </li>
                <li>
                  Once verified, we will permanently delete or anonymize your personal profile, active sessions, and chat records within <strong>30 days</strong>, except where limited payment or transaction records must be retained temporarily for statutory accounting, fraud prevention, or dispute resolution under Nigerian law.
                </li>
              </ol>
            </div>
          </section>

          {/* 9. Changes */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-2">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white">
              9. Updates to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect improvements to our Services or updates to Nigerian data protection regulations. Changes take effect once posted on this page with an updated effective date. For questions, reach us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold underline text-[#FA6131]">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
