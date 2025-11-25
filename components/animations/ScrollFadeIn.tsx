import React, { useEffect, useRef, useState } from 'react';

interface ScrollFadeInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
}

const ScrollFadeIn: React.FC<ScrollFadeInProps> = ({
    children,
    delay = 0,
    direction = 'up',
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [delay]);

    const getTransform = () => {
        if (isVisible) return 'translate(0, 0)';
        switch (direction) {
            case 'up': return 'translate(0, 40px)';
            case 'down': return 'translate(0, -40px)';
            case 'left': return 'translate(40px, 0)';
            case 'right': return 'translate(-40px, 0)';
            default: return 'translate(0, 40px)';
        }
    };

    return (
        <div
            ref={elementRef}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: getTransform(),
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
        >
            {children}
        </div>
    );
};

export default ScrollFadeIn;
