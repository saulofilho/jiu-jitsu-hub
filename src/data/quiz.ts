import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Quantos pontos um atleta recebe ao realizar uma Passagem de Guarda estabilizada por 3 segundos na regra IBJJF?',
    options: ['2 pontos', '3 pontos', '4 pontos', '1 ponto e uma vantagem'],
    correctIndex: 1,
    explanation: 'A Passagem de Guarda confere exatamente 3 pontos ao atleta que transpõe as pernas do guardeiro e mantém o controle lateral ou norte-sul por 3 segundos.',
    category: 'regras',
    difficulty: 'basico'
  },
  {
    id: 'q2',
    question: 'Por que a chave de ombro "Kimura" tem esse nome no Jiu-Jitsu?',
    options: [
      'Foi inventada por um monge japonês chamado Kimura no século XVIII',
      'Em homenagem ao mestre Masahiko Kimura, que derrotou Hélio Gracie com essa chave em 1951 no Maracanã',
      'É a tradução exata em japonês da palavra "ombro de ferro"',
      'Foi batizada pela família Gracie em um torneio em Tóquio'
    ],
    correctIndex: 1,
    explanation: 'Após a lendária luta de 1951 no Maracanã onde o campeão de Judô Masahiko Kimura finalizou Hélio Gracie com a chave Ude-Garami, a família Gracie passou a chamar o golpe de "Kimura" em sinal de honra e respeito.',
    category: 'historia',
    difficulty: 'basico'
  },
  {
    id: 'q3',
    question: 'Qual é a pontuação oficial da IBJJF para a colocação do Joelho na Barriga (Knee on Belly)?',
    options: ['1 ponto', '2 pontos', '3 pontos', '4 pontos'],
    correctIndex: 1,
    explanation: 'A colocação do Joelho na Barriga com postura ereta e o outro pé apoiado no tatame confere 2 pontos ao atleta que a mantém por 3 segundos.',
    category: 'regras',
    difficulty: 'basico'
  },
  {
    id: 'q4',
    question: 'O que significa etimologicamente a saudação "OSS" (押忍) das artes marciais japonesas?',
    options: [
      'Força máxima e destruição do oponente',
      'Vitória certa a qualquer custo',
      'Perseverar sob qualquer pressão e continuar avançando com paciência',
      'Saudação de boa noite aos samurais'
    ],
    correctIndex: 2,
    explanation: 'OSS vem de "Oshi Shinobu", a combinação de "pressionar para frente" (Osu) e "suportar com paciência/resiliência" (Shinobu).',
    category: 'historia',
    difficulty: 'intermediario'
  },
  {
    id: 'q5',
    question: 'Qual é o tempo de luta oficial de um combate adulto na Faixa Preta de acordo com o regulamento da IBJJF?',
    options: ['6 minutos', '8 minutos', '10 minutos', '12 minutos'],
    correctIndex: 2,
    explanation: 'Combates da categoria Adulto Faixa Preta na IBJJF têm duração regulamentar de 10 minutos (enquanto Faixa Branca tem 5 min, Azul 6 min, Roxa 7 min e Marrom 8 min).',
    category: 'regras',
    difficulty: 'intermediario'
  },
  {
    id: 'q6',
    question: 'Qual destas finalizações é terminantemente PROIBIDA no Jiu-Jitsu com quimono para todas as faixas pela IBJJF?',
    options: ['Armlock da guarda', 'Heel Hook (Chave de Calcanhar com torção de joelho)', 'Estrangulamento Ezequiel', 'Triângulo'],
    correctIndex: 1,
    explanation: 'A chave de calcanhar (Heel Hook) e torções diretas do joelho são estritamente proibidas nas competições de quimono da IBJJF por motivos de segurança articular.',
    category: 'regras',
    difficulty: 'intermediario'
  },
  {
    id: 'q7',
    question: 'Quem foi o discípulo de Jigoro Kano que veio ao Brasil e ensinou Carlos Gracie em Belém do Pará em 1917?',
    options: ['Masahiko Kimura', 'Mitsuyo Maeda (Conde Koma)', 'Gichin Funakoshi', 'Mikinosuke Kawaishi'],
    correctIndex: 1,
    explanation: 'Mitsuyo Maeda, conhecido mundialmente como Conde Koma, foi o mestre japonês que transmitiu os segredos do combate corporal e do Judô/Jiu-Jitsu a Carlos Gracie.',
    category: 'historia',
    difficulty: 'basico'
  },
  {
    id: 'q8',
    question: 'Qual é o detalhe mecânico principal para impedir que o oponente escape do estrangulamento Mata-Leão?',
    options: [
      'Pressionar a traqueia com o osso do punho',
      'Cruzar os pés na frente do quadril do oponente',
      'Esconder a mão de apoio atrás da nuca do oponente e colar a sua cabeça na dele para bloquear a defesa',
      'Ficar em pé e pular nas costas dele'
    ],
    correctIndex: 2,
    explanation: 'Esconder a mão atrás da nuca do adversário e colar a cabeça evita que ele alcance seus pulsos para puxar e quebrar a pegada de estrangulamento.',
    category: 'tecnica',
    difficulty: 'avancado'
  }
];
