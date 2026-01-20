import React from 'react';
import { Award, Crown, Gem, Medal } from 'lucide-react';

const levelConfig = {
  bronze: {
    icon: Medal,
    label: 'Bronce',
    color: 'from-amber-600 to-amber-700',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  silver: {
    icon: Award,
    label: 'Plata',
    color: 'from-slate-400 to-slate-500',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
  },
  gold: {
    icon: Crown,
    label: 'Oro',
    color: 'from-yellow-400 to-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
  },
  platinum: {
    icon: Gem,
    label: 'Platino',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
};

export default function LevelBadge({ level = 'bronze', size = 'default' }) {
  const config = levelConfig[level] || levelConfig.bronze;
  const Icon = config.icon;
  const isSmall = size === 'small';

  return (
    <div className={`inline-flex items-center gap-2 rounded-full ${config.bgColor} ${
      isSmall ? 'px-2.5 py-1' : 'px-4 py-2'
    }`}>
      <div className={`bg-gradient-to-br ${config.color} rounded-full p-1`}>
        <Icon className={`text-white ${isSmall ? 'w-3 h-3' : 'w-4 h-4'}`} />
      </div>
      <span className={`font-semibold ${config.textColor} ${isSmall ? 'text-xs' : 'text-sm'}`}>
        {config.label}
      </span>
    </div>
  );
}