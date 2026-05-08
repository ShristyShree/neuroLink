import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expertService, bookingService } from '../services/api';
import { socket, connectSocket } from '../socket/socket';
import { Star, Clock, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const ExpertDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchExpertAndBookings = async (isInitial = false) => {
    try {
      const [expertRes, bookingsRes] = await Promise.all([
        expertService.getExpertById(id),
        bookingService.getBookedSlotsForExpert(id)
      ]);
      setExpert(expertRes.data);
      setBookedSlots(bookingsRes.data);
      
      // Only set the default selected date on initial load
      if (isInitial && expertRes.data.availableSlots?.length > 0) {
        setSelectedDate(expertRes.data.availableSlots[0].date);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpertAndBookings(true);
    
    connectSocket();
    
    const handleSlotBooked = (data) => {
      if (data.expertId === id) {
        setBookedSlots(prev => {
          if (!prev.some(b => b.date === data.date && b.slot === data.slot)) {
            return [...prev, { date: data.date, slot: data.slot }];
          }
          return prev;
        });
      }
    };

    socket.on('slot_booked', handleSlotBooked);

    return () => {
      socket.off('slot_booked', handleSlotBooked);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!expert) return <div className="text-center mt-20 text-white">Expert not found</div>;

  const getAvailableDates = () => expert.availableSlots || [];
  
  const getSlotsForSelectedDate = () => {
    const day = expert.availableSlots?.find(d => d.date === selectedDate);
    return day ? day.slots : [];
  };

  const isSlotBooked = (date, slot) => {
    return bookedSlots.some(b => b.date.split('T')[0] === date.split('T')[0] && b.slot === slot);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-8"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Experts
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card overflow-hidden">
            <img src={expert.image} alt={expert.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h1 className="text-2xl font-bold text-white mb-2">{expert.name}</h1>
              <p className="text-primaryLight font-medium mb-4">{expert.category}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-white">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="font-bold">{expert.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-textMuted text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{expert.experience} yrs exp</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {expert.expertiseTags?.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-surfaceLight border border-white/5 rounded-md text-xs text-textMuted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-3">About</h3>
            <p className="text-textMuted leading-relaxed text-sm">
              {expert.bio}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Book a Session</h2>
            
            <div className="mb-8">
              <h3 className="text-sm font-medium text-textMuted mb-3">Select Date</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {getAvailableDates().map(day => {
                  const dateObj = new Date(day.date);
                  const isSelected = selectedDate === day.date;
                  return (
                    <button
                      key={day.date}
                      onClick={() => { setSelectedDate(day.date); setSelectedSlot(null); }}
                      className={`min-w-[80px] flex flex-col items-center p-3 rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-primary border border-primaryLight text-white shadow-[0_0_15px_rgba(123,44,191,0.5)]' 
                          : 'bg-surfaceLight/50 border border-white/5 text-textMuted hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="text-xs uppercase font-medium">{dateObj.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                      <span className="text-lg font-bold">{dateObj.getDate()}</span>
                      <span className="text-xs">{dateObj.toLocaleDateString(undefined, { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="mb-8 animate-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-sm font-medium text-textMuted mb-3">Available Time Slots</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {getSlotsForSelectedDate().map(slot => {
                    const isBooked = isSlotBooked(selectedDate, slot);
                    const isSelected = selectedSlot === slot;
                    
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                          isBooked 
                            ? 'bg-surface opacity-40 text-textMuted cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-accent/20 border border-accent text-accent shadow-[0_0_15px_rgba(0,245,212,0.2)]'
                              : 'bg-surfaceLight/50 border border-white/5 text-white hover:border-white/20'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                  {getSlotsForSelectedDate().length === 0 && (
                    <div className="col-span-full text-textMuted text-sm">No slots available on this date.</div>
                  )}
                </div>
              </div>
            )}

            <button
              disabled={!selectedSlot}
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-background hover:bg-gray-200"
            >
              Continue to Details <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expert={expert}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        onSuccess={() => fetchExpertAndBookings(false)}
      />
    </div>
  );
};

export default ExpertDetails;
