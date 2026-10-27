import React from 'react';
import styled from 'styled-components';
import { Home, Dumbbell, BookOpen, TrendingUp, User, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AppTab } from '../../context/AppContext';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  padding: 0 8px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);

  @media (min-width: 768px) {
    max-width: 500px;
    margin: 0 auto;
    border-radius: ${({ theme }) => `${theme.radii.lg} ${theme.radii.lg} 0 0`};
    border-left: 1px solid ${({ theme }) => theme.colors.border};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const NavItem = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 0;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textMuted)};
  transition: all 0.15s ease;
  min-height: 48px;

  &:hover {
    color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  }

  svg {
    stroke-width: ${({ $active }) => ($active ? 2.5 : 2)};
    transform: ${({ $active }) => ($active ? 'scale(1.1)' : 'scale(1)')};
    transition: transform 0.15s ease;
  }
`;

const NavLabel = styled.span<{ $active: boolean }>`
  font-size: 0.7rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  letter-spacing: 0.2px;
`;

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab } = useApp();

  const tabs: { id: AppTab; label: string; icon: React.ReactElement }[] = [
    { id: 'inicio', label: 'Início', icon: <Home size={20} /> },
    { id: 'treinos', label: 'Treinos', icon: <Dumbbell size={20} /> },
    { id: 'exercicios', label: 'Exercícios', icon: <BookOpen size={20} /> },
    { id: 'evolucao', label: 'Evolução', icon: <TrendingUp size={20} /> },
    { id: 'perfil', label: 'Perfil', icon: <User size={20} /> },
    { id: 'configuracoes', label: 'Ajustes', icon: <Settings size={20} /> },
  ];

  return (
    <NavContainer role="navigation" aria-label="Navegação principal">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <NavItem
            key={tab.id}
            $active={isActive}
            onClick={() => setCurrentTab(tab.id)}
            aria-selected={isActive}
            role="tab"
            aria-label={tab.label}
          >
            {tab.icon}
            <NavLabel $active={isActive}>{tab.label}</NavLabel>
          </NavItem>
        );
      })}
    </NavContainer>
  );
};
