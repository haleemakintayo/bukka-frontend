import React, { useState, useEffect, useCallback } from 'react';
import {
  Bike,
  Plus,
  Edit2,
  Trash2,
  Phone,
  User,
  Check,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
} from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';

const VendorRidersManager = ({ onRidersUpdated }) => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Modal State (Add or Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState(null); // null = add, object = edit
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [riderActive, setRiderActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const showToast = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchRiders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vendorService.getRiders();
      setRiders(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to load dispatch riders.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  const openAddModal = () => {
    setEditingRider(null);
    setRiderName('');
    setRiderPhone('');
    setRiderActive(true);
    setModalOpen(true);
  };

  const openEditModal = (rider) => {
    setEditingRider(rider);
    setRiderName(rider.name);
    setRiderPhone(rider.phone_number);
    setRiderActive(rider.is_active);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingRider(null);
  };

  const handleSaveRider = async (e) => {
    e.preventDefault();
    if (!riderName.trim() || !riderPhone.trim()) {
      showToast('error', 'Please enter both rider name and phone number.');
      return;
    }

    setSaving(true);
    try {
      if (editingRider) {
        // Edit existing rider
        const updated = await vendorService.updateRider(editingRider.id, {
          name: riderName.trim(),
          phone_number: riderPhone.trim(),
          is_active: riderActive,
        });
        setRiders((prev) =>
          prev.map((r) => (r.id === editingRider.id ? updated : r))
        );
        showToast('success', `Updated "${updated.name}" successfully!`);
      } else {
        // Add new rider
        const created = await vendorService.createRider({
          name: riderName.trim(),
          phone_number: riderPhone.trim(),
        });
        setRiders((prev) => [created, ...prev.filter((r) => r.id !== created.id)]);
        showToast('success', `Added "${created.name}" to your fleet! 🛵`);
      }
      closeModal();
      if (onRidersUpdated) onRidersUpdated();
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to save rider.'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (rider) => {
    try {
      const updated = await vendorService.updateRider(rider.id, {
        is_active: !rider.is_active,
      });
      setRiders((prev) =>
        prev.map((r) => (r.id === rider.id ? updated : r))
      );
      showToast(
        'success',
        `${updated.name} is now ${updated.is_active ? 'active for dispatches' : 'marked off-duty'}.`
      );
      if (onRidersUpdated) onRidersUpdated();
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to update rider status.'));
    }
  };

  const handleDeleteRider = async (riderId, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your dispatch fleet?`)) {
      return;
    }
    setDeletingId(riderId);
    try {
      await vendorService.deleteRider(riderId);
      setRiders((prev) => prev.filter((r) => r.id !== riderId));
      showToast('success', `Removed "${name}" from fleet.`);
      if (onRidersUpdated) onRidersUpdated();
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to delete rider.'));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#171B26] border border-white/10 rounded-2xl p-6 flex items-center justify-center gap-3">
        <Loader2 size={18} className="animate-spin text-[#2CD6EB]" />
        <span className="text-xs text-gray-400 font-semibold">Loading dispatch fleet…</span>
      </div>
    );
  }

  const activeRiders = riders.filter((r) => r.is_active);

  return (
    <div className="space-y-4">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
          {feedback.msg}
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-[#171B26] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2CD6EB]/10 border border-[#2CD6EB]/20 text-[#2CD6EB] flex items-center justify-center">
                <Bike size={18} />
              </div>
              <h3 className="text-sm font-extrabold text-white tracking-tight">
                Dispatch Fleet & Delivery Riders
              </h3>
              {riders.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  {activeRiders.length} active
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Save your delivery riders once to assign dispatches in 1 tap without retyping phone numbers.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] text-xs font-extrabold shadow-md shadow-[#2CD6EB]/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus size={14} />
            Add Rider
          </button>
        </div>

        {/* Empty State */}
        {riders.length === 0 ? (
          <div className="bg-[#0F1219] border border-dashed border-white/10 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2CD6EB]/10 border border-[#2CD6EB]/20 flex items-center justify-center mx-auto text-[#2CD6EB]">
              <Bike size={22} />
            </div>
            <div className="max-w-sm mx-auto">
              <p className="text-xs font-bold text-white">No delivery riders saved yet</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Add your trusted campus dispatchers or delivery partners so you can select them with one tap when orders are ready.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={openAddModal}
                className="px-4 py-2.5 rounded-xl bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] text-xs font-extrabold shadow-md shadow-[#2CD6EB]/20 transition-all inline-flex items-center gap-1.5"
              >
                <Plus size={14} />
                Add Your First Rider
              </button>
            </div>
          </div>
        ) : (
          /* Riders Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {riders.map((rider) => {
              const isOffDuty = !rider.is_active;

              return (
                <div
                  key={rider.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isOffDuty
                      ? 'bg-[#0F1219]/60 border-white/5 opacity-60'
                      : 'bg-[#0F1219] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isOffDuty
                            ? 'bg-white/5 text-gray-500'
                            : 'bg-[#2CD6EB]/10 border border-[#2CD6EB]/20 text-[#2CD6EB]'
                        }`}
                      >
                        <Bike size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-white truncate">
                          {rider.name}
                        </p>
                        <a
                          href={`tel:${rider.phone_number}`}
                          className="text-[11px] font-mono text-gray-400 hover:text-[#2CD6EB] transition-colors flex items-center gap-1 mt-0.5"
                          title="Call rider"
                        >
                          <Phone size={10} className="shrink-0 text-emerald-400" />
                          <span>{rider.phone_number}</span>
                        </a>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                        rider.is_active
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/5 text-gray-500 border border-white/10'
                      }`}
                    >
                      {rider.is_active ? 'Active' : 'Off-duty'}
                    </span>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(rider)}
                      className={`text-[10px] font-bold flex items-center gap-1 transition-colors ${
                        rider.is_active
                          ? 'text-gray-400 hover:text-amber-400'
                          : 'text-emerald-400 hover:text-emerald-300'
                      }`}
                      title={rider.is_active ? 'Mark rider off-duty' : 'Activate rider'}
                    >
                      {rider.is_active ? (
                        <>
                          <PauseCircle size={12} />
                          Set Off-duty
                        </>
                      ) : (
                        <>
                          <PlayCircle size={12} />
                          Set Active
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(rider)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                        title="Edit rider details"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRider(rider.id, rider.name)}
                        disabled={deletingId === rider.id}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-40"
                        title="Remove rider"
                      >
                        {deletingId === rider.id ? (
                          <Loader2 size={12} className="animate-spin text-red-400" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add / Edit Rider Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#171B26] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2CD6EB]/15 text-[#2CD6EB] flex items-center justify-center">
                  <Bike size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    {editingRider ? 'Edit Rider Details' : 'Add Delivery Rider'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Trusted dispatch rider or courier
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveRider} className="space-y-4">
              {/* Rider Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Rider Full Name / Nickname</label>
                <div className="relative">
                  <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={riderName}
                    onChange={(e) => setRiderName(e.target.value)}
                    placeholder="e.g. Tunde (Campus Express)"
                    className="w-full bg-[#0F1219] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB]"
                  />
                </div>
              </div>

              {/* Rider Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Phone Number (WhatsApp / Call)</label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={riderPhone}
                    onChange={(e) => setRiderPhone(e.target.value)}
                    placeholder="e.g. 08012345678 or +234..."
                    className="w-full bg-[#0F1219] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB]"
                  />
                </div>
                <p className="text-[10px] text-gray-500">
                  Customers receive this phone number via WhatsApp so they can coordinate delivery.
                </p>
              </div>

              {/* Active Toggle (Edit Mode) */}
              {editingRider && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0F1219] border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">Active Status</p>
                    <p className="text-[10px] text-gray-400">Available to take new dispatches</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRiderActive(!riderActive)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
                      riderActive ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        riderActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] text-xs font-extrabold shadow-md shadow-[#2CD6EB]/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  {editingRider ? 'Save Changes' : 'Add Rider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRidersManager;
