import React, { useEffect } from 'react';
import { FileText, Mail, ArrowLeft, ShieldCheck, Store, ShoppingBag, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONTACT_EMAIL = 'hello@bukkaai.com';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            to="/privacy"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black dark:border-white bg-[#25D366] text-sm font-display font-extrabold text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <ShieldCheck size={16} />
            Read Privacy Policy
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="rounded-3xl border-3 border-black dark:border-white bg-[#FFE600] p-8 md:p-10 text-black shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex-shrink-0">
            <FileText className="w-10 h-10 text-black" />
          </div>
          <div>
            <span className="inline-block bg-black text-[#FFE600] text-xs px-3 py-1 rounded-md font-display font-black uppercase tracking-wider mb-3">
              Legal Agreement • Customers &amp; Vendors
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-black">
              Terms of Service
            </h1>
            <p className="text-black/85 max-w-2xl text-base mt-2 font-medium leading-relaxed">
              Clear rules governing food orders placed through Bukka AI on WhatsApp or the web, as well as food vendors operating digital storefronts on our platform.
            </p>
            <p className="text-xs font-display font-bold uppercase tracking-wider text-black/75 mt-3">
              Effective Date: November 20, 2026 • Governing Law: Federal Republic of Nigeria
            </p>
          </div>
        </div>

        {/* Terms Body */}
        <div className="rounded-3xl border-3 border-black dark:border-white bg-white dark:bg-[#1C2230] p-7 md:p-11 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] space-y-8 leading-relaxed text-gray-800 dark:text-gray-200">
          <p className="text-base md:text-lg font-medium">
            Welcome to <strong>Bukka AI</strong>. By accessing our website, interacting with our WhatsApp ordering assistant (&quot;Auntie Chioma&quot;), placing an order, or registering as a food vendor, you agree to be bound by these Terms of Service and our{' '}
            <Link to="/privacy" className="underline font-bold text-[#FA6131]">
              Privacy Policy
            </Link>
            .
          </p>

          {/* 1. Platform Role */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-3">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white">
              1. Platform Role (Technology Intermediary)
            </h2>
            <p>
              Bukka AI provides software, conversational AI ordering workflows, digital menus, and payment-routing infrastructure that connect customers with independent campus and local food vendors (&quot;Vendors&quot;).
            </p>
            <p>
              <strong>Bukka AI does not cook, package, store, or physically deliver meals.</strong> Each Vendor operates as an independent business and is solely responsible for menu accuracy, ingredient disclosure, food preparation, hygiene, packaging, and timely pickup or dispatch.
            </p>
          </section>

          {/* 2. Customer Ordering, Fees & Payments */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FA6131]" />
              2. Customer Ordering, Fees &amp; Payments
            </h2>
            <ul className="space-y-2.5 list-disc pl-5">
              <li>
                <strong>Order Confirmation:</strong> Orders submitted via web checkout or WhatsApp Flows are forwarded to the Vendor only after payment is verified through our licensed third-party payment partners.
              </li>
              <li>
                <strong>Pricing &amp; Convenience Fee:</strong> Vendors set all meal prices, packaging costs, and delivery zone fees. A transparent <strong>₦50 platform convenience fee</strong> applies to web checkout orders and is itemized clearly prior to payment.
              </li>
              <li>
                <strong>Accurate Details:</strong> You are responsible for providing an accurate WhatsApp/phone number and delivery location so the Vendor and dispatch rider can contact you.
              </li>
              <li>
                <strong>Automated Assistant Notice:</strong> While Auntie Chioma assists with browsing menus and building orders, confirmed prices, item availability, and totals shown at checkout govern your transaction.
              </li>
            </ul>
          </section>

          {/* 3. Cancellations, Refunds & Disputes */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-3">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white">
              3. Cancellations, Refunds &amp; Order Issues
            </h2>
            <ul className="space-y-2.5 list-disc pl-5">
              <li>
                <strong>Before Kitchen Acceptance:</strong> If a Vendor declines or cannot fulfill a paid order (for example, an item sells out or the kitchen closes), the order is eligible for a full refund or alternative arrangement.
              </li>
              <li>
                <strong>After Preparation Begins:</strong> Because meals are perishable and prepared to order, paid orders already accepted and in preparation generally cannot be cancelled for a refund unless the order was not delivered, materially incorrect, or spoiled.
              </li>
              <li>
                <strong>Resolving Disputes:</strong> For failed payment confirmations, missing items, or refund inquiries, contact the Vendor directly or email{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold underline text-[#FA6131]">
                  {CONTACT_EMAIL}
                </a>{' '}
                within <strong>24 hours</strong> with your order number and payment reference.
              </li>
            </ul>
          </section>

          {/* 4. Vendor Terms & Compliance */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-[#25D366]" />
              4. Vendor Responsibilities &amp; Payouts
            </h2>
            <p>If you onboard and operate a store on Bukka AI, you agree to:</p>
            <ul className="space-y-2.5 list-disc pl-5">
              <li>
                <strong>Accurate Menus &amp; Fulfillment:</strong> Keep prices, stock availability, store hours, and delivery areas up to date, and fulfill accepted orders promptly and hygienically in compliance with Nigerian food-safety and business laws.
              </li>
              <li>
                <strong>Lawful Commerce &amp; Messaging Compliance:</strong> Offer only lawful food and beverage items and comply fully with applicable Meta / WhatsApp Business and Commerce Policies (no prohibited goods, spam, or unsolicited messaging).
              </li>
              <li>
                <strong>Bank Details &amp; Payouts:</strong> Provide accurate Nigerian bank payout details. Verified order proceeds (net of applicable platform or processing charges) are settled to your designated bank account. Bukka AI may temporarily hold payouts if fraud, chargebacks, or unresolved customer disputes occur.
              </li>
              <li>
                <strong>Account Security:</strong> Keep your vendor PIN, pairing codes, and dashboard credentials confidential.
              </li>
            </ul>
          </section>

          {/* 5. Acceptable Use & Suspension */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-3">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white">
              5. Prohibited Conduct
            </h2>
            <p>You agree not to use Bukka AI to:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Submit fake transfer receipts, spoofed webhook payloads, or fraudulent payment confirmations.</li>
              <li>Harass vendors, riders, customers, or spam our WhatsApp endpoints with automated bots or abusive prompts.</li>
              <li>Attempt to reverse-engineer, scrape, overload, or bypass security controls on our platform.</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate access for accounts that engage in fraud, repeated fulfillment failures, policy violations, or unlawful activity.
            </p>
          </section>

          {/* 6. Intellectual Property & Disclaimers */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-3">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white">
              6. Intellectual Property &amp; Limitation of Liability
            </h2>
            <p>
              The Bukka AI name, branding, QR layouts, software, and user interfaces belong to Bukka AI. Vendors retain ownership of their business names, logos, and menu photos uploaded to the platform.
            </p>
            <p>
              The Services are provided on an &quot;as available&quot; basis. To the fullest extent permitted under Nigerian law, Bukka AI is not liable for indirect or consequential damages, third-party telecommunications/payment network outages, or food quality and delivery delays attributable to independent Vendors or riders. Where liability cannot be excluded by law, our aggregate liability for any order dispute shall not exceed the total amount paid by the customer for that specific order.
            </p>
          </section>

          {/* 7. Governing Law & Contact */}
          <section className="pt-6 border-t-2 border-black/10 dark:border-white/15 space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-black text-black dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#2CD6EB]" />
              7. Governing Law, Updates &amp; Contact
            </h2>
            <p>
              These Terms are governed by the laws of the <strong>Federal Republic of Nigeria</strong>. We may update these Terms periodically; continued use of Bukka AI after updates are posted constitutes acceptance of the revised Terms.
            </p>
            <div className="inline-flex items-center gap-3 bg-[#FAF7EE] dark:bg-[#11141D] border-2 border-black dark:border-white p-4 rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
              <Mail className="w-5 h-5 text-[#FA6131] flex-shrink-0" />
              <div className="text-sm">
                <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Questions or Order Support
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
        </div>
      </div>
    </div>
  );
}
