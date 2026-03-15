import React, { useState, useEffect, useRef } from 'react';

// Scroll Reveal Wrapper Component
export const ScrollReveal = ({ children, delay = 0, style = {}, threshold = 0.1, rootMargin = "0px 0px -50px 0px" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Unobserve once animated
                }
            },
            {
                threshold: threshold,
                rootMargin: rootMargin
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, rootMargin]);

    // Provide inline animation properties combined with the dynamic state
    const revealStyle = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: `all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms`,
        ...style
    };

    return (
        <div ref={ref} style={revealStyle}>
            {children}
        </div>
    );
};
