import React, { useState, useEffect } from 'react';
import {
  Trash2, Plus, CheckCircle, ExternalLink, QrCode,
  Link2, Store, User, Phone, Mail, Lock, CreditCard,
  Building2, Hash, ChefHat, Copy, Check, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { getApiErrorMessage, resolveAssetUrl } from '../services/api';

/* ── Helpers ───────────────────────────────────────────────────────── */
const slugify = (text) =>
  text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const NIGERIAN_BANKS = [
  { name: 'Access Bank', code: '044' },
  { name: 'Citibank', code: '023' },
  { name: 'Diamond Bank', code: '063' },
  { name: 'Ecobank Nigeria', code: '050' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'First City Monument Bank', code: '214' },
  { name: 'Guaranty Trust Bank', code: '058' },
  { name: 'Heritage Bank', code: '030' },
  { name: 'Keystone Bank', code: '082' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Providus Bank', code: '101' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Standard Chartered Bank', code: '068' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Suntrust Bank', code: '100' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'United Bank for Africa', code: '033' },
  { name: 'Unity Bank', code: '215' },
  { name: 'Wema Bank', code: '035' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'Kuda Bank', code: '50211' },
  { name: 'Opay', code: '090267' },
  { name: 'Palmpay', code: '090275' },
  { name: 'Moniepoint', code: '090405' },
];

/* ── Reusable field component ──────────────────────────────────────── */
const Field = ({ label, icon: Icon, children, hint, required }) => (
  <div>
    <label className="onboard-label">
      {Icon && <Icon size={14} className="onboard-label-icon" />}
      {label}
      {required && <span className="onboard-required">*</span>}
    </label>
    {children}
    {hint && <p className="onboard-hint">{hint}</p>}
  </div>
);

/* ── Step indicator ────────────────────────────────────────────────── */
const StepIndicator = ({ currentStep, steps }) => (
  <div className="onboard-steps">
    {steps.map((step, i) => (
      <div key={step.label} className="onboard-step-item">
        <div className={`onboard-step-circle ${i < currentStep ? 'onboard-step-done' : i === currentStep ? 'onboard-step-active' : ''}`}>
          {i < currentStep ? <Check size={14} /> : <span>{i + 1}</span>}
        </div>
        <span className={`onboard-step-label ${i <= currentStep ? 'onboard-step-label-active' : ''}`}>
          {step.label}
        </span>
        {i < steps.length - 1 && <div className={`onboard-step-line ${i < currentStep ? 'onboard-step-line-done' : ''}`} />}
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
const OnboardVendorForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    business_name: '', owner_name: '', whatsapp_number: '', slug: '',
    bank_code: '', account_number: '', account_name: '',
    email: '', password: ''
  });
  const [isSlugEditedManually, setIsSlugEditedManually] = useState(false);
  const [menuItems, setMenuItems] = useState([{ name: '', price: '', category: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const STEPS = [
    { label: 'Business', icon: Store },
    { label: 'Banking', icon: CreditCard },
    { label: 'Menu', icon: ChefHat },
  ];

  useEffect(() => {
    if (!isSlugEditedManually && formData.business_name) {
      setFormData(prev => ({ ...prev, slug: slugify(prev.business_name) }));
    }
  }, [formData.business_name, isSlugEditedManually]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'slug') {
      setIsSlugEditedManually(true);
      setFormData(prev => ({ ...prev, [name]: slugify(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMenuChange = (index, e) => {
    const newItems = [...menuItems];
    newItems[index][e.target.name] = e.target.value;
    setMenuItems(newItems);
  };

  const addMenuItem = () => setMenuItems([...menuItems, { name: '', price: '', category: '' }]);

  const removeMenuItem = (index) => {
    const newItems = [...menuItems];
    newItems.splice(index, 1);
    setMenuItems(newItems);
  };

  const canAdvance = () => {
    if (currentStep === 0) {
      return formData.business_name && formData.owner_name && formData.whatsapp_number;
    }
    if (currentStep === 1) {
      return formData.bank_code && formData.account_number && formData.account_name;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessData(null);

    const payload = {
      business_name: formData.business_name,
      owner_name: formData.owner_name,
      whatsapp_number: formData.whatsapp_number,
      slug: formData.slug,
      bank_code: formData.bank_code,
      account_number: formData.account_number,
      account_name: formData.account_name,
      email: formData.email,
      password: formData.password,
      menu_items: menuItems.filter(item => item.name && item.price),
    };

    try {
      const response = await adminService.onboardVendor(payload);
      setSuccessData({
        ...response,
        submitted_slug: response.slug || formData.slug || slugify(formData.business_name),
        business_name: formData.business_name,
      });
      setFormData({
        business_name: '', owner_name: '', whatsapp_number: '', slug: '',
        bank_code: '', account_number: '', account_name: '', email: '', password: ''
      });
      setMenuItems([{ name: '', price: '', category: '' }]);
      setIsSlugEditedManually(false);
      setCurrentStep(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(getApiErrorMessage(err, 'An unexpected error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (successData?.pairing_code) {
      navigator.clipboard.writeText(`/link ${successData.pairing_code}`);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const storefrontSlug = successData?.slug || successData?.submitted_slug;
  const qrImageUrl = resolveAssetUrl(successData?.qr_image_url);

  /* ── Success State ─────────────────────────────────────────────── */
  if (successData) {
    return (
      <div className="onboard-root">
        <style>{onboardStyles}</style>
        <div className="onboard-success-card">
          {/* Success header */}
          <div className="onboard-success-header">
            <div className="onboard-success-icon">
              <CheckCircle size={32} />
            </div>
            <h2 className="onboard-success-title">
              {successData.business_name || 'Vendor'} is live
            </h2>
            <p className="onboard-success-desc">
              The storefront, AI menu, and payment system are now active.
            </p>
          </div>

          {/* Info panels */}
          <div className="onboard-success-panels">
            {/* QR Panel */}
            <div className="onboard-panel">
              <div className="onboard-panel-header">
                <QrCode size={16} />
                <span>Storefront QR</span>
              </div>
              {qrImageUrl && (
                <img src={qrImageUrl} alt="Store QR" className="onboard-qr-img" />
              )}
              {storefrontSlug ? (
                <a
                  href={`/order/${storefrontSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="onboard-store-link"
                >
                  bukkaai.com.ng/order/{storefrontSlug}
                  <ExternalLink size={12} />
                </a>
              ) : (
                <p className="onboard-panel-note">
                  Storefront link will appear after provisioning.
                </p>
              )}
              <p className="onboard-panel-hint">Print this and place on tables</p>
            </div>

            {/* Pairing Panel */}
            <div className="onboard-panel onboard-panel-pairing">
              <div className="onboard-panel-header">
                <Phone size={16} />
                <span>Device Pairing</span>
              </div>
              {successData.pairing_code ? (
                <>
                  <div className="onboard-pairing-code">
                    {successData.pairing_code}
                  </div>
                  <p className="onboard-pairing-instruction">
                    The vendor must message the bot on WhatsApp and send:
                  </p>
                  <div className="onboard-pairing-command">
                    <code>/link {successData.pairing_code}</code>
                    <button onClick={handleCopyCode} className="onboard-copy-btn">
                      {copiedCode ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                    </button>
                  </div>
                </>
              ) : (
                <p className="onboard-panel-note">
                  No pairing code was returned. Manage this vendor from the directory.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="onboard-success-actions">
            <button onClick={() => setSuccessData(null)} className="onboard-btn-primary">
              Onboard Another Vendor
            </button>
            <button onClick={() => navigate('/admin/vendors')} className="onboard-btn-secondary">
              Go to Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form State ────────────────────────────────────────────────── */
  return (
    <div className="onboard-root">
      <style>{onboardStyles}</style>

      {/* Header */}
      <div className="onboard-page-header">
        <button onClick={() => navigate('/admin/vendors')} className="onboard-back-btn">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="onboard-page-title">Onboard Vendor</h1>
          <p className="onboard-page-desc">
            Create a digital storefront with AI-powered menu and payments
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={currentStep} steps={STEPS} />

      {/* Error */}
      {error && (
        <div className="onboard-error">
          <strong>Error: </strong>{error}
        </div>
      )}

      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Step 0: Business Profile */}
        {currentStep === 0 && (
          <div className="onboard-card">
            <h3 className="onboard-card-title">
              <Store size={18} /> Business Profile
            </h3>

            <div className="onboard-fields">
              <Field label="Business Name" icon={Store} required>
                <input
                  type="text" name="business_name" id="onboard_business_name"
                  value={formData.business_name} onChange={handleFormChange}
                  required placeholder="e.g. Iya Basira Amala"
                  autoComplete="off" className="onboard-input"
                />
              </Field>

              <Field label="Store Link (Slug)" icon={Link2} hint={
                formData.slug ? `bukkaai.com.ng/order/${formData.slug}` : 'Auto-generated from business name'
              }>
                <input
                  type="text" name="slug" id="onboard_slug"
                  value={formData.slug} onChange={handleFormChange}
                  placeholder="e.g. iya-basira-amala"
                  autoComplete="off" className="onboard-input"
                />
              </Field>

              <Field label="Owner Full Name" icon={User} required>
                <input
                  type="text" name="owner_name" id="onboard_owner_name"
                  value={formData.owner_name} onChange={handleFormChange}
                  required autoComplete="off" className="onboard-input"
                  placeholder="Full name of the vendor owner"
                />
              </Field>

              <div className="onboard-row">
                <Field label="WhatsApp Number" icon={Phone} required>
                  <input
                    type="tel" name="whatsapp_number" id="onboard_whatsapp_number"
                    value={formData.whatsapp_number} onChange={handleFormChange}
                    required autoComplete="off" placeholder="2348012345678"
                    className="onboard-input"
                  />
                </Field>
                <Field label="Email (Optional)" icon={Mail}>
                  <input
                    type="email" name="email" id="onboard_email"
                    value={formData.email} onChange={handleFormChange}
                    autoComplete="off" className="onboard-input"
                    placeholder="vendor@email.com"
                  />
                </Field>
              </div>

              <Field label="Initial Password (Optional)" icon={Lock} hint="Leave blank to auto-generate">
                <input
                  type="password" name="password" id="onboard_password"
                  value={formData.password} onChange={handleFormChange}
                  autoComplete="new-password" className="onboard-input"
                  placeholder="••••••••"
                />
              </Field>
            </div>
          </div>
        )}

        {/* Step 1: Banking */}
        {currentStep === 1 && (
          <div className="onboard-card">
            <h3 className="onboard-card-title">
              <CreditCard size={18} /> Settlement Details
            </h3>
            <p className="onboard-card-desc">
              Payments are routed directly to this account via Paystack split payments.
            </p>

            <div className="onboard-fields">
              <Field label="Bank Name" icon={Building2} required>
                <select
                  name="bank_code" id="onboard_bank_code"
                  value={formData.bank_code} onChange={handleFormChange}
                  required className="onboard-input"
                >
                  <option value="">Select a bank</option>
                  {NIGERIAN_BANKS.map((bank) => (
                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                  ))}
                </select>
              </Field>

              <div className="onboard-row">
                <Field label="Account Number" icon={Hash} required>
                  <input
                    type="text" inputMode="numeric" pattern="[0-9]*"
                    name="account_number" id="onboard_account_number"
                    value={formData.account_number} onChange={handleFormChange}
                    required autoComplete="off" placeholder="10-digit number"
                    className="onboard-input"
                  />
                </Field>
                <Field label="Account Name" icon={User} required>
                  <input
                    type="text" name="account_name" id="onboard_account_name"
                    value={formData.account_name} onChange={handleFormChange}
                    required autoComplete="off" placeholder="Account holder name"
                    className="onboard-input"
                  />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Menu */}
        {currentStep === 2 && (
          <div className="onboard-card">
            <div className="onboard-card-header-row">
              <h3 className="onboard-card-title">
                <ChefHat size={18} /> Menu Items
              </h3>
              <span className="onboard-menu-count">
                {menuItems.length} item{menuItems.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="onboard-menu-list">
              {menuItems.map((item, index) => (
                <div key={`menu-${index}`} className="onboard-menu-item">
                  <div className="onboard-menu-item-header">
                    <span className="onboard-menu-item-num">#{index + 1}</span>
                    {menuItems.length > 1 && (
                      <button
                        type="button" onClick={() => removeMenuItem(index)}
                        className="onboard-menu-remove"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text" name="name" value={item.name}
                    onChange={(e) => handleMenuChange(index, e)}
                    placeholder="Item name (e.g. Jollof Rice)"
                    required className="onboard-input"
                  />
                  <div className="onboard-row">
                    <input
                      type="text" name="category" value={item.category}
                      onChange={(e) => handleMenuChange(index, e)}
                      placeholder="Category (e.g. Rice)"
                      className="onboard-input"
                    />
                    <input
                      type="number" name="price" value={item.price}
                      onChange={(e) => handleMenuChange(index, e)}
                      placeholder="₦ Price"
                      required className="onboard-input onboard-input-price"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button" onClick={addMenuItem}
              className="onboard-add-menu-btn"
            >
              <Plus size={15} /> Add Item
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="onboard-nav">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="onboard-btn-secondary"
            >
              Back
            </button>
          )}
          <div className="onboard-nav-spacer" />
          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canAdvance()}
              className="onboard-btn-primary"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="onboard-btn-primary"
            >
              {loading ? 'Creating Storefront…' : 'Save & Generate Storefront'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════════════ */
const onboardStyles = `
  .onboard-root {
    max-width: 640px;
    margin: 0 auto;
    padding-bottom: 48px;
  }

  /* ── Header ── */
  .onboard-page-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
  }
  .onboard-back-btn {
    width: 36px; height: 36px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: #9ca3af;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
    transition: all .15s;
  }
  .onboard-back-btn:hover {
    color: #f3f4f6;
    background: rgba(255,255,255,0.08);
  }
  .onboard-page-title {
    font-size: 22px;
    font-weight: 800;
    color: #f3f4f6;
    margin: 0;
    letter-spacing: -0.02em;
  }
  .onboard-page-desc {
    font-size: 13px;
    color: #6b7280;
    margin: 3px 0 0;
  }

  /* ── Steps ── */
  .onboard-steps {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 24px;
    padding: 16px 20px;
    background: #171B26;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
  }
  .onboard-step-item {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }
  .onboard-step-circle {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    color: #4b5563;
    font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all .2s;
  }
  .onboard-step-active {
    background: rgba(250,97,49,0.15);
    border-color: rgba(250,97,49,0.3);
    color: #FA6131;
  }
  .onboard-step-done {
    background: rgba(52,211,153,0.15);
    border-color: rgba(52,211,153,0.3);
    color: #34d399;
  }
  .onboard-step-label {
    font-size: 12px;
    font-weight: 600;
    color: #4b5563;
    white-space: nowrap;
  }
  .onboard-step-label-active {
    color: #d1d5db;
  }
  .onboard-step-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 0 4px;
    min-width: 16px;
  }
  .onboard-step-line-done {
    background: rgba(52,211,153,0.3);
  }

  /* ── Card ── */
  .onboard-card {
    background: #171B26;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px;
    padding: 24px;
  }
  .onboard-card-title {
    font-size: 15px;
    font-weight: 700;
    color: #f3f4f6;
    margin: 0 0 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .onboard-card-title svg {
    color: #FA6131;
  }
  .onboard-card-desc {
    font-size: 12px;
    color: #6b7280;
    margin: 0 0 16px;
  }
  .onboard-card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  /* ── Fields ── */
  .onboard-fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
  }
  .onboard-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
    margin-bottom: 6px;
  }
  .onboard-label-icon {
    color: #6b7280;
  }
  .onboard-required {
    color: #FA6131;
    margin-left: 1px;
  }
  .onboard-hint {
    font-size: 11px;
    color: #4b5563;
    margin: 4px 0 0;
  }
  .onboard-input {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #f3f4f6;
    font-size: 13px;
    outline: none;
    transition: border-color .15s;
    box-sizing: border-box;
  }
  .onboard-input::placeholder {
    color: #4b5563;
  }
  .onboard-input:focus {
    border-color: rgba(44,214,235,0.4);
  }
  .onboard-input option {
    background: #171B26;
    color: #f3f4f6;
  }
  .onboard-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  /* ── Menu items ── */
  .onboard-menu-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 420px;
    overflow-y: auto;
    padding-right: 4px;
  }
  .onboard-menu-item {
    padding: 14px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .onboard-menu-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .onboard-menu-item-num {
    font-size: 11px;
    font-weight: 700;
    color: #6b7280;
  }
  .onboard-menu-remove {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color .15s;
  }
  .onboard-menu-remove:hover {
    color: #ef4444;
  }
  .onboard-menu-count {
    font-size: 11px;
    font-weight: 700;
    color: #2CD6EB;
    background: rgba(44,214,235,0.1);
    padding: 3px 10px;
    border-radius: 20px;
  }
  .onboard-input-price {
    font-family: monospace;
  }
  .onboard-add-menu-btn {
    width: 100%;
    margin-top: 12px;
    padding: 10px;
    border-radius: 8px;
    border: 1px dashed rgba(255,255,255,0.1);
    background: transparent;
    color: #6b7280;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all .15s;
  }
  .onboard-add-menu-btn:hover {
    border-color: rgba(44,214,235,0.3);
    color: #2CD6EB;
  }

  /* ── Navigation ── */
  .onboard-nav {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }
  .onboard-nav-spacer {
    flex: 1;
  }
  .onboard-btn-primary {
    padding: 10px 24px;
    border-radius: 8px;
    background: #FA6131;
    border: none;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background .15s;
  }
  .onboard-btn-primary:hover {
    background: #e04e1f;
  }
  .onboard-btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .onboard-btn-secondary {
    padding: 10px 20px;
    border-radius: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    color: #d1d5db;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s;
  }
  .onboard-btn-secondary:hover {
    background: rgba(255,255,255,0.08);
    color: #f3f4f6;
  }

  /* ── Error ── */
  .onboard-error {
    padding: 10px 16px;
    border-radius: 10px;
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.15);
    color: #f87171;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  /* ── Success ── */
  .onboard-success-card {
    background: #171B26;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px;
    padding: 32px 24px;
  }
  .onboard-success-header {
    text-align: center;
    margin-bottom: 28px;
  }
  .onboard-success-icon {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.2);
    color: #34d399;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
  }
  .onboard-success-title {
    font-size: 20px;
    font-weight: 800;
    color: #f3f4f6;
    margin: 0 0 6px;
  }
  .onboard-success-desc {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
  }
  .onboard-success-panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 24px;
  }
  .onboard-panel {
    padding: 20px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
  }
  .onboard-panel-pairing {
    align-items: stretch;
    text-align: left;
  }
  .onboard-panel-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .onboard-qr-img {
    width: 120px; height: 120px;
    background: #fff;
    padding: 6px;
    border-radius: 8px;
  }
  .onboard-store-link {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-family: monospace;
    color: #2CD6EB;
    text-decoration: none;
  }
  .onboard-store-link:hover {
    text-decoration: underline;
  }
  .onboard-panel-note {
    font-size: 11px;
    color: #4b5563;
    margin: 0;
  }
  .onboard-panel-hint {
    font-size: 10px;
    color: #4b5563;
    margin: 0;
  }
  .onboard-pairing-code {
    font-size: 28px;
    font-family: monospace;
    font-weight: 900;
    color: #93c5fd;
    letter-spacing: 0.15em;
    text-align: center;
    padding: 12px;
    background: rgba(59,130,246,0.06);
    border-radius: 8px;
    border: 1px solid rgba(59,130,246,0.12);
  }
  .onboard-pairing-instruction {
    font-size: 12px;
    color: #9ca3af;
    margin: 0;
  }
  .onboard-pairing-command {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 6px;
  }
  .onboard-pairing-command code {
    font-size: 13px;
    font-weight: 700;
    color: #f3f4f6;
  }
  .onboard-copy-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 5px;
    background: rgba(59,130,246,0.08);
    border: 1px solid rgba(59,130,246,0.15);
    color: #60a5fa;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }
  .onboard-success-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .onboard-root {
      padding-left: 16px;
      padding-right: 16px;
    }
    .onboard-row {
      grid-template-columns: 1fr;
    }
    .onboard-success-panels {
      grid-template-columns: 1fr;
    }
    .onboard-step-label {
      display: none;
    }
  }
`;

export default OnboardVendorForm;
