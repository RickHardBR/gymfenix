import React from 'react';
import type { ReactNode, HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  highlight?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const StyledCard = styled.div<{ $highlight?: boolean; $padding: 'sm' | 'md' | 'lg' }>`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme, $highlight }) => ($highlight ? theme.colors.primary : theme.colors.border)};
  box-shadow: ${({ theme, $highlight }) => ($highlight ? theme.shadows.glow : theme.shadows.sm)};
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;

  ${({ $padding }) => {
    switch ($padding) {
      case 'sm':
        return css`
          padding: 12px 16px;
        `;
      case 'lg':
        return css`
          padding: 24px;
        `;
      case 'md':
      default:
        return css`
          padding: 18px 20px;
        `;
    }
  }}
`;

export const Card: React.FC<CardProps> = ({
  highlight = false,
  padding = 'md',
  children,
  ...rest
}) => {
  return (
    <StyledCard $highlight={highlight} $padding={padding} {...rest}>
      {children}
    </StyledCard>
  );
};
