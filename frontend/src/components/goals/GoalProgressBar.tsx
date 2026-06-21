import React from 'react';

export const GoalProgressBar = ({ progress }: { progress: number }) => {
  let colorClass = 'bg-red-500';
  if (progress > 25 && progress <= 50) colorClass = 'bg-orange-500';
  else if (progress > 50 && progress <= 75) colorClass = 'bg-blue-500';
  else if (progress > 75) colorClass = 'bg-emerald-500';

  return (
    <div className="w-full bg-[#1e293b] rounded-full h-2.5 mt-2 overflow-hidden border border-white/5">
      <div 
        className={`${colorClass} h-2.5 rounded-full transition-all duration-500 ease-in-out`} 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
