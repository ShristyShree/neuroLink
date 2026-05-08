import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { bookingService } from '../services/api';

const BookingModal = ({ isOpen, onClose, expert, selectedDate, selectedSlot, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await bookingService.createBooking({
        expertId: expert._id,
        date: selectedDate,
        slot: selectedSlot,
        ...formData
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
        setFormData({ name: '', email: '', phone: '', notes: '' });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book slot. It might be already taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-textMuted hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
            <p className="text-textMuted">You're all set to meet with {expert.name}. Check your email for details.</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-white mb-1">Confirm Booking</h3>
            <p className="text-textMuted mb-6">
              {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} at {selectedSlot}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full bg-surfaceLight/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full bg-surfaceLight/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  className="w-full bg-surfaceLight/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Notes (Optional)</label>
                <textarea 
                  name="notes" 
                  rows="3"
                  className="w-full bg-surfaceLight/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="What would you like to discuss?"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>

              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primaryLight text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
