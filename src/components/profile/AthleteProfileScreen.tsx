import React, { useState } from 'react';
import styled from 'styled-components';
import {
  User,
  Save,
  Scale,
  Ruler,
  Activity,
  HeartPulse,
  Flame,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 40px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const MetricCard = styled.div<{ $highlight?: boolean }>`
  background: ${({ theme, $highlight }) =>
    $highlight ? 'rgba(249, 115, 22, 0.1)' : theme.colors.surface};
  border: 1px solid
    ${({ theme, $highlight }) =>
      $highlight ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
`;

const MetricLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MetricValue = styled.span`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const MetricDesc = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 12px 14px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
`;

const Select = styled.select`
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 12px 14px;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
`;

const InfoBox = styled.div`
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 14px;
  font-size: 0.825rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.45;
  display: flex;
  gap: 10px;
  align-items: flex-start;

  svg {
    color: #38bdf8;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const AthleteProfileScreen: React.FC = () => {
  const { profile, updateProfile, showFeedback } = useApp();

  const [name, setName] = useState(profile.name || '');
  const [nickname, setNickname] = useState(profile.nickname || '');
  const [gender, setGender] = useState<'masculino' | 'feminino'>(profile.gender || 'masculino');
  const [age, setAge] = useState(profile.age || 30);
  const [weightKg, setWeightKg] = useState(profile.weightKg || 80);
  const [heightCm, setHeightCm] = useState(profile.heightCm || 178);
  const [waistCm, setWaistCm] = useState(profile.waistCm || 85);
  const [neckCm, setNeckCm] = useState(profile.neckCm || 39);
  const [hipCm, setHipCm] = useState(profile.hipCm || 98);

  // 1. CÁLCULO DO IMC (Informativo)
  const heightM = heightCm / 100;
  const imc = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '0';

  // 2. FÓRMULA DA MARINHA AMERICANA (U.S. Navy Body Fat Formula)
  // Homens: 495 / (1.0324 - 0.19077 * log10(cintura - pescoço) + 0.15456 * log10(altura)) - 450
  // Mulheres: 495 / (1.29579 - 0.35004 * log10(cintura + quadril - pescoço) + 0.22100 * log10(altura)) - 450
  let calculatedBf: number | null = null;
  if (heightCm > 0 && waistCm > 0 && neckCm > 0) {
    if (gender === 'masculino') {
      const waistDiff = waistCm - neckCm;
      if (waistDiff > 0) {
        const density = 1.0324 - 0.19077 * Math.log10(waistDiff) + 0.15456 * Math.log10(heightCm);
        calculatedBf = Math.max(3, Math.min(50, Math.round((495 / density - 450) * 10) / 10));
      }
    } else {
      const totalDiff = waistCm + hipCm - neckCm;
      if (totalDiff > 0) {
        const density = 1.29579 - 0.35004 * Math.log10(totalDiff) + 0.22100 * Math.log10(heightCm);
        calculatedBf = Math.max(8, Math.min(60, Math.round((495 / density - 450) * 10) / 10));
      }
    }
  }

  // 3. MASSA MAGRA & MASSA GORDA
  const fatMassKg = calculatedBf ? Math.round((weightKg * (calculatedBf / 100)) * 10) / 10 : null;
  const leanMassKg = fatMassKg !== null ? Math.round((weightKg - fatMassKg) * 10) / 10 : null;

  // 4. RELAÇÃO CINTURA-ESTATURA (RCE) - Marcador visceral
  const waistToHeightRatio = heightCm > 0 ? (waistCm / heightCm).toFixed(2) : '0';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      nickname,
      gender,
      age: Number(age),
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      waistCm: Number(waistCm),
      neckCm: Number(neckCm),
      hipCm: Number(hipCm),
      bodyFatPercentage: calculatedBf || undefined,
    });
    showFeedback('Perfil do atleta e medições atualizadas com sucesso!');
  };

  return (
    <Container>
      <TitleSection>
        <Title>Perfil do Atleta</Title>
        <Subtitle>
          Identificação, biometria e avaliação precisa de composição corporal além do IMC
        </Subtitle>
      </TitleSection>

      {/* DASHBOARD DE COMPOSIÇÃO FÍSICA REAL */}
      <Card>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={20} color="#f97316" /> Composição Corporal Real
        </h3>

        <MetricsGrid>
          <MetricCard $highlight={true}>
            <MetricLabel>
              <Percent size={14} color="#f97316" /> % Gordura (BF)
            </MetricLabel>
            <MetricValue>{calculatedBf !== null ? `${calculatedBf}%` : '--'}</MetricValue>
            <MetricDesc>Fórmula da Marinha dos EUA</MetricDesc>
          </MetricCard>

          <MetricCard>
            <MetricLabel>
              <Flame size={14} color="#10b981" /> Massa Magra
            </MetricLabel>
            <MetricValue>{leanMassKg !== null ? `${leanMassKg} kg` : '--'}</MetricValue>
            <MetricDesc>Músculos, ossos e órgãos</MetricDesc>
          </MetricCard>

          <MetricCard>
            <MetricLabel>
              <Scale size={14} color="#38bdf8" /> Massa Gorda
            </MetricLabel>
            <MetricValue>{fatMassKg !== null ? `${fatMassKg} kg` : '--'}</MetricValue>
            <MetricDesc>Gordura corporal total</MetricDesc>
          </MetricCard>

          <MetricCard>
            <MetricLabel>
              <HeartPulse size={14} color="#eab308" /> Cintura/Estatura
            </MetricLabel>
            <MetricValue>{waistToHeightRatio}</MetricValue>
            <MetricDesc>{Number(waistToHeightRatio) <= 0.5 ? 'Excelente (Ideal)' : 'Atenção Visceral'}</MetricDesc>
          </MetricCard>
        </MetricsGrid>

        <div style={{ marginTop: 14 }}>
          <InfoBox>
            <ShieldCheck size={20} />
            <div>
              <strong>Por que não usamos apenas o IMC?</strong>
              <br />
              O IMC clássico calcula apenas peso dividido por altura ao quadrado (atualmente {imc}), o que classifica muitos atletas musculosos erroneamente como "sobrepeso". O método da Marinha e a Relação Cintura-Estatura medem a real distribuição de gordura corporal!
            </div>
          </InfoBox>
        </div>
      </Card>

      {/* FORMULÁRIO DE BIOMETRIA E DADOS DO ATLETA */}
      <Card>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={20} color="#f97316" /> Dados Pessoais & Apelido
          </h3>

          <FormRow>
            <FormGroup>
              <Label>Nome Completo:</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Silva"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Apelido / Como quer ser chamado no App:</Label>
              <Input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ex: Carlão ou Fênix"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Gênero Biológico (para equações de gordura):</Label>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'masculino' | 'feminino')}
              >
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Idade:</Label>
              <Input
                type="number"
                min="12"
                max="100"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </FormGroup>
          </FormRow>

          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '8px 0 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ruler size={20} color="#38bdf8" /> Medições Corporais Antropométricas
          </h3>

          <FormRow>
            <FormGroup>
              <Label>
                <Scale size={15} /> Peso Corporal (kg):
              </Label>
              <Input
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Ruler size={15} /> Altura (cm):
              </Label>
              <Input
                type="number"
                min="100"
                max="250"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Circunferência da Cintura (cm):</Label>
              <Input
                type="number"
                step="0.5"
                min="40"
                max="200"
                value={waistCm}
                onChange={(e) => setWaistCm(Number(e.target.value))}
                placeholder="Na linha do umbigo"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Circunferência do Pescoço (cm):</Label>
              <Input
                type="number"
                step="0.5"
                min="20"
                max="70"
                value={neckCm}
                onChange={(e) => setNeckCm(Number(e.target.value))}
                placeholder="Logo abaixo do pomo de Adão"
                required
              />
            </FormGroup>
          </FormRow>

          {gender === 'feminino' && (
            <FormGroup>
              <Label>Circunferência do Quadril (cm) - Mulheres:</Label>
              <Input
                type="number"
                step="0.5"
                min="50"
                max="200"
                value={hipCm}
                onChange={(e) => setHipCm(Number(e.target.value))}
                placeholder="Na maior circunferência dos glúteos"
              />
            </FormGroup>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button variant="primary" size="lg" fullWidth type="submit">
              <Save size={18} /> Salvar Dados do Perfil
            </Button>
          </div>
        </form>
      </Card>

      {/* CARD DE SAÚDE LOMBAR & OBJETIVOS */}
      <Card>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px 0' }}>
          Objetivo Atual & Condição Lombar
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: '#9ca3af' }}>Objetivo: </span>
            <strong>{profile.mainGoal}</strong>
          </div>
          <div>
            <span style={{ color: '#9ca3af' }}>Metodologia: </span>
            <Badge variant="primary">{profile.methodDescription}</Badge>
          </div>
          <div>
            <span style={{ color: '#9ca3af' }}>Condição Lombar: </span>
            <span>{profile.initialStatus.lumbarCondition}</span>
          </div>
        </div>
      </Card>
    </Container>
  );
};
