import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Flame,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User as UserIcon,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  signInWithEmail,
  signUpWithEmail,
  resetPasswordForEmail,
  verifyEmailOtp,
  resendVerificationEmail,
} from '../../services/authService';

interface LoginScreenProps {
  onSuccess?: () => void;
  onContinueOffline?: () => void;
}

const PageContainer = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: #0d0e12;
  background-image: 
    linear-gradient(
      180deg,
      rgba(10, 11, 15, 0.82) 0%,
      rgba(10, 11, 15, 0.6) 35%,
      rgba(10, 11, 15, 0.88) 75%,
      rgba(10, 11, 15, 0.98) 100%
    ),
    url('/gym_login_bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-y: auto;
  font-family: inherit;
  color: #ffffff;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FlameIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 85, 0, 0.14);
  border: 1px solid rgba(255, 85, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff5500;
  box-shadow: 0 0 15px rgba(255, 85, 0, 0.2);
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: #ffffff;
  line-height: 1.1;

  span {
    color: #ff5500;
    margin-left: 4px;
  }
`;

const BrandSubtitle = styled.span`
  font-size: 0.675rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #8b8f9e;
`;

const SkipButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #a0a5b5;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.775rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ContentArea = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 20px 40px 20px;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
`;

const HeroHeading = styled.div`
  text-align: center;
  margin-bottom: 28px;
`;

const MainHeading = styled.h1`
  font-size: 1.85rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
  line-height: 1.25;

  @media (min-width: 480px) {
    font-size: 2.1rem;
  }
`;

const SubHeading = styled.p`
  font-size: 0.95rem;
  color: #c4c7d4;
  margin: 0;
  line-height: 1.45;
  font-weight: 400;
`;

const FormCard = styled.div`
  width: 100%;
  background: rgba(20, 22, 28, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 85, 0, 0.45);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 
    0 20px 45px rgba(0, 0, 0, 0.6),
    0 0 25px rgba(255, 85, 0, 0.08);
  transition: border-color 0.3s;
`;

const CardSubHeader = styled.span`
  font-size: 0.85rem;
  color: #9ea3b5;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
`;

const CardTitle = styled.h2`
  font-size: 1.55rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 22px 0;
  letter-spacing: -0.01em;
`;

const Form = styled.form`
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
  font-size: 0.825rem;
  font-weight: 600;
  color: #9ea3b5;
`;

const InputWrapper = styled.div<{ $hasError?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(28, 31, 40, 0.85);
  border: 1px solid ${({ $hasError }) => ($hasError ? '#ef4444' : 'rgba(255, 255, 255, 0.12)')};
  border-radius: 12px;
  padding: 12px 14px;
  transition: all 0.2s;

  &:focus-within {
    border-color: #ff5500;
    box-shadow: 0 0 0 2px rgba(255, 85, 0, 0.2);
    background: rgba(28, 31, 40, 0.98);
  }

  svg {
    color: #8b8f9e;
    flex-shrink: 0;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  background: none;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: #ffffff;

  &::placeholder {
    color: #5d6273;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #8b8f9e;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #8b8f9e;
  font-size: 0.8rem;
  align-self: flex-end;
  cursor: pointer;
  margin-top: -6px;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #ff5500;
    text-decoration: underline;
  }
`;

const PrimarySubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #ff5500;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 6px;
  transition: all 0.2s;
  box-shadow: 0 6px 18px rgba(255, 85, 0, 0.35);

  &:hover:not(:disabled) {
    background: #e64d00;
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(255, 85, 0, 0.45);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
  font-size: 0.85rem;
  color: #8b8f9e;
  gap: 6px;
`;

const SwitchModeButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  font-size: 0.85rem;
  transition: color 0.2s;

  &:hover {
    color: #ff5500;
    text-decoration: underline;
  }
`;

const AlertBanner = styled.div<{ $type: 'error' | 'success' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.825rem;
  background: ${({ $type }) => ($type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)')};
  border: 1px solid ${({ $type }) => ($type === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)')};
  color: ${({ $type }) => ($type === 'error' ? '#ef4444' : '#22c55e')};
  margin-bottom: 12px;
`;

// Modo de validação de e-mail OTP
const OtpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: center;
`;

const OtpInput = styled.input`
  width: 100%;
  padding: 14px;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 6px;
  text-align: center;
  background: rgba(28, 31, 40, 0.95);
  border: 2px solid rgba(255, 85, 0, 0.5);
  border-radius: 12px;
  color: #ffffff;
  outline: none;

  &:focus {
    border-color: #ff5500;
    box-shadow: 0 0 16px rgba(255, 85, 0, 0.3);
  }
`;

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSuccess,
  onContinueOffline,
}) => {
  const { showFeedback, syncWithCloud } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Temporizador para reenvio
  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Polling em tempo real se estiver aguardando validação de e-mail
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (mode === 'verify' && email && password) {
      interval = setInterval(async () => {
        try {
          const res = await signInWithEmail(email, password);
          if (res && res.session) {
            clearInterval(interval);
            showFeedback('Conta confirmada e validada em tempo real!');
            if (onSuccess) onSuccess();
            await syncWithCloud();
          }
        } catch {
          // Continua aguardando silenciosamente
        }
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, email, password, onSuccess, showFeedback, syncWithCloud]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        showFeedback('Login realizado com sucesso! Bem-vindo.');
        if (onSuccess) onSuccess();
        await syncWithCloud();
      } else if (mode === 'register') {
        const res = await signUpWithEmail(email, password, fullName);
        if (res.needsEmailConfirmation) {
          setMode('verify');
          setResendCooldown(60);
          showFeedback('Verifique seu e-mail para confirmar a conta.');
        } else {
          showFeedback('Conta criada com sucesso!');
          if (onSuccess) onSuccess();
          await syncWithCloud();
        }
      } else if (mode === 'forgot') {
        await resetPasswordForEmail(email);
        setSuccessMsg('Link de redefinição de senha enviado para seu e-mail.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha na autenticação. Verifique os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMsg('Digite o código de 6 dígitos recebido no e-mail.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    try {
      await verifyEmailOtp(email, otpCode);
      await signInWithEmail(email, password);
      showFeedback('E-mail validado com sucesso! Seus treinos estão liberados.');
      if (onSuccess) onSuccess();
      await syncWithCloud();
    } catch (err: any) {
      setErrorMsg(err.message || 'Código inválido ou expirado.');
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
      setSuccessMsg('Novo código enviado para o seu e-mail.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao reenviar e-mail.');
    }
  };

  return (
    <PageContainer>
      <TopBar>
        <BrandLogo>
          <FlameIconBox>
            <Flame size={22} fill="currentColor" />
          </FlameIconBox>
          <BrandText>
            <BrandTitle>
              FENIX<span>GYM</span>
            </BrandTitle>
            <BrandSubtitle>TRACKER</BrandSubtitle>
          </BrandText>
        </BrandLogo>

        {onContinueOffline && (
          <SkipButton type="button" onClick={onContinueOffline}>
            Continuar Offline
          </SkipButton>
        )}
      </TopBar>

      <ContentArea>
        <HeroHeading>
          <MainHeading>Transforme sua força.</MainHeading>
          <SubHeading>
            Acesse sua conta para continuar seus treinos.
          </SubHeading>
        </HeroHeading>

        <FormCard>
          {errorMsg && (
            <AlertBanner $type="error">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </AlertBanner>
          )}

          {successMsg && (
            <AlertBanner $type="success">
              <CheckCircle size={16} />
              <span>{successMsg}</span>
            </AlertBanner>
          )}

          {mode === 'verify' ? (
            <Form onSubmit={handleVerifyOtp}>
              <CardSubHeader>Validação de Segurança</CardSubHeader>
              <CardTitle>Confirmar E-mail</CardTitle>

              <OtpWrapper>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#a0a5b5' }}>
                  Enviamos um código de 6 dígitos para:
                  <br />
                  <strong style={{ color: '#ff5500' }}>{email}</strong>
                </p>

                <OtpInput
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  autoComplete="one-time-code"
                  autoFocus
                />

                <PrimarySubmitButton type="submit" disabled={isLoading || otpCode.length < 6}>
                  {isLoading ? (
                    <>
                      <RefreshCw size={18} className="spin" /> Validando...
                    </>
                  ) : (
                    <>
                      Validar e Entrar <ArrowRight size={18} />
                    </>
                  )}
                </PrimarySubmitButton>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendCooldown > 0 ? '#666' : '#ff5500',
                      cursor: resendCooldown > 0 ? 'default' : 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Send size={13} />
                    {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a0a5b5',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    Trocar e-mail
                  </button>
                </div>
              </OtpWrapper>
            </Form>
          ) : (
            <Form onSubmit={handleSubmit}>
              <CardSubHeader>
                {mode === 'forgot'
                  ? 'Recuperação de Acesso'
                  : mode === 'register'
                  ? 'Comece sua Jornada'
                  : 'Entre na sua conta'}
              </CardSubHeader>
              <CardTitle>
                {mode === 'forgot' ? 'Redefinir Senha' : mode === 'register' ? 'Criar Conta' : 'Entrar'}
              </CardTitle>

              {mode === 'register' && (
                <InputGroup>
                  <Label htmlFor="login-name">Nome Completo</Label>
                  <InputWrapper>
                    <UserIcon size={18} />
                    <StyledInput
                      id="login-name"
                      type="text"
                      placeholder="Seu nome"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </InputWrapper>
                </InputGroup>
              )}

              <InputGroup>
                <Label htmlFor="login-email">E-mail ou Usuário</Label>
                <InputWrapper>
                  <Mail size={18} />
                  <StyledInput
                    id="login-email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputWrapper>
              </InputGroup>

              {mode !== 'forgot' && (
                <InputGroup>
                  <Label htmlFor="login-password">Senha</Label>
                  <InputWrapper>
                    <Lock size={18} />
                    <StyledInput
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    <IconButton
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputWrapper>
                  {mode === 'login' && (
                    <ForgotPasswordLink
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                    >
                      Esqueceu a senha?
                    </ForgotPasswordLink>
                  )}
                </InputGroup>
              )}

              <PrimarySubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="spin" /> Processando...
                  </>
                ) : mode === 'login' ? (
                  <>
                    Entrar <ArrowRight size={18} />
                  </>
                ) : mode === 'register' ? (
                  <>
                    Criar Minha Conta <ArrowRight size={18} />
                  </>
                ) : (
                  <>
                    Enviar Link de Redefinição <ArrowRight size={18} />
                  </>
                )}
              </PrimarySubmitButton>

              <CardFooter>
                {mode === 'login' ? (
                  <>
                    <span>Não tem uma conta?</span>
                    <SwitchModeButton
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                    >
                      Cadastre-se
                    </SwitchModeButton>
                  </>
                ) : mode === 'register' ? (
                  <>
                    <span>Já tem uma conta?</span>
                    <SwitchModeButton
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                    >
                      Entrar
                    </SwitchModeButton>
                  </>
                ) : (
                  <SwitchModeButton
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                  >
                    Voltar para o Login
                  </SwitchModeButton>
                )}
              </CardFooter>
            </Form>
          )}
        </FormCard>
      </ContentArea>
    </PageContainer>
  );
};
