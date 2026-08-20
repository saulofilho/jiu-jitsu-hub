import { School } from '../types';

export const SCHOOLS: School[] = [
  {
    id: 'gracie-barra',
    name: 'Gracie Barra',
    founders: ['Carlos Gracie Jr.'],
    foundationYear: 1986,
    headquarters: 'Barra da Tijuca, Rio de Janeiro / Irvine, Califórnia (EUA)',
    motto: 'Organizados como um Exército, Unidos como uma Família / Jiu-Jitsu para Todos',
    philosophy: 'Democratizar o Jiu-Jitsu mantendo a essência das artes marciais tradicionais, com foco em desenvolvimento pessoal, integridade, saúde e liderança.',
    fightingStyle: 'Jiu-Jitsu completo com forte ênfase em fundamentos, guarda fechada, guarda aberta clássica e transições fluidas.',
    notableChampions: ['Marcio Feitosa', 'Romulo Barral', 'Braulio Estima', 'Kaynan Duarte', 'Felipe Pena (Preguiça)', 'Orlando Sanchez', 'Kyra Gracie'],
    lineage: 'Mitsuyo Maeda → Carlos Gracie → Carlos Gracie Jr.',
    historySummary: 'Fundada na Barra da Tijuca em 1986 por Carlos Gracie Jr., a Gracie Barra cresceu para se tornar a maior organização de escolas de Jiu-Jitsu do mundo, com mais de 1.000 academias globais e a emblemática logomarca do escudo vermelho.',
    funFacts: [
      'Foi a primeira equipe a padronizar uniformes e estrutura metodológica de ensino por faixas e módulos.',
      'O escudo vermelho (Red Shield) representa a lealdade, honra e espírito de família entre os membros globais.'
    ],
    logoColor: '#DC2626',
    symbolEmoji: '🛡️'
  },
  {
    id: 'alliance-jiu-jitsu',
    name: 'Alliance Jiu-Jitsu',
    founders: ['Romero "Jacaré" Cavalcanti', 'Fabio Gurgel', 'Alexandre Paiva', 'Fernando Gurgel'],
    foundationYear: 1993,
    headquarters: 'São Paulo, Brasil / Atlanta, Geórgia (EUA)',
    motto: 'A Águia nunca voa baixo / Excelência e Domínio Técnico',
    philosophy: 'Abordagem científica e altamente técnica do combate, treinamento disciplinado de alta intensidade e desenvolvimento de guardeiros e passadores dominantes.',
    fightingStyle: 'Passagens de guarda devastadoras com pressão (Bernardo Faria / Cobrinha / Lepri), meia guarda profunda e guarda laço cirúrgica.',
    notableChampions: ['Marcelo Garcia', 'Rubens "Cobrinha" Charles', 'Lucas Lepri', 'Bernardo Faria', 'Gabi Garcia', 'Michael Langhi', 'Nicholas Meregali', 'Tarsis Humphreys'],
    lineage: 'Mitsuyo Maeda → Carlos Gracie → Hélio Gracie → Rolls Gracie → Romero Cavalcanti',
    historySummary: 'A Alliance é uma das equipes mais laureadas da história do Jiu-Jitsu esportivo, com mais de 14 títulos mundiais por equipes na IBJJF. Originou-se da linhagem refinada de Rolls Gracie.',
    funFacts: [
      'Em 2002 sofreu uma grande dissidência que gerou equipes como a Checkmat e Brasa, mas reconstruiu-se para dominar a década seguinte.',
      'Marcelo Garcia, considerado por muitos o maior competidor de todos os tempos peso por peso, foi forjado na Alliance por Fabio Gurgel.'
    ],
    logoColor: '#1E3A8A',
    symbolEmoji: '🦅'
  },
  {
    id: 'checkmat',
    name: 'Checkmat Jiu-Jitsu',
    founders: ['Leonardo Vieira (Leozinho)', 'Ricardo Vieira (Rico)'],
    foundationYear: 2008,
    headquarters: 'Santos, SP / Long Beach, Califórnia (EUA)',
    motto: 'Xeque-Mate no Tatame / Criatividade e Inovação',
    philosophy: 'Estilo dinâmico, moderno e altamente criativo, mesclando acrobacias de guarda com passagens de guarda rápidas e finalizações imprevisíveis.',
    fightingStyle: 'Guarda 50/50, Berimbolo, passagens com saltos e rolamentos, leglocks rápidos e transições velozes.',
    notableChampions: ['Marcus "Buchecha" Almeida', 'Lucas Leite', 'Michelle Nicolini', 'Leo Vieira', 'Jackson Sousa', 'Gabriel Arges'],
    lineage: 'Mitsuyo Maeda → Carlos Gracie → Hélio Gracie → Rolls Gracie → Romero Cavalcanti → Leo Vieira',
    historySummary: 'Fundada pelos irmãos Vieira após a cisão da Brasa, a Checkmat revelou Marcus Buchecha Almeida, recordista absoluto com 13 títulos mundiais da IBJJF na faixa preta.',
    funFacts: [
      'O nome Checkmat vem do jogo de xadrez: a arte de antecipar jogadas até o xeque-mate no adversário.',
      'A academia é conhecida pelo ambiente vibrante e por acolher atletas de diversos países em seus camps de treino.'
    ],
    logoColor: '#059669',
    symbolEmoji: '♟️'
  },
  {
    id: 'atos-jiu-jitsu',
    name: 'Atos Jiu-Jitsu',
    founders: ['André Galvão', 'Ramon Lemos'],
    foundationYear: 2008,
    headquarters: 'San Diego, Califórnia (EUA) / Rio Claro, Brasil',
    motto: 'Juntos Somos Mais Fortes / A Fé move Guerreiros',
    philosophy: 'Combinação de fé, preparação física de nível olímpico, inovação técnica contínua e mentalidade de campeão implacável.',
    fightingStyle: 'Wrestling agressivo, Berimbolo, Leg Drag, transições rápidas da guarda para as costas e pressão física superior.',
    notableChampions: ['André Galvão', 'JT Torres', 'Keenan Cornelius', 'Lucas "Hulk" Barbosa', 'Kaynan Duarte', 'Rafa Mendes & Gui Mendes (Art of Jiu Jitsu / Atos)'],
    lineage: 'Mitsuyo Maeda → Carlos Gracie → Carlson Gracie → André Pederneiras / Tererê → André Galvão',
    historySummary: 'Nascida da união de André Galvão e Ramon Lemos em 2008, a Atos revolucionou o Jiu-Jitsu moderno nos anos 2010 com a popularização do Berimbolo, Guarda Worm e domínio no ADCC e Mundial IBJJF.',
    funFacts: [
      'A sede em San Diego tornou-se o epicentro mundial dos camps de preparação para o ADCC.',
      'André Galvão conquistou múltiplos títulos do ADCC tanto em sua categoria de peso quanto na histórica Superluta.'
    ],
    logoColor: '#000000',
    symbolEmoji: '⚡'
  },
  {
    id: 'carlson-gracie-team',
    name: 'Carlson Gracie Team',
    founders: ['Carlson Gracie'],
    foundationYear: 1970,
    headquarters: 'Copacabana, Rio de Janeiro (Figueiredo Magalhães)',
    motto: 'Onde o Filho Chora e a Mãe Não Vê / Coragem, Raça e Pressão',
    philosophy: 'Treinamento duro, sem frescura, voltado para a eficiência pura, vale-tudo, quebra de guarda por cima e esmagamento posicional.',
    fightingStyle: 'Passagens de guarda pesadíssimas (amassa-pão), pressão de ombro no queixo, guarda fechada sólida e agressividade calculada.',
    notableChampions: ['Murilo Bustamante', 'Zé Mario Sperry', 'Wallid Ismail', 'Ricardo Libório', 'Amaury Bitetti', 'Vitor Belfort', 'Bebeo Duarte'],
    lineage: 'Mitsuyo Maeda → Carlos Gracie → Carlson Gracie',
    historySummary: 'Carlson Gracie rompeu com o conservadorismo da família Gracie, abrindo as portas para alunos de todas as classes sociais e criando a equipe de luta mais temida dos anos 70, 80 e 90 no Vale-Tudo e Jiu-Jitsu.',
    funFacts: [
      'A lendária academia de Copacabana foi o berço que originou posteriormente a Brazilian Top Team (BTT) e a American Top Team (ATT).',
      'Carlson Gracie era famoso por seu amor a galos de briga e sua personalidade carismática e irreverente.'
    ],
    logoColor: '#EA580C',
    symbolEmoji: '🥊'
  },
  {
    id: 'nova-uniao',
    name: 'Nova União',
    founders: ['André Pederneiras (Dedé)', 'Wendell Alexander'],
    foundationYear: 1995,
    headquarters: 'Flamengo, Rio de Janeiro, Brasil',
    motto: 'União, Disciplina e Respeito',
    philosophy: 'Inclusão social através do esporte em comunidades do Rio de Janeiro, formação de atletas leves, rápidos e com guardas impossíveis de passar.',
    fightingStyle: 'Guarda meia profunda, guarda De La Riva, finalizações de pé e transição magistral para o MMA / UFC.',
    notableChampions: ['José Aldo', 'Renan Barão', 'Robson Moura (6x Campeão Mundial)', 'Vitor Ribeiro "Shaolin"', 'Leonardo Santos', 'BJ Penn'],
    lineage: 'Linhagem Carlos Gracie (Dedé) + Linhagem Oswaldo Fadda (Wendell Alexander)',
    historySummary: 'A Nova União uniu a linhagem Gracie de André Pederneiras com a histórica linhagem do subúrbio carioca de Oswaldo Fadda, tornando-se dominante nas categorias de peso leve do Jiu-Jitsu e campeã mundial do UFC com José Aldo e Renan Barão.',
    funFacts: [
      'Foi pioneira em acolher jovens de projetos sociais de favelas cariocas e transformá-los em campeões mundiais de Jiu-Jitsu e MMA.',
      'Robson Moura venceu o Mundial da IBJJF seis vezes representando a bandeira da Nova União.'
    ],
    logoColor: '#2563EB',
    symbolEmoji: '🇧🇷'
  },
  {
    id: 'gracie-humaita',
    name: 'Gracie Humaitá',
    founders: ['Hélio Gracie', 'Royler Gracie', 'Rickson Gracie'],
    foundationYear: 1980,
    headquarters: 'Humaitá, Rio de Janeiro, Brasil',
    motto: 'A Fonte Original da Arte Suave',
    philosophy: 'Preservação fiel dos princípios de defesa pessoal, sobrevivência, alavancas biomecânicas e supremacia da técnica sobre o tamanho físico.',
    fightingStyle: 'Jiu-Jitsu clássico, defesa pessoal cirúrgica, guarda fechada impenetrável e paciência estratégica no tatame.',
    notableChampions: ['Rickson Gracie', 'Royler Gracie (4x Campeão Mundial e 3x ADCC)', 'Saulo Ribeiro', 'Xande Ribeiro', 'Megaton Dias'],
    lineage: 'Mitsuyo Maeda → Carlos Gracie & Hélio Gracie',
    historySummary: 'A lendária sede da Rua Humaitá no Rio de Janeiro onde o Grande Mestre Hélio Gracie ministrava suas aulas particulares e onde foram forjados os maiores ícones da história da família, como Rickson e Royler.',
    funFacts: [
      'Royler Gracie venceu 4 Mundiais consecutivos da IBJJF e 3 campeonatos consecutivos do ADCC treinando no Humaitá.',
      'A academia é considerada o templo sagrado da linhagem direta de Hélio Gracie.'
    ],
    logoColor: '#15803D',
    symbolEmoji: '🥋'
  },
  {
    id: '10th-planet-jiu-jitsu',
    name: '10th Planet Jiu-Jitsu',
    founders: ['Eddie Bravo'],
    foundationYear: 2003,
    headquarters: 'Los Angeles, Califórnia (EUA)',
    motto: 'No-Gi Only / Evolua ou Fique para Trás',
    philosophy: 'Ruptura total com a tradição do quimono, desenvolvimento de nomenclaturas próprias e sistemas de flexibilidade para o combate No-Gi e MMA.',
    fightingStyle: 'Rubber Guard (Guarda Borracha), Lockdown na meia guarda, Twister, Truck e ataques sistemáticos de perna (Leglocks).',
    notableChampions: ['Geo Martinez', 'Richie Martinez', 'Grace Gundrum', 'Tony Ferguson (MMA)', 'Ben Eddy'],
    lineage: 'Mitsuyo Maeda → Carlos Gracie → Carlos Gracie Jr. → Jean Jacques Machado → Eddie Bravo',
    historySummary: 'Criada por Eddie Bravo após finalizar Royler Gracie com um triângulo no ADCC 2003, a 10th Planet descartou o uso do quimono para criar um sistema voltado exclusivamente para o submission wrestling e MMA.',
    funFacts: [
      'Utiliza termos e nomes excêntricos para as posições, como Zombie, Meat Hook, Electric Chair, New York e Kung Fu Move.',
      'Possui mais de 100 filiais no mundo focadas exclusivamente na modalidade sem quimono.'
    ],
    logoColor: '#7C3AED',
    symbolEmoji: '🪐'
  }
];
