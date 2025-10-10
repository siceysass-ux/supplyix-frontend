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
        <h2 className="text-3xl font-bold leading-tight text-dark-blue sm:truncate">
          {title}
        </h2>
        <p className="mt-2 text-md text-slate-600">
          {subtitle}
        </p>
      </div>
      {children && (
        <div className="mt-4 flex flex-shrink-0 md:mt-0 md:ml-4">
            {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
