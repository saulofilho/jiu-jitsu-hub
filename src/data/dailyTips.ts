export interface DailyTip {
  id: string;
  category: 'tecnica' | 'invisivel' | 'filosofia' | 'historia' | 'regras';
  title: string;
  badge: string;
  content: string;
  authorOrSource: string;
  actionText?: string;
  targetTab?: string;
}

export const DAILY_TIPS: DailyTip[] = [
  {
    id: 'tip-1',
    category: 'invisivel',
    title: 'O Poder da Alavanca do Quadril no Armlock',
    badge: 'Jiu-Jitsu Invisível',
    content: 'Ao puxar o braço do oponente no armlock, nunca puxe com a força dos bíceps. Mantenha os calcanhares cravados no tatame ou nas costelas do adversário e eleve seu quadril. A força do seu glúteo e lombar supera facilmente qualquer resistência muscular do braço adversário.',
    authorOrSource: 'Princípio de Rickson Gracie',
    actionText: 'Ver Armlock da Guarda',
    targetTab: 'golpes'
  },
  {
    id: 'tip-2',
    category: 'regras',
    title: 'Regra dos 3 Segundos de Estabilização',
    badge: 'Arbitragem IBJJF',
    content: 'No regulamento oficial da IBJJF, nenhuma passagem, raspagem ou queda pontua imediatamente. É obrigatório estabilizar e manter o controle total por 3 segundos consecutivos sem tentativa ativa de fuga imediata antes do árbitro sinalizar a pontuação.',
    authorOrSource: 'Livro de Regras IBJJF (Artigo 2.3)',
    actionText: 'Consultar Placar & Regras',
    targetTab: 'regras'
  },
  {
    id: 'tip-3',
    category: 'filosofia',
    title: 'A Máxima de Carlos Gracie sobre a Mente',
    badge: 'Mentalidade & Tradição',
    content: '“O Jiu-Jitsu é a arte de usar a força do oponente contra ele mesmo, mas acima de tudo é a arte de dominar a própria mente sob a maior das pressões.” No tatame, a calma é a maior arma contra o cansaço.',
    authorOrSource: 'Grande Mestre Carlos Gracie',
    actionText: 'Ler História & Tradição',
    targetTab: 'historia'
  },
  {
    id: 'tip-4',
    category: 'tecnica',
    title: 'O Segredo da Pegada na Gola Cruzada',
    badge: 'Mecânica de Estrangulamento',
    content: 'No estrangulamento da gola cruzada (Cross Collar Choke), a primeira mão deve entrar o mais fundo possível, tocando a costura da nuca atrás do pescoço. Se a primeira mão estiver rasa, o segundo braço não terá ângulo para fechar a carótida.',
    authorOrSource: 'Fundamentos da Guarda Fechada',
    actionText: 'Ver Técnicas de Guarda',
    targetTab: 'golpes'
  },
  {
    id: 'tip-5',
    category: 'historia',
    title: 'A Origem da Tarja Vermelha na Faixa Preta',
    badge: 'Curiosidade Histórica',
    content: 'Renzo Gracie e os pioneiros explicavam que a tarja vermelha foi criada para diferenciar os instrutores formados e mestres aptos a lecionar dos demais faixas-pretas de competição (que usavam tarja branca). Ela homenageia o sangue e sacrifício dedicados à arte.',
    authorOrSource: 'Tradição do Tatame',
    actionText: 'Explorar Sistema de Faixas',
    targetTab: 'historia'
  },
  {
    id: 'tip-6',
    category: 'invisivel',
    title: 'Bloqueio do Crossface na Meia Guarda',
    badge: 'Defesa & Estrutura',
    content: 'Ao jogar por baixo na meia guarda, sua prioridade número um nunca é abraçar a cintura, mas sim proteger a linha da mandíbula com seu ombro e braço superior para impedir que o passador espalme sua cabeça e destrua sua mobilidade espinhal.',
    authorOrSource: 'Conceito de Alinhamento Vertebral',
    actionText: 'Ver Golpes & Defesas',
    targetTab: 'golpes'
  },
  {
    id: 'tip-7',
    category: 'tecnica',
    title: 'A Regra de Ouro do Triângulo: Fechar o Ângulo',
    badge: 'Biomecânica de Finalização',
    content: 'Se o oponente tiver ombros largos e o triângulo parecer difícil de travar, não estique as pernas em linha reta. Domine a canela oposta, pise com o pé livre no quadril dele e gire 90 graus para o lado do braço preso. O ajuste fecha o pescoço quase instantaneamente.',
    authorOrSource: 'Mecânica Angular do Triângulo',
    actionText: 'Ver Passo a Passo do Triângulo',
    targetTab: 'golpes'
  },
  {
    id: 'tip-8',
    category: 'filosofia',
    title: 'Acompanhe a sua Cobertura de Golpes no Tatame',
    badge: 'Progresso do Praticante',
    content: 'Praticar com regularidade exige mapear seu repertório: finalizações, raspagens, passagens e quedas. Acompanhe a porcentagem de técnicas treinadas no seu gráfico de rosca para garantir uma evolução técnica balanceada em todas as áreas.',
    authorOrSource: 'Gestão de Treino no Tatame',
    actionText: 'Ver Meu Perfil & Gráficos',
    targetTab: 'perfil'
  }
];
