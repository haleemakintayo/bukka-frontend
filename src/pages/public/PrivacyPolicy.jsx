import React from 'react';
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-bukka-dark-surface pt-24 pb-12 px-4 md:px-8 font-sans text-gray-900 dark:text-bukka-soft-white transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Link Back */}
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-[#0F6B43] dark:text-bukka-cyan hover:underline font-semibold"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-[#0F6B43] rounded-3xl p-8 md:p-12 text-white shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white/10 p-4 rounded-2xl flex-shrink-0">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <div>
            <span className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
              Legal & Compliance
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight lowercase">
              privacy policy
            </h1>
            <p className="text-emerald-50 max-w-2xl text-base mt-2">
              Bukka AI is committed to protecting your privacy. This policy outlines how we collect, use, and protect your personal data in compliance with the Nigeria Data Protection Act (NDPA).
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white dark:bg-bukka-card-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-8">
            <p className="text-lg font-medium">
              Bukka AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting the privacy and security of your personal data. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our autonomous AI sales management platform, CRM services, and associated WhatsApp integration (collectively, the &quot;Services&quot;).
            </p>
            
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-[#0F6B43] dark:border-bukka-cyan p-4 rounded-r-xl">
              <p className="text-sm font-semibold text-[#0F6B43] dark:text-bukka-cyan">
                This Privacy Policy is compliant with the Nigeria Data Protection Act (NDPA) and other applicable data protection regulations in Nigeria.
              </p>
            </div>

            {/* Section 1 */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white lowercase mb-3">1. data controller</h2>
              <p className="mb-4">
                Bukka AI acts as both a Data Controller (for the information of vendors who sign up for our services) and a Data Processor (for the customer interaction data handled by our AI on behalf of vendors).
              </p>
              <p className="mb-4">
                For any inquiries regarding this policy, you can contact our Data Protection Office at:
              </p>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-bukka-dark-surface/50 border border-gray-100 dark:border-gray-800 p-4 rounded-xl max-w-sm">
                <Mail className="w-5 h-5 text-[#FF6600] flex-shrink-0" />
                <div className="text-sm font-medium">
                  <p className="text-gray-500 dark:text-gray-400">Email Address</p>
                  <a href="mailto:privacy@bukkaai.com" className="text-[#FF6600] hover:underline font-bold">privacy@bukkaai.com</a>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white lowercase mb-3">2. information we collect</h2>
              <p className="mb-4">
                We collect information that is necessary to provide, optimize, and secure our Services.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div className="bg-gray-50 dark:bg-bukka-dark-surface/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                  <h3 className="font-bold text-gray-900 dark:text-bukka-soft-white text-base mb-2">Account Information</h3>
                  <p className="text-sm">Name, email address, phone number, business name, and account credentials when you register.</p>
                </div>
                <div className="bg-gray-50 dark:bg-bukka-dark-surface/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                  <h3 className="font-bold text-gray-900 dark:text-bukka-soft-white text-base mb-2">Customer Interaction Data</h3>
                  <p className="text-sm">Text, messages, transaction details, and order details processed by our AI automated agent (&quot;Auntie Chioma&quot;) via the WhatsApp Business API.</p>
                </div>
                <div className="bg-gray-50 dark:bg-bukka-dark-surface/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                  <h3 className="font-bold text-gray-900 dark:text-bukka-soft-white text-base mb-2">Payment and Billing Information</h3>
                  <p className="text-sm">Metadata related to payments (processed via secure third-party payment gateways). We do not store full credit card details.</p>
                </div>
                <div className="bg-gray-50 dark:bg-bukka-dark-surface/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                  <h3 className="font-bold text-gray-900 dark:text-bukka-soft-white text-base mb-2">Technical Data</h3>
                  <p className="text-sm">IP address, device type, operating system, and usage logs when interacting with our dashboard.</p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white lowercase mb-3">3. lawful basis for processing</h2>
              <p className="mb-4">
                In line with the NDPA, we only process personal data when we have a valid legal ground to do so:
              </p>
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Consent:</strong> Where you or your customers have given explicit consent (e.g., opting into communication).</li>
                <li><strong>Contractual Necessity:</strong> To fulfill our obligations in providing the Bukka AI platform to you.</li>
                <li><strong>Legal Obligation:</strong> To comply with financial, regulatory, or legal requirements in Nigeria.</li>
                <li><strong>Legitimate Interests:</strong> To prevent fraud, maintain system security, and improve our AI conversational capabilities.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white lowercase mb-3">4. how we use your information</h2>
              <p className="mb-4">
                We use the collected data to:
              </p>
              <ul className="space-y-3 list-disc pl-5">
                <li>Provision, maintain, and optimize the Bukka AI conversational engine.</li>
                <li>Analyze and train our automated sales agents to improve response accuracy (using anonymized metadata).</li>
                <li>Process transactions and send billing notices.</li>
                <li>Provide technical support and resolve Meta developer dashboard integration issues.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white lowercase mb-3">5. data retention</h2>
              <p>
                We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law (such as financial record-keeping laws). When data is no longer required, it is securely deleted or anonymized.
              </p>
            </div>

            {/* Section 6 */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white lowercase mb-3">6. data transfers and third parties</h2>
              <p className="mb-4">
                To deliver our services, we share data with trusted third parties, notably:
              </p>
              <ul className="space-y-3 list-disc pl-5 mb-4">
                <li><strong>Meta Platforms, Inc.:</strong> Through the WhatsApp Business API integration to route messages.</li>
                <li><strong>Cloud Infrastructure Providers:</strong> Secure servers where our database and AI models reside.</li>
              </ul>
              <div className="mt-6 p-6 bg-gray-50 dark:bg-bukka-dark-surface/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-bukka-soft-white text-base mb-2">Cross-Border Data Transfers</h3>
                <p className="text-sm">
                  Some of our cloud infrastructure and integrations (like Meta) may host data outside of Nigeria. In accordance with the NDPA, we ensure that such transfers are made only to countries with adequate data protection laws or under strict standard contractual clauses that guarantee the safety of your data.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white lowercase mb-3">7. your rights under the ndpa</h2>
              <p className="mb-4">
                As a data subject in Nigeria, you have specific rights regarding your personal data:
              </p>
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Right to Access:</strong> You can request copies of the personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> You can request that we correct inaccurate or incomplete information.</li>
                <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You can request the deletion of your data under certain conditions.</li>
                <li><strong>Right to Restrict or Object to Processing:</strong> You can object to how we process your data, including direct marketing.</li>
                <li><strong>Right to Data Portability:</strong> You can request that we transfer your data to another organization.</li>
                <li><strong>Right to Withdraw Consent:</strong> You can withdraw your consent at any time where consent is the basis of processing.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us at <a href="mailto:support@bukkaai.com" className="text-[#FF6600] hover:underline font-bold">support@bukkaai.com</a>.
              </p>
            </div>

            {/* Section 8 */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white lowercase mb-3">8. security of your data</h2>
              <p>
                We implement robust technical and organizational security measures—including data encryption in transit and at rest, firewalls, and strict access controls to protect your information from unauthorized access, alteration, or disclosure.
              </p>
            </div>

            {/* Section 9 */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white lowercase mb-3">9. remedies and redress</h2>
              <p>
                If you believe your data protection rights have been violated, you have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC). However, we encourage you to contact us first to resolve any concerns directly.
              </p>
            </div>

            {/* Section 10 */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white lowercase mb-3">10. changes to this policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our technology or Nigerian legal frameworks. We will notify you of any material changes by posting the new policy on this page with an updated effective date.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
