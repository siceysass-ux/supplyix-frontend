import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  actionButton?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, actionButton }) => {
  return (
    <div className="text-center bg-white p-12 rounded-xl border border-slate-200">
      <div className="mx-auto h-12 w-12 text-slate-400">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-dark-blue">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{message}</p>
      {actionButton && (
        <div className="mt-6">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
