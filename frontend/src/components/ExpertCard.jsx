import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExpertCard = ({ expert }) => {
  return (
    <Link to={`/expert/${expert._id}`} className="block group">
      <div className="glass-card overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden bg-surfaceLight">
          <div className="absolute inset-0 bg-gradient-to-t from-[#161622] to-transparent z-10" />
          <img 
            src={expert.image} 
            alt={expert.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-4 left-4 z-20">
            <span className="px-2 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-xs font-medium text-white">
              {expert.category}
            </span>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col relative z-20 bg-[#161622]/80 backdrop-blur-sm -mt-2">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-primaryLight transition-colors">
              {expert.name}
            </h3>
            <div className="flex items-center gap-1 text-accent bg-accent/10 px-2 py-1 rounded-md">
              <Star className="w-4 h-4 fill-accent" />
              <span className="text-sm font-bold">{expert.rating}</span>
            </div>
          </div>
          <p className="text-textMuted text-sm line-clamp-2 mb-4 flex-1">
            {expert.bio}
          </p>
          <div className="flex items-center justify-between text-sm pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-textMuted">
              <Clock className="w-4 h-4" />
              <span>{expert.experience} yrs exp</span>
            </div>
            <div className="text-primary font-medium group-hover:text-accent transition-colors flex items-center gap-1">
              Book Session &rarr;
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExpertCard;
