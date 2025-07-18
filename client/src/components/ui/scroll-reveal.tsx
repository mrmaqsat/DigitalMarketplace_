import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'bounce' | 'rotate' | 'flip';
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

const animationVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  'slide-up': {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  'slide-down': {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
  },
  'slide-left': {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  'slide-right': {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  bounce: {
    hidden: { opacity: 0, y: 50, scale: 0.3 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  },
  rotate: {
    hidden: { opacity: 0, rotate: -180 },
    visible: { opacity: 1, rotate: 0 }
  },
  flip: {
    hidden: { opacity: 0, rotateY: -90 },
    visible: { opacity: 1, rotateY: 0 }
  }
};

export function ScrollReveal({ 
  children, 
  animation = 'fade',
  delay = 0,
  duration = 0.6,
  distance = 50,
  threshold = 0.1,
  once = true,
  className = ''
}: ScrollRevealProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { 
    threshold,
    once
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, inView, once]);

  // Customize animation based on distance prop
  const customVariants = {
    ...animationVariants[animation],
    hidden: {
      ...animationVariants[animation].hidden,
      ...(animation.includes('slide-up') && { y: distance }),
      ...(animation.includes('slide-down') && { y: -distance }),
      ...(animation.includes('slide-left') && { x: distance }),
      ...(animation.includes('slide-right') && { x: -distance })
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={customVariants}
      transition={{ 
        duration,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Convenience components for common animations
export const FadeIn = ({ children, delay = 0, duration = 0.6, className = '' }: { 
  children: ReactNode; 
  delay?: number; 
  duration?: number; 
  className?: string; 
}) => (
  <ScrollReveal animation="fade" delay={delay} duration={duration} className={className}>
    {children}
  </ScrollReveal>
);

export const SlideUp = ({ children, delay = 0, duration = 0.6, distance = 50, className = '' }: { 
  children: ReactNode; 
  delay?: number; 
  duration?: number; 
  distance?: number; 
  className?: string; 
}) => (
  <ScrollReveal animation="slide-up" delay={delay} duration={duration} distance={distance} className={className}>
    {children}
  </ScrollReveal>
);

export const SlideIn = ({ children, direction = 'left', delay = 0, duration = 0.6, distance = 50, className = '' }: { 
  children: ReactNode; 
  direction?: 'left' | 'right'; 
  delay?: number; 
  duration?: number; 
  distance?: number; 
  className?: string; 
}) => (
  <ScrollReveal 
    animation={direction === 'left' ? 'slide-left' : 'slide-right'} 
    delay={delay} 
    duration={duration} 
    distance={distance} 
    className={className}
  >
    {children}
  </ScrollReveal>
);

export const ScaleIn = ({ children, delay = 0, duration = 0.6, className = '' }: { 
  children: ReactNode; 
  delay?: number; 
  duration?: number; 
  className?: string; 
}) => (
  <ScrollReveal animation="scale" delay={delay} duration={duration} className={className}>
    {children}
  </ScrollReveal>
);

export const BounceIn = ({ children, delay = 0, duration = 0.8, className = '' }: { 
  children: ReactNode; 
  delay?: number; 
  duration?: number; 
  className?: string; 
}) => (
  <ScrollReveal animation="bounce" delay={delay} duration={duration} className={className}>
    {children}
  </ScrollReveal>
);

// Stagger animation for lists
export const StaggerContainer = ({ children, staggerDelay = 0.1, className = '' }: { 
  children: ReactNode; 
  staggerDelay?: number; 
  className?: string; 
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, threshold: 0.1 }}
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, animation = 'fade', className = '' }: { 
  children: ReactNode; 
  animation?: 'fade' | 'slide-up' | 'scale';
  className?: string; 
}) => (
  <motion.div
    variants={animationVariants[animation]}
    className={className}
  >
    {children}
  </motion.div>
);
