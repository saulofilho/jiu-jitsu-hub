import { NewsArticle, TournamentEvent } from '../types';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Mundial de Jiu-Jitsu IBJJF 2026: Prévia das Chaves e Favoritos no Absoluto Faixa-Preta',
    category: 'Competição',
    date: '18 de Agosto de 2026',
    author: 'Tatame News Redação',
    readTime: '4 min de leitura',
    excerpt: 'A Pirâmide de Long Beach na Califórnia se prepara para receber os maiores nomes do Jiu-Jitsu mundial em busca do cobiçado ouro absoluto.',
    content: [
      'O Campeonato Mundial de Jiu-Jitsu da IBJJF promete ser um dos mais disputados da última década. Com recorde de inscritos em todas as categorias da faixa-preta, a divisão do absoluto desponta como a mais aguardada pelos fãs de todo o planeta.',
      'Entre os favoritos no peso pesado e superpesado, nomes como Nicholas Meregali, Kaynan Duarte e Victor Hugo despontam com jogos consolidados tanto por cima quanto por baixo.',
      'Nas categorias mais leves, a disputa entre a velocidade do Berimbolo e a precisão do Leg Drag segue aquecendo as discussões técnicas no tatame.'
    ],
    tags: ['IBJJF', 'Mundial', 'Faixa Preta', 'Long Beach', 'Absoluto'],
    likes: 342
  },
  {
    id: 'news-2',
    title: 'ADCC Submission Fighting: A Nova Era dos Leglocks e do Wrestling Integrado',
    category: 'Técnica',
    date: '14 de Agosto de 2026',
    author: 'Mestre Rogério Andrade',
    readTime: '6 min de leitura',
    excerpt: 'Como o grappling sem quimono evoluiu nos últimos anos, fundindo o wrestling universitário com as transições de Ashi Garami e Heel Hooks.',
    content: [
      'A transição entre o combate em pé e a luta de chão no No-Gi atingiu um nível de sofisticação nunca antes visto. Os melhores atletas do mundo agora dominam entradas rápidas de Single Leg e Duck Unders conectando diretamente em controles de perna (Inside Senkaku).',
      'A defesa de chaves de calcanhar também se aprimorou: o "Heel Slip" e a rotação preventiva agora são ensinados desde as categorias de base.',
      'Para quem busca competir no ADCC, o preparo físico anaeróbico e o tempo de reação em scrambles tornaram-se requisitos tão cruciais quanto o refinamento técnico.'
    ],
    tags: ['ADCC', 'No-Gi', 'Wrestling', 'Leglocks', 'Grappling'],
    likes: 489
  },
  {
    id: 'news-3',
    title: 'A Importância do "Jiu-Jitsu Invisível" nos Detalhes de Distribuição de Peso',
    category: 'Técnica',
    date: '08 de Agosto de 2026',
    author: 'Redação Arte Suave',
    readTime: '5 min de leitura',
    excerpt: 'Entenda o conceito popularizado por Rickson Gracie: como fazer 70 kg parecerem 120 kg sobre o adversário usando apenas o centro de gravidade.',
    content: [
      'O termo "Jiu-Jitsu Invisível" refere-se aos micro-ajustes corporais que não são facilmente perceptíveis por quem assiste de fora da luta, mas que transformam a experiência de quem está embaixo.',
      'Ao aplicar o controle lateral (100kg), por exemplo, apoiar os joelhos no chão dissipa a maior parte da sua massa no tatame. Ficar na ponta dos pés com o peso focado na ponta do ombro diretamente no queixo do adversário multiplica a pressão sentida por ele.',
      'Conexões de quadril, relaxamento consciente dos músculos antagonistas e respiração diafragmática são as verdadeiras chaves para se manter pesado e incansável durante múltiplos rounds.'
    ],
    tags: ['Rickson Gracie', 'Invisível', 'Biomecânica', '100kg', 'Fundamentos'],
    likes: 612
  },
  {
    id: 'news-4',
    title: 'Brasileiro de Jiu-Jitsu em Barueri Quebra Recorde Histórico de Inscritos',
    category: 'Comunidade',
    date: '02 de Agosto de 2026',
    author: 'CBJJ Notícias',
    readTime: '3 min de leitura',
    excerpt: 'O Ginásio José Corrêa em Barueri recebeu mais de 8 mil atletas de todas as regiões do Brasil, do pré-mirim ao Master 7.',
    content: [
      'O Campeonato Brasileiro da CBJJ confirmou mais uma vez o status do Brasil como o coração pulsante do esporte. O evento durou 9 dias ininterruptos em 14 áreas de luta simultâneas.',
      'Destaque especial para as divisões femininas e master, que apresentaram o maior crescimento percentual de participantes dos últimos 5 anos, comprovando o lema "Jiu-Jitsu para Todos".'
    ],
    tags: ['CBJJ', 'Brasileiro', 'Barueri', 'Comunidade', 'Crescimento'],
    likes: 275
  }
];

export const TOURNAMENT_CALENDAR: TournamentEvent[] = [
  {
    id: 'event-1',
    name: 'IBJJF World Jiu-Jitsu Championship 2026',
    organization: 'IBJJF',
    date: '28 de Outubro de 2026',
    location: 'Walter Pyramid, Long Beach, Califórnia (EUA)',
    modality: 'Gi',
    description: 'O maior e mais prestigiado torneio com quimono do planeta, coroando os campeões mundiais da temporada.',
    status: 'upcoming',
    livestreamInfo: 'Transmissão ao vivo via FloGrappling'
  },
  {
    id: 'event-2',
    name: 'ADCC World Championship 2026',
    organization: 'ADCC',
    date: '15 de Novembro de 2026',
    location: 'T-Mobile Arena, Las Vegas, Nevada (EUA)',
    modality: 'No-Gi',
    description: 'As Olimpíadas da Luta Agarrada (Submission Wrestling), reunindo os melhores finalizadores do mundo sem quimono.',
    status: 'upcoming',
    livestreamInfo: 'Pay-Per-View Global ADCC'
  },
  {
    id: 'event-3',
    name: 'Campeonato Pan-Americano de Jiu-Jitsu 2026',
    organization: 'IBJJF',
    date: '10 de Dezembro de 2026',
    location: 'Kissimmee, Flórida (EUA)',
    modality: 'Gi & No-Gi',
    description: 'Uma das etapas do Grand Slam do Jiu-Jitsu internacional reunindo os melhores atletas das Américas.',
    status: 'upcoming',
    livestreamInfo: 'Transmissão oficial IBJJF TV'
  },
  {
    id: 'event-4',
    name: 'BJJ Stars 14: O Duelo das Gerações',
    organization: 'BJJ Stars',
    date: '20 de Setembro de 2026',
    location: 'São Paulo, SP, Brasil',
    modality: 'Gi',
    description: 'O maior show profissional de lutas casadas do Brasil com premiações astronômicas para os campeões.',
    status: 'upcoming',
    livestreamInfo: 'Transmissão no Canal Combate e YouTube'
  }
];
