import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Cloud,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  KeyRound,
  Send,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  signInWithEmail,
  signUpWithEmail,
  resetPasswordForEmail,
  verifyEmailOtp,
  resendVerificationEmail,
} from '../../services/authService';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Header = styled.div`
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceHover};
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.surface : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.textMuted)};
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  font-size: 0.95rem;
  cursor: pointer;
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Form = styled.form`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 10px 14px;
  color: ${({ theme }) => theme.colors.text};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    color: ${({ theme }) => theme.colors.textMuted};
    flex-shrink: 0;
  }
`;

const Input = styled.input`
  width: 100%;
  background: none;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  padding: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GuestButton = styled.button`
  background: none;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.82rem;
  cursor: pointer;
  text-align: right;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const MessageBanner = styled.div<{ $type: 'error' | 'success' | 'info' }>`
  background: ${({ $type, theme }) =>
    $type === 'error'
      ? `${theme.colors.danger}22`
      : $type === 'success'
      ? `${theme.colors.success}22`
      : `${theme.colors.primary}22`};
  border: 1px solid
    ${({ $type, theme }) =>
      $type === 'error'
        ? theme.colors.danger
        : $type === 'success'
        ? theme.colors.success
        : theme.colors.primary};
  color: ${({ $type, theme }) =>
    $type === 'error'
      ? theme.colors.danger
      : $type === 'success'
      ? theme.colors.success
      : theme.colors.primary};
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.85rem;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.4;
`;

// Container da Tela de Verificação em Tempo Real
const VerifyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0;
`;

const EmailHighlightCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const AnimatedMailCircle = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 85, 0, 0.15);
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px dashed ${({ theme }) => theme.colors.primary};
    animation: rotate 6s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const RealtimePulseBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.775rem;
  font-weight: 700;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.15);
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};

  span.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.9); opacity: 0.6; }
    50% { transform: scale(1.3); opacity: 1; }
    100% { transform: scale(0.9); opacity: 0.6; }
  }
`;

const CodeInputWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const OtpInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 4px;
  text-align: center;
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const HintBox = styled.div`
  font-size: 0.775rem;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 10px 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.4;
`;

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, showFeedback, syncWithCloud } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // Polling em tempo real para verificar se o usuário validou pelo link no email
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Polling em segundo plano enquanto estiver na aba de verificação
  useEffect(() => {
    if (activeTab === 'verify' && email && password) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await signInWithEmail(email, password);
          if (res && res.session) {
            // Validado com sucesso em tempo real!
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            showFeedback('🎉 Conta confirmada e validada em tempo real! Bem-vindo!');
            closeAuthModal();
            await syncWithCloud();
          }
        } catch {
          // Continua aguardando confirmação silenciosamente
        }
      }, 3500);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [activeTab, email, password, showFeedback, closeAuthModal, syncWithCloud]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        await signInWithEmail(email, password);
        showFeedback('Login realizado com sucesso!');
        closeAuthModal();
        await syncWithCloud();
      } else if (activeTab === 'register') {
        const result = await signUpWithEmail(email, password, fullName);

        if (result.needsEmailConfirmation) {
          // Requer confirmação de e-mail: Abre tela de validação em tempo real
          setActiveTab('verify');
          setResendCooldown(60);
          showFeedback('Verifique sua caixa de entrada para validar a conta.');
        } else {
          // Auto-confirm já ativo no Supabase
          showFeedback('Conta criada com sucesso!');
          closeAuthModal();
          await syncWithCloud();
        }
      } else if (activeTab === 'forgot') {
        await resetPasswordForEmail(email);
        setSuccessMsg('Link de redefinição de senha enviado para seu email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro na autenticação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMsg('Digite o código de 6 dígitos enviado ao seu e-mail.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      await verifyEmailOtp(email, otpCode);
      // Tenta logar após validar
      await signInWithEmail(email, password);
      showFeedback('🎉 E-mail validado com sucesso! Seus treinos estão liberados.');
      closeAuthModal();
      await syncWithCloud();
    } catch (err: any) {
      setErrorMsg(err.message || 'Código inválido ou expirado. Tente novamente ou reenvie o código.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualCheck = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await signInWithEmail(email, password);
      if (res && res.session) {
        showFeedback('🎉 Conta validada com sucesso!');
        closeAuthModal();
        await syncWithCloud();
      } else {
        setErrorMsg('E-mail ainda não confirmado. Verifique o link em sua caixa de entrada.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'E-mail ainda pendente de confirmação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg(null);
    try {
      await resendVerificationEmail(email);
      setResendCooldown(60);
      setSuccessMsg('Novo e-mail de confirmação enviado!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao reenviar e-mail.');
    }
  };

  return (
    <Backdrop onClick={closeAuthModal} role="dialog" aria-modal="true">
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <Cloud size={20} color="#ff5500" />
            {activeTab === 'verify'
              ? 'Validação de Conta'
              : activeTab === 'forgot'
              ? 'Recuperar Senha'
              : 'Nuvem Fênix (Supabase)'}
          </Title>
          <CloseButton onClick={closeAuthModal} aria-label="Fechar modal">
            <X size={18} />
          </CloseButton>
        </Header>

        {activeTab !== 'forgot' && activeTab !== 'verify' && (
          <TabBar>
            <TabButton
              type="button"
              $active={activeTab === 'login'}
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
            >
              Entrar
            </TabButton>
            <TabButton
              type="button"
              $active={activeTab === 'register'}
              onClick={() => {
                setActiveTab('register');
                setErrorMsg(null);
              }}
            >
              Criar Conta
            </TabButton>
          </TabBar>
        )}

        {/* TELA DE VALIDAÇÃO EM TEMPO REAL */}
        {activeTab === 'verify' ? (
          <Form onSubmit={handleVerifyOtp}>
            <VerifyContainer>
              <EmailHighlightCard>
                <AnimatedMailCircle>
                  <Mail size={24} />
                </AnimatedMailCircle>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#fff' }}>
                    Confirme seu E-mail
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#aaa', wordBreak: 'break-all' }}>
                    Enviamos um link e código de 6 dígitos para:
                    <br />
                    <strong style={{ color: '#ff5500' }}>{email}</strong>
                  </p>
                </div>
                <RealtimePulseBadge>
                  <span className="dot" />
                  Aguardando validação em tempo real...
                </RealtimePulseBadge>
              </EmailHighlightCard>

              {errorMsg && (
                <MessageBanner $type="error">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </MessageBanner>
              )}

              {successMsg && (
                <MessageBanner $type="success">
                  <CheckCircle size={16} />
                  <span>{successMsg}</span>
                </MessageBanner>
              )}

              <InputGroup>
                <Label htmlFor="auth-otp">
                  <KeyRound size={14} style={{ display: 'inline', marginRight: 4 }} />
                  Digite o código de 6 dígitos (OTP) recebido:
                </Label>
                <CodeInputWrapper>
                  <OtpInput
                    id="auth-otp"
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    autoComplete="one-time-code"
                  />
                </CodeInputWrapper>
              </InputGroup>

              <PrimaryButton type="submit" disabled={isLoading || otpCode.length < 6}>
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="spin" /> Validando...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} /> Validar Código e Liberar Treino
                  </>
                )}
              </PrimaryButton>

              <SecondaryButton type="button" onClick={handleManualCheck} disabled={isLoading}>
                <ExternalLink size={16} /> Já cliquei no link do e-mail
              </SecondaryButton>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <ForgotPasswordLink
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  style={{ opacity: resendCooldown > 0 ? 0.6 : 1 }}
                >
                  <Send size={13} style={{ display: 'inline', marginRight: 4 }} />
                  {resendCooldown > 0 ? `Reenviar e-mail em (${resendCooldown}s)` : 'Reenviar e-mail'}
                </ForgotPasswordLink>

                <ForgotPasswordLink
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg(null);
                  }}
                >
                  Trocar e-mail
                </ForgotPasswordLink>
              </div>

              <HintBox>
                <HelpCircle size={16} style={{ flexShrink: 0, marginTop: 2, color: '#ff5500' }} />
                <span>
                  <strong>Dica:</strong> Se você abrir o e-mail em outro dispositivo ou aba e clicar no link, esta tela detectará a confirmação automaticamente em segundos.
                </span>
              </HintBox>
            </VerifyContainer>
          </Form>
        ) : (
          /* TELAS DE LOGIN / CADASTRO / ESQUECI MINHA SENHA */
          <Form onSubmit={handleSubmit}>
            {errorMsg && (
              <MessageBanner $type="error">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </MessageBanner>
            )}

            {successMsg && (
              <MessageBanner $type="success">
                <CheckCircle size={16} />
                <span>{successMsg}</span>
              </MessageBanner>
            )}

            {activeTab === 'register' && (
              <InputGroup>
                <Label htmlFor="auth-name">Nome Completo</Label>
                <InputWrapper>
                  <UserIcon size={18} />
                  <Input
                    id="auth-name"
                    type="text"
                    placeholder="Seu nome ou apelido"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </InputWrapper>
              </InputGroup>
            )}

            <InputGroup>
              <Label htmlFor="auth-email">E-mail</Label>
              <InputWrapper>
                <Mail size={18} />
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
            </InputGroup>

            {activeTab !== 'forgot' && (
              <InputGroup>
                <Label htmlFor="auth-password">Senha</Label>
                <InputWrapper>
                  <Lock size={18} />
                  <Input
                    id="auth-password"
                    type="password"
                    placeholder="Mínimo de 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </InputWrapper>
                {activeTab === 'login' && (
                  <ForgotPasswordLink
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setErrorMsg(null);
                    }}
                  >
                    Esqueceu a senha?
                  </ForgotPasswordLink>
                )}
              </InputGroup>
            )}

            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  Processando...
                </>
              ) : activeTab === 'login' ? (
                'Entrar e Sincronizar'
              ) : activeTab === 'register' ? (
                'Criar Minha Conta'
              ) : (
                'Enviar Link de Recuperação'
              )}
            </PrimaryButton>

            {activeTab === 'forgot' ? (
              <GuestButton
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg(null);
                }}
              >
                Voltar para o Login
              </GuestButton>
            ) : (
              <GuestButton type="button" onClick={closeAuthModal}>
                Continuar como Convidado (Modo Offline)
              </GuestButton>
            )}
          </Form>
        )}
      </ModalCard>
    </Backdrop>
  );
};
