import React, { useEffect, useState } from 'react';
import { expertService } from '../services/api';
import ExpertCard from '../components/ExpertCard';
import { Sparkles, Loader2 } from 'lucide-react';

const Home = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const data = await expertService.getExperts();
        setExperts(data.data);
      } catch (err) {
        setError('Failed to fetch experts');
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 mt-20">{error}</div>;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center py-16 md:py-24 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primaryLight text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>The Future of Consultation</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Unlock your potential with <span className="text-gradient">AI Experts</span>
        </h1>
        <p className="text-xl text-textMuted mb-10 leading-relaxed">
          Connect with industry-leading AI professionals for 1-on-1 consultations. Elevate your projects, architecture, and business strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
        {experts.map(expert => (
          <ExpertCard key={expert._id} expert={expert} />
        ))}
      </div>
    </div>
  );
};

export default Home;
