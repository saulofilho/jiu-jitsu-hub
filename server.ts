import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini instance
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes for Mestre IA & BJJ Assistant
app.post("/api/mestre-ai", async (req, res) => {
  try {
    const { message, belt, style, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    const ai = getAIClient();
    if (!ai) {
      // Graceful fallback response when API key is not yet set
      return res.json({
        reply: `🥋 **Oss! Conselho do Mestre:**\n\nPara sua dúvida sobre: *"${message}"*:\n\n1. **Postura e Base:** Lembre-se que no Jiu-Jitsu a alavanca e a base superam a força física. Mantenha os cotovelos colados às costelas e coluna ereta.\n2. **Ajuste Técnico:** Domine as pegadas nas mangas ou na gola antes de iniciar a transição. Se o oponente resistir, não insista na mesma linha: encadeie com uma raspagem ou ataque no lado oposto.\n3. **Respiração:** Respire pelo diafragma e não desperdice energia desnecessária no rola.\n\n*(Dica: Configure sua chave Gemini API em Configurações para obter análises táticas ultra-detalhadas em tempo real).*`,
        suggestedDrills: ["Repetições de entrada de pegadas (3x 20 reps)", "Fuga de quadril com troca de guarda", "Transição guarda fechada para costas"],
      });
    }

    const prompt = `Você é o "Mestre BJJ", um Grande Mestre Faixa-Coral/Preta 8º Grau de Brazilian Jiu-Jitsu, com profundo conhecimento técnico, histórico, regras da IBJJF/ADCC e biomecânica do Jiu-Jitsu (Arte Suave).
Responda ao praticante sempre mantendo um tom respeitoso, encorajador, técnico e tradicional ("Oss!").

Informações do praticante:
- Faixa atual: ${belt || "Não informada"}
- Estilo preferido: ${style || "Equilibrado / Completo"}
${context ? `- Contexto adicional: ${context}` : ""}

Pergunta/Dúvida do praticante:
"${message}"

Estruture sua resposta de forma clara e visualmente rica:
1. Resumo Direto e Princípio Biomecânico (alavancas, distribuição de peso, pegadas).
2. Passo a Passo Técnico ou Ajustes Cirúrgicos (detalhes invisíveis que fazem a diferença).
3. Erros Críticos que você deve evitar.
4. Plano de Treino / Drill sugerido para fixar.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um mestre renomado de Brazilian Jiu-Jitsu. Fale em português do Brasil com terminologia correta do tatame (guarda, raspagem, armlock, kimura, passagem emborrachando, berimbolo, estrangulamento, postura, alavanca, etc.).",
        temperature: 0.7,
      },
    });

    return res.json({
      reply: response.text || "Oss! Mantenha a guarda e o foco nos treinos diários.",
    });
  } catch (error: any) {
    console.error("Erro na API Mestre IA:", error);
    return res.status(500).json({
      error: "Erro ao processar resposta do Mestre IA.",
      details: error?.message || "Tente novamente em instantes.",
    });
  }
});

// API Route for Gameplan generation
app.post("/api/gameplan", async (req, res) => {
  try {
    const { belt, weightClass, playStyle, targetGoal } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        plan: {
          title: `Gameplan Tático: ${playStyle || "Guardeiro"} (${belt || "Faixa Azul"})`,
          standingStrategy: "Puxada rápida para Guarda De La Riva ou Meia Guarda profunda; evitar troca de quedas com judocas pesados.",
          primaryAttackSequence: "De La Riva -> Desequilíbrio com empurrão no joelho -> Raspagem Tomoe Nage ou Transição para as Costas via Berimbolo.",
          backupPlan: "Se o adversário amassar a perna (Knee Slice): Transição imediata para Meia Guarda Fechada -> Raspagem Coyote / Pegada na faixa.",
          keySubmissions: ["Estrangulamento Arco e Flecha", "Armlock da montada", "Kimura de contra-ataque"],
          mindsetTip: "Imponha o seu ritmo nos primeiros 60 segundos de combate. Quem dita as pegadas controla a luta.",
        },
      });
    }

    const prompt = `Crie um Gameplan de Competição de Jiu-Jitsu completo e altamente tático em formato JSON.
Dados do atleta:
- Faixa: ${belt}
- Categoria de peso: ${weightClass}
- Estilo de jogo: ${playStyle} (ex: Guardeiro, Passador de Pressão, Passador Ágil, Finalizador, Especialista em Quedas)
- Objetivo principal: ${targetGoal || "Vencer campeonato IBJJF"}

Responda SOMENTE em formato JSON com a seguinte estrutura:
{
  "title": "string (nome chamativo do gameplan)",
  "overview": "string (resumo da estratégia geral)",
  "standingStrategy": "string (estratégia em pé - puxar guarda ou quedar, pegadas iniciais)",
  "primarySequence": "string (sequência principal de ataques/transições detalhada)",
  "secondarySequence": "string (plano B se o oponente bloquear o ataque primário)",
  "topSubmissions": ["string", "string", "string"],
  "pointsManagement": "string (como pontuar com segurança conforme regras IBJJF)",
  "mentalPreparation": "string (foco mental, respiração e atitude no tatame)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ plan: parsed });
  } catch (error: any) {
    console.error("Erro no Gameplan:", error);
    return res.status(500).json({ error: "Erro ao gerar Gameplan tático." });
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "jiu-jitsu-hub" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🥋 Jiu-Jitsu Hub rodando na porta http://0.0.0.0:${PORT}`);
  });
}

startServer();
