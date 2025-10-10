import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  actionButton?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, actionButton }) => {
  return (
    <div className="text-center bg-white p-12 rounded-lg border-2 border-dashed border-gray-300">
      <div className="mx-auto h-12 w-12 text-gray-400">
        {icon}
      </div>
      <h3 className="mt-2 text-lg font-medium text-dark-blue">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
      {actionButton && (
        <div className="mt-6">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
