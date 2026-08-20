import { HistoryTopic, GlossaryTerm } from '../types';

export const HISTORY_TOPICS: HistoryTopic[] = [
  {
    id: 'origem-conde-koma',
    title: 'A Chegada de Mitsuyo Maeda (Conde Koma) ao Brasil',
    subtitle: 'O elo japonês que plantou a semente do Jiu-Jitsu em Belém do Pará',
    category: 'origem',
    era: '1914 – 1925',
    summary: 'Como um dos melhores discípulos de Jigoro Kano (fundador do Judô/Jiu-Jitsu Kodokan) viajou o mundo enfrentando lutadores de todas as modalidades e ensinou a família Gracie no norte do Brasil.',
    fullContent: [
      'Mitsuyo Maeda nasceu no Japão em 1878 e tornou-se um dos mais habilidosos mestres do Instituto Kodokan de Tóquio. Com o objetivo de divulgar a arte pelo globo, viajou pela América do Norte, Europa e América Central realizando centenas de desafios de luta real.',
      'Em 1914, Maeda desembarcou em Porto Alegre e posteriormente fixou residência em Belém do Pará, onde ficou conhecido como "Conde Koma".',
      'Em Belém, Maeda foi auxiliado pelo diplomata e empresário Gastão Gracie. Em sinal de gratidão pela ajuda na colônia japonesa, Maeda aceitou ensinar os segredos da arte ao jovem Carlos Gracie, filho mais velho de Gastão, em 1917.',
      'Carlos treinou com afinco por alguns anos, absorvendo as quedas, a luta de chão e a filosofia samurai, repassando o conhecimento aos seus irmãos: Oswaldo, Gastão Jr., George e Hélio Gracie.'
    ],
    keyFigures: ['Mitsuyo Maeda (Conde Koma)', 'Carlos Gracie', 'Gastão Gracie', 'Jigoro Kano'],
    legacyImpact: 'Deu início formal à linhagem brasileira de Jiu-Jitsu que viria a transformar as artes marciais no século XX.',
    highlightQuote: 'O Jiu-Jitsu é a arte de ceder para vencer, usando a força do agressor contra ele mesmo.'
  },
  {
    id: 'helio-gracie-adaptacao',
    title: 'Hélio Gracie e a Revolução das Alavancas',
    subtitle: 'A transformação do Jiu-Jitsu para que o mais fraco pudesse vencer o mais forte',
    category: 'filosofia',
    era: '1925 – 1955',
    summary: 'Como a compleição franzina de Hélio Gracie forçou a evolução da técnica, substituindo a força física bruta por alavancas biomecânicas perfeitas.',
    fullContent: [
      'Hélio Gracie era o mais jovem e fisicamente franzino entre os irmãos Gracie. Devido a constantes desmaios e saúde frágil, ele apenas assistia às aulas ministradas por seu irmão Carlos Gracie no Rio de Janeiro.',
      'Certo dia, Carlos se atrasou para ministrar uma aula particular a um empresário influente. Hélio, que havia memorizado todos os movimentos visualmente, ofereceu-se para conduzir a aula.',
      'Ao aplicar os golpes com seu corpo leve (pesava cerca de 63 kg), Hélio percebeu que muitos movimentos do Jiu-Jitsu japonês tradicional dependiam de força e explosão que ele não possuía.',
      'Ele começou a modificar sistematicamente os ângulos, pontos de apoio e alavancas: guardas fechadas, saídas com pontes no quadril, estrangulamentos arteriais com o próprio peso e tempo de luta. Assim nasceu a essência refinada do Brazilian Jiu-Jitsu (Gracie Jiu-Jitsu).'
    ],
    keyFigures: ['Hélio Gracie', 'Carlos Gracie', 'George Gracie'],
    legacyImpact: 'Provou ao mundo que a técnica, precisão e paciência superam qualquer vantagem de peso ou força bruta em um combate.',
    highlightQuote: 'Eu nunca derrotei ninguém; foi o Jiu-Jitsu que os derrotou.'
  },
  {
    id: 'luta-kimura-vs-helio',
    title: 'A Batalha Histórica: Hélio Gracie vs Masahiko Kimura (1951)',
    subtitle: 'A noite no Maracanã que batizou a chave de braço mais famosa do mundo',
    category: 'lutas_historicas',
    era: '23 de Outubro de 1951',
    summary: 'O campeão japonês Masahiko Kimura veio ao Brasil e enfrentou Hélio Gracie em um Maracanã lotado com 20 mil espectadores.',
    fullContent: [
      'Em outubro de 1951, o lendário judoca Masahiko Kimura, considerado invencível no Japão e pesando 84 kg de puro músculo, aceitou o desafio de enfrentar Hélio Gracie (65 kg) no Estádio do Maracanã.',
      'Antes da luta, Kimura declarou à imprensa que se Hélio resistisse por mais de 3 minutos, consideraria o brasileiro o vencedor moral.',
      'A luta durou impressionantes 13 minutos de batalha tensa no solo. Hélio defendeu arremessos violentos e estrangulamentos, até que Kimura conseguiu encaixar uma chave de ombro reversa (Gyaku Ude-Garami).',
      'Hélio recusou-se a bater para não desistir, até que Carlos Gracie jogou a toalha para preservar o braço do irmão.',
      'Impressionado com a bravura, técnica e resistência de Hélio, Kimura subiu ao ringue e cumprimentou o mestre brasileiro com profunda reverência. Desde aquele dia, a chave Ude-Garami passou a ser mundialmente conhecida como "KIMURA".'
    ],
    keyFigures: ['Masahiko Kimura', 'Hélio Gracie', 'Carlos Gracie'],
    legacyImpact: 'Batizou a chave de ombro "Kimura" e colocou o Jiu-Jitsu brasileiro no radar dos maiores mestres marciais do planeta.',
    highlightQuote: 'Hélio Gracie foi o adversário mais valente e resistente que enfrentei em toda a minha carreira. — Masahiko Kimura'
  },
  {
    id: 'origem-do-termo-oss',
    title: 'O Verdadeiro Significado do Cumprimento "OSS"',
    subtitle: 'Por que os praticantes de Jiu-Jitsu dizem OSS ao entrar no tatame',
    category: 'curiosidade',
    era: 'Tradição Marcial',
    summary: 'A etimologia japonesa de Osu (押忍) e sua representação de perseverança, respeito mútuo e resiliência sob pressão.',
    fullContent: [
      'A expressão "OSS" (pronunciada Osu) tem suas raízes no Japão imperial e nas academias de Karatê e Judô da Universidade de Kyoto nos anos 1930.',
      'É a abreviação da expressão japonesa "Oshi Shinobu" (押し忍ぶ), composta por dois kanjis fundamentais:',
      '1. OSU (押): Significa empurrar, pressionar para a frente com determinação.',
      '2. SHINOBU (忍): Significa suportar, aguentar firme a dor, perseverar com paciência.',
      'Juntos, significam: "A capacidade de suportar qualquer pressão e continuar avançando sem reclamar".',
      'No Jiu-Jitsu moderno, "OSS" é usado como saudação de respeito ao Mestre e aos colegas, demonstração de entendimento de uma instrução e celebração da perseverança no tatame.'
    ],
    keyFigures: ['Tradição Samurai', 'Gerações de Mestres'],
    legacyImpact: 'Tornou-se a saudação universal de união e camaradagem em todos os tatames do planeta.',
    highlightQuote: 'OSS é perseverar quando seu corpo pede para desistir.'
  },
  {
    id: 'por-que-faixa-preta-tem-tarja-vermelha',
    title: 'Por Que a Faixa Preta de BJJ Tem Tarja Vermelha?',
    subtitle: 'O segredo da graduação que diferencia o Jiu-Jitsu do Judô e Karatê',
    category: 'faixas',
    era: '1967 – Presente',
    summary: 'A história da criação da tarja vermelha por Carlos Gracie e a Federação da Guanabara para indicar autoridade de ensino e graus de maestria.',
    fullContent: [
      'Diferente do Judô ou Karatê tradicional onde a faixa preta é lisa, a faixa preta de Brazilian Jiu-Jitsu possui uma marcante tarja vermelha de cerca de 10 cm em uma das pontas.',
      'Criada pela primeira Federação de Jiu-Jitsu do Rio de Janeiro (fundada por Hélio e Carlos Gracie em 1967), a tarja vermelha indica que o portador é um INSTRUTOR/PROFESSOR qualificado.',
      'Na tarja vermelha são colocados os graus brancos (de 1º a 6º grau), que exigem anos e décadas de dedicação ao esporte.',
      'Ao atingir o 7º e 8º grau, o mestre recebe a Faixa Coral (Vermelha e Preta / Vermelha e Branca). Ao atingir o 9º e 10º grau, recebe a cobiçada Faixa Vermelha de Grande Mestre.',
      'Curiosidade: Atletas que são apenas competidores ou não são instrutores diplomados podem utilizar faixa preta com tarja branca.'
    ],
    keyFigures: ['Carlos Gracie', 'Hélio Gracie', 'Oswaldo Fadda'],
    legacyImpact: 'Criou uma das hierarquias mais respeitadas e difíceis de se conquistar no universo das artes marciais.'
  },
  {
    id: 'a-luta-de-3-horas-e-40-minutos',
    title: 'A Luta Épica de 3 Horas e 40 Minutos: Hélio Gracie vs Waldemar Santana',
    subtitle: 'O combate sem interrupções mais longo da história das artes marciais modernas',
    category: 'lutas_historicas',
    era: '24 de Maio de 1955',
    summary: 'Aos 42 anos, Hélio Gracie enfrentou seu ex-aluno e operário Waldemar Santana (26 anos) em uma luta sem rounds e sem limite de tempo no Rio de Janeiro.',
    fullContent: [
      'Em 1955, no Clube de Regatas do Flamengo no Rio de Janeiro, ocorreu um dos confrontos mais dramáticos da história das lutas.',
      'Waldemar Santana, conhecido como o "Leopardo Negro", era um atleta jovem de força descomunal que havia sido faxineiro e aluno na academia Gracie.',
      'A luta foi combinada sob regras de Vale-Tudo sem limite de tempo e sem rounds. O combate durou inacreditáveis 3 horas e 40 minutos contínuos de troca de golpes, quedas e guarda.',
      'Com quase 4 horas de luta e exausto fisicamente, Hélio Gracie foi atingido por um chute na cabeça e nocauteado.',
      'Apesar da derrota, o confronto consagrou a resistência lendária de Hélio Gracie e abriu as portas para que seu sobrinho Carlson Gracie vingasse a família meses depois, derrotando Waldemar Santana diante de 40 mil pessoas no Maracanãzinho.'
    ],
    keyFigures: ['Hélio Gracie', 'Waldemar Santana', 'Carlson Gracie'],
    legacyImpact: 'Consolidou o Vale-Tudo brasileiro e lançou Carlson Gracie ao estrelato nacional como o maior campeão da época.'
  },
  {
    id: 'oswaldo-fadda-a-linhagem-do-suburbio',
    title: 'Oswaldo Fadda: O Mestre do Povo e das Chaves de Pé',
    subtitle: 'A linhagem que popularizou o Jiu-Jitsu entre os mais humildes e desenvolveu o jogo de pernas',
    category: 'linhagens',
    era: '1950 – 1990',
    summary: 'Enquanto os Gracie ensinavam na zona sul carioca, Mestre Fadda ensinava no subúrbio de Bento Ribeiro, acolhendo operários e desenvolvendo as primeiras chaves de pé (Leglocks).',
    fullContent: [
      'Oswaldo Fadda foi aluno direto de Luiz França, que também foi discípulo de Mitsuyo Maeda no Pará.',
      'Fadda instalou sua academia em Bento Ribeiro, periferia do Rio de Janeiro, e dava aulas gratuitas em praças públicas, na areia e em comunidades para pessoas que não podiam pagar mensalidades caras.',
      'Em 1951, Fadda desafiou a Academia Gracie para um confronto entre equipes. Para surpresa geral, os alunos de Fadda venceram a maioria dos combates utilizando chaves de pé e tornozelo que os alunos dos Gracie consideravam "suburbanas" ou grosseiras.',
      'Ao final do evento, Hélio Gracie declarou publicamente com nobreza: "Onde quer que haja um homem que saiba o Jiu-Jitsu, ali está a nossa arte. O Fadda é um autêntico campeão."'
    ],
    keyFigures: ['Oswaldo Fadda', 'Luiz França', 'Wendell Alexander', 'Hélio Gracie'],
    legacyImpact: 'Deu origem à linhagem da Nova União e consagrou o uso de chaves de perna no Jiu-Jitsu de alto nível.'
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Amassa-pão',
    origin: 'Gíria Brasileira',
    definition: 'Pressão esmagadora exercida pelo passador de guarda colocando o punho ou o antebraço na garganta ou queixo do oponente para incomodar e forçar a abertura de guarda.',
    exampleContext: 'O passador colocou um amassa-pão pesado para tirar o ar do guardeiro.'
  },
  {
    term: 'Berimbolo',
    origin: 'Técnico',
    definition: 'Movimento moderno de rotação de cabeça para baixo onde o atleta inverte seu corpo a partir da guarda De La Riva para escalar as costas do oponente.',
    exampleContext: 'Ele entrou no gancho De La Riva e girou um berimbolo perfeito direto no cinto de segurança.'
  },
  {
    term: 'Casca Grossa',
    origin: 'Gíria Brasileira',
    definition: 'Lutador duro, experiente, resistente à dor e muito difícil de ser finalizado.',
    exampleContext: 'Aquele faixa marrom é casca grossa, não bate fácil e treina todos os dias.'
  },
  {
    term: 'Dar um Rola / Rolar',
    origin: 'Gíria Brasileira',
    definition: 'O momento do treino de sparring/combate prático entre dois atletas onde todas as técnicas são testadas com resistência real.',
    exampleContext: 'Depois do aquecimento e dos drills técnicos, o mestre liberou 5 rounds de rola de 6 minutos.'
  },
  {
    term: 'Passar o Carro',
    origin: 'Gíria Brasileira',
    definition: 'Vencer uma luta com ampla superioridade técnica e física, pontuando muito e dominando todas as ações.',
    exampleContext: 'Ele passou o carro na final, raspou, passou a guarda e finalizou no estrangulamento.'
  },
  {
    term: 'Macaco Velho',
    origin: 'Gíria Brasileira',
    definition: 'Praticante veterano que conhece todos os truques, atalhos biomecânicos e descansos na luta sem gastar energia à toa.',
    exampleContext: 'O faixa preta é macaco velho: só se mexe na hora certa da alavanca.'
  },
  {
    term: 'Sprawl',
    origin: 'Wrestling',
    definition: 'Defesa de queda jogando as duas pernas e quadris para trás com explosão e colocando o peso do peito sobre a cabeça ou pescoço do atacante.',
    exampleContext: 'Quando o adversário entrou na baiana, ele deu um sprawl fulminante e caiu na guilhotina.'
  },
  {
    term: 'Kuzushi (崩し)',
    origin: 'Japonês',
    definition: 'O princípio do desequilíbrio prévio que deve anteceder qualquer projeção, raspagem ou transição eficaz.',
    exampleContext: 'Sem quebrar o kuzushi do adversário com as pegadas, você não conseguirá aplicar a queda.'
  },
  {
    term: 'Tatame (畳)',
    origin: 'Japonês',
    definition: 'A área acolchoada sagrada onde ocorrem os treinos e combates marciais.',
    exampleContext: 'Sempre faça reverência ao entrar e ao sair do tatame.'
  },
  {
    term: 'Creonte',
    origin: 'Gíria Brasileira',
    definition: 'Termo criado pelo Grande Mestre Carlson Gracie para designar o atleta que troca de equipe ou trai seu mestre por vantagens momentâneas.',
    exampleContext: 'Na época de ouro do Jiu-Jitsu carioca, a lealdade à bandeira era sagrada e ninguém queria ser chamado de creonte.'
  }
];
