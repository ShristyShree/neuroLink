import React, { useState } from 'react';
import { bookingService } from '../services/api';
import { Calendar, Clock, Loader2, Search } from 'lucide-react';

const UserDashboard = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const data = await bookingService.getBookingsByEmail(email);
      setBookings(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">My Bookings</h1>
        <p className="text-textMuted">Enter your email address to view your past and upcoming consultation sessions.</p>
      </div>

      <div className="glass-card p-6 md:p-8 mb-10 max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-textMuted" />
            </div>
            <input 
              type="email" 
              required
              className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primaryLight text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      {searched && !loading && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {bookings.length > 0 ? `Found ${bookings.length} bookings for ${email}` : 'No bookings found'}
          </h2>
          
          {error && <p className="text-red-400">{error}</p>}

          <div className="grid gap-4">
            {bookings.map(booking => {
              const dateObj = new Date(booking.date);
              return (
                <div key={booking._id} className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group hover:border-primary/30">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent" />
                  
                  <div className="flex-1 flex items-center gap-4">
                    <img 
                      src={booking.expertId?.image || 'https://via.placeholder.com/150'} 
                      alt={booking.expertId?.name} 
                      className="w-16 h-16 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">{booking.expertId?.name || 'Expert'}</h3>
                      <p className="text-sm text-primaryLight">{booking.expertId?.category}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 bg-surfaceLight/30 px-6 py-4 rounded-xl border border-white/5 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-accent" />
                      <span className="text-white font-medium">
                        {dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      <span className="text-white font-medium">{booking.slot}</span>
                    </div>
                  </div>
                  
                  <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold uppercase tracking-wider">
                    {booking.status || 'Confirmed'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
