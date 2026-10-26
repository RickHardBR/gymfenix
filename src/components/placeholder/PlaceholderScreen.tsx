import React from 'react';
import styled from 'styled-components';
import { Dumbbell, BookOpen, TrendingUp, Sparkles, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AppTab } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  text-align: center;
  padding: 30px 10px;
`;

const IconCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.glow};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 420px;
  line-height: 1.6;
`;

const FeaturesCard = styled(Card)`
  text-align: left;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const PlaceholderScreen: React.FC<{ tab: AppTab }> = ({ tab }) => {
  const { setCurrentTab } = useApp();

  const getTabDetails = () => {
    switch (tab) {
      case 'treinos':
        return {
          icon: <Dumbbell size={36} />,
          title: 'Módulo de Treinos A, B e C',
          badge: 'Fase 2 do Projeto',
          desc: 'Nesta seção você poderá gerenciar e personalizar seus modelos de treino Full Body (A, B e C), reordenar exercícios, ajustar séries, repetições e tempos de descanso.',
          features: [
            'Treino A (Pernas, Peito e Costas) com ênfase em estabilidade',
            'Treino B (Pernas, Costas, Peito e Braços)',
            'Treino C (Corpo Inteiro e Cadeia Posterior)',
            'Registro de séries ao vivo, RIR e cronômetro de descanso (Fase 3)',
          ],
        };
      case 'exercicios':
        return {
          icon: <BookOpen size={36} />,
          title: 'Biblioteca de Exercícios',
          badge: 'Fase 2 do Projeto',
          desc: 'Biblioteca completa de movimentos com filtros por grupo muscular, equipamentos (máquinas, halteres, cabos) e foco em alternativas seguras para a região lombar.',
          features: [
            'Instruções objetivas de postura e execução anatômica',
            'Filtros por máquinas apoiadas vs peso livre',
            'Substituição de exercícios por equivalentes seguros',
            'Cadastro de exercícios personalizados offline',
          ],
        };
      case 'evolucao':
        return {
          icon: <TrendingUp size={36} />,
          title: 'Evolução e Gráficos de Carga',
          badge: 'Fase 4 do Projeto',
          desc: 'Acompanhamento do progresso de força, volume por grupo muscular, regra de progressão dupla transparente e histórico detalhado das sessões anteriores.',
          features: [
            'Gráficos de evolução de carga por exercício (Recharts)',
            'Cálculo de volume semanal por grupo muscular',
            'Sugestões explicáveis de aumento de carga (progressão dupla)',
            'Exportação e relatórios em CSV e JSON',
          ],
        };
      default:
        return {
          icon: <Sparkles size={36} />,
          title: 'Em Desenvolvimento',
          badge: 'Próxima Fase',
          desc: 'Esta funcionalidade faz parte do roadmap das próximas fases de desenvolvimento.',
          features: [],
        };
    }
  };

  const details = getTabDetails();

  return (
    <Container>
      <IconCircle>{details.icon}</IconCircle>
      <Badge variant="primary">{details.badge}</Badge>
      <Title>{details.title}</Title>
      <Description>{details.desc}</Description>

      {details.features.length > 0 && (
        <FeaturesCard>
          <strong style={{ fontSize: '0.9rem', color: '#9ca3af' }}>RECURSOS PROGRAMADOS:</strong>
          {details.features.map((f, i) => (
            <FeatureItem key={i}>
              <Sparkles size={16} />
              <span>{f}</span>
            </FeatureItem>
          ))}
        </FeaturesCard>
      )}

      <Button variant="secondary" size="md" onClick={() => setCurrentTab('inicio')}>
        <ArrowLeft size={18} />
        Voltar para a Tela Inicial
      </Button>
    </Container>
  );
};
