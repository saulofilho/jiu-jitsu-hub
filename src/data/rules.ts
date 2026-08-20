export interface IBJJFPointRule {
  points: number;
  name: string;
  description: string;
  stabilizationTime: string;
  examples: string[];
  keyNotes: string;
}

export const IBJJF_POINTS: IBJJFPointRule[] = [
  {
    points: 2,
    name: 'Queda (Takedown)',
    description: 'Quando um atleta em pé projeta ou derruba o oponente e o mantém de costas ou de lado no tatame por 3 segundos.',
    stabilizationTime: '3 segundos',
    examples: ['Baiana (Double Leg)', 'Single Leg', 'Ippon Seoi Nage', 'Osoto Gari', 'Kouchi Gari'],
    keyNotes: 'Se o oponente puxar para a guarda com pegadas já feitas antes da projeção iniciar, não são computados pontos de queda.'
  },
  {
    points: 2,
    name: 'Raspagem (Sweep)',
    description: 'Quando o atleta que está por baixo na guarda ou meia-guarda inverte a posição do oponente e fica por cima.',
    stabilizationTime: '3 segundos',
    examples: ['Raspagem Tesourinha', 'Raspagem Pêndulo', 'Raspagem De La Riva', 'Raspagem de Gancho', 'Raspagem Berimbolo'],
    keyNotes: 'O movimento deve começar obrigatoriamente dentro de uma posição de guarda ou meia guarda.'
  },
  {
    points: 2,
    name: 'Joelho na Barriga (Knee on Belly)',
    description: 'Quando o atleta por cima nos 100kg coloca o joelho no abdômen ou tórax do adversário, mantendo o outro pé no tatame e a postura ereta.',
    stabilizationTime: '3 segundos',
    examples: ['Transição de 100kg para joelho na barriga com pegadas na gola e calça'],
    keyNotes: 'O pé da perna que está com o joelho na barriga não pode estar apoiado no chão.'
  },
  {
    points: 3,
    name: 'Passagem de Guarda (Guard Pass)',
    description: 'Quando o atleta por cima ultrapassa as pernas do guardeiro e estabelece controle transversal, lateral ou norte-sul sem sofrer guarda.',
    stabilizationTime: '3 segundos',
    examples: ['Toreando', 'Knee Slice', 'Over-Under', 'Emborrachamento (Stack Pass)', 'Leg Drag'],
    keyNotes: 'A pontuação só é válida se a passagem partir de uma guarda ou meia guarda ativa.'
  },
  {
    points: 4,
    name: 'Montada (Mount) / Montada pelas Costas',
    description: 'Quando o atleta senta sobre o tronco do oponente com os dois joelhos ou pés no chão, ou nas costas do adversário de bruços.',
    stabilizationTime: '3 segundos',
    examples: ['Montada clássica', 'Montada S', 'Montada pelas costas com adversário de quatro apoios'],
    keyNotes: 'Um dos braços do oponente pode estar preso sob a perna (triângulo/montada), mas não os dois.'
  },
  {
    points: 4,
    name: 'Pegada pelas Costas (Back Control with Hooks)',
    description: 'Quando o atleta domina as costas do oponente colocando os dois calcanhares posicionados por dentro das coxas (ganchos).',
    stabilizationTime: '3 segundos',
    examples: ['Controle de costas com Seatbelt e ganchos', 'Pegada de costas partindo de Berimbolo'],
    keyNotes: 'Cruzar os pés na frente do abdômen não pontua como ganchos de costas (e é vulnerável a chave de pé).'
  }
];

export interface BeltSystemInfo {
  belt: string;
  colorHex: string;
  minAge: number;
  minTimeMonths: number;
  meaning: string;
  focus: string;
}

export const BELT_SYSTEM: BeltSystemInfo[] = [
  {
    belt: 'Faixa Branca (White Belt)',
    colorHex: '#F3F4F6',
    minAge: 0,
    minTimeMonths: 12,
    meaning: 'O início, a mente aberta, a folha em branco pronta para absorver os princípios.',
    focus: 'Sobrevivência, postura, defesas básicas, saídas da montada e dos 100kg, fuga de quadril e respeito ao tatame.'
  },
  {
    belt: 'Faixa Azul (Blue Belt)',
    colorHex: '#2563EB',
    minAge: 16,
    minTimeMonths: 24,
    meaning: 'A fase da técnica ampla e exploração de todas as guardas e finalizações.',
    focus: 'Construção de repertório técnico, transições de guarda, passagens ágeis e primeiras combinações de ataques.'
  },
  {
    belt: 'Faixa Roxa (Purple Belt)',
    colorHex: '#7C3AED',
    minAge: 16,
    minTimeMonths: 18,
    meaning: 'A maturidade técnica e o refinamento do timing e fluxo dos movimentos.',
    focus: 'Criação do próprio estilo de jogo individual, encadeamentos em cadeia (combo chains), antecipação de reações.'
  },
  {
    belt: 'Faixa Marrom (Brown Belt)',
    colorHex: '#78350F',
    minAge: 18,
    minTimeMonths: 12,
    meaning: 'O polimento final antes da maestria, força e precisão milimétrica.',
    focus: 'Lapidação cirúrgica, jogo de leglocks avançados, pressão contínua e consistência mental sob pressão.'
  },
  {
    belt: 'Faixa Preta (Black Belt)',
    colorHex: '#111827',
    minAge: 19,
    minTimeMonths: 36,
    meaning: 'A verdadeira graduação de início: quando a técnica se torna instinto natural e sabedoria.',
    focus: 'Domínio do "Jiu-Jitsu Invisível", capacidade de ensinar, liderança e simplicidade na execução.'
  },
  {
    belt: 'Faixa Coral (Vermelha e Preta / Branca)',
    colorHex: '#DC2626',
    minAge: 50,
    minTimeMonths: 84,
    meaning: 'Grau de Grande Mestre (7º e 8º Graus) com mais de 30 anos dedicados na faixa preta.',
    focus: 'Preservação histórica da arte, formação de gerações de professores e guardião dos valores marciais.'
  },
  {
    belt: 'Faixa Vermelha (Red Belt)',
    colorHex: '#B91C1C',
    minAge: 67,
    minTimeMonths: 120,
    meaning: 'O cume máximo do Jiu-Jitsu (9º e 10º Graus), reservado aos pioneiros e fundadores da Arte Suave.',
    focus: 'Sabedoria imorredoura e lenda viva do Jiu-Jitsu.'
  }
];

export const MATCH_DURATIONS = [
  { belt: 'Branca (Adulto)', time: '5 minutos' },
  { belt: 'Azul (Adulto)', time: '6 minutos' },
  { belt: 'Roxa (Adulto)', time: '7 minutos' },
  { belt: 'Marrom (Adulto)', time: '8 minutos' },
  { belt: 'Preta (Adulto)', time: '10 minutos' },
  { belt: 'Master 1 (Todas as Faixas)', time: '5 minutos' },
  { belt: 'Master 2 em diante', time: '5 minutos' },
  { belt: 'Juvenil (16-17 anos)', time: '5 minutos' }
];
