"use client";
import { useEffect, useState } from "react";

export default function EditBookingModal({ open, onClose, booking, onSave }) {
  const [form, setForm] = useState(booking || {});

  useEffect(() => {
    setForm(booking || {});
  }, [booking]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open || !booking) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Edit Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium mb-1">User ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.userId || ""}
              onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
            />
          </div>
          
          {/* Listing ID */}  
          <div>
            <label className="block text-sm font-medium mb-1">Listing ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.listingId || ""}
              onChange={e => setForm(f => ({ ...f, listingId: e.target.value }))}
            />
          </div>
          
          {/* Details (dates, guests, etc.) */}
          <div>
            <label className="block text-sm font-medium mb-1">Details (JSON)</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={form.details ? JSON.stringify(form.details, null, 2) : ""}
              onChange={e => {
                try {
                  setForm(f => ({ ...f, details: JSON.parse(e.target.value) }));
                } catch {
                  // ignore parse error for now
                }
              }}
            />
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.status || ""}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.paymentMethod || ""}
              onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
            >
              <option value="stripe">Stripe</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
          
          {/* Payment Intent ID */}
          <div>
            <label className="block text-sm font-medium mb-1">Payment Intent ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.paymentIntentId || ""}
              onChange={e => setForm(f => ({ ...f, paymentIntentId: e.target.value }))}
            />
          </div>
          
          {/* Created At */}
          <div>
            <label className="block text-sm font-medium mb-1">Created At</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.createdAt ? new Date(form.createdAt).toISOString().slice(0, 16) : ""}
              onChange={e => setForm(f => ({ ...f, createdAt: new Date(e.target.value).toISOString() }))}
            />
          </div>
          
          {/* Updated At */}
          <div>
            <label className="block text-sm font-medium mb-1">Updated At</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.updatedAt ? new Date(form.updatedAt).toISOString().slice(0, 16) : ""}
              onChange={e => setForm(f => ({ ...f, updatedAt: new Date(e.target.value).toISOString() }))}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}