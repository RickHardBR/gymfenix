# FÊNIX GYM TRACKER - HISTÓRICO DE DESENVOLVIMENTO

> **Última atualização:** 26/10/2026  
> **Status Geral:** Fases 1 a 6 Concluídas | PWA Instalável no Celular & Modo Tela Cheia Standalone | Aba Perfil & Gordura U.S. Navy | Troca de Aparelhos | Supabase Operacional  
> **Suíte de Testes:** 31 arquivos de teste, 71 testes unitários e de integração — **100% aprovados**  
> **Build de Produção:** `tsc -b && vite build` — **Sucesso (Código 0)**  

---

## 1. Visão Geral do Projeto e Perfil do Atleta

O **Fênix Gym Tracker** é um aplicativo mobile-first projetado para gerenciar musculação, força e hipertrofia de forma inteligente e segura, com ênfase na saúde da coluna lombar e progressão dupla sustentável.

- **Objetivo Principal:** Desenvolver força e hipertrofia com melhora da composição corporal.
- **Divisão do Treino:** Full Body 3x por semana (Treinos alternados A, B e C).
- **Situação de Retorno:** Retorno gradual após 14 dias de inatividade.
  - *Semanas 1 e 2:* 2 séries por exercício, RIR ~3 (reserva confortável), foco em técnica e apoio dorsal/lombar.
- **Atenção Lombar:** Sem dor aguda atual, histórico de desconforto em cargas livres elevadas. Substituição preferencial de movimentos axiais livres por exercícios com apoio de peito/banco (ex: Remada apoiada no peito, Leg Press 45°, Cadeira Flexora/Extensora).
- **Arquitetura:** **Offline-First**. O aplicativo é 100% funcional sem conexão (IndexedDB nativo via `idb`) e sincroniza com a nuvem (Supabase PostgreSQL) quando autenticado e online.

---

## 2. Stack Tecnológica

- **Frontend:** React 19 + TypeScript + Vite (Single Page Application mobile-first).
- **Estilização:** Styled Components com Design System completo (`darkTheme` e `lightTheme`, tokens de cores HSL/Hex, radii, shadows com efeito glow).
- **Gráficos e Visualizações:** Recharts (LineChart para 1RM e cargas, BarChart para volume muscular).
- **Ícones:** Lucide React.
- **Áudio / Cronômetro:** Web Audio API pura com sintetizador senoidal (sem dependência de arquivos MP3 externos) e recálculo temporal baseado em `Date.now()`.
- **Persistência Local:** IndexedDB nativo tipado com a biblioteca `idb` v8.
- **Persistência em Nuvem & Auth:** `@supabase/supabase-js` conectado ao projeto `GYM`.
- **Testes Automatizados:** Vitest + React Testing Library + `fake-indexeddb`.

---

## 3. Fases do Projeto e Status Atual

### ✅ FASE 1: Fundação, Design System e Perfil
- Estrutura base Vite + TypeScript configurada.
- Navegação por abas inferiores (`BottomNav.tsx`): Início, Treinos, Exercícios, Evolução e Configurações.
- Cabeçalho dinâmico (`Header.tsx`) com alternância de tema escuro/claro e status da nuvem.
- Tela de Perfil e Configurações (`ProfileScreen.tsx`): edição de dados, metas, aviso legal de saúde e cuidados lombares.
- Banco local IndexedDB (`src/services/db.ts`) com stores dedicadas para perfil, configurações, exercícios, modelos, sessões e medidas.

### ✅ FASE 2: Biblioteca de Exercícios e Gerenciamento de Treinos
- Biblioteca com 14 exercícios essenciais cadastrados (`src/data/initialExercises.ts`) com instruções anatômicas, erros comuns e advertências de segurança lombar.
- Telas de Exercícios (`ExerciseListScreen.tsx`), Detalhes (`ExerciseDetailModal.tsx`) e criação de novos exercícios personalizados (`CustomExerciseModal.tsx`).
- Treinos Full Body A, B e C pré-configurados (`src/data/initialWorkouts.ts`).
- Gerenciamento de Treinos (`WorkoutListScreen.tsx`) e Edição/Substituição de exercícios (`WorkoutEditScreen.tsx`), incluindo duplicação de treinos.

### ✅ FASE 3: Execução de Treino ao Vivo e Segurança
- Tela de treino ativo (`ActiveWorkoutScreen.tsx`):
  - Tabela responsiva de séries (aquecimento vs. trabalho).
  - Consulta do último desempenho (cargas e repetições anteriores).
  - Controle de RIR (repetições na reserva) e percepção de esforço.
  - Cronômetro de descanso flutuante (`RestTimer.tsx`) com bipes sintetizados via Web Audio API.
  - Modal de relato de dor/desconforto com escala de 1 a 10 e opção de interrupção imediata.
  - Modal de resumo pós-treino com cálculo automático de volume efetivo em kg (excluindo aquecimento).

### ✅ INTEGRAÇÃO SUPABASE: Autenticação e Nuvem
- **Cliente Supabase:** [`src/services/supabase.ts`](file:///j:/RickHardBR/FenixGyn/src/services/supabase.ts) configurado de forma resiliente.
- **Serviço de Autenticação:** [`src/services/authService.ts`](file:///j:/RickHardBR/FenixGyn/src/services/authService.ts) (Cadastro, Login, Logout, Recuperação de Senha, OTP de 6 dígitos e reenvio).
- **Tela de Login Cinematográfica ([`src/components/auth/LoginScreen.tsx`](file:///j:/RickHardBR/FenixGyn/src/components/auth/LoginScreen.tsx)):**
  - **Portão de Entrada Padrão:** O aplicativo agora abre diretamente na tela de login estilizada caso o usuário não possua sessão ativa no Supabase.
  - Usuários já autenticados entram direto no aplicativo sem interrupções.
  - Opção "Continuar Offline" disponível para quem desejar testar como convidado.
- **Sincronização Local-First:** [`src/services/syncService.ts`](file:///j:/RickHardBR/FenixGyn/src/services/syncService.ts) sincroniza perfil e sessões concluídas bidirecionalmente.
- **Políticas RLS:** Row Level Security idempotente configurado no Postgres.

### ✅ FASE 4: Histórico, Progressão Dupla e Gráficos
- **Motor de Progressão Dupla (`src/utils/progressionEngine.ts`):**
  - Estimativa de 1RM pela fórmula de Epley: `1RM = Carga * (1 + Reps / 30)`.
  - Análise automática de sobrecarga progressiva: quando o atleta completa todas as séries de trabalho no topo da faixa de repetições (ex: 12 reps) com RIR seguro ($\ge 1.5$), recomenda incremento de carga (+1kg a +2.5kg) e retorno ao piso da faixa (ex: 8 reps).
  - Alerta lombar e articular preventivo: detecta relatos de dor e recomenda deload/manutenção protetiva.
- **Componentes e Visualizações:**
  - `DoubleProgressionCard.tsx`: Cartões visuais de recomendação de sobrecarga com badges de status ("Subir Carga", "Buscar Reps", "Cuidado Lombar", "Consolidar").
  - `ExerciseProgressChart.tsx`: Gráfico de linhas (Recharts) com histórico cronológico de carga máxima e 1RM estimado por exercício com seletor interativo.
  - `MuscleVolumeChart.tsx`: Gráfico de barras horizontais com tonelagem e séries de trabalho distribuídas por grupo muscular nos últimos 30 dias.
  - `SessionDetailModal.tsx`: Modal para visualização completa de sessões anteriores (data, duração, tonelagem total, séries detalhadas e relatos de dor).
  - `ProgressScreen.tsx`: Tela de Evolução e Histórico conectada na navegação inferior (aba `evolucao`).

### ✅ GUIA VISUAL, ANATÔMICO & CADÊNCIA DOS EXERCÍCIOS
- **Ponto de Restauração Seguro:** Tag `v1.0.0-fase4-login-checkpoint` (`ac33475`) criada antes da implementação.
- **Componente `ExerciseGuideDrawer.tsx`:** Bottom sheet moderno acessível a 1 toque na tela de treino ativo e na biblioteca de exercícios.
  - **Loop de Cadência em Tempo Real:** Animação gráfica com barra de progresso temporal e silhueta anatômica destacando o músculo alvo, sincronizada no tempo ideal (3 segundos na descida excêntrica + 1 segundo na subida concêntrica).
  - **Dicas Respiratórias:** Indicação de inspiração profunda na descida e expiração na contração concêntrica.
  - **Comparativo de Fases A vs. B:** Alternância para visualizar a posição inicial/alongamento versus o pico de contração sem hiperextensão articular.
  - **Semáforo de Segurança Lombar e Postura:**
    - 🟢 *Postura Correta:* Instruções fundamentais de estabilização escapular e pés firmes.
    - 🔴 *Atenção Lombar & O que Evitar:* Advertências específicas para evitar compensações ou arqueamento da coluna.
    - ⚙️ *Setup do Equipamento:* Regulagem correta da máquina, apoios e pinos de segurança.
- **Integração:** Disponibilizado diretamente no cabeçalho de cada exercício durante o treino ativo ([`ActiveWorkoutScreen.tsx`](file:///j:/RickHardBR/FenixGyn/src/components/active-workout/ActiveWorkoutScreen.tsx)) e no modal de detalhes da biblioteca ([`ExerciseDetailModal.tsx`](file:///j:/RickHardBR/FenixGyn/src/components/exercises/ExerciseDetailModal.tsx)).
### ✅ NOVA ABA PERFIL DO ATLETA & AVALIAÇÃO DE GORDURA REAL (U.S. NAVY)
- **Separação Arquitetural:** Separação clara entre a aba **Perfil** (dados biométricos, medidas e composição do atleta) e a aba **Ajustes** (configurações do app, sincronização na nuvem Supabase e preferências).
- **Métricas Científicas Além do IMC:**
  - **Fórmula da Marinha dos EUA (U.S. Navy Body Fat):** Cálculo preciso do percentual de gordura corporal baseado na circunferência de cintura, pescoço e altura (e quadril para mulheres), superando a limitação do IMC que penaliza atletas musculosos.
  - **Massa Magra & Massa Gorda:** Estimativa em quilogramas do peso de massa muscular/óssea versus gordura absoluta.
  - **Relação Cintura / Estatura (WHtR):** Indicador de excelência metabólica e saúde cardiovascular (ideal <= 0.50).
  - **Identificação do Atleta:** Suporte a nome completo e apelido de treino (ex: "Monstro", "Fênix").
- **Troca Rápida de Aparelhos no Treino Ativo:**
  - Botão com 1 toque no card de cada exercício ativo para selecionar aparelhos alternativos da academia (ex: Halteres, Smith, Polia, Máquina Articulada).
  - Suporte a substituição temporária (apenas no treino de hoje) ou permanente no modelo do treino.

### ✅ PWA (PROGRESSIVE WEB APP) & MODO TELA CHEIA TOTAL
- **Instalabilidade Completa:**
  - Configuração do manifesto moderno W3C (`manifest.webmanifest`) com suporte a `display: standalone` e `fullscreen`, sem barra de endereço.
  - Ícones vetoriais e de alta resolução `icon-192.png` e `icon-512.png` com o monograma de fogo FG.
  - Meta tags para iOS Safari (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style: black-translucent`).
- **Service Worker Nativo (`public/sw.js`):**
  - Cache de ativos estáticos com estratégia *stale-while-revalidate* para abertura instantânea e 100% offline.
- **Hook `usePWA` & Modal Interativo (`PWAInstallModal`):**
  - Captura inteligente do evento `beforeinstallprompt` (Android/Chrome).
  - Guia ilustrado com passos para usuários de iPhone / iPad (Safari).
  - Botão de alternância instantânea para **Modo Tela Cheia** (Fullscreen API nativa) disponível no cabeçalho, na barra de treino ativo e na tela de Ajustes.

## 4. Estrutura do Banco no Supabase (`supabase_schema.sql`)

O script [`supabase_schema.sql`](file:///j:/RickHardBR/FenixGyn/supabase_schema.sql) foi revisado, idempotente com `DROP POLICY IF EXISTS`:
- **Tabelas presentes no script:**
  1. `public.profiles`: Armazena dados de objetivos, histórico lombar, frequência e preferências.
  2. `public.exercises`: Biblioteca de exercícios do usuário e do sistema.
  3. `public.workout_templates`: Modelos de treinos A, B, C e variações customizadas.
  4. `public.workout_sessions`: Histórico detalhado de sessões concluídas, volumes e séries executadas.
  5. `public.pain_logs`: Relatos de dor e alertas articulares/posturais.
  6. `public.body_measurements`: Histórico de peso e medidas corporais.
- **Segurança (RLS):** Row Level Security habilitado em todas as tabelas (cada atleta só lê/escreve seus próprios dados).
- **Trigger:** `on_auth_user_created` cria automaticamente o registro na tabela `profiles` ao se cadastrar.

---

## 5. Próximos Passos (Ao Retomar)

1. **FASE 5: Medidas Corporais e Composição:**
   - Registro de peso corporal, percentual de gordura e circunferência de cintura.
   - Gráfico de tendência de peso corporal e evolução de medidas ao longo do tempo.
   - Sincronização da store local e tabela `public.body_measurements` com o Supabase.
2. **FASE 6: PWA (Progressive Web App) e Exportação:**
   - Configuração do Service Worker e manifesto PWA (`vite-plugin-pwa`) para instalação mobile nativa com ícone e splash screen.
   - Exportação e importação de dados em formato JSON e CSV.
