import React from 'react';

const Progressbar = () => {
  return (
    <div className="fixed top-0 h-1 w-full overflow-hidden bg-slate-400">
      <div className="h-full w-full origin-left-right animate-progress bg-primary"></div>
    </div>
  );
};

export default Progressbar;
