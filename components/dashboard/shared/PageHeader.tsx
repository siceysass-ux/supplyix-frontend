import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  children?: ReactNode; // For action buttons
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="mb-8 md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-dark-blue sm:text-3xl sm:truncate">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {subtitle}
        </p>
      </div>
      {children && (
        <div className="mt-4 flex md:mt-0 md:ml-4">
            {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
