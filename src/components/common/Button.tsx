import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background: ${({ theme }) => theme.colors.primary};
        color: #ffffff;
        box-shadow: ${({ theme }) => theme.shadows.glow};
        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.primaryHover};
          transform: translateY(-1px);
        }
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    case 'secondary':
      return css`
        background: ${({ theme }) => theme.colors.surfaceHover};
        color: ${({ theme }) => theme.colors.text};
        border: 1px solid ${({ theme }) => theme.colors.border};
        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.surfaceActive};
        }
      `;
    case 'outline':
      return css`
        background: transparent;
        color: ${({ theme }) => theme.colors.primary};
        border: 1.5px solid ${({ theme }) => theme.colors.primary};
        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.primaryLight};
        }
      `;
    case 'danger':
      return css`
        background: ${({ theme }) => theme.colors.danger};
        color: #ffffff;
        &:hover:not(:disabled) {
          filter: brightness(0.9);
        }
      `;
    case 'ghost':
      return css`
        background: transparent;
        color: ${({ theme }) => theme.colors.textSecondary};
        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.surfaceHover};
          color: ${({ theme }) => theme.colors.text};
        }
      `;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return css`
        min-height: 38px;
        padding: 6px 14px;
        font-size: 0.875rem;
        font-weight: 500;
        gap: 6px;
      `;
    case 'md':
      return css`
        min-height: 48px;
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: 600;
        gap: 8px;
      `;
    case 'lg':
      return css`
        min-height: 56px;
        padding: 14px 24px;
        font-size: 1.125rem;
        font-weight: 700;
        gap: 10px;
      `;
  }
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all 0.15s ease-in-out;
  user-select: none;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $size }) => getSizeStyles($size)}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...rest
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};
