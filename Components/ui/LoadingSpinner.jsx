import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'default', text }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={`${sizeClasses[size]} text-amber-500 animate-spin`} />
      {text && <p className="mt-4 text-slate-500 text-sm">{text}</p>}
    </div>
  );
}