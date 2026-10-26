import React from 'react';
import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const StyledBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background: ${theme.colors.primaryLight};
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
        `;
      case 'success':
        return css`
          background: ${theme.colors.successLight};
          color: ${theme.colors.success};
          border: 1px solid ${theme.colors.success};
        `;
      case 'warning':
        return css`
          background: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
          border: 1px solid ${theme.colors.warning};
        `;
      case 'danger':
        return css`
          background: ${theme.colors.dangerLight};
          color: ${theme.colors.danger};
          border: 1px solid ${theme.colors.danger};
        `;
      case 'accent':
        return css`
          background: rgba(56, 189, 248, 0.15);
          color: ${theme.colors.accent};
          border: 1px solid ${theme.colors.accent};
        `;
      case 'neutral':
      default:
        return css`
          background: ${theme.colors.surfaceHover};
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
`;

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children }) => {
  return <StyledBadge $variant={variant}>{children}</StyledBadge>;
};
