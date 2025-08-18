import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const GradientContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -2,
  background: `
    radial-gradient(circle at 20% 80%, 
      rgba(147, 197, 253, 0.15) 0%, 
      transparent 60%
    ),
    radial-gradient(circle at 80% 20%, 
      rgba(196, 181, 253, 0.15) 0%, 
      transparent 60%
    ),
    radial-gradient(circle at 40% 40%, 
      rgba(167, 243, 208, 0.1) 0%, 
      transparent 70%
    ),
    linear-gradient(135deg, 
      rgba(239, 246, 255, 0.8) 0%, 
      rgba(243, 244, 246, 0.8) 25%, 
      rgba(249, 250, 251, 0.8) 50%, 
      rgba(243, 244, 246, 0.8) 75%, 
      rgba(239, 246, 255, 0.8) 100%
    )
  `,
});

const BlurContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backdropFilter: 'blur(80px)',
  WebkitBackdropFilter: 'blur(80px)',
  zIndex: -1,
  pointerEvents: 'none',
});


interface GradientBackgroundProps {
  children?: React.ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => {
  return (
    <>
      <GradientContainer />
      <BlurContainer />
      {children}
    </>
  );
};

export default GradientBackground;