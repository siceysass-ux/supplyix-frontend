import React from 'react';
import { Icon, IconName } from './Icon';

export interface Feature {
  iconName: IconName;
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: Feature;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 text-left transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:shadow-primary/10">
      <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block mb-4">
        <Icon iconName={feature.iconName} className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-dark-blue mb-2">{feature.title}</h3>
      <p className="text-gray-600">
        {feature.description}
      </p>
    </div>
  );
};