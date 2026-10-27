# 🔥 FÊNIX GYM TRACKER

<p align="center">
  <img src="public/gym_login_bg.jpg" alt="Fênix Gym Tracker Banner" width="100%" style="border-radius: 14px; max-height: 380px; object-fit: cover;" />
</p>

<p align="center">
  <strong>Aplicativo de Alta Performance para Musculação, Sobrecarga Progressiva e Preservação Lombar</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue.svg" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-orange.svg" alt="Vite" />
  <img src="https://img.shields.io/badge/Styled--Components-6-pink.svg" alt="Styled Components" />
  <img src="https://img.shields.io/badge/Supabase-Auth_%26_PostgreSQL-green.svg" alt="Supabase" />
  <img src="https://img.shields.io/badge/PWA-Installable_%26_Fullscreen-blueviolet.svg" alt="PWA Installable" />
  <img src="https://img.shields.io/badge/Tests-71%20Passed-brightgreen.svg" alt="Vitest 71 Tests Passed" />
</p>

---

## 📋 Sumário
1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Arquitetura & Filosofia Offline-First](#-arquitetura--filosofia-offline-first)
3. [Diferenciais de Segurança & Saúde Lombar](#-diferenciais-de-segurança--saúde-lombar)
4. [Telas & Funcionalidades Completas](#-telas--funcionalidades-completas)
   - [4.1 Tela de Login Cinematográfica](#41-tela-de-login-cinematográfica)
   - [4.2 Painel Inicial (Home)](#42-painel-inicial-home)
   - [4.3 Execução de Treino Ativo (Live Workout)](#43-execução-de-treino-ativo-live-workout)
   - [4.4 Guia Visual & Anatômico do Exercício](#44-guia-visual--anatômico-do-exercício)
   - [4.5 Gerenciamento & Edição de Treinos](#45-gerenciamento--edição-de-treinos)
   - [4.6 Biblioteca de Exercícios & Customização](#46-biblioteca-de-exercícios--customização)
   - [4.7 Evolução, 1RM & Histórico de Sessões](#47-evolução-1rm--histórico-de-sessões)
   - [4.8 Perfil do Atleta & Configurações](#48-perfil-do-atleta--configurações)
5. [Guia de Todos os Botões & Ações do Sistema](#-guia-de-todos-os-botões--ações-do-sistema)
6. [Motor de Progressão Dupla (Algoritmo)](#-motor-de-progressão-dupla-algoritmo)
7. [Estrutura do Banco de Dados (Supabase & IndexedDB)](#-estrutura-do-banco-de-dados-supabase--indexeddb)
8. [Instalação & Como Rodar o Projeto](#-instalação--como-rodar-o-projeto)
9. [Suíte de Testes Automatizados](#-suíte-de-testes-automatizados)

---

## 🎯 Sobre o Projeto

O **Fênix Gym Tracker** foi projetado especificamente para praticantes de musculação que levam o treinamento a sério, buscam hipertrofia e ganho de força através da **Sobrecarga Progressiva Dupla**, mas que precisam de **cuidado redobrado com a região lombar e coluna vertebral**.

O atleta conta com treinos Full Body inteligentes (A, B e C), cronômetro com áudio sintetizado, histórico de cargas anteriores na ponta dos dedos, registro de dores com escala de 1 a 10 e orientações anatômicas com imagens reais das duas fases de cada movimento.

---

## ⚡ Arquitetura & Filosofia Offline-First

O aplicativo foi desenhado para **funcionar perfeitamente dentro da academia, mesmo sem internet**:
- **IndexedDB Nativo (`idb` v8):** Todos os dados (treinos, séries concluídas, repetições, pesos e configurações) são gravados instantaneamente no banco de dados local do seu dispositivo. Você nunca perde uma série porque o sinal caiu.
- **Nuvem Supabase PostgreSQL:** Assim que houver conexão com a internet, o sistema sincroniza os dados com a nuvem de forma bidirecional e segura (RLS ativado por usuário).
- **Sem Dependências Pesadas:** Sons sintetizados em tempo real via **Web Audio API** nativa (sem necessidade de carregar arquivos MP3 da internet).

---

## 🛡️ Diferenciais de Segurança & Saúde Lombar

1. **Substituição Anatômica de Cargas Axiais:**
   - Exercícios que geram alta compressão na coluna vertebral (ex: agachamento livre pesado ou remada curvada sem apoio) possuem alternativas preferenciais com apoio de peito ou guiadas (ex: *Leg Press 45°*, *Remada Sentada com Apoio no Peito*, *Mesa Flexora*).
2. **Monitoramento de Desconforto em Tempo Real:**
   - Durante o treino, o atleta pode tocar no botão de **Relato de Dor** para registrar qualquer incômodo na lombar, ombros ou joelhos (escala de 1 a 10).
3. **Pausa e Deload Protetivo:**
   - Se o atleta relatar dor significativa, o motor de progressão interrompe imediatamente as recomendações de aumento de carga e sugere estabilização ou semana de alívio (*deload*).

---

## 🖥️ Telas & Funcionalidades Completas

### 4.1 Tela de Login Cinematográfica
- **Portão de Entrada do App:** Interface visual imersiva com tipografia esportiva e imagem de fundo estilizada.
- **Opções de Acesso:**
  - Login tradicional com E-mail e Senha.
  - Alternância rápida para **Cadastro de Novo Atleta**.
  - **Validação de E-mail:** Suporte a código OTP de 6 dígitos com botão de reenvio.
  - **Recuperação de Senha:** Envio de e-mail de redefinição instantâneo.
  - **Modo Visitante (Offline):** Botão *"Continuar Offline"* que permite treinar e testar todas as funcionalidades do app sem criar conta imediatamente.

---

### 4.2 Painel Inicial (Home)
- **Saudação Personalizada:** Exibe o nome do atleta e o resumo da frequência semanal.
- **Card de Retorno Seguro:** Orientações personalizadas para semanas de retorno aos treinos (ex: início com 2 séries por exercício e RIR ~3).
- **Acesso Rápido ao Próximo Treino:** Card em destaque com o próximo treino da sequência (Treino A, B ou C), quantidade de exercícios e botão de início imediato.
- **Atalhos para Módulos:** Navegação direta para biblioteca de exercícios, histórico e evolução.

---

### 4.3 Execução de Treino Ativo (Live Workout)
Ao iniciar uma sessão, a tela se transforma em um diário de bordo interativo:
- **Barra Superior Fixa:**
  - Nome do treino em andamento.
  - Cronômetro decorrido em tempo real.
  - Botão **Cancelar** e botão verde **Finalizar Treino**.
- **Cards de Exercícios:**
  - **Histórico Imediato:** Exibe a carga e repetições alcançadas na última vez que você fez aquele exercício (ex: *"Última: 10 reps @ 120 kg"*).
  - **Tabela de Séries:**
    - Seletor de Tipo de Série: **Aquecimento (A)** ou **Trabalho (T)**.
    - Campos rápidos numéricos para **Carga (kg)** e **Repetições Feitas**.
    - Seletor de **RIR (Repetições na Reserva)**: 0 (falha), 1, 2, 3 ou 4+.
    - Botão de **Concluir Série (Check Verde)**: salva a série e dispara automaticamente o cronômetro de descanso.
    - Botão **Excluir Série (Lixeira)**.
  - **Botão Adicionar Série (+):** Insere nova linha mantendo a carga anterior como sugestão.
  - **Botão Relatar Desconforto (Escudo Vermelho):** Abre modal para registro de dor com notas de observação.
  - **Botão Guia (Ícone de Atividade):** Abre o guia visual de técnica do exercício com 1 toque sem interromper o treino.
- **Cronômetro de Descanso Flutuante (`RestTimer`):**
  - Conta regressiva automática dos segundos de descanso programados para o exercício (ex: 90s ou 120s).
  - Alerta sonoro tríplice quando o tempo zera, alertando o atleta para iniciar a próxima série.
  - Botões rápidos de **+30s**, **Pausar**, **Retomar** e **Pular**.
- **Resumo Pós-Treino:**
  - Modal comemorativo ao finalizar o treino calculando: **Duração total**, **Volume de Trabalho Efetivo (kg)** e **Quantidade de Séries Válidas**.

---

### 4.4 Guia Visual & Anatômico do Exercício
Aberto em formato de gaveta moderna (*bottom sheet*) diretamente na tela de treino ativo ou na biblioteca:
- **Palco de Cadência & Movimento:**
  - **Animação Contínua em Loop:** Alterna suavemente entre as fotos reais da posição inicial e do pico de contração no tempo prescrito (**3s descida excêntrica / 1s subida concêntrica**).
  - **Guia Respiratório Dinâmico:** Badge que instrui a inspirar na descida e expirar com força na contração concêntrica.
  - **Controle de Reprodução:** Botões para pausar e retomar a animação de cadência.
- **Aba "Posição A vs. B (Fotos)":**
  - **Foto Fase A (Posição Inicial / Alongamento):** Foto técnica demonstrando o alinhamento corporal, pegada correta e pés firmes.
  - **Foto Fase B (Pico de Contração):** Foto demonstrando a contração máxima sem compensações articulares.
- **Semáforo de Segurança Lombar & Postura:**
  - 🟢 **Postura e Execução Correta:** Pontos biomecânicos essenciais.
  - 🔴 **Atenção Lombar & O que Evitar:** Erros críticos que podem sobrecarregar a coluna.
  - ⚙️ **Setup do Equipamento:** Como ajustar pinos, assentos e almofadas da máquina.

---

### 4.5 Gerenciamento & Edição de Treinos
- **Visualização dos Modelos A, B e C:**
  - Lista completa de exercícios pertencentes a cada treino.
  - Tempo estimado de treino, volume de séries e grupos musculares trabalhados.
- **Edição Personalizada (`WorkoutEditScreen`):**
  - Alteração de nome e descrição do treino.
  - Reordenação de exercícios.
  - Ajuste de **Séries Planejadas**, **Faixa de Repetições (Mín/Máx)**, **Descanso (segundos)** e **RIR Alvo**.
  - Remoção e inclusão de novos exercícios.
  - **Duplicação de Treinos:** Permite clonar o Treino A ou B para criar variações rapidamente.

---

### 4.6 Biblioteca de Exercícios & Customização
- **Catálogo com 14 Exercícios Fundamentais:**
  - Leg Press 45°, Supino em Máquina, Remada Sentada com Apoio no Peito, Mesa Flexora, Cadeira Extensora, Puxada Alta, Elevação Lateral, Cadeira Flexora, Abdominal Máquina, Supino Inclinado Máquina, Rosca Bíceps, Tríceps Cabo, Elevação Pélvica e Panturrilha Sentada.
- **Filtros Inteligentes:**
  - Busca por nome do exercício em tempo real.
  - Filtro por grupo muscular (Peito, Costas, Quadríceps, Isquiotibiais, Ombros, Braços, Abdômen).
- **Cadastro de Exercícios Personalizados (`CustomExerciseModal`):**
  - Permite criar exercícios novos com instruções, advertências de segurança e fotos personalizadas.

---

### 4.7 Evolução, 1RM & Histórico de Sessões
- **Recomendações da Progressão Dupla:**
  - Cartões inteligentes com diagnósticos automáticos para cada exercício:
    - 🚀 **Subir Carga:** Quando o atleta atinge o topo da faixa de repetições com RIR seguro.
    - 🎯 **Buscar Repetições:** Quando o atleta aumentou o peso e agora deve construir volume com a mesma carga.
    - 🛡️ **Cuidado Lombar:** Quando foram relatadas dores recentes.
- **Gráfico de Evolução de Carga & 1RM Estimado (`ExerciseProgressChart`):**
  - Gráfico de linhas interativo (Recharts) exibindo a carga real utilizada e o 1RM calculado pela fórmula de Epley.
- **Gráfico de Volume Muscular Semanal (`MuscleVolumeChart`):**
  - Tonelagem total levantada e número de séries de trabalho por grupo muscular nos últimos 30 dias.
- **Histórico de Treinos Passados:**
  - Lista cronológica de todas as sessões concluídas.
  - Ao clicar em uma sessão, abre o `SessionDetailModal` exibindo cada série realizada, peso, repetições e notas de dor.

---

### 4.8 Perfil do Atleta & Composição Corporal Real (U.S. Navy)
- **Identificação:** Nome completo e Apelido de treino (ex: "Monstro", "Fênix").
- **Métricas Científicas Além do IMC:**
  - O IMC clássico considera apenas peso e altura e classifica praticantes de musculação erroneamente como "sobrepeso".
  - **Fórmula da Marinha dos EUA (U.S. Navy Body Fat):** Calcula o percentual real de gordura corporal baseado nas circunferências de **Cintura**, **Pescoço**, **Altura** (e **Quadril** para mulheres).
  - **Massa Magra Estimada:** Quantidade em kg de músculos, ossos e órgãos vitais.
  - **Massa Gorda:** Quantidade em kg de gordura corporal.
  - **Relação Cintura / Estatura (WHtR):** Indicador de excelência metabólica (ideal $\le 0.50$).
- **Dados Biométricos & Lombar:** Registro de idade, peso, sexo biológico e condição lombar.

---

### 4.9 Ajustes do Sistema, Instalação no Celular & Tela Cheia
- **Instalação no Celular (PWA - Progressive Web App):**
  - **Android / Chrome / Edge:** Clique em **"Instalar no Celular"** no cabeçalho ou em Ajustes para adicionar o app à tela inicial do smartphone com ícone nativo em alta resolução.
  - **iPhone / iPad (Safari iOS):** Toque no botão **Compartilhar** do Safari e selecione **"Adicionar à Tela de Início"**. O app abrirá sem nenhuma barra de navegação, ocupando 100% da tela como app da App Store.
  - **Funcionamento Offline:** Graças ao Service Worker e IndexedDB, o app abre instantaneamente e salva todos os treinos mesmo no subsolo da academia sem internet.
- **Modo Tela Cheia (Fullscreen API):**
  - Botão de alternância rápida de tela cheia no cabeçalho superior e na barra fixa do treino em andamento.
- **Gerenciamento de Nuvem & Sincronização:**
  - Status da conexão com o Supabase.
  - Botão de **Sincronizar Agora** para envio forçado de dados pendentes.
  - Botão de **Desconectar (Logout)** e login rápido.
- **Alternância de Tema:** Tema Escuro (*Dark Mode* de alto contraste) ou Tema Claro (*Light Mode*).
- **Restauração de Dados:** Opção para restaurar configurações iniciais recomendadas.

---

## 🔘 Guia de Todos os Botões & Ações do Sistema

| Botão / Elemento | Onde Fica | Ação e Comportamento no Sistema |
| :--- | :--- | :--- |
| **Instalar no Celular (Smartphone)** | Cabeçalho / Ajustes | Abre o modal de instalação do app na tela inicial do celular com tela cheia. |
| **Tela Cheia (Maximize / Minimize)** | Cabeçalho / Barra Treino | Expande a visualização para tela cheia imediata sem bordas do navegador. |
| **Entrar / Cadastrar** | Tela de Login | Valida credenciais no Supabase e carrega perfil do usuário. |
| **Continuar Offline** | Tela de Login | Pula o login e abre o app usando o banco local IndexedDB. |
| **Iniciar Treino** | Home / Treinos | Inicia a sessão ativa com cronômetro e salva no IndexedDB. |
| **Finalizar (Check Verde)** | Barra Fixa do Treino | Conclui o treino, calcula o volume em kg e abre resumo. |
| **Cancelar** | Barra Fixa do Treino | Cancela o treino ativo com confirmação de segurança. |
| **Trocar Aparelho (Repetir)** | Card do Exercício Ativo | Permite substituir o aparelho ocupado por outro (apenas hoje ou permanente). |
| **Guia (Atividade)** | Cabeçalho do Exercício | Abre a gaveta de técnica com fotos A/B, cadência e dicas. |
| **Relatar Dor (Escudo)** | Card do Exercício | Abre o modal de escala de dor de 1 a 10 com opção de parar. |
| **Concluir Série (Check)** | Linha da Tabela de Série | Registra a série e inicia a contagem do cronômetro de descanso. |
| **Adicionar Série (+)** | Abaixo da Tabela de Séries | Cria uma nova série copiando o peso da anterior como base. |
| **Lixeira (Excluir)** | Ao lado da Série | Remove a série indesejada da sessão. |
| **+30s / Pular** | Cronômetro de Descanso | Acrescenta 30 segundos ao descanso ou finaliza o intervalo. |
| **Alternar Tema (Sol/Lua)** | Cabeçalho Superior | Alterna instantaneamente entre o tema Escuro e o tema Claro. |
| **Sincronizar Nuvem** | Cabeçalho / Perfil | Força a sincronização bidirecional entre IndexedDB e Supabase. |
| **Duplicar Treino** | Card do Treino | Cria uma cópia exata do treino para customizações adicionais. |

---

## 📈 Motor de Progressão Dupla (Algoritmo)

O Fênix Gym Tracker adota o método de progressão dupla, considerado a forma mais segura e eficiente de hipertrofia muscular:

1. **Faixa de Repetições:** Todo exercício possui uma meta mínima e máxima (ex: **8 a 12 repetições**).
2. **Construção de Volume:** Você mantém a carga fixa (ex: 80 kg no Leg Press) e tenta aumentar as repetições a cada semana:
   - *Semana 1:* 8, 8 repetições.
   - *Semana 2:* 10, 9 repetições.
   - *Semana 3:* 12, 12 repetições.
3. **Subida de Carga:** Quando você alcança o topo da faixa (12 repetições) em todas as séries de trabalho com **RIR $\ge 1.5$** (sem chegar na falha concêntrica perigosa), o sistema sugere:
   - **Incrementar o peso:** +2kg a +5kg.
   - **Retornar para o piso da faixa:** 8 repetições.
4. **Cálculo de 1RM Estimado (Fórmula de Epley):**
   $$\text{1RM} = \text{Carga} \times \left(1 + \frac{\text{Repetições}}{30}\right)$$

---

## 🗄️ Estrutura do Banco de Dados (Supabase & IndexedDB)

O banco de dados do Supabase é configurado via script idempotente [`supabase_schema.sql`](supabase_schema.sql) com as seguintes tabelas:

- `public.profiles`: Dados do atleta, preferências e histórico de saúde lombar.
- `public.exercises`: Catálogo de exercícios do sistema e personalizados criados pelo usuário.
- `public.workout_templates`: Fichas e modelos de treino (Treino A, B, C).
- `public.workout_sessions`: Sessões concluídas com métricas de tonelagem, duração e séries.
- `public.pain_logs`: Relatos e históricos de dor corporal e advertências lombares.
- `public.body_measurements`: Histórico de evolução física e medidas.

---

## 🚀 Instalação & Como Rodar o Projeto

### Pré-requisitos
- **Node.js** v18+ instalado.
- Gerenciador de pacotes **npm** ou **yarn**.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/RickHardBR/gymfenix.git
   cd gymfenix
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Abra no seu navegador o endereço indicado (ex: `http://localhost:5173`).

4. **Gerar build de produção otimizado:**
   ```bash
   npm run build
   ```

---

## 🧪 Suíte de Testes Automatizados

O projeto conta com **cobertura abrangente de testes unitários e de integração** utilizando Vitest, React Testing Library e mocks de banco de dados (`fake-indexeddb`):

```bash
# Rodar todos os testes automatizados
npm test

# Rodar testes em modo interativo (watch)
npx vitest

# Validar regras de linting do código
npx oxlint
```

- **Total de arquivos de teste:** 29 arquivos
- **Total de testes:** 65 testes unitários e de integração (**100% aprovados**)

---

<p align="center">
  Desenvolvido com foco em <strong>Alta Performance, Rigor Biomecânico e Longevidade Articular</strong>.
</p>
