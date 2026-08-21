import { BeltLevel, TechniqueCategory, Modality } from '../types';

export type NodeType = 'root_position' | 'technique' | 'outcome' | 'decision_point';
export type EdgeType = 'primary_attack' | 'opponent_reaction' | 'counter_transition' | 'sweep_point' | 'pass_point' | 'submission_finish';

export interface PathNode {
  id: string;
  techniqueId?: string; // Links to actual Technique in TECHNIQUES if applicable
  label: string;
  kanji?: string;
  category: TechniqueCategory | 'posicao' | 'reacao' | 'finalizacao_letal';
  minBelt: BeltLevel;
  modality: Modality;
  points?: number;
  type: NodeType;
  description: string;
  tacticalTip?: string;
  x?: number;
  y?: number;
}

export interface PathEdge {
  id: string;
  source: string;
  target: string;
  label: string; // e.g. "Se o oponente posturar", "Ataque inicial", "Raspagem"
  edgeType: EdgeType;
  description?: string;
  isAnimated?: boolean;
}

export interface TechniqueFlowScenario {
  id: string;
  title: string;
  kanji: string;
  subtitle: string;
  startingPosition: string;
  category: 'guarda' | 'passagem' | 'quedas' | 'defesa' | 'moderno';
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  description: string;
  rootNodeId: string;
  nodes: PathNode[];
  edges: PathEdge[];
}

export const TECHNIQUE_FLOW_SCENARIOS: TechniqueFlowScenario[] = [
  {
    id: 'guarda-fechada-flow',
    title: 'Guarda Fechada: O Triângulo de Ouro e Cadeias de Finalização',
    kanji: '閉じたガード',
    subtitle: 'A matriz definitiva de ataques interconectados de Hélio Gracie e Rickson Gracie',
    startingPosition: 'Guarda Fechada (Closed Guard)',
    category: 'guarda',
    difficulty: 'Iniciante',
    description: 'A guarda fechada é um sistema ofensivo interligado: qualquer defesa contra o Armlock abre espaço imediato para o Triângulo ou a Omoplata, e o bloqueio de base abre a Raspagem Pendular ou Tesourinha.',
    rootNodeId: 'node-gf-root',
    nodes: [
      {
        id: 'node-gf-root',
        label: 'Guarda Fechada Estabelecida',
        kanji: '本道',
        category: 'posicao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'root_position',
        description: 'Postura quebrada, controle de manga e gola com quadris ativos e soltos.',
        tacticalTip: 'Nunca fique plano no chão: mantenha os joelhos puxando o oponente para si.'
      },
      {
        id: 'node-gf-armlock',
        techniqueId: 'armlock-guarda-fechada',
        label: 'Armlock da Guarda Fechada',
        kanji: '十字固',
        category: 'finalizacao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'technique',
        description: 'Hiperextensão do cotovelo cruzando o braço e ângulo perpendicular de 90°.',
        tacticalTip: 'Aperte forte os joelhos (adutores) e mantenha o polegar dele para o teto.'
      },
      {
        id: 'node-gf-triangulo',
        techniqueId: 'triangulo-guarda-fechada',
        label: 'Triângulo (Sankaku Jime)',
        kanji: '三角絞',
        category: 'finalizacao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'technique',
        description: 'Estrangulamento vascular carotídeo isolando um braço para dentro e outro fora.',
        tacticalTip: 'Segure a canela antes de fechar a perna em 4 e mude o ângulo para a lateral.'
      },
      {
        id: 'node-gf-omoplata',
        techniqueId: 'omoplata-guarda',
        label: 'Omoplata (Ashi Guruma)',
        kanji: '肩車',
        category: 'finalizacao',
        minBelt: 'azul',
        modality: 'ambos',
        type: 'technique',
        description: 'Chave de ombro alavancada com as pernas em S e controle do quadril.',
        tacticalTip: 'Trave a faixa ou cintura dele imediatamente para impedir a cambalhota de fuga.'
      },
      {
        id: 'node-gf-flower',
        techniqueId: 'raspagem-pendulo-flower',
        label: 'Raspagem Pendular (Flower Sweep)',
        kanji: '振子返',
        category: 'raspagem',
        minBelt: 'branca',
        modality: 'gi',
        points: 2,
        type: 'technique',
        description: 'Momentum circular da perna livre jogando o oponente direto na montada.',
        tacticalTip: 'Abrace a coxa dele por baixo e chute a perna livre em arco amplo.'
      },
      {
        id: 'node-gf-kimura',
        techniqueId: 'kimura-guarda-fechada',
        label: 'Kimura da Guarda (Ude Garami)',
        kanji: '腕緘',
        category: 'finalizacao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'technique',
        description: 'Figura de quatro no punho e rotação do ombro para trás da nuca.',
        tacticalTip: 'Sente-se em diagonal para buscar a pegada em vez de tentar pegar deitado.'
      },
      {
        id: 'node-gf-tesourinha',
        techniqueId: 'raspagem-tesourinha',
        label: 'Raspagem Tesourinha (Scissor)',
        kanji: '鋏返',
        category: 'raspagem',
        minBelt: 'branca',
        modality: 'ambos',
        points: 2,
        type: 'technique',
        description: 'Escudo com canela no peito e tesoura de pernas cortando a base.',
        tacticalTip: 'Puxe o oponente para cima do seu escudo antes de tesourar as pernas.'
      },
      {
        id: 'node-gf-cruzado',
        techniqueId: 'estrangulamento-cruzado',
        label: 'Estrangulamento Cruzado',
        kanji: '十字絞',
        category: 'finalizacao',
        minBelt: 'branca',
        modality: 'gi',
        type: 'technique',
        description: 'Dupla pegada profunda com 4 dedos para dentro nas golas cruzadas.',
        tacticalTip: 'Aproxime o seu peito do oponente em vez de tentar puxar apenas com os braços.'
      },
      {
        id: 'node-gf-montada',
        label: 'Montada Estabelecida (+4 Pts)',
        kanji: '乗込',
        category: 'posicao',
        minBelt: 'branca',
        modality: 'ambos',
        points: 4,
        type: 'outcome',
        description: 'Domínio superior estabilizado por 3 segundos com joelhos no peito do oponente.',
        tacticalTip: 'Abra as mãos como base no chão se ele tentar pontes de fuga (Upa).'
      },
      {
        id: 'node-gf-finalizacao-letal',
        label: 'Vitória por Finalização (Tap-Out)',
        kanji: '一本勝',
        category: 'finalizacao_letal',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'outcome',
        description: 'Rendimento do oponente por finalização técnica incontestável (Ippon).',
        tacticalTip: 'Solte a chave imediatamente ao sentir os 3 tapinhas do adversário.'
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'node-gf-root',
        target: 'node-gf-armlock',
        label: 'Quebra de postura + Braço cruzado',
        edgeType: 'primary_attack',
        isAnimated: true
      },
      {
        id: 'e2',
        source: 'node-gf-armlock',
        target: 'node-gf-triangulo',
        label: 'Oponente recolhe o braço posturando',
        edgeType: 'opponent_reaction',
        description: 'Ao retirar o braço esticado, um braço fica dentro e outro fora, abrindo o triângulo imediato.'
      },
      {
        id: 'e3',
        source: 'node-gf-armlock',
        target: 'node-gf-omoplata',
        label: 'Oponente esconde o cotovelo e gira o tronco',
        edgeType: 'counter_transition',
        description: 'Chute a perna por baixo da axila e gire 180 graus para sentar na omoplata.'
      },
      {
        id: 'e4',
        source: 'node-gf-armlock',
        target: 'node-gf-flower',
        label: 'Oponente defende a cabeça com peso para trás',
        edgeType: 'counter_transition',
        description: 'Abrace a perna de apoio dele e use o pêndulo para inverter direto na montada.'
      },
      {
        id: 'e5',
        source: 'node-gf-root',
        target: 'node-gf-kimura',
        label: 'Oponente apoia a mão no tatame',
        edgeType: 'primary_attack',
        isAnimated: true
      },
      {
        id: 'e6',
        source: 'node-gf-kimura',
        target: 'node-gf-tesourinha',
        label: 'Oponente esconde a mão na cintura/coxa',
        edgeType: 'opponent_reaction',
        description: 'Como o peso dele foi para o quadril, o corte da tesourinha ou Hip Bump fica livre.'
      },
      {
        id: 'e7',
        source: 'node-gf-root',
        target: 'node-gf-cruzado',
        label: 'Pegada profunda dupla nas golas',
        edgeType: 'primary_attack'
      },
      {
        id: 'e8',
        source: 'node-gf-cruzado',
        target: 'node-gf-armlock',
        label: 'Oponente empurra cotovelos para aliviar pescoço',
        edgeType: 'counter_transition'
      },
      {
        id: 'e9',
        source: 'node-gf-flower',
        target: 'node-gf-montada',
        label: 'Giro completo (+2 Pts Raspagem)',
        edgeType: 'sweep_point'
      },
      {
        id: 'e10',
        source: 'node-gf-tesourinha',
        target: 'node-gf-montada',
        label: 'Varredura e subida (+2 Pts Raspagem)',
        edgeType: 'sweep_point'
      },
      {
        id: 'e11',
        source: 'node-gf-armlock',
        target: 'node-gf-finalizacao-letal',
        label: 'Hiperextensão do cotovelo (Tap)',
        edgeType: 'submission_finish'
      },
      {
        id: 'e12',
        source: 'node-gf-triangulo',
        target: 'node-gf-finalizacao-letal',
        label: 'Aperto carotídeo duplo (Tap)',
        edgeType: 'submission_finish'
      },
      {
        id: 'e13',
        source: 'node-gf-omoplata',
        target: 'node-gf-finalizacao-letal',
        label: 'Elevação de quadril no ombro (Tap)',
        edgeType: 'submission_finish'
      },
      {
        id: 'e14',
        source: 'node-gf-cruzado',
        target: 'node-gf-finalizacao-letal',
        label: 'Oclusão das carótidas (Tap)',
        edgeType: 'submission_finish'
      }
    ]
  },
  {
    id: 'de-la-riva-berimbolo-flow',
    title: 'Guarda De La Riva & Sistema Moderno de Costas',
    kanji: '裏回り',
    subtitle: 'Conexões táticas de guarda aberta, desequilíbrios e rotação para as costas',
    startingPosition: 'Guarda De La Riva (Open Guard)',
    category: 'moderno',
    difficulty: 'Avançado',
    description: 'O encadeamento moderno utilizado pelos irmãos Miyao e Mendes: gancho De La Riva quebra a base para o Berimbolo ou força a transição para Guarda X e Leglocks.',
    rootNodeId: 'node-dlr-root',
    nodes: [
      {
        id: 'node-dlr-root',
        label: 'Guarda De La Riva Ativa',
        kanji: '足絡み',
        category: 'guarda',
        minBelt: 'azul',
        modality: 'ambos',
        type: 'root_position',
        description: 'Gancho externo profundo no tendão de Aquiles e pegada no calcanhar/faixa.',
        tacticalTip: 'Gire o pé para fora empurrando o joelho dele para dentro para anular a base.'
      },
      {
        id: 'node-dlr-berimbolo',
        techniqueId: 'raspagem-berimbolo',
        label: 'Berimbolo (Inversão para Costas)',
        kanji: '回転技',
        category: 'raspagem',
        minBelt: 'roxa',
        modality: 'ambos',
        points: 2,
        type: 'technique',
        description: 'Inversão de cabeça para baixo rodando pelos ombros com gancho twister.',
        tacticalTip: 'Nunca apoie o pescoço: role sobre a linha dos ombros mantendo a pegada na faixa.'
      },
      {
        id: 'node-dlr-costas',
        label: 'Pegada pelas Costas (+4 Pts)',
        kanji: '背後取',
        category: 'posicao',
        minBelt: 'branca',
        modality: 'ambos',
        points: 4,
        type: 'outcome',
        description: 'Ganchos colocados no interior das coxas e controle de cinto de segurança (Seatbelt).',
        tacticalTip: 'Cole seu peito nas costas do oponente e mantenha a cabeça do lado do braço que ataca.'
      },
      {
        id: 'node-dlr-arco',
        techniqueId: 'estrangulamento-arco-e-flecha',
        label: 'Arco e Flecha (Bow & Arrow)',
        kanji: '弓矢絞',
        category: 'finalizacao',
        minBelt: 'azul',
        modality: 'gi',
        type: 'technique',
        description: 'Pegada funda na gola cruzada e mão na calça puxando em direções opostas.',
        tacticalTip: 'Passe a perna por cima do ombro dele para anular qualquer tentativa de giro.'
      },
      {
        id: 'node-dlr-mataleao',
        techniqueId: 'mata-leao',
        label: 'Mata-Leão (Hadaka Jime)',
        kanji: '裸絞',
        category: 'finalizacao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'technique',
        description: 'Ataque arterial direto pelas costas com pegada no próprio bíceps.',
        tacticalTip: 'Esconda a mão de apoio atrás da nuca dele e expanda a caixa torácica.'
      },
      {
        id: 'node-dlr-xguard',
        techniqueId: 'guarda-x-x-guard',
        label: 'Transição para Guarda X',
        kanji: 'Xガード',
        category: 'guarda',
        minBelt: 'azul',
        modality: 'ambos',
        points: 2,
        type: 'technique',
        description: 'Mergulho sob o centro de gravidade com pernas em X desestabilizando o passador.',
        tacticalTip: 'Apoie a perna dele no seu ombro e estique as pernas para tirar a base dele.'
      },
      {
        id: 'node-dlr-5050',
        techniqueId: 'guarda-50-50',
        label: 'Entrada na Guarda 50/50',
        kanji: '五分五分',
        category: 'guarda',
        minBelt: 'roxa',
        modality: 'ambos',
        type: 'technique',
        description: 'Entrelaçamento simétrico de pernas em triângulo na perna do adversário.',
        tacticalTip: 'Mantenha seus calcanhares escondidos e dispute a pegada do tronco.'
      },
      {
        id: 'node-dlr-heelhook',
        techniqueId: 'chave-de-calcanhar-heel-hook',
        label: 'Inside Heel Hook (Torção)',
        kanji: '踵挫',
        category: 'finalizacao',
        minBelt: 'marrom',
        modality: 'nogi',
        type: 'technique',
        description: 'Isolamento da linha do joelho e rotação do calcanhar no No-Gi / ADCC.',
        tacticalTip: 'Prenda o joelho do oponente firmemente entre as suas coxas antes de girar os ombros.'
      },
      {
        id: 'node-dlr-botinha',
        techniqueId: 'chave-pe-reta',
        label: 'Chave de Pé Reta (Botinha)',
        kanji: '足挫',
        category: 'finalizacao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'technique',
        description: 'Ataque ao tendão de Aquiles e arco dorsal arqueando a coluna para trás.',
        tacticalTip: 'Encaixe o pé fundo sob a axila e olhe por cima do ombro de ataque.'
      }
    ],
    edges: [
      {
        id: 'e-dlr-1',
        source: 'node-dlr-root',
        target: 'node-dlr-berimbolo',
        label: 'Desequilíbrio + Queda sentada do oponente',
        edgeType: 'primary_attack',
        isAnimated: true
      },
      {
        id: 'e-dlr-2',
        source: 'node-dlr-berimbolo',
        target: 'node-dlr-costas',
        label: 'Twister Hook + Escalar para as costas (+4 Pts)',
        edgeType: 'sweep_point'
      },
      {
        id: 'e-dlr-3',
        source: 'node-dlr-costas',
        target: 'node-dlr-arco',
        label: 'Com Kimono: Pegada na gola cruzada + calça',
        edgeType: 'submission_finish'
      },
      {
        id: 'e-dlr-4',
        source: 'node-dlr-costas',
        target: 'node-dlr-mataleao',
        label: 'No-Gi ou Pescoço exposto: Seatbelt para Bíceps',
        edgeType: 'submission_finish'
      },
      {
        id: 'e-dlr-5',
        source: 'node-dlr-root',
        target: 'node-dlr-xguard',
        label: 'Passador afasta a perna de trás',
        edgeType: 'counter_transition'
      },
      {
        id: 'e-dlr-6',
        source: 'node-dlr-root',
        target: 'node-dlr-5050',
        label: 'Inversão De La Riva invertida',
        edgeType: 'counter_transition'
      },
      {
        id: 'e-dlr-7',
        source: 'node-dlr-5050',
        target: 'node-dlr-heelhook',
        label: 'Regra No-Gi: Exposição de calcanhar',
        edgeType: 'submission_finish'
      },
      {
        id: 'e-dlr-8',
        source: 'node-dlr-5050',
        target: 'node-dlr-botinha',
        label: 'Regra Gi IBJJF: Ataque reto ao tendão',
        edgeType: 'submission_finish'
      }
    ]
  },
  {
    id: 'passador-top-game-flow',
    title: 'Pressão Superior: Passagens de Guarda & Finalizações do 100kg',
    kanji: '護身破壊',
    subtitle: 'Da quebra de guarda até a montada esmagadora e finalizações da posição dominante',
    startingPosition: 'Passador por Cima (Top Passing)',
    category: 'passagem',
    difficulty: 'Intermediário',
    description: 'A anatomia do jogo por cima: corte de joelho rápido (Knee Slice) e Toreando quebram os ganchos, garantindo 3 pontos de passagem e abrindo Katagatame, Kimura ou Montada.',
    rootNodeId: 'node-top-root',
    nodes: [
      {
        id: 'node-top-root',
        label: 'Passador em Postura Ativa',
        kanji: '上段',
        category: 'posicao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'root_position',
        description: 'Base baixa, cotovelos fechados, controle de golas e calças.',
        tacticalTip: 'Nunca fique com os braços esticados dentro da guarda do adversário.'
      },
      {
        id: 'node-top-kneeslice',
        techniqueId: 'passagem-knee-slice-corte-joelho',
        label: 'Knee Slice Pass (Corte de Joelho)',
        kanji: '膝切越',
        category: 'passagem',
        minBelt: 'branca',
        modality: 'ambos',
        points: 3,
        type: 'technique',
        description: 'Deslize diagonal sobre a coxa do guardeiro com esgrima e ombro no queixo.',
        tacticalTip: 'O Crossface (ombro no queixo dele) é o que anula 100% da reposição.'
      },
      {
        id: 'node-top-toreando',
        techniqueId: 'passagem-torreando',
        label: 'Passagem Toreando (Bullfighter)',
        kanji: '闘牛越',
        category: 'passagem',
        minBelt: 'branca',
        modality: 'ambos',
        points: 3,
        type: 'technique',
        description: 'Jogar os joelhos para um lado e correr os quadris para o outro lado.',
        tacticalTip: 'Empurre os joelhos dele para o chão e faça passos circulares rápidos.'
      },
      {
        id: 'node-top-100kg',
        label: 'Controle Lateral 100kg (+3 Pts)',
        kanji: '横四方',
        category: 'posicao',
        minBelt: 'branca',
        modality: 'ambos',
        points: 3,
        type: 'outcome',
        description: 'Peito no peito estabilizado com cabeça e axila dominadas por 3 segundos.',
        tacticalTip: 'Mantenha os quadris pesados no chão e o ombro pressionando o queixo dele.'
      },
      {
        id: 'node-top-katagatame',
        techniqueId: 'katagatame-arm-triangle',
        label: 'Katagatame (Arm Triangle)',
        kanji: '肩固',
        category: 'finalizacao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'technique',
        description: 'Estrangulamento com o próprio ombro do oponente comprimindo a carótida.',
        tacticalTip: 'Desmonte o quadril para o lado do braço preso e cole a testa no tatame.'
      },
      {
        id: 'node-top-ezequiel',
        techniqueId: 'estrangulamento-ezequiel',
        label: 'Ezequiel Choke (Manga / Punho)',
        kanji: '袖車絞',
        category: 'finalizacao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'technique',
        description: 'Quatro dedos dentro da própria manga e lâmina do punho na traqueia.',
        tacticalTip: 'Não dê espaço para o oponente erguer o queixo e defender com a mão.'
      },
      {
        id: 'node-top-montada',
        label: 'Transição para Montada (+4 Pts)',
        kanji: '上四方',
        category: 'posicao',
        minBelt: 'branca',
        modality: 'ambos',
        points: 4,
        type: 'outcome',
        description: 'Avanço do joelho deslizando pelo abdômen até a montada completa.',
        tacticalTip: 'Isole os braços do oponente antes de montar para impedir o Upa imediato.'
      },
      {
        id: 'node-top-americana',
        techniqueId: 'americana-montada',
        label: 'Chave Americana da Montada',
        kanji: '腕挫',
        category: 'finalizacao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'technique',
        description: 'Figura de quatro pressionando o punho no chão e elevando o cotovelo.',
        tacticalTip: 'Pincele o chão trazendo o dorso da mão em direção à cintura dele.'
      }
    ],
    edges: [
      {
        id: 'e-top-1',
        source: 'node-top-root',
        target: 'node-top-kneeslice',
        label: 'Esgrima profunda + Corte diagonal',
        edgeType: 'primary_attack',
        isAnimated: true
      },
      {
        id: 'e-top-2',
        source: 'node-top-root',
        target: 'node-top-toreando',
        label: 'Pegadas nos joelhos + Desvio lateral',
        edgeType: 'primary_attack'
      },
      {
        id: 'e-top-3',
        source: 'node-top-kneeslice',
        target: 'node-top-100kg',
        label: 'Estabilização 3 segundos (+3 Pts)',
        edgeType: 'pass_point'
      },
      {
        id: 'e-top-4',
        source: 'node-top-toreando',
        target: 'node-top-100kg',
        label: 'Estabilização lateral (+3 Pts)',
        edgeType: 'pass_point'
      },
      {
        id: 'e-top-5',
        source: 'node-top-100kg',
        target: 'node-top-katagatame',
        label: 'Oponente tenta empurrar com o braço esticado',
        edgeType: 'submission_finish'
      },
      {
        id: 'e-top-6',
        source: 'node-top-100kg',
        target: 'node-top-ezequiel',
        label: 'Ataque direto por cima do queixo',
        edgeType: 'submission_finish'
      },
      {
        id: 'e-top-7',
        source: 'node-top-100kg',
        target: 'node-top-montada',
        label: 'Joelho desliza no abdômen (+4 Pts)',
        edgeType: 'sweep_point'
      },
      {
        id: 'e-top-8',
        source: 'node-top-montada',
        target: 'node-top-americana',
        label: 'Oponente apoia o cotovelo no chão',
        edgeType: 'submission_finish'
      }
    ]
  },
  {
    id: 'quedas-wrestling-judo-flow',
    title: 'Luta em Pé & Quedas: Judô, Wrestling & Front Headlock',
    kanji: '立技投技',
    subtitle: 'Do controle de pegadas em pé à projeção de 2 pontos e ataques de guilhotina no sprawl',
    startingPosition: 'Luta em Pé (Stand-up Combat)',
    category: 'quedas',
    difficulty: 'Intermediário',
    description: 'A transição em pé: se o oponente defender o Double Leg com sprawl, o pescoço fica exposto para Guilhotina, D\'Arce ou Anaconda Choke. Se ele empurrar, a projeção de Ippon Seoi Nage derruba nos 100kg.',
    rootNodeId: 'node-stand-root',
    nodes: [
      {
        id: 'node-stand-root',
        label: 'Combate em Pé & Disputa de Pegadas',
        kanji: '立合',
        category: 'posicao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'root_position',
        description: 'Postura atlética, pés paralelos/escalonados, quebrando pegadas de gola.',
        tacticalTip: 'Quem domina a primeira pegada controla o tempo e a distância da luta.'
      },
      {
        id: 'node-stand-doubleleg',
        techniqueId: 'queda-double-leg-baiana',
        label: 'Double Leg / Baiana (2 Pts)',
        kanji: '諸手狩',
        category: 'queda',
        minBelt: 'branca',
        modality: 'ambos',
        points: 2,
        type: 'technique',
        description: 'Mudança de nível, joelho no meio das pernas e abraço duplo nos joelhos.',
        tacticalTip: 'Cole a cabeça na costela dele com queixo alto para não entrar na guilhotina.'
      },
      {
        id: 'node-stand-seoinage',
        techniqueId: 'queda-ippon-seoi-nage',
        label: 'Ippon Seoi Nage (Projeção)',
        kanji: '一本背負',
        category: 'queda',
        minBelt: 'azul',
        modality: 'gi',
        points: 2,
        type: 'technique',
        description: 'Desequilíbrio frontal (Kuzushi), giro 180° e arremesso por cima do ombro.',
        tacticalTip: 'Seu quadril deve ficar abaixo do dele para atuar como fulcro do arremesso.'
      },
      {
        id: 'node-stand-frontheadlock',
        label: 'Controle de Front Headlock / Sprawl',
        kanji: '首落',
        category: 'posicao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'decision_point',
        description: 'Oponente defendeu a queda jogando os quadris para trás (sprawl) de cabeça baixa.',
        tacticalTip: 'Pressione o peso do seu peito sobre a nuca dele para impedir que ele levante.'
      },
      {
        id: 'node-stand-guillotine',
        techniqueId: 'guilhotina-em-pe-e-chao',
        label: 'Guilhotina (Guillotine Choke)',
        kanji: '断頭絞',
        category: 'finalizacao',
        minBelt: 'branca',
        modality: 'ambos',
        type: 'technique',
        description: 'Braço ao redor da garganta e crunch abdominal puxando para a guarda.',
        tacticalTip: 'Eleve o cotovelo de ataque por cima do ombro dele (estilo Marcelotine).'
      },
      {
        id: 'node-stand-darce',
        techniqueId: 'darce-choke',
        label: "D'Arce Choke (Brabo No-Gi)",
        kanji: '絞撃',
        category: 'finalizacao',
        minBelt: 'azul',
        modality: 'ambos',
        type: 'technique',
        description: 'Braço entra pela axila e sai pelo pescoço travando no próprio bíceps.',
        tacticalTip: 'Derrube o oponente de lado e caminhe com as pernas para fechar o triângulo.'
      },
      {
        id: 'node-stand-anaconda',
        techniqueId: 'anaconda-choke',
        label: 'Anaconda Choke & Gator Roll',
        kanji: '蛇絞',
        category: 'finalizacao',
        minBelt: 'azul',
        modality: 'ambos',
        type: 'technique',
        description: 'Braço entra pelo pescoço e sai pela axila seguido do rolamento de jacaré.',
        tacticalTip: 'O rolamento quebra a base e prende as pernas do oponente no tatame.'
      }
    ],
    edges: [
      {
        id: 'e-stand-1',
        source: 'node-stand-root',
        target: 'node-stand-doubleleg',
        label: 'Level Change + Penetração de joelho',
        edgeType: 'primary_attack',
        isAnimated: true
      },
      {
        id: 'e-stand-2',
        source: 'node-stand-root',
        target: 'node-stand-seoinage',
        label: 'Puxada de manga (Kuzushi) + Giro de costas',
        edgeType: 'primary_attack'
      },
      {
        id: 'e-stand-3',
        source: 'node-stand-doubleleg',
        target: 'node-stand-frontheadlock',
        label: 'Oponente joga as pernas para trás (Sprawl)',
        edgeType: 'opponent_reaction'
      },
      {
        id: 'e-stand-4',
        source: 'node-stand-frontheadlock',
        target: 'node-stand-guillotine',
        label: 'Cabeça do oponente exposta para a frente',
        edgeType: 'submission_finish'
      },
      {
        id: 'e-stand-5',
        source: 'node-stand-frontheadlock',
        target: 'node-stand-darce',
        label: 'Braço do oponente fica esticado para apoiar',
        edgeType: 'submission_finish'
      },
      {
        id: 'e-stand-6',
        source: 'node-stand-frontheadlock',
        target: 'node-stand-anaconda',
        label: 'Pescoço e axila travados + Gator Roll',
        edgeType: 'submission_finish'
      }
    ]
  }
];
