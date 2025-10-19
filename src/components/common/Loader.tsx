import React from 'react';

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
};

const Loader = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const loaderSizeClass: string = sizeClasses[size] || sizeClasses.md;

    return (
        <div className="flex items-center justify-center">
            <div
                className={`
          animate-spin 
          text-white
          rounded-full 
          border-4 
          border-t-transparent 
          ${loaderSizeClass}
        `}
            ></div>
        </div>
    );
};

export default Loader;
