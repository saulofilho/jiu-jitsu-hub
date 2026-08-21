# 🥋 Jiu-Jitsu Hub • Arte Suave (柔術)

> **Enciclopédia Marcial Interativa, Visualizador Biomecânico 3D, Diário de Treinos, Linhagens Históricas, Regras Oficiais IBJJF, Paisagens Sonoras Zen e Sensei IA.**

---

## ⛩️ Visão Geral

O **Jiu-Jitsu Hub** é uma plataforma imersiva de artes marciais projetada para praticantes, competidores e mestres de Brazilian Jiu-Jitsu (BJJ). Combinando rigor técnico, história ancestral do Bushido e tecnologia moderna, o app oferece uma jornada completa desde a faixa branca até a faixa preta e além.

---

## 🌟 Principais Funcionalidades

### 1. 📖 Enciclopédia Completa de Técnicas (技)
- **Catálogo Detalhado**: Raspagens, passagens de guarda, finalizações, defesas, quedas e transições.
- **Passo a Passo & Biomecânica**: Instruções por fases, pegadas corretas, distribuição de peso e segredos do *"Jiu-Jitsu Invisível"*.
- **Visualizador 3D Interativo (Three.js)**: Demonstração anatômica 360° dos eixos de alavanca, fulcro e vetores de força.
- **Filtros e Busca Global**: Filtragem por faixa mínima (Branca a Preta), modalidade (Gi / Kimono ou No-Gi), tipo de golpe e pontuação oficial IBJJF.

### 2. ⚖️ Comparador Técnico de Golpes
- Compare lado a lado duas técnicas simultâneas.
- Análise de contra-ataques, nível de risco vs. recompensa, pontos concedidos e transições encadeadas.

### 3. 🥋 Meu Dojo, Diário de Treinos & Gamificação (道場)
- **Registro de Sessões**: Duração do treino, tipo (Drills, Sparring/Rola, Técnica, Físico) e anotações técnicas.
- **Streak & Frequência**: Rastreador de dias consecutivos no tatame e estatísticas de consistência.
- **Sistema de Níveis e XP**: Conquistas desbloqueáveis (badges) conforme você treina e domina novas posições.

### 4. 📜 Linhagens & Escolas Históricas (流派)
- Árvore genealógica interativa desde Mitsuyo Maeda (Conde Koma) e os irmãos Carlos e Hélio Gracie até as principais academias modernas (Alliance, Gracie Barra, Checkmat, Atos, B-Team, etc.).

### 5. 🏛️ Bushido, História & Curiosidades (武士道)
- Evolução histórica do Jiu-Jitsu tradicional e Kodokan Judo até a consagração mundial nos primeiros UFCs e eventos mundiais.
- Código de honra do Bushido e ensinamentos dos grandes mestres.

### 6. 🏆 Regras Oficiais & Placar de Luta IBJJF (ルール)
- **Placar Interativo de Sparring**: Cronômetro de rounds com aviso sonoro (buzzer), pontuação em tempo real (2, 3, 4 pts), vantagens e punições.
- **Tabela de Legalidade**: Golpes permitidos e proibidos por faixa e faixa etária.

### 7. 🎋 Paisagens Sonoras Tradicionais do Dojo (Web Audio API)
- Reprodutor de áudio ambiente no rodapé com síntese procedural:
  - 🎋 **Flauta Shakuhachi & Vento** (Escala Insen tradicional pentatônica)
  - 🔔 **Sinos do Templo & Suikinkutsu** (Ressonâncias metálicas e tigelas tibetanas)
  - 🍃 **Jardim Zen do Dojo** (Brisa suave e meditação silenciosa)
  - 🥋 **Foco Bushido & Pulso Taiko** (Batimento de concentração)
- Visualizador de ondas sonoras em tempo real e controle de volume integrado.

### 8. 師範 Sensei IA & Estratégia de Combate (Google Gemini)
- **Consultoria Técnica**: Tire dúvidas sobre alavancas, biomecânica e saídas de sufocos.
- **Gerador de Gameplan Personalizado**: Crie planos de luta estratégicos sob medida para seu peso, faixa e estilo (Guardeiro vs. Passador).

### 9. 昇段 Simulado de Exame de Graduação
- Testes teóricos de regras de arbitragem, história e mecânica para testar seu conhecimento antes de mudar de faixa.

---

## 🛠️ Stack Tecnológica

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Visualização 3D**: [Three.js](https://threejs.org/)
- **Animações & Ícones**: [Motion](https://motion.dev/), [Lucide React](https://lucide.dev/), [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Áudio & Síntese**: Web Audio API nativo (sem dependências pesadas externas de mídia)
- **Gráficos & Métricas**: [Recharts](https://recharts.org/)
- **Backend & IA**: [Express](https://expressjs.com/), [Google Gen AI SDK (@google/genai)](https://www.npmjs.com/package/@google/genai)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js**: Versão 18 ou superior
- **npm** ou **yarn** / **pnpm**

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/saulosilvaf/jiu-jitsu-hub.git
   cd jiu-jitsu-hub
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz (baseado no `.env.example`):
   ```env
   GEMINI_API_KEY=sua_chave_da_api_gemini_aqui
   ```

4. **Inicie o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse no Navegador:**
   Abra [http://localhost:3000](http://localhost:3000)

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor full-stack (Express + Vite) em modo desenvolvimento |
| `npm run build` | Compila os assets do frontend e o bundle do servidor backend |
| `npm start` | Executa o servidor de produção compilado |
| `npm run lint` | Executa a verificação estática de tipos com TypeScript (`tsc --noEmit`) |
| `npm run preview` | Visualiza o build de produção localmente |

---

## 🥋 Filosofia do Tatame

> *"O Jiu-Jitsu é a arte onde um indivíduo menor e fisicamente mais fraco pode se defender com sucesso contra um agressor maior e mais forte através da mecânica, alavanca e técnica."*  
> **— Hélio Gracie**

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para obter mais detalhes.

**OSS! 押忍 • 心技体**
