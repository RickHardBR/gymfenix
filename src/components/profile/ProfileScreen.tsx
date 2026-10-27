import React, { useState } from 'react';
import styled from 'styled-components';
import { User, ShieldAlert, Save, RotateCcw, AlertTriangle, Moon, Cloud, CloudCheck, LogOut, LogIn, RefreshCw, Smartphone, Maximize, Minimize, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePWA } from '../../hooks/usePWA';
import { PWAInstallModal } from '../common/PWAInstallModal';
import { INITIAL_USER_PROFILE } from '../../types/profile';
import type { UserProfile, ExperienceLevel, TrainingMethod } from '../../types/profile';
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
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

const TextArea = styled.textarea`
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 12px 14px;
  font-size: 0.95rem;
  min-height: 80px;
  resize: vertical;
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
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  padding: 6px 0;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    accent-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SettingTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SettingDesc = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DisclaimerCard = styled(Card)`
  background: ${({ theme }) => (theme.name === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.1)')};
  border-color: ${({ theme }) => theme.colors.danger};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DisclaimerTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.danger};
`;

const DisclaimerText = styled.p`
  font-size: 0.8rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
`;

export const ProfileScreen: React.FC = () => {
  const { profile, settings, updateProfile, updateSettings, user, openAuthModal, syncWithCloud, isSyncing, logout } = useApp();

  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleTextChange = (field: keyof UserProfile, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInitialStatusChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      initialStatus: {
        ...prev.initialStatus,
        [field]: value,
      },
    }));
  };

  const { isInstallable, isStandalone, isFullscreen, isIOS, promptInstall, toggleFullscreen } = usePWA();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  const handleResetToDefaults = async () => {
    if (window.confirm('Deseja restaurar as configurações padrão iniciais do perfil?')) {
      setFormData(INITIAL_USER_PROFILE);
      await updateProfile(INITIAL_USER_PROFILE);
    }
  };

  return (
    <Container>
      <TitleSection>
        <Title>Ajustes do Sistema</Title>
        <Subtitle>Configurações do aplicativo, sincronização na nuvem Supabase e segurança</Subtitle>
      </TitleSection>

      {/* Card de Instalação no Celular & Tela Cheia */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <Smartphone size={20} color="#ff5500" /> Aplicativo Móvel & Tela Cheia
          </h3>
          <Badge variant={isStandalone ? 'success' : 'accent'}>
            {isStandalone ? 'App Instalado' : 'Modo Web'}
          </Badge>
        </div>

        <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#a0a5b5', lineHeight: 1.45 }}>
          Instale o Fenix Gym diretamente no seu celular para remover as barras do navegador, utilizar a <strong>tela cheia total</strong> e acessar seus treinos instantaneamente na academia, inclusive offline.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {!isStandalone && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsInstallModalOpen(true)}
              type="button"
            >
              <Download size={15} /> Instalar no Celular
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            type="button"
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            {isFullscreen ? 'Sair da Tela Cheia' : 'Modo Tela Cheia'}
          </Button>
        </div>
      </Card>

      {/* Card de Conta & Sincronização na Nuvem */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <Cloud size={20} color="#ff5500" /> Conta & Nuvem Supabase
          </h3>
          <Badge variant={user ? 'success' : 'neutral'}>
            {user ? 'Conectado' : 'Modo Offline'}
          </Badge>
        </div>

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: '0.85rem', color: '#a0a5b5' }}>
              Atleta conectado: <strong style={{ color: '#ffffff' }}>{user.email}</strong>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => syncWithCloud()}
                disabled={isSyncing}
                type="button"
              >
                {isSyncing ? <RefreshCw size={14} className="spin" /> : <CloudCheck size={14} />}
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                type="button"
              >
                <LogOut size={14} /> Sair da Conta
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a0a5b5', lineHeight: 1.4 }}>
              Conecte sua conta para fazer backup automático na nuvem, sincronizar treinos entre dispositivos e nunca perder seu histórico.
            </p>
            <div>
              <Button
                variant="primary"
                size="sm"
                onClick={openAuthModal}
                type="button"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <LogIn size={15} /> Entrar ou Criar Conta
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Formulário de Perfil do Usuário */}
      <Card>
        <form onSubmit={handleSaveProfile}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={20} /> Dados do Atleta
          </h3>
          <Badge variant="accent">{formData.experienceLevel}</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormGroup>
            <Label htmlFor="athlete-name">Nome do Atleta</Label>
            <Input
              id="athlete-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleTextChange('name', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="main-goal">Objetivo Principal</Label>
            <Input
              id="main-goal"
              type="text"
              value={formData.mainGoal}
              onChange={(e) => handleTextChange('mainGoal', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="training-location">Local e Equipamentos</Label>
            <Input
              id="training-location"
              type="text"
              value={formData.trainingLocation}
              onChange={(e) => handleTextChange('trainingLocation', e.target.value)}
              required
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="experience-level">Nível de Experiência</Label>
              <Select
                id="experience-level"
                value={formData.experienceLevel}
                onChange={(e) => handleTextChange('experienceLevel', e.target.value as ExperienceLevel)}
              >
                <option value="iniciante">Iniciante (0-6 meses)</option>
                <option value="intermediario">Intermediário (6m-2a)</option>
                <option value="avancado">Avançado (2+ anos)</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="weekly-frequency">Frequência Semanal</Label>
              <Select
                id="weekly-frequency"
                value={formData.weeklyFrequency}
                onChange={(e) => handleTextChange('weeklyFrequency', Number(e.target.value))}
              >
                <option value="2">2x por semana</option>
                <option value="3">3x por semana (Full Body A/B/C)</option>
                <option value="4">4x por semana</option>
                <option value="5">5x por semana</option>
              </Select>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="training-method">Método de Treinamento</Label>
            <Select
              id="training-method"
              value={formData.method}
              onChange={(e) => handleTextChange('method', e.target.value as TrainingMethod)}
            >
              <option value="fullbody_abc">Full Body A, B e C Alternados</option>
              <option value="upper_lower">Upper / Lower (Superior / Inferior)</option>
              <option value="ppl">Push / Pull / Legs</option>
              <option value="outro">Personalizado</option>
            </Select>
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="duration-min">Duração Mín (minutos)</Label>
              <Input
                id="duration-min"
                type="number"
                min="30"
                max="180"
                value={formData.availableDurationMinutes.min}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availableDurationMinutes: {
                      ...prev.availableDurationMinutes,
                      min: Number(e.target.value),
                    },
                  }))
                }
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="duration-max">Duração Máx (minutos)</Label>
              <Input
                id="duration-max"
                type="number"
                min="30"
                max="180"
                value={formData.availableDurationMinutes.max}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availableDurationMinutes: {
                      ...prev.availableDurationMinutes,
                      max: Number(e.target.value),
                    },
                  }))
                }
              />
            </FormGroup>
          </FormRow>

          <Button type="submit" variant="primary" size="md" fullWidth>
            <Save size={18} />
            Salvar Alterações do Perfil
          </Button>
        </div>
        </form>
      </Card>

      {/* Histórico Clínico e Cuidados de Segurança */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <ShieldAlert size={20} color="#f59e0b" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Segurança e Adaptação Lombar</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormGroup>
            <Label htmlFor="days-inactive">Dias de Inatividade Anterior</Label>
            <Input
              id="days-inactive"
              type="number"
              min="0"
              value={formData.initialStatus.daysInactive}
              onChange={(e) => handleInitialStatusChange('daysInactive', Number(e.target.value))}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="lumbar-condition">Situação Lombar e Articular</Label>
            <TextArea
              id="lumbar-condition"
              value={formData.initialStatus.lumbarCondition}
              onChange={(e) => handleInitialStatusChange('lumbarCondition', e.target.value)}
            />
          </FormGroup>

          <CheckboxLabel>
            <input
              type="checkbox"
              checked={formData.initialStatus.currentPain}
              onChange={(e) => handleInitialStatusChange('currentPain', e.target.checked)}
            />
            <span>Sente dor ou desconforto agudo no momento?</span>
          </CheckboxLabel>

          {formData.initialStatus.currentPain && (
            <FormGroup>
              <Label htmlFor="pain-notes">Detalhes e Localização do Desconforto</Label>
              <Input
                id="pain-notes"
                type="text"
                placeholder="Ex: leve incômodo na lombar ao flexionar o tronco"
                value={formData.initialStatus.painNotes}
                onChange={(e) => handleInitialStatusChange('painNotes', e.target.value)}
              />
            </FormGroup>
          )}

          <Button type="button" variant="secondary" size="md" onClick={handleSaveProfile} fullWidth>
            <Save size={18} />
            Atualizar Parâmetros de Segurança
          </Button>
        </div>
      </Card>

      {/* Preferências do Aplicativo */}
      <Card>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Moon size={20} /> Preferências do Aplicativo
        </h3>

        <SettingRow>
          <SettingInfo>
            <SettingTitle>Tema Visual</SettingTitle>
            <SettingDesc>{settings.theme === 'dark' ? 'Tema Escuro (Moderno)' : 'Tema Claro'}</SettingDesc>
          </SettingInfo>
          <Select
            aria-label="Selecionar tema visual"
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as 'dark' | 'light' })}
            style={{ width: 'auto', padding: '6px 12px' }}
          >
            <option value="dark">Escuro</option>
            <option value="light">Claro</option>
          </Select>
        </SettingRow>

        <SettingRow>
          <SettingInfo>
            <SettingTitle>Avisos Sonoros</SettingTitle>
            <SettingDesc>Tocar alerta sonoro ao terminar o cronômetro</SettingDesc>
          </SettingInfo>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
            style={{ width: 20, height: 20, accentColor: '#f97316' }}
            aria-label="Ativar avisos sonoros"
          />
        </SettingRow>

        <SettingRow>
          <SettingInfo>
            <SettingTitle>Início Automático do Descanso</SettingTitle>
            <SettingDesc>Disparar cronômetro imediatamente após marcar uma série</SettingDesc>
          </SettingInfo>
          <input
            type="checkbox"
            checked={settings.autoStartTimer}
            onChange={(e) => updateSettings({ autoStartTimer: e.target.checked })}
            style={{ width: 20, height: 20, accentColor: '#f97316' }}
            aria-label="Ativar início automático do descanso"
          />
        </SettingRow>

        <SettingRow>
          <SettingInfo>
            <SettingTitle>Descanso Padrão</SettingTitle>
            <SettingDesc>Tempo base recomendado entre séries</SettingDesc>
          </SettingInfo>
          <Select
            aria-label="Tempo base de descanso"
            value={settings.restTimerDefaultSeconds}
            onChange={(e) => updateSettings({ restTimerDefaultSeconds: Number(e.target.value) })}
            style={{ width: 'auto', padding: '6px 12px' }}
          >
            <option value="60">60 segundos</option>
            <option value="90">90 segundos</option>
            <option value="120">2 minutos</option>
            <option value="180">3 minutos</option>
          </Select>
        </SettingRow>
      </Card>

      {/* Aviso Legal de Saúde & Segurança */}
      <DisclaimerCard>
        <DisclaimerTitle>
          <AlertTriangle size={18} />
          Aviso Importante de Segurança
        </DisclaimerTitle>
        <DisclaimerText>
          O <strong>Fenix Gym Tracker</strong> é uma ferramenta de auxílio ao registro e acompanhamento de treinos. O
          aplicativo não substitui a orientação, prescrição e acompanhamento individualizado de um profissional de
          educação física, fisioterapeuta ou médico. Se sentir qualquer dor aguda ou desconforto durante os exercícios,
          interrompa a execução imediatamente e busque avaliação profissional.
        </DisclaimerText>
      </DisclaimerCard>

      {/* Restaurar Padrões */}
      <ActionsContainer>
        <Button variant="ghost" size="sm" onClick={handleResetToDefaults}>
          <RotateCcw size={16} />
          Restaurar Configurações Originais
        </Button>
      </ActionsContainer>

      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstall={promptInstall}
        isIOS={isIOS}
        isInstallable={isInstallable}
        onToggleFullscreen={toggleFullscreen}
      />
    </Container>
  );
};
