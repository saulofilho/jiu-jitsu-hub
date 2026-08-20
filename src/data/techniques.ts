import { Technique } from '../types';

export const TECHNIQUES: Technique[] = [
  // ==================== FINALIZAÇÕES (SUBMISSIONS) ====================
  {
    id: 'armlock-guarda-fechada',
    name: 'Armlock da Guarda Fechada',
    japaneseName: 'Juji-Gatame',
    category: 'finalizacao',
    subCategory: 'chave_braco',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'A mais clássica e fundamental chave de braço do Jiu-Jitsu, atacando a articulação do cotovelo através da hiperextensão utilizando o quadril como ponto de apoio.',
    startingPosition: 'Guarda Fechada',
    targetPositionOrSub: 'Finalização por Chave de Braço',
    steps: [
      'Domine o braço do oponente com pegada cruzada na manga e a outra mão na gola/tríceps, quebrando a postura.',
      'Passe o braço do oponente pela linha central do seu peito.',
      'Abra a guarda e coloque o pé do mesmo lado do braço dominado no quadril do oponente para empurrar e criar ângulo perpendicular (90 graus).',
      'Passe a outra perna bem alta nas costas, travando a axila do oponente (Heavy Leg) para impedir a recuperação de postura.',
      'Empurre o rosto do oponente suavemente e passe a perna por cima da cabeça, calçando a nuca.',
      'Mantenha os joelhos bem colados, polegar do oponente apontado para o teto, eleve o quadril lentamente até o tap-out.'
    ],
    invisibleDetails: [
      'O segredo do armlock justo não está nos braços, mas na pressão dos adutores (aperto dos joelhos).',
      'O polegar do adversário DEVE estar virado para cima; a articulação dobra para trás na direção oposta ao polegar.',
      'Mantenha os calcanhares puxando o chão (heavy heels) para manter a cabeça do oponente presa ao tatame.'
    ],
    commonMistakes: [
      'Deixar espaço entre o seu quadril e o ombro do adversário.',
      'Cruzar os pés de forma frouxa, aliviando a pressão na nuca.',
      'Puxar o braço com força dos bíceps antes de colar os joelhos e erguer o quadril.'
    ],
    counters: ['Postura imediata estilo Stack/Empilhamento', 'Hitchhiker Escape (fuga do carona) girando o polegar', 'Defesa de mão na mão (biceps grip)'],
    followUps: ['Transição para Triângulo se o oponente puxar o braço', 'Omoplata se ele recolher o cotovelo', 'Raspagem Pendular (Flower Sweep)'],
    ibjjfLegalityNote: 'Permitido para todas as faixas e idades (desde a faixa branca).',
    tags: ['Fundamental', 'Armlock', 'Guarda Fechada', 'Clássico', 'Hélio Gracie']
  },
  {
    id: 'triangulo-guarda-fechada',
    name: 'Triângulo (Sankaku Jime)',
    japaneseName: 'Sankaku-Jime',
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'Estrangulamento vascular devastador realizado com as pernas, comprimindo as artérias carótidas usando a própria coxa e o ombro do adversário.',
    startingPosition: 'Guarda Fechada ou Guarda Aberta',
    targetPositionOrSub: 'Finalização por Estrangulamento',
    steps: [
      'Isole um braço para fora e empurre o outro braço para dentro da sua guarda (situação "um braço dentro, um braço fora").',
      'Lance o quadril para cima e cruze os tornozelos atrás da nuca do oponente.',
      'Trave a nuca com as duas mãos para manter a postura dele quebrada.',
      'Transfira o braço isolado do oponente através do seu abdômen para o lado oposto.',
      'Segure na sua própria canela (lado da perna que passa na nuca) com a mão oposta, coloque o outro pé no quadril dele e gire o seu corpo para criar um ângulo de 45 a 90 graus.',
      'Encaixe a dobra do joelho por cima do peito do pé (formando o formato de 4/triângulo perfeito) e aperte os joelhos puxando a nuca.'
    ],
    invisibleDetails: [
      'O ângulo é a chave: quanto mais de lado você estiver (olhando dentro do ouvido dele), menos força necessitará para finalizar.',
      'Puxe os dedos do pé para cima (dorsiflexão) para endurecer a panturrilha e travar a circulação com corte firme.',
      'Nunca cruze os tornozelos sem segurar a canela primeiro para não perder a distância.'
    ],
    commonMistakes: [
      'Tentar fechar o triângulo de frente, sem girar o ângulo do quadril.',
      'Fechar sobre o pé em vez da canela (risco de lesão no próprio tornozelo).',
      'Permitir que o adversário esconda o braço ou empilhe sobre seu pescoço.'
    ],
    counters: ['Stack Defense (empilhar e dobrar o guardeiro)', 'Postura com base ereta antes do fechamento', 'Passe de guarda passando o braço por trás da coxa'],
    followUps: ['Armlock reto com o triângulo já encaixado', 'Kimura no braço de fora', 'Omoplata se ele tentar girar'],
    ibjjfLegalityNote: 'Válido para todas as faixas no Gi e No-Gi. Puxar a nuca para baixo é permitido, bater o oponente no chão (slam) é desclassificação imediata.',
    tags: ['Triângulo', 'Guarda', 'Finalização', 'Carótida', 'Inoxidável']
  },
  {
    id: 'estrangulamento-arco-e-flecha',
    name: 'Estrangulamento Arco e Flecha (Bow and Arrow)',
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'gi',
    summary: 'Um dos estrangulamentos mais potentes com quimono partindo das costas, usando a gola cruzada e a pegada na calça ou perna do oponente como arco e flecha.',
    startingPosition: 'Pegada pelas Costas (Back Control) com Seatbelt',
    targetPositionOrSub: 'Finalização por Estrangulamento de Gola',
    steps: [
      'Partindo do controle das costas, abra a gola do oponente com a mão de apoio e faça uma pegada ultra profunda com o polegar para dentro com a mão de ataque.',
      'Com a mão livre, faça uma pegada de concha na lateral externa da calça ou no joelho do adversário.',
      'Jogue a perna do lado do estrangulamento por cima do ombro e peito dele.',
      'Gire o corpo para o lado e estenda as costas esticando o oponente como se estivesse armando um arco com flecha.'
    ],
    invisibleDetails: [
      'A perna que passa por cima do ombro do adversário impede que ele gire de frente para aliviar a pressão.',
      'O vetor de força combina puxar a gola, puxar a calça para longe e estender a coluna dorsal.'
    ],
    commonMistakes: [
      'Pegada na gola muito frouxa ou rasa.',
      'Esquecer de passar a perna sobre o ombro, permitindo que o oponente caia por cima e defenda.',
      'Tentar puxar apenas com a força dos braços em vez de usar os extensores das costas e pernas.'
    ],
    counters: ['Segurar as duas mãos na mão que ataca a gola (2-on-1)', 'Girar o quadril rapidamente para o chão do lado do braço que estrangula'],
    followUps: ['Armlock das costas se ele defender a gola', 'Transição para o Triângulo invertido das costas'],
    ibjjfLegalityNote: 'Válido a partir da faixa branca em categorias com quimono.',
    tags: ['Costas', 'Quimono', 'Estrangulamento', 'Mundial', 'Alavanca']
  },
  {
    id: 'mata-leao',
    name: 'Mata-Leão (Rear Naked Choke)',
    japaneseName: 'Hadaka-Jime',
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'O rei de todas as finalizações do combate corpo a corpo. Ataque vascular definitivo pelas costas sem necessidade de pano.',
    startingPosition: 'Controle das Costas com Ganchos',
    targetPositionOrSub: 'Finalização por Estrangulamento Sanguíneo',
    steps: [
      'Garanta os ganchos e o controle de cinto de segurança (Seatbelt Grip).',
      'Deslize o braço de ataque por debaixo do queixo do oponente, alinhando a traqueia com a dobra do seu cotovelo.',
      'Encaixe a mão do braço que ataca no seu próprio bíceps do braço oposto.',
      'Esconda a mão de apoio atrás da nuca do oponente (palma virada para dentro).',
      'Cole sua cabeça na cabeça do oponente, expire o ar, aperte os cotovelos para dentro e expanda o peito.'
    ],
    invisibleDetails: [
      'Não faça pressão na traqueia/garganta: o estrangulamento perfeito é arterial nas carótidas, fazendo o oponente dormir em 6 a 8 segundos sem dor.',
      'A mão de apoio atrás da nuca deve estar escondida para que o adversário não consiga pegá-la para quebrar o golpe.'
    ],
    commonMistakes: [
      'Cruzar os pés na frente do quadril do oponente (deixando-se vulnerável a uma chave de tornozelo instantânea).',
      'Tentar finalizar com o queixo dele travando o braço sem antes abrir caminho com a mão de apoio.'
    ],
    counters: ['Proteger o pescoço segurando os pulsos (mão na mão)', 'Fuga de quadril deslizando as costas para o tatame'],
    followUps: ['Armlock das costas', 'Ezequiel invertido pelas costas'],
    ibjjfLegalityNote: 'Válido para todas as faixas (Gi e No-Gi).',
    tags: ['Mata-Leão', 'Sem Pano', 'Costas', 'Clássico', 'No-Gi']
  },
  {
    id: 'kimura-guarda-fechada',
    name: 'Kimura (Ude-Garami)',
    japaneseName: 'Gyaku Ude-Garami',
    category: 'finalizacao',
    subCategory: 'chave_ombro',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'Chave de ombro de rotação interna em figura de quatro, batizada em homenagem ao mestre Masahiko Kimura após sua luta com Hélio Gracie.',
    startingPosition: 'Guarda Fechada ou Meia Guarda',
    targetPositionOrSub: 'Finalização por Chave de Ombro / Transição',
    steps: [
      'Aguarde ou force o oponente a apoiar a palma da mão no tatame.',
      'Segure o punho do mesmo lado com a pegada sem polegar (Monkey Grip).',
      'Abra a guarda, sente-se em diagonal passando o braço oposto por cima do ombro e por dentro do cotovelo do adversário.',
      'Segure no seu próprio punho travando a figura de 4 (Double Wrist Lock).',
      'Deite-se novamente de lado, passe a perna alta sobre as costas do oponente para travar a postura.',
      'Gire o braço dele para trás em direção à nuca mantendo um ângulo de 90 graus no cotovelo.'
    ],
    invisibleDetails: [
      'A "pegada de macaco" (sem usar o polegar) é mais forte biomecanicamente na rotação do que a pegada com polegar.',
      'Mantenha o cotovelo do adversário colado ao seu peito; se ele se afastar, o braço estica e a alavanca se perde.'
    ],
    commonMistakes: [
      'Esquecer de sentar para buscar a pegada na figura de 4, tentando pegar deitado.',
      'Não passar a perna nas costas, permitindo que o oponente role para a frente e inverta a posição.'
    ],
    counters: ['Segurar na própria coxa/faixa para bloquear a rotação', 'Salto/Rolamento para frente neutralizando a torção'],
    followUps: ['Raspagem de Kimura (Kimura Sweep)', 'Transição para Armlock', 'Pegada de Costas via Kimura Trap'],
    ibjjfLegalityNote: 'Permitido a partir da faixa branca em todas as divisões.',
    tags: ['Kimura', 'Ombro', 'Figura de 4', 'Masahiko Kimura', 'Kimura Trap']
  },
  {
    id: 'omoplata-guarda',
    name: 'Omoplata (Ashi Guruma / Shoulder Lock)',
    category: 'finalizacao',
    subCategory: 'chave_ombro',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'ambos',
    summary: 'Chave de ombro feita com as pernas a partir da guarda, utilizando o peso do corpo e a alavanca dos quadris para torcer a articulação escapular.',
    startingPosition: 'Guarda Fechada, Guarda Aranha ou De La Riva',
    targetPositionOrSub: 'Finalização ou Raspagem de Omoplata',
    steps: [
      'Quebre a postura do adversário e domine uma das mangas.',
      'Chute a perna por baixo da axila e passe-a por cima do ombro dele.',
      'Gire seu corpo 180 graus de forma que você e o oponente fiquem sentados olhando na mesma direção.',
      'Trave a cintura do oponente com a mão oposta ou segure a faixa para impedir que ele dê cambalhota de fuga.',
      'Posicione suas duas pernas apontadas para a frente formando uma letra "S".',
      'Eleve o quadril suavemente empurrando o chão até a finalização.'
    ],
    invisibleDetails: [
      'Achatar o oponente (fazer a barriga dele encostar no tatame) torna a finalização 100% inevitável.',
      'A mão que segura a cintura ou faixa deve travar imediatamente no momento em que você senta.'
    ],
    commonMistakes: [
      'Não controlar o quadril do oponente, permitindo que ele role para a frente.',
      'Cruzar as pernas de maneira folgada, permitindo que ele retire o cotovelo.'
    ],
    counters: ['Rolamento frontal antes de ter o quadril bloqueado', 'Pular por cima do guardeiro'],
    followUps: ['Raspagem de Omoplata (Sweep)', 'Transição para Chave de Punho / Armlock', 'Pegada de Costas'],
    ibjjfLegalityNote: 'Válido para todas as faixas (Gi e No-Gi).',
    tags: ['Omoplata', 'Avançado', 'Guarda', 'Controle', 'Flexibilidade']
  },
  {
    id: 'chave-de-calcanhar-heel-hook',
    name: 'Heel Hook (Chave de Calcanhar / Torção)',
    category: 'finalizacao',
    subCategory: 'chave_perna',
    difficulty: 'avancado',
    minBelt: 'marrom',
    modality: 'nogi',
    summary: 'A submissão mais temida do grappling moderno sem quimono, atacando os ligamentos cruzados do joelho através da rotação do calcanhar com a perna presa em Ashi Garami.',
    startingPosition: 'Entrada de Ashi Garami / Inside Senkaku / 50-50',
    targetPositionOrSub: 'Finalização por Torção Ligamentar do Joelho',
    steps: [
      'Estabeleça o controle posicional da perna (Ashi Garami ou 411/Saddle) travando o joelho do oponente entre suas coxas.',
      'Isole o calcanhar do oponente com o pulso/osso do rádio (Bite on the Heel).',
      'Conecte as mãos em pegada gable ou palma com palma sem folgas.',
      'Rotacione os ombros e o tronco usando a força do corpo inteiro para girar o calcanhar enquanto mantém o joelho fixo.'
    ],
    invisibleDetails: [
      'A finalização vem do isolamento da linha do joelho: se o joelho puder girar livremente, o golpe perde a eficácia e o oponente escapa.',
      'A aplicação no treino deve ser lenta e progressiva, pois a dor no joelho só surge após o rompimento ligamentar.'
    ],
    commonMistakes: [
      'Tentar girar apenas com as mãos sem travar a linha do joelho.',
      'Deixar folga no calcanhar (slipping the heel).'
    ],
    counters: ['Heel Slip (deslizar o calcanhar)', 'Girar na mesma direção da torção antes do travamento'],
    followUps: ['Transição para Chave de Pé Reta (Straight Ankle Lock)', 'Toe Hold (Americano de Pé)'],
    ibjjfLegalityNote: 'PROIBIDO no quimono para todas as faixas. Permitido no No-Gi apenas para Faixa Marrom e Preta (Regras IBJJF atualizadas) e livre no ADCC.',
    tags: ['Leglock', 'No-Gi', 'ADCC', 'Danaher Death Squad', 'Ashi Garami']
  },
  {
    id: 'estrangulamento-ezequiel',
    name: 'Estrangulamento Ezequiel (Sode Guruma Jime)',
    japaneseName: 'Sode-Guruma-Jime',
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'Estrangulamento direto usando a própria manga do quimono ou o punho (no-gi), capaz de ser aplicado da montada, 100kg e até mesmo de dentro da guarda fechada do adversário.',
    startingPosition: 'Montada, 100kg ou Dentro da Guarda',
    targetPositionOrSub: 'Finalização por Compressão da Traqueia e Carótida',
    steps: [
      'Passe um braço por trás da cabeça ou nuca do oponente.',
      'Insira quatro dedos desse braço por dentro da manga do seu próprio quimono do outro braço.',
      'Deslize o outro punho ou lâmina da mão através do pescoço do oponente na traqueia.',
      'Estenda os braços criando um efeito de tesoura e estrangulando o adversário.'
    ],
    invisibleDetails: [
      'Popularizado pelo judoca olímpico brasileiro Ezequiel Paraguassu nos treinos na lendária Carlson Gracie nos anos 1980.',
      'A versão sem quimono (No-Gi) usa a dobra do cotovelo e a mão no bíceps como alavanca.'
    ],
    commonMistakes: [
      'Pegar na borda externa da manga em vez de enfiar os 4 dedos por dentro.',
      'Dar espaço para o oponente erguer o queixo e defender com a mão.'
    ],
    counters: ['Empurrar os cotovelos para cima com as duas mãos', 'Fuga de quadril imediata'],
    followUps: ['Armlock se o oponente esticar o braço para defender', 'Montada S'],
    ibjjfLegalityNote: 'Totalmente legal para todas as faixas.',
    tags: ['Ezequiel', 'Carlson Gracie', 'Manga', 'Surpresa', 'Eficaz']
  },
  {
    id: 'guilhotina-em-pe-e-chao',
    name: 'Guilhotina (Guillotine Choke)',
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'Estrangulamento frontal clássico aplicado quando o oponente deixa a cabeça baixa ou tenta uma entrada de queda afobada (double leg).',
    startingPosition: 'Em pé, Guarda Fechada ou Meia Guarda',
    targetPositionOrSub: 'Finalização por Guilhotina Frontal',
    steps: [
      'Envolva o pescoço do oponente com o braço dominante, encaixando o osso do rádio na garganta.',
      'Conecte a mão livre com a mão de estrangulamento (pegada High-Elbow Marcelotine ou pegada clássica).',
      'Puxe a guarda fechando as pernas em torno das costelas do oponente.',
      'Crunch abdominal: incline o tronco e eleve o cotovelo para cima, comprimindo a carótida e traqueia.'
    ],
    invisibleDetails: [
      'Não puxe para trás com a coluna: dobre o corpo para a frente (crunch) para cortar todo o espaço sob o queixo.',
      'A Marcelotine (guilhotina de Marcelo Garcia) eleva o cotovelo por cima do ombro do adversário, impossibilitando qualquer defesa.'
    ],
    commonMistakes: [
      'Cair para trás sem fechar a guarda, permitindo que o oponente passe para o lado oposto e aplique o Von Flue choke.',
      'Apertar apenas a nuca sem envolver a garganta com precisão.'
    ],
    counters: ['Passar para o lado oposto da cabeça e aplicar Von Flue Choke', 'Colocar a mão no quadril e posturar com queixo alto'],
    followUps: ['Anaconda Choke / D’Arce Choke se ele defender a cabeça', 'Raspagem de Guilhotina'],
    ibjjfLegalityNote: 'Permitido a partir da branca (com restrição de puxar torcendo coluna cervical para faixas infantis).',
    tags: ['Guilhotina', 'Marcelo Garcia', 'Frontal', 'No-Gi', 'Queda']
  },

  // ==================== RASPAGENS (SWEEPS) ====================
  {
    id: 'raspagem-tesourinha',
    name: 'Raspagem Tesourinha (Scissor Sweep)',
    category: 'raspagem',
    subCategory: 'guarda_fechada',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    points: 2,
    summary: 'A raspagem mais fundamental do Jiu-Jitsu, usando o corte de pernas em tesoura e a quebra de base para inverter o oponente e cair na montada.',
    startingPosition: 'Guarda Fechada',
    targetPositionOrSub: 'Montada (4 pontos) ou 100kg',
    steps: [
      'Faça a pegada na gola na mesma linha e pegada na manga do mesmo lado do oponente.',
      'Abra a guarda, coloque o pé no quadril do lado que você tem a manga e fuja o quadril para trás criando espaço.',
      'Coloque a canela transversalmente no peito/estômago do adversário (escudo).',
      'Deite a perna de baixo paralela ao tatame encostando na canela/joelho dele.',
      'Puxe o adversário para cima do seu escudo com as pegadas para tirar o peso dos calcanhares dele.',
      'Tesoure as pernas: a de cima empurra o peito e a de baixo varre a perna de apoio dele, montando em seguida.'
    ],
    invisibleDetails: [
      'Você NÃO consegue raspar se o peso dele estiver nos calcanhares. O passo crucial é puxar o oponente para "cima" de você antes de tesourar.',
      'A perna de baixo deve cortar o tatame como se fosse uma vassoura rente ao chão.'
    ],
    commonMistakes: [
      'Tentar raspar sem fugir o quadril primeiro (ficando reto embaixo do oponente).',
      'Esquecer de bloquear o braço do mesmo lado, permitindo que ele apoie a mão e não caia.'
    ],
    counters: ['Base baixa com peso na perna oposta', 'Amassar o escudo de perna e passar emborrachando'],
    followUps: ['Transição para Armlock se ele apoiar a mão', 'Raspagem de Gancho se a tesourinha travar'],
    ibjjfLegalityNote: 'Válido para todas as faixas (Garante 2 pontos de raspagem + 4 de montada após estabilização).',
    tags: ['Raspagem', 'Tesourinha', 'Fundamentos', 'Guarda Fechada', 'Pontos IBJJF']
  },
  {
    id: 'raspagem-berimbolo',
    name: 'Berimbolo (Modern Guard Sweep to Back)',
    category: 'raspagem',
    subCategory: 'guarda_aberta',
    difficulty: 'avancado',
    minBelt: 'roxa',
    modality: 'ambos',
    points: 2,
    summary: 'A revolução moderna do Jiu-Jitsu esportivo criada pelos irmãos Miyao e Rafael Mendes, invertendo o corpo de cabeça para baixo a partir da De La Riva para tomar as costas.',
    startingPosition: 'Guarda De La Riva',
    targetPositionOrSub: 'Pegada pelas Costas (Back Take)',
    steps: [
      'Mantenha o gancho De La Riva profundo e pegada firme na faixa ou calça do oponente.',
      'Desequilibre o adversário empurrando a outra perna no joelho até que ele caia sentado no tatame.',
      'Inverta o seu corpo de cabeça para baixo rodando pelo ombro de dentro.',
      'Passe a sua perna por trás do joelho dele empurrando a dobra da perna para forçar a rotação do quadril dele.',
      'Use o gancho duplo (twister hook) para escalar até as costas e colocar os dois ganchos.'
    ],
    invisibleDetails: [
      'Não tente rodar pelo pescoço: a rotação se apoia exclusivamente sobre os ombros e a parte superior das costas.',
      'A pegada na faixa é o âncora que puxa a cintura do oponente para o seu peito durante a inversão.'
    ],
    commonMistakes: [
      'Frouxidão no gancho De La Riva no início do movimento.',
      'Perder a pegada na calça ou faixa durante o giro, permitindo que o oponente gire de frente.'
    ],
    counters: ['Leg Drag imediato durante o giro', 'Bloqueio de quadril com mão na faixa e peso no quadril'],
    followUps: ['Leg Drag direto para os 100kg', 'Estrangulamento Arco e Flecha ou Mata-leão direto nas costas'],
    ibjjfLegalityNote: 'Válido para todas as faixas (embora exigido alto nível de flexibilidade e coordenação motora).',
    tags: ['Berimbolo', 'Miyao', 'Mendes Bros', 'De La Riva', 'Costas', 'Moderno']
  },
  {
    id: 'raspagem-pendulo-flower',
    name: 'Raspagem Pêndulo / Flor (Flower Sweep)',
    category: 'raspagem',
    subCategory: 'guarda_fechada',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'gi',
    points: 2,
    summary: 'Raspagem dinâmica e potente onde o guardeiro usa o balanço da perna livre como um pêndulo para gerar inércia e virar o oponente diretamente na montada.',
    startingPosition: 'Guarda Fechada',
    targetPositionOrSub: 'Montada Completa (4 pontos)',
    steps: [
      'Domine a manga do oponente de um lado e segure a gola cruzada ou a calça na altura da canela.',
      'Passe o braço livre por baixo da perna do oponente (abraçando a coxa por baixo).',
      'Abra a guarda e chute a perna livre em direção ao teto e para o lado da cabeça do adversário gerando o efeito pêndulo.',
      'Use o momentum do pêndulo para virar o oponente por cima de você, acompanhando a subida até a montada.'
    ],
    invisibleDetails: [
      'O segredo é o timing: execute o pêndulo no momento em que o oponente tenta colocar a perna em pé para abrir a guarda.',
      'A perna que faz o pêndulo deve desenhar um grande arco circular no ar.'
    ],
    commonMistakes: [
      'Fazer o pêndulo curto sem amplitude de movimento.',
      'Soltar a pegada da manga do braço que impede a base de mão no tatame.'
    ],
    counters: ['Abrir a base do joelho do lado oposto', 'Postura ereta com pegadas duplas nas faixas'],
    followUps: ['Armlock instantâneo se a raspagem parar no meio do caminho', 'Omoplata'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Raspagem', 'Pêndulo', 'Guarda Fechada', 'Montada', 'Inércia']
  },

  // ==================== PASSAGENS DE GUARDA (GUARD PASSES) ====================
  {
    id: 'passagem-knee-slice-corte-joelho',
    name: 'Passagem Cortando o Joelho (Knee Slice / Knee Slide)',
    category: 'passagem',
    subCategory: 'passagem_agil',
    difficulty: 'intermediario',
    minBelt: 'branca',
    modality: 'ambos',
    points: 3,
    summary: 'A passagem de guarda mais utilizada e bem-sucedida da história dos campeonatos mundiais, cortando o joelho em diagonal sobre a coxa do adversário.',
    startingPosition: 'Guarda Aberta ou Meia Guarda',
    targetPositionOrSub: 'Controle Lateral de 100kg (3 pontos)',
    steps: [
      'Pise entre as pernas do guardeiro e controle a gola profunda ou faça esgrima justa com o braço sob a axila dele.',
      'Com a outra mão, domine a calça ou o tríceps oposto.',
      'Deslize o seu joelho em diagonal sobre a coxa do guardeiro, mirando o chão do lado do quadril dele.',
      'Cole a sua cabeça no queixo do oponente (Crossface) para girar a cabeça dele para o lado oposto e anular a força da coluna.',
      'Deslize o pé de trás para fora da perna dele e estabeleça o peito no peito nos 100kg por 3 segundos.'
    ],
    invisibleDetails: [
      'O Crossface (ombro no queixo) é o detalhe que impede o guardeiro de virar de quatro ou repor a guarda.',
      'O seu quadril deve permanecer o mais colado possível ao chão durante o deslize do joelho para não dar espaço ao gancho de recuperação.'
    ],
    commonMistakes: [
      'Tentar deslizar o joelho sem ter a esgrima (Underhook) dominada primeiro (o guardeiro vai para as costas).',
      'Ficar com a postura alta demais, facilitando o desarme de base.'
    ],
    counters: ['Underhook profundo para as costas', 'Escudo de joelho (Knee Shield) bem posicionado'],
    followUps: ['Transição para Long Step Pass se o guardeiro travar o pé', 'Montada direta cortando para o lado oposto'],
    ibjjfLegalityNote: 'Passagem padrão IBJJF conferindo 3 pontos após 3 segundos de imobilização.',
    tags: ['Knee Slide', 'Passagem', 'Esgrima', '100kg', 'Lucas Lepri', 'Pressão']
  },
  {
    id: 'passagem-torreando',
    name: 'Passagem Toreando (Bullfighter Pass)',
    category: 'passagem',
    subCategory: 'passagem_agil',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    points: 3,
    summary: 'Passagem clássica e veloz de guarda aberta, segurando nos joelhos ou calças e jogando as pernas do oponente para um lado enquanto você corre para o outro.',
    startingPosition: 'Em pé contra Guarda Aberta',
    targetPositionOrSub: 'Controle Lateral / Joelho na Barriga / Norte-Sul',
    steps: [
      'Faça pegadas firmes na parte externa das calças na altura dos joelhos do guardeiro.',
      'Dê um passo para trás com um leve puxão para esticar as pernas dele e tirar o quadril do chão.',
      'Empurre as duas pernas dele energicamente para um lado (como um toureiro desviando do touro).',
      'Avance seu quadril e peito rapidamente para o lado oposto que você jogou as pernas dele.',
      'Abaixe o centro de gravidade e estabeleça os 100kg ou joelho na barriga.'
    ],
    invisibleDetails: [
      'Empurre os joelhos dele em direção ao chão e para a diagonal, colando os joelhos dele no próprio peito dele para impedir a reposição.',
      'O movimento dos pés do passador deve ser rápido e circular (orbitando em torno do quadril do oponente).'
    ],
    commonMistakes: [
      'Avançar o peito devagar, dando tempo para o guardeiro recolocar os pés no quadril ou laçar os braços.',
      'Ficar com os braços completamente esticados, sendo puxado para triângulos ou armlocks voadores.'
    ],
    counters: ['Girar de quatro e levantar (Granby Roll)', 'Repor guarda laço ou guarda aranha'],
    followUps: ['Joelho na barriga (2 pontos extras)', 'Transição para Norte-Sul'],
    ibjjfLegalityNote: '3 pontos de passagem + 2 pontos de joelho na barriga se estabilizados sucessivamente.',
    tags: ['Toreando', 'Velocidade', 'Guarda Aberta', 'Passagem', 'Leandro Lo']
  },
  {
    id: 'passagem-pressao-over-under',
    name: 'Passagem de Pressão Over-Under (Bernardo Faria Pass)',
    category: 'passagem',
    subCategory: 'passagem_pressao',
    difficulty: 'avancado',
    minBelt: 'azul',
    modality: 'gi',
    points: 3,
    summary: 'A passagem de pressão mais implacável do Jiu-Jitsu, onde um braço passa por cima da perna e outro por baixo, dobrando o guardeiro como uma folha de papel.',
    startingPosition: 'Guarda Borboleta, Meia Guarda ou Guarda Aberta',
    targetPositionOrSub: 'Controle Lateral com Dobra de Quadril',
    steps: [
      'Mergulhe um braço por baixo de uma perna do guardeiro (pegando na calça oposta) e o outro braço por cima da outra perna (abraçando o quadril).',
      'Coloque a testa no abdômen ou costela do adversário e fique na ponta dos pés (Tripod).',
      'Caminhe com as pernas em círculo em direção ao lado da perna que está por baixo (Underhook).',
      'Exerça 100% do seu peso no quadril do oponente até a perna dele ceder e você avançar para os 100kg.'
    ],
    invisibleDetails: [
      'O segredo do Bernardo Faria: todo o peso do seu corpo deve estar concentrado no ombro que pressiona a perna do oponente.',
      'A perna do adversário fica completamente presa e sem mobilidade para qualquer raspagem.'
    ],
    commonMistakes: [
      'Apoiar os joelhos no chão (aliviando a pressão esmagadora).',
      'Deixar o oponente pegar na sua gola e tentar estrangulamento cruzado.'
    ],
    counters: ['Empurrar a cabeça do passador para longe (Frame na mandíbula)', 'Guarda Kimura de contra-ataque'],
    followUps: ['Passagem direta para a montada', 'Ataque de lapela'],
    ibjjfLegalityNote: 'Permitido para todas as faixas.',
    tags: ['Bernardo Faria', 'Pressão', 'Over Under', 'Pesado', 'Esmagamento']
  },

  // ==================== QUEDAS E PROJEÇÕES (TAKEDOWNS) ====================
  {
    id: 'queda-double-leg-baiana',
    name: 'Baiana / Entrada nas Duas Pernas (Double Leg)',
    japaneseName: 'Morote Gari',
    category: 'queda',
    subCategory: 'queda_wrestling',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    points: 2,
    summary: 'Queda clássica vinda do Wrestling e adaptada com maestria no Jiu-Jitsu brasileiro, atacando ambas as pernas com penetração profunda de joelho.',
    startingPosition: 'Luta em pé com troca de pegadas',
    targetPositionOrSub: 'Queda com Domínio no Chão (2 pontos)',
    steps: [
      'Mude o nível (Level Change) abaixando os joelhos sem curvar a coluna lombar.',
      'Dê o passo de penetração avançando o joelho da frente no chão entre os pés do oponente.',
      'Cole o peito no quadril dele e a cabeça na lateral da costela/quadril (nunca abaixe a cabeça de frente).',
      'Abrace a dobra dos dois joelhos dele por trás (pegada de concha).',
      'Empurre com a cabeça para o lado enquanto puxa as pernas para você (Drive through), derrubando o adversário no tatame.'
    ],
    invisibleDetails: [
      'A cabeça DEVE ficar colada e com queixo erguido na costela do oponente; colocar a cabeça para fora ou para baixo te expõe a uma guilhotina fatal.',
      'O impulso não vem dos braços, mas da passada forte da perna de trás que empurra o chão.'
    ],
    commonMistakes: [
      'Dobrar a cintura em vez de flexionar os joelhos (telegrafando a queda).',
      'Entrar de muito longe sem preparar a pegada ou sem quebrar a postura do adversário.'
    ],
    counters: ['Sprawl imediato jogando as pernas para trás e peso no pescoço', 'Guilhotina se a cabeça ficar exposta'],
    followUps: ['Passagem de guarda direta ao cair', 'Joelho na barriga'],
    ibjjfLegalityNote: '2 pontos de queda na IBJJF ao manter o adversário de costas no chão por 3 segundos.',
    tags: ['Queda', 'Baiana', 'Double Leg', 'Wrestling', '2 Pontos']
  },
  {
    id: 'queda-ippon-seoi-nage',
    name: 'Ippon Seoi Nage (Projeção por Cima do Ombro)',
    japaneseName: 'Ippon Seoi Nage',
    category: 'queda',
    subCategory: 'projeção_judo',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'gi',
    points: 2,
    summary: 'A mais famosa projeção do Judô adaptada ao Jiu-Jitsu, arremessando o adversário sobre o ombro através de um giro rápido e flexão de joelhos.',
    startingPosition: 'Luta em pé com pegada de gola e manga',
    targetPositionOrSub: 'Queda com Oponente de Costas no Tatame (2 pontos)',
    steps: [
      'Faça a pegada na manga do oponente e puxe-o para a frente para provocar o desequilíbrio (Kuzushi).',
      'Dê um passo com o pé direito entre os pés dele, girando 180 graus de costas para ele.',
      'Encaixe o braço direito sob a axila do oponente dobrando o cotovelo e travando o braço dele contra o seu ombro.',
      'Flexione bem os joelhos de forma que seu quadril fique abaixo do quadril dele.',
      'Estenda as pernas e incline o tronco para a frente, arremessando-o por cima do seu ombro até o chão.'
    ],
    invisibleDetails: [
      'Se o seu quadril não ficar abaixo do quadril do oponente, você não conseguirá levantá-lo e correrá o risco de levar contragolpe para trás.',
      'Não solte a pegada da manga na queda: use-a para controlar o braço dele e já cair no armlock ou 100kg.'
    ],
    commonMistakes: [
      'Girar com as pernas esticadas.',
      'Deixar as costas muito longe do peito do oponente.'
    ],
    counters: ['Ura Nage (contra-queda levantando pelas costas)', 'Puxar para a guarda durante o giro'],
    followUps: ['Armlock direto no braço que foi projetado', 'Controle lateral nos 100kg'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Judô', 'Seoi Nage', 'Queda', 'Arremesso', 'Kuzushi']
  },

  // ==================== DEFESAS E SAÍDAS (ESCAPES) ====================
  {
    id: 'saida-da-montada-upa',
    name: 'Saída da Montada Clássica: Upa (Bridge & Roll)',
    category: 'defesa',
    subCategory: 'saida_montada',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'A mais tradicional saída de defesa pessoal ensinada por Hélio e Carlos Gracie, travando o braço e o pé do montador antes de aplicar uma ponte explosiva.',
    startingPosition: 'Embaixo da Montada do Adversário',
    targetPositionOrSub: 'Dentro da Guarda Fechada (com você por cima)',
    steps: [
      'Proteja o pescoço com os cotovelos colados às costelas.',
      'Abrace o braço do oponente do mesmo lado que você pretende rolar, colando-o ao seu peito.',
      'Com o seu pé do mesmo lado, prenda o pé/tornozelo do oponente por fora, impedindo que ele abra a base com o joelho.',
      'Plante os dois pés firmes no tatame próximos aos seus glúteos.',
      'Execute uma ponte (Upa) explosiva e vertical com o quadril, girando 45 graus sobre o ombro do lado bloqueado.',
      'Caia diretamente dentro da guarda fechada do adversário, estabelecendo postura imediata.'
    ],
    invisibleDetails: [
      'A ponte deve ser direcionada para o teto primeiro e só depois para a diagonal do ombro, maximizando a elevação do centro de massa.',
      'Travar o pé do oponente é fundamental; se o pé dele estiver solto, ele apenas abrirá a perna e manterá a montada.'
    ],
    commonMistakes: [
      'Empurrar o peito do oponente com os braços esticados (o que convida a um armlock imediato).',
      'Tentar rolar de lado sem antes fazer a elevação vertical de quadril.'
    ],
    counters: ['Montador avançar os joelhos para a axila (High Mount)', 'Trocar para montada S'],
    followUps: ['Abertura de guarda fechada e passagem'],
    ibjjfLegalityNote: 'Movimento de sobrevivência essencial em qualquer graduação.',
    tags: ['Upa', 'Defesa', 'Montada', 'Gracie Jiu-Jitsu', 'Sobrevivência']
  },
  {
    id: 'saida-dos-100kg-fuga-de-quadril',
    name: 'Fuga de Quadril dos 100kg (Hip Escape / Shrimp to Guard)',
    category: 'defesa',
    subCategory: 'saida_100kg',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'O movimento essencial de reposição de guarda por baixo do controle lateral, utilizando frames de braço e o famoso movimento de camarão (fuga de quadril).',
    startingPosition: 'Por baixo do Controle Lateral (100kg)',
    targetPositionOrSub: 'Recuperação de Guarda Fechada ou Meia Guarda',
    steps: [
      'Crie os frames de proteção: antebraço de dentro no pescoço/garganta do oponente e antebraço de fora no quadril dele.',
      'Dê uma leve ponte com o quadril para aliviar o peso do oponente sobre o seu peito.',
      'Afaste o seu quadril para longe do oponente (movimento de camarão / shrimping).',
      'Deslize o joelho de baixo para o espaço criado entre o seu cotovelo e o quadril dele.',
      'Coloque a canela transversal no abdômen dele (escudo de joelho) e empurre para recuperar a guarda completa.'
    ],
    invisibleDetails: [
      'Nunca fique plano de costas no tatame: vire-se ligeiramente de lado voltado para o oponente.',
      'Os braços atuam como "estruturas rígidas" (frames/pilares), não empurrando com os músculos, mas sustentando o peso nos ossos.'
    ],
    commonMistakes: [
      'Tentar abraçar o pescoço do passador por baixo (fica completamente preso sem mobilidade).',
      'Fugir o quadril para o lado errado, entregando as costas.'
    ],
    counters: ['Passador bloquear o quadril do guardeiro e rodar para Norte-Sul'],
    followUps: ['Ataque de triângulo ou armlock na recuperação de guarda'],
    ibjjfLegalityNote: 'Fundamental em qualquer avaliação de graduação.',
    tags: ['100kg', 'Camarão', 'Fuga de Quadril', 'Reposição', 'Sobrevivência']
  },

  // ==================== GUARDAS E POSIÇÕES DOMINANTES ====================
  {
    id: 'guarda-de-la-riva',
    name: 'Guarda De La Riva',
    category: 'guarda',
    subCategory: 'guarda_aberta',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'ambos',
    summary: 'Desenvolvida pelo lendário mestre Ricardo De La Riva na década de 1980 para anular os passadores pesados da Carlson Gracie, revolucionou o jogo aberto com o gancho externo.',
    startingPosition: 'Guarda Aberta contra oponente em pé',
    targetPositionOrSub: 'Raspagens, Berimbolo, Tomada de Costas',
    steps: [
      'Domine o calcanhar ou calça da perna da frente do adversário com a mão de dentro.',
      'Encaixe o gancho com a perna externa por trás da coxa e do tendão de Aquiles dele.',
      'Com a outra mão, faça pegada na gola ou manga do oponente para controlar a distância.',
      'Coloque o pé livre no quadril ou coxa oposta do oponente para controlar o equilíbrio dele.'
    ],
    invisibleDetails: [
      'O pé do gancho deve girar para fora e empurrar a coxa de dentro para fora, torcendo o joelho do passador para dentro e quebrando a postura.',
      'A pegada no calcanhar não pode soltar; ela impede que o passador retire a perna do gancho.'
    ],
    commonMistakes: [
      'Deixar o gancho frouxo ou sem pressão no tendão de Aquiles.',
      'Permitir que o passador empurre o joelho do gancho para o chão (Knee Slice).'
    ],
    counters: ['Knee Slide Pass amassando o gancho', 'Back Step Pass'],
    followUps: ['Berimbolo para as costas', 'Raspagem Tomoe Nage', 'Transição para Guarda X'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['De La Riva', 'Guarda Aberta', 'Histórico', 'Gancho', 'Ricardo De La Riva']
  },
  {
    id: 'guarda-50-50',
    name: 'Guarda 50/50 (Fifty-Fifty)',
    category: 'guarda',
    subCategory: 'guarda_aberta',
    difficulty: 'avancado',
    minBelt: 'roxa',
    modality: 'ambos',
    summary: 'Posição simétrica onde as pernas de ambos os atletas se entrelaçam em forma de quatro ao redor da mesma perna, criando oportunidades letais de raspagem e leglocks.',
    startingPosition: 'Transição de De La Riva Invertida ou Guarda X',
    targetPositionOrSub: 'Raspagem (2 pontos), Heel Hook, Chave de Pé Reta',
    steps: [
      'Entrelace a sua perna por fora e cruze o pé por dentro da perna do oponente, travando o triângulo de perna ao redor da coxa dele.',
      'Esconda o seu próprio calcanhar para evitar contra-ataques de chave de perna.',
      'Controle o kimono ou o tronco do oponente para ditar quem sobe primeiro para pontuar.',
      'Em No-Gi, busque o controle do calcanhar exposto dele para o Inside Heel Hook.'
    ],
    invisibleDetails: [
      'Na regra de quimono IBJJF, quem conseguir subir e estabilizar por 3 segundos ganha 2 pontos de raspagem.',
      'Em No-Gi, o segredo é manter os joelhos fechados e o calcanhar do oponente preso na axila.'
    ],
    commonMistakes: [
      'Deixar o calcanhar de fora desprotegido em combates No-Gi.',
      'Ficar passivo na posição gerando punição por falta de combatividade.'
    ],
    counters: ['Abrir o triângulo de pernas com as mãos e passar para as costas'],
    followUps: ['Heel Hook (No-Gi)', 'Raspagem de subida', 'Back Take via Crab Ride'],
    ibjjfLegalityNote: 'Legal com quimono para todas as faixas (sem chave de calcanhar). No-Gi permite heel hook a partir da faixa marrom.',
    tags: ['50/50', 'Moderno', 'Leglock', 'Simetria', 'No-Gi']
  },
  {
    id: 'guarda-x-x-guard',
    name: 'Guarda X (X-Guard)',
    category: 'guarda',
    subCategory: 'guarda_aberta',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'ambos',
    points: 2,
    summary: 'Criada e imortalizada pelo lendário Marcelo Garcia, consiste em entrar por baixo do centro de gravidade do oponente com as pernas cruzadas em "X" ao redor da perna dele.',
    startingPosition: 'Guarda Borboleta ou Guarda Aberta',
    targetPositionOrSub: 'Raspagens Diversas, Quedas Técnicas, Pegada de Costas',
    steps: [
      'Mergulhe por baixo do quadril do oponente enquanto ele estiver em pé.',
      'Abrace uma das pernas dele com o braço apoiando a coxa no seu ombro.',
      'Coloque o pé da perna superior no quadril dele e o pé da perna inferior atrás do joelho dele, formando a letra "X".',
      'Estenda o "X" com as pernas para desequilibrar o oponente para a frente ou para trás.',
      'Levante-se com a perna dele dominada (Technical Standup) garantindo 2 pontos de raspagem.'
    ],
    invisibleDetails: [
      'O oponente não tem peso nos pés porque você está suportando o centro de gravidade dele nos seus ganchos.',
      'A cabeça do guardeiro deve ficar colada na perna do adversário para evitar ataques no pescoço.'
    ],
    commonMistakes: [
      'Deixar os pés do "X" frouxos, permitindo que o oponente pise no chão e passe a guarda.',
      'Esquecer de manter a perna dele abraçada firmemente no ombro.'
    ],
    counters: ['Empurrar o pé do quadril e dar passo atrás (Back Step)'],
    followUps: ['Raspagem de levantar técnico', 'Raspagem jogando o oponente para trás', 'Transição para Chave de Perna Reta'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Marcelo Garcia', 'Guarda X', 'Raspagem', 'Desequilíbrio', 'Inovação']
  },

  // ==================== NOVAS FINALIZAÇÕES ADICIONAIS ====================
  {
    id: 'estrangulamento-cruzado',
    name: 'Estrangulamento Cruzado da Guarda',
    japaneseName: 'Juji-Jime',
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'gi',
    summary: 'A técnica favorita do Grão-Mestre Hélio Gracie. Utiliza pegadas cruzadas profundas nas golas do adversário para um estrangulamento carotídeo limpo e fulminante.',
    startingPosition: 'Guarda Fechada ou Montada',
    targetPositionOrSub: 'Finalização por Estrangulamento',
    steps: [
      'Abra a gola do oponente e enfie a primeira mão com quatro dedos para dentro, o mais fundo possível atrás da nuca dele.',
      'Quebre a postura do adversário puxando com as pernas da guarda fechada.',
      'Passe a segunda mão por baixo ou por cima da primeira, entrando na outra gola.',
      'Cole os cotovelos nas suas costelas, aproxime a testa do oponente e puxe os punhos girando as lâminas dos rádios contra as carótidas.'
    ],
    invisibleDetails: [
      'A profundidade da primeira mão define 90% do sucesso do estrangulamento.',
      'Não abra os cotovelos como asas de frango; junte os cotovelos e faça o movimento de trazer as mãos até o próprio peito.'
    ],
    commonMistakes: [
      'Pegar na gola muito raso, permitindo que o oponente defenda empurrando o cotovelo.',
      'Tentar finalizar esticando os braços ao invés de aproximar o tronco.'
    ],
    counters: ['Empurrar o cotovelo do braço mais fundo', 'Defender com o queixo e posturar forte'],
    followUps: ['Transição para Armlock se ele defender a gola', 'Raspagem Pendular'],
    ibjjfLegalityNote: 'Permitido para todas as faixas.',
    tags: ['Hélio Gracie', 'Fundamental', 'Clássico', 'Gola', 'Cruzado']
  },
  {
    id: 'chave-pe-reta',
    name: 'Chave de Pé Reta (Botinha)',
    japaneseName: 'Ashi Hishigi',
    category: 'finalizacao',
    subCategory: 'chave_perna',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'A principal chave de perna legal para faixas brancas na IBJJF. Comprime o tendão de Aquiles e hiperextende o tornozelo usando o antebraço e a curvatura do peito.',
    startingPosition: 'Guarda Aberta, Meia Guarda ou 50/50',
    targetPositionOrSub: 'Finalização por Chave de Pé Reta',
    steps: [
      'Isole a perna do oponente e coloque a lâmina do seu rádio logo acima do calcanhar dele (no tendão de Aquiles).',
      'Feche a pegada com mão na própria gola ou mão-com-mão (Guilhotina grip).',
      'Pise com o pé de fora no quadril dele e o pé de dentro calçando o ísquio ou coxa interna (Single Leg X).',
      'Olhe por cima do ombro que abraça o pé e estenda o corpo em arco para trás arqueando as costas.'
    ],
    invisibleDetails: [
      'Não puxe a perna com os braços: trave o pé bem firme debaixo da axila e use a expansão da caixa torácica e das costas para quebrar o ângulo.',
      'Mantenha o joelho do oponente apontando para cima para evitar torções laterais ilegais na faixa branca.'
    ],
    commonMistakes: [
      'Deixar o pé do oponente deslizar para fora da axila.',
      'Cruzar o pé por dentro do quadril de forma a cruzar a linha média (Reaping of the knee / Cruzada de perna proibida).'
    ],
    counters: ['Colocar a bota (empurrar o pé para frente flexionando o tornozelo)', 'Subir e pisar no peito do aplicador'],
    followUps: ['Transição para Meia Guarda ou Raspagem'],
    ibjjfLegalityNote: 'Permitido a partir da faixa branca na IBJJF (sem torcer o joelho).',
    tags: ['Botinha', 'Leglock', 'Tornozelo', 'Aquiles', 'Fundamental']
  },
  {
    id: 'arco-e-flecha',
    name: 'Estrangulamento Arco e Flecha (Bow & Arrow)',
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'gi',
    summary: 'Considerado um dos estrangulamentos mais justos e eficientes de quimono. Utiliza a pegada cruzada na gola combinada com o controle da calça do adversário pelas costas.',
    startingPosition: 'Controle de Costas (Back Mount) ou Tartaruga',
    targetPositionOrSub: 'Finalização por Estrangulamento',
    steps: [
      'Com o controle de costas estabelecido, entre a mão dominante bem funda na gola cruzada do oponente com quatro dedos para dentro.',
      'Com a mão livre, faça uma pegada firme na calça ou canela do lado oposto do adversário.',
      'Passe a perna superior por cima do ombro do oponente calçando o peito dele.',
      'Deite para a lateral e estenda as pernas enquanto puxa a gola e a calça simultaneamente, imitando o ato de disparar uma flecha.'
    ],
    invisibleDetails: [
      'A perna que calça o peito impede que o adversário gire para dentro da sua guarda.',
      'A pegada na calça remove a base dele e duplica a alavanca mecânica do estrangulamento.'
    ],
    commonMistakes: [
      'Não passar a perna por cima do ombro, permitindo que ele escorregue as costas no chão.',
      'Fazer a pegada na gola muito frouxa.'
    ],
    counters: ['Segurar com as duas mãos no punho da gola antes do ajuste', 'Girar o quadril para defender a pegada da calça'],
    followUps: ['Transição para Armlock das Costas', 'Mata-Leão'],
    ibjjfLegalityNote: 'Permitido para todas as faixas (Gi).',
    tags: ['Bow and Arrow', 'Costas', 'Clássico', 'Gola', 'Alta Eficiência']
  },
  {
    id: 'katagatame-arm-triangle',
    name: 'Katagatame (Arm Triangle Choke)',
    japaneseName: 'Kata-Gatame',
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'intermediario',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'Estrangulamento com o próprio braço do adversário comprimindo a carótida de um lado e o bíceps do atacante comprimindo o outro.',
    startingPosition: 'Montada ou 100kg (Side Control)',
    targetPositionOrSub: 'Finalização por Estrangulamento',
    steps: [
      'Isole o braço do oponente e empurre-o através do pescoço dele com a sua cabeça.',
      'Abrace o pescoço e o braço isolado com o seu braço dominante.',
      'Junte as mãos em pegada gable (palma com palma) ou mão no próprio bíceps.',
      'Desmonte para o lado do braço preso, cole a cabeça no tatame e aplique pressão com o quadril colado ao chão.'
    ],
    invisibleDetails: [
      'A cabeça do aplicador deve colar na orelha do oponente para não permitir que o braço dele volte.',
      'O peso deve ser direcionado para o chão e para o pescoço, não para cima.'
    ],
    commonMistakes: [
      'Ficar na montada para finalizar ao invés de descer o quadril para o lado do tatame.',
      'Permitir que o oponente responda ao telefone colocando a mão na própria orelha.'
    ],
    counters: ['Atender o telefone com a mão livre', 'Girar de bruços e repor guarda'],
    followUps: ['Voltar para a Montada se o oponente aliviar o pescoço', 'Transição para Pegada de Costas'],
    ibjjfLegalityNote: 'Permitido para todas as faixas.',
    tags: ['Katagatame', 'Arm Triangle', '100kg', 'Montada', 'Mata-Leão de Frente']
  },
  {
    id: 'darce-choke',
    name: "D'Arce Choke (Brabo Choke No-Gi)",
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'avancado',
    minBelt: 'azul',
    modality: 'ambos',
    summary: 'Estrangulamento devastador sem quimono batizado em homenagem a Joe D\'Arce. O braço do atacante passa por baixo da axila do oponente e sai pelo pescoço travando no próprio bíceps.',
    startingPosition: 'Posição de Tartaruga, Meia Guarda ou Sprawl',
    targetPositionOrSub: 'Finalização por Estrangulamento',
    steps: [
      'A partir do sprawl ou tartaruga, enfie o braço direito por baixo da axila do oponente até que sua mão saia do lado oposto do pescoço dele.',
      'Trave a mão no seu bíceps esquerdo e coloque a mão esquerda nas costas do adversário.',
      'Derrube o oponente de lado com a perna presa (Half Guard hook).',
      'Caminhe com as pernas em direção ao corpo do oponente e aperte o triângulo de braços.'
    ],
    invisibleDetails: [
      'Quanto mais fundo o braço passar, menor a resistência do pescoço.',
      'Mantenha a cabeça do adversário comprimida em direção ao peito dele.'
    ],
    commonMistakes: [
      'Tentar apertar com força de braço sem fechar o ângulo com o quadril.',
      'Deixar o oponente abrir o espaço do cotovelo para posturar.'
    ],
    counters: ['Postura imediata e giro para a guarda aberta'],
    followUps: ['Transição para Anaconda Choke', 'Guilhotina'],
    ibjjfLegalityNote: 'Permitido para todas as faixas adultos.',
    tags: ["D'Arce", 'Brabo', 'No-Gi', 'Axila', 'Moderno']
  },
  {
    id: 'anaconda-choke',
    name: 'Anaconda Choke',
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'avancado',
    minBelt: 'azul',
    modality: 'ambos',
    summary: 'Primo do D\'Arce Choke, mas o braço entra primeiro pelo pescoço e sai pela axila do oponente. Famoso pelo rolamento em jacaré (Gator Roll).',
    startingPosition: 'Front Headlock ou Sprawl',
    targetPositionOrSub: 'Finalização por Estrangulamento',
    steps: [
      'Com o oponente na tartaruga ou após defender uma queda no sprawl, passe o braço pelo pescoço saindo por baixo da axila dele.',
      'Tranque a mão no seu próprio bíceps oposto.',
      'Execute o "Gator Roll" (rolamento por cima do ombro que está sob o adversário) para inverter a posição.',
      'Prenda a perna do oponente com os seus pés e aperte os braços comprimindo o pescoço.'
    ],
    invisibleDetails: [
      'O rolamento não serve apenas para derrubar, mas para quebrar a base de apoio e prender as pernas do oponente.',
      'Aproxime o seu peito do queixo dele para não deixar folga.'
    ],
    commonMistakes: ['Rolar para o lado errado, aliviando o estrangulamento.'],
    counters: ['Segurar o pulso do atacante antes do fechamento do bíceps'],
    followUps: ['Transição para D\'Arce', 'Mata-leão pelas costas'],
    ibjjfLegalityNote: 'Permitido para todas as faixas adultos.',
    tags: ['Anaconda', 'Gator Roll', 'Front Headlock', 'No-Gi']
  },
  {
    id: 'americana-montada',
    name: 'Chave Americana da Montada',
    japaneseName: 'Ude Garami',
    category: 'finalizacao',
    subCategory: 'chave_ombro',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'Chave de ombro clássica em figura de 4 (Double Wrist Lock) que ataca a rotação externa da articulação do ombro a partir do controle de 100kg ou da montada.',
    startingPosition: 'Montada ou 100kg',
    targetPositionOrSub: 'Finalização por Torção de Ombro',
    steps: [
      'Isole o braço do oponente empurrando o punho dele em direção ao tatame com a mão do mesmo lado.',
      'Cole o seu cotovelo rente à orelha dele no chão para impedir que ele mova o braço.',
      'Passe o outro braço por baixo do tríceps dele e segure no seu próprio punho.',
      'Mantenha as costas da mão do oponente no tatame e puxe o cotovelo dele na direção da cintura dele, erguendo o seu cotovelo suavemente até a desistência.'
    ],
    invisibleDetails: [
      'Faça o movimento de "pincelar o chão" com as costas da mão do oponente antes de erguer o cotovelo para diminuir a folga articular.',
      'Não use pegada com polegar (pegada de macaco sem polegar dá mais firmeza estrutural).'
    ],
    commonMistakes: [
      'Erguer o cotovelo do oponente reto para o alto sem puxá-lo primeiro em direção ao quadril.',
      'Perder a base da montada durante o ataque.'
    ],
    counters: ['Esticar o braço para transicionar em fuga de cotovelo', 'Ponte forte (Upa) para o lado do braço preso'],
    followUps: ['Transição para Armlock reto', 'Katagatame'],
    ibjjfLegalityNote: 'Permitido para todas as faixas.',
    tags: ['Americana', 'Ude Garami', 'Montada', 'Ombro', 'Fundamental']
  },
  {
    id: 'omoplata-guarda-fechada',
    name: 'Omoplata da Guarda Fechada',
    japaneseName: 'Ashi Sankaku Garami',
    category: 'finalizacao',
    subCategory: 'chave_ombro',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'ambos',
    summary: 'Ataque ao ombro utilizando as pernas do guardeiro. Além de uma finalização técnica graciosa, é uma das melhores ferramentas para raspagens e transições.',
    startingPosition: 'Guarda Fechada ou Guarda Aranha',
    targetPositionOrSub: 'Finalização por Chave de Ombro ou Raspagem',
    steps: [
      'Domine uma manga e abra a guarda, empurrando o braço dominado para frente com o pé no quadril.',
      'Lance a perna por cima do ombro e axila do oponente.',
      'Gire o corpo para fora ficando paralelo ao adversário.',
      'Cruze as pernas em formato de triângulo ao redor do braço dele.',
      'Segure no quadril ou faixa do adversário para impedir que ele dê cambalhota de escape.',
      'Sente-se com postura ereta e curve-se para frente em direção ao ombro dele até o tap.'
    ],
    invisibleDetails: [
      'Segurar na cintura do oponente com a mão é mandatório para anular o rolamento de defesa.',
      'Quebre a postura dele deitando o ombro dele completamente colado no tatame antes de subir.'
    ],
    commonMistakes: [
      'Deixar espaço para o oponente rolar para frente e anular a posição.',
      'Sentar-se para trás ao invés de se projetar na diagonal para frente.'
    ],
    counters: ['Rolamento frontal para frente para aliviar a pressão no ombro'],
    followUps: ['Raspagem de Omoplata (2 pontos)', 'Transição para Armlock ou Triângulo'],
    ibjjfLegalityNote: 'Permitido para todas as faixas.',
    tags: ['Omoplata', 'Alavanca', 'Guarda Fechada', 'Nino Schembri', 'Ombro']
  },
  {
    id: 'ezequiel-choke',
    name: 'Estrangulamento Ezequiel (Sode Guruma Jime)',
    japaneseName: 'Sode-Guruma-Jime',
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'intermediario',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'Famoso pelo judoca olímpico Ezequiel Paraguassu nos treinos da Carlson Gracie. Permite estrangular o oponente mesmo estando preso dentro da guarda dele.',
    startingPosition: 'Montada, 100kg ou Dentro da Guarda do Oponente',
    targetPositionOrSub: 'Finalização por Estrangulamento',
    steps: [
      'Passe um braço por trás do pescoço do oponente.',
      'Enfie quatro dedos desse braço por dentro da própria manga do quimono.',
      'Com a outra mão, passe a faca da mão ou punho por cima da garganta do oponente.',
      'Estenda os braços criando uma tesoura que esmaga a traqueia e as carótidas.'
    ],
    invisibleDetails: [
      'Em No-Gi, pode ser feito usando a pegada mão-no-bíceps com o punho fechado na garganta.',
      'Na montada, mantenha o peso afundando o peito do adversário.'
    ],
    commonMistakes: [
      'Tentar aplicar sem profundidade no abraço da nuca, permitindo que o oponente empurre os cotovelos.'
    ],
    counters: ['Empurrar os cotovelos do atacante e abrir espaço para a cabeça'],
    followUps: ['Americana se ele levantar os braços para defender o pescoço'],
    ibjjfLegalityNote: 'Permitido para todas as faixas.',
    tags: ['Ezequiel', 'Carlson Gracie', 'Sode Guruma', 'Surpresa', 'Gola']
  },
  {
    id: 'baseball-choke',
    name: 'Estrangulamento Bastão de Beisebol (Baseball Bat Choke)',
    category: 'finalizacao',
    subCategory: 'estrangulamento',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'gi',
    summary: 'Estrangulamento giratório onde as mãos seguram a gola como quem empunha um taco de beisebol, seguido de um giro de 180 graus do corpo que corta o fluxo sanguíneo instantaneamente.',
    startingPosition: 'Joelho na Barriga ou 100kg',
    targetPositionOrSub: 'Finalização por Estrangulamento',
    steps: [
      'Do joelho na barriga, entre com a primeira mão com quatro dedos na gola do oponente (lado mais próximo).',
      'Entre com a segunda mão com o polegar para dentro colada na primeira mão (pegada de taco de beisebol).',
      'Desça o peso e gire o seu corpo 180 graus dando as costas para a cabeça do oponente.',
      'Cole os cotovelos no tatame torcendo as duas golas como um torniquete.'
    ],
    invisibleDetails: [
      'Muitos atletas usam essa finalização como armadilha ("bait"): deixam o oponente repor a guarda enquanto já estão com as mãos posicionadas no taco de beisebol.'
    ],
    commonMistakes: [
      'Girar para o lado errado aliviando o cruzamento das golas.'
    ],
    counters: ['Segurar nos cotovelos impedindo o giro de 180 graus'],
    followUps: ['Finalização imediata da guarda ou do 100kg'],
    ibjjfLegalityNote: 'Permitido para todas as faixas.',
    tags: ['Baseball Choke', 'Gola', 'Torniquete', 'Joelho na Barriga', 'Armadilha']
  },

  // ==================== NOVAS RASPAGEIS ADICIONAIS ====================
  {
    id: 'raspagem-pendulo-flower',
    name: 'Raspagem Pendular / Flor (Flower Sweep)',
    category: 'raspagem',
    subCategory: 'guarda_fechada',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    points: 2,
    summary: 'Raspagem clássica da guarda fechada que usa o pêndulo das pernas e o domínio da manga para girar o oponente e cair diretamente na montada (2 pontos de raspagem + 4 pontos de montada).',
    startingPosition: 'Guarda Fechada',
    targetPositionOrSub: 'Montada Completa (6 pontos totais)',
    steps: [
      'Domine o braço do oponente com pegada na manga e cruze-o pelo peito.',
      'Com a outra mão, mergulhe por baixo da perna dele segurando na calça ou abraçando a coxa.',
      'Abra a guarda, balance a perna de fora como um pêndulo e chute a perna alta na axila dele.',
      'Role por cima do ombro e monte no oponente estabilizando a posição.'
    ],
    invisibleDetails: [
      'O tempo do chute da perna com o pêndulo deve ser sincronizado com a puxada da perna dele por baixo.',
      'Impedir que o adversário apoie o braço no tatame é o ponto crítico do sucesso.'
    ],
    commonMistakes: [
      'Não criar o ângulo de 90 graus antes de desferir o pêndulo.'
    ],
    counters: ['Posturar imediatamente e tirar o peso da perna dominada'],
    followUps: ['Armlock se o oponente esticar o braço para defender', 'Triângulo'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Flower Sweep', 'Pêndulo', 'Guarda Fechada', 'Montada', 'Fundamental']
  },
  {
    id: 'raspagem-borboleta-hook',
    name: 'Raspagem da Guarda Borboleta (Hook Sweep)',
    category: 'raspagem',
    subCategory: 'guarda_aberta',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    points: 2,
    summary: 'A essência da guarda borboleta. Utiliza os ganchos internos dos pés combinados com esgrima e domínio de tríceps para projetar o adversário lateralmente.',
    startingPosition: 'Guarda Borboleta',
    targetPositionOrSub: 'Montada ou 100kg (2 pontos de raspagem)',
    steps: [
      'Sente-se ereto com os dois peitos dos pés calçados por dentro das coxas do oponente.',
      'Consiga uma esgrima profunda nas costas dele e domine o tríceps oposto.',
      'Deite de ombro no tatame na diagonal e eleve o gancho interno da perna do lado da esgrima.',
      'Acompanhe o movimento com o quadril até aterrissar na montada ou no controle lateral.'
    ],
    invisibleDetails: [
      'Nunca caia de costas retas no chão; deite sempre de lado sobre o ombro para maximizar a alavanca do gancho.',
      'A cabeça do guardeiro deve ficar debaixo do queixo do oponente guiando a rotação.'
    ],
    commonMistakes: [
      'Deitar reto de costas no chão perdendo toda a força de elevação dos ganchos.'
    ],
    counters: ['Espalmar o pé no chão criando base e posturar'],
    followUps: ['Guilhotina se ele defender com a cabeça exposta', 'Armlock'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Borboleta', 'Butterfly', 'Hook Sweep', 'Marcelo Garcia', 'Dinâmico']
  },
  {
    id: 'raspagem-meia-guarda-profunda',
    name: 'Raspagem da Meia Guarda Profunda (Waiter Sweep)',
    category: 'raspagem',
    subCategory: 'meia_guarda',
    difficulty: 'avancado',
    minBelt: 'roxa',
    modality: 'ambos',
    points: 2,
    summary: 'Especialidade de grandes campeões como Bernardo Faria e Jeff Glover. Mergulha por baixo do quadril do passador até a posição de garçom (Waiter) para raspar com precisão matemática.',
    startingPosition: 'Meia Guarda Profunda',
    targetPositionOrSub: 'Raspagem para a Superioridade Posicional (2 pontos)',
    steps: [
      'Mergulhe a cabeça e o tronco inteiramente por baixo das pernas do oponente na meia guarda.',
      'Abrace a perna de trás do adversário sobre o seu ombro como uma bandeja de garçom.',
      'Balance os joelhos para frente e para trás para tirar o equilíbrio dele.',
      'Gire para cima estendendo a perna e suba nas costas ou no joelho dele garantindo os 2 pontos.'
    ],
    invisibleDetails: [
      'Mantenha a cabeça colada no abdômen dele para não expor o pescoço a ataques de Kimura ou Guilhotina.',
      'O peso do passador fica flutuando nas pernas do guardeiro.'
    ],
    commonMistakes: [
      'Deixar o braço exposto para a Kimura do passador.'
    ],
    counters: ['Passagem com giro para trás (Back Step) ou Kimura Counter'],
    followUps: ['Pegada de Costas', 'Raspagem de subida simples'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Meia Guarda Profunda', 'Waiter Sweep', 'Bernardo Faria', 'Alavanca']
  },
  {
    id: 'raspagem-de-la-riva-costas',
    name: 'Raspagem De La Riva com Tomada de Costas',
    category: 'raspagem',
    subCategory: 'guarda_aberta',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'ambos',
    points: 2,
    summary: 'A transição mais clássica da De La Riva: desequilibrar o passador para frente, soltar a perna e girar diretamente para a mochila nas costas do adversário.',
    startingPosition: 'Guarda De La Riva',
    targetPositionOrSub: 'Tomada de Costas (4 pontos) ou Raspagem (2 pontos)',
    steps: [
      'Estabeleça o gancho De La Riva fundo no tendão de Aquiles e domine a manga cruzada do oponente.',
      'Chute a coxa do adversário com o pé do quadril forçando-o a apoiar as duas mãos no tatame à frente.',
      'Aproveite a projeção dele para sentar, passar por trás das pernas dele e colocar os dois ganchos nas costas.'
    ],
    invisibleDetails: [
      'O segredo é a força do empurrão do pé livre no quadril que transfere todo o peso dele para as mãos no chão.'
    ],
    commonMistakes: [
      'Demorar para subir após o oponente colocar as mãos no tatame.'
    ],
    counters: ['Postura imediata com joelho amassando o gancho'],
    followUps: ['Berimbolo', 'Mata-Leão pelas costas'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['De La Riva', 'Costas', 'Raspagem', 'Moderno', 'Controle']
  },

  // ==================== NOVAS PASSAGENS DE GUARDA ====================
  {
    id: 'passagem-knee-cut',
    name: 'Passagem Cortando o Joelho (Knee Cut / Knee Slice)',
    category: 'passagem',
    subCategory: 'passagem_agil',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    points: 3,
    summary: 'A passagem de guarda mais utilizada no Jiu-Jitsu de alto rendimento. Consiste em deslizar o joelho diagonalmente sobre a coxa do adversário enquanto esgrima o tronco com força.',
    startingPosition: 'Meia Guarda ou Guarda Aberta',
    targetPositionOrSub: '100kg / Side Control (3 pontos)',
    steps: [
      'Abra a guarda do oponente ou posicione-se sobre a meia guarda dele.',
      'Faça uma esgrima profunda do lado em que seu joelho vai deslizar e domine a gola ou a cabeça do adversário.',
      'Aponte o joelho na diagonal deslizando a canela sobre a coxa dele até tocar o tatame do outro lado.',
      'Estenda a perna de trás com a ponta dos dedos no chão (Sprawl) e estabilize no 100kg por 3 segundos.'
    ],
    invisibleDetails: [
      'A esgrima profunda e a pressão do ombro no queixo do adversário impedem que ele vire de quatro ou pegue suas costas.',
      'O joelho deve cortar bem rente ao quadril dele, sem deixar espaço para recuperação do escudo de joelho.'
    ],
    commonMistakes: [
      'Tentar deslizar o joelho sem ter conquistado a esgrima (risco de levar tomada de costas).',
      'Deixar a perna presa na meia guarda sem liberar o pé.'
    ],
    counters: ['Escudo de Joelho (Knee Shield)', 'Esgrima reversa por baixo'],
    followUps: ['Transição para Montada', 'Estrangulamento Norte-Sul'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Knee Cut', 'Knee Slide', 'Ágil', 'Essencial', 'Leandro Lo']
  },
  {
    id: 'passagem-leg-drag',
    name: 'Passagem Leg Drag',
    category: 'passagem',
    subCategory: 'passagem_agil',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'ambos',
    points: 3,
    summary: 'Técnica revolucionada pelos irmãos Mendes e Gui Valente. Arrasta a perna do guardeiro cruzando o quadril dele, imobilizando completamente a capacidade de reposição de guarda.',
    startingPosition: 'Guarda De La Riva, Guarda Aranha ou Aberta',
    targetPositionOrSub: 'Controle Lateral ou Pegada de Costas (3 a 4 pontos)',
    steps: [
      'Segure na barra da calça e na gola ou calcanhar do oponente.',
      'Puxe a perna do adversário transversalmente cruzando-a pelo seu próprio quadril.',
      'Abaixe o seu quadril travando a perna dele entre a sua coxa e o tatame.',
      'Abrace a cabeça e a gola dele estabilizando a passagem de guarda ou avançando para as costas.'
    ],
    invisibleDetails: [
      'Ao cruzar a perna do oponente, o quadril dele fica torcido para o lado oposto, impossibilitando qualquer fuga de camarão eficiente.',
      'Cole o seu peito no ombro dele para anular tentativas de tartaruga.'
    ],
    commonMistakes: [
      'Não colocar o peso suficiente na perna arrastada, permitindo que ele desfaça o cruzamento.'
    ],
    counters: ['Empurrar o ombro do passador com a mão de fora e fugir o quadril'],
    followUps: ['Tomada de Costas', 'Montada'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Leg Drag', 'Mendes Bros', 'Moderno', 'Controle de Quadril', 'Alta Precisão']
  },
  {
    id: 'passagem-over-under',
    name: 'Passagem Over-Under (Bernardo Faria Pass)',
    category: 'passagem',
    subCategory: 'passagem_pressao',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'gi',
    points: 3,
    summary: 'A arma registrada do 5x campeão mundial Bernardo Faria. Uma mão passa por cima da coxa e a outra mergulha por baixo da outra perna, travando o quadril em um abraço de ferro.',
    startingPosition: 'Guarda Borboleta, Meia Guarda ou Guarda Aberta',
    targetPositionOrSub: '100kg (3 pontos)',
    steps: [
      'Enfie um braço por baixo da perna do oponente (Under) segurando a calça na altura da virilha.',
      'Passe o outro braço por cima da outra coxa (Over) segurando a calça no joelho ou tecido da coxa.',
      'Coloque o seu ombro diretamente no abdômen/bexiga do adversário.',
      'Fique na ponta dos pés, desloque o seu quadril para a lateral e passe a perna estabilizando a lateral.'
    ],
    invisibleDetails: [
      'A cabeça do passador deve colar na costela do oponente do lado da perna "Under" para evitar ataques de guilhotina ou triângulo.',
      'A pressão do ombro é contínua e esmagadora, forçando o guardeiro a cansar e ceder a passagem.'
    ],
    commonMistakes: [
      'Colocar a cabeça do lado errado e ser pego no triângulo.',
      'Não manter o quadril alto na ponta dos pés.'
    ],
    counters: ['Empurrar a cabeça do passador e tentar o triângulo'],
    followUps: ['Controle Lateral', 'Joelho na Barriga'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Over-Under', 'Bernardo Faria', 'Pressão', 'Pesado', 'Esmagamento']
  },
  {
    id: 'passagem-long-step',
    name: 'Passagem Long Step Pass',
    category: 'passagem',
    subCategory: 'passagem_agil',
    difficulty: 'avancado',
    minBelt: 'roxa',
    modality: 'ambos',
    points: 3,
    summary: 'Passagem dinâmica que utiliza um passo longo para trás com giro do quadril, livrando a perna de ganchos De La Riva e caindo instantaneamente no 100kg do outro lado.',
    startingPosition: 'Guarda De La Riva ou Meia Guarda',
    targetPositionOrSub: '100kg (3 pontos)',
    steps: [
      'Faça pegada forte na gola cruzada e na calça do adversário.',
      'Dê um passo longo e explosivo para trás com a perna presa no gancho.',
      'Gire o quadril no ar e desça o ombro no peito do oponente.',
      'Estabilize no controle lateral invertido ou no 100kg clássico.'
    ],
    invisibleDetails: [
      'A pegada na gola deve puxar o tronco do oponente para você enquanto sua perna viaja para trás, esticando o corpo dele.'
    ],
    commonMistakes: [
      'Fazer o passo curto permitindo que o guardeiro acompanhe com o gancho.'
    ],
    counters: ['Subir imediatamente no single leg'],
    followUps: ['Norte-Sul', 'Estrangulamento Baseball'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Long Step', 'Explosivo', 'De La Riva Counter', 'Moderno']
  },

  // ==================== NOVAS QUEDAS E PROJEÇÕES ====================
  {
    id: 'queda-double-leg',
    name: 'Double Leg Takedown (Baiana de Wrestling)',
    japaneseName: 'Morote Gari',
    category: 'queda',
    subCategory: 'queda_wrestling',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    points: 2,
    summary: 'A queda mais consagrada do Wrestling e do MMA adaptada ao Jiu-Jitsu. Entrada explosiva com penetração de joelho entre as pernas e abraço duplo atrás dos joelhos do oponente.',
    startingPosition: 'Em Pé (Distância Média)',
    targetPositionOrSub: '100kg ou Guarda do Oponente (2 pontos)',
    steps: [
      'Mude o nível (Level Change) dobrando os joelhos, não dobrando a cintura.',
      'Dê o passo de penetração com o joelho da frente tocando o tatame entre os pés do adversário.',
      'Abrace as duas pernas atrás dos joelhos com as mãos conectadas.',
      'Coloque a cabeça na costela dele e dê um passo na diagonal com a perna de trás ("Corner"), projetando-o no chão.'
    ],
    invisibleDetails: [
      'A cabeça DEVE ficar na costela externa do oponente com o queixo alto, NUNCA voltada para o peito (evita levar guilhotina).',
      'O movimento do pescoço e do olhar para o horizonte direciona a queda.'
    ],
    commonMistakes: [
      'Olhar para o chão e curvar as costas (leva guilhotina ou sprawl imediato).',
      'Tentar derrubar puxando com os braços ao invés de usar a força das pernas e quadril.'
    ],
    counters: ['Sprawl com quadril pesado', 'Guilhotina se o pescoço estiver baixo'],
    followUps: ['Passagem imediata para o 100kg', 'Montada'],
    ibjjfLegalityNote: 'Permitido para todas as faixas na IBJJF.',
    tags: ['Double Leg', 'Baiana', 'Wrestling', 'Explosão', 'Fundamentos']
  },
  {
    id: 'queda-single-leg',
    name: 'Single Leg Takedown (Entrada de Uma Perna)',
    japaneseName: 'Kuchiki Taoshi',
    category: 'queda',
    subCategory: 'queda_wrestling',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    points: 2,
    summary: 'Ataque a uma perna única isolada. Permite diversas finalizações de queda como correr o cano (Run the Pipe) ou rasteira por dentro.',
    startingPosition: 'Em Pé',
    targetPositionOrSub: 'Queda de 2 pontos',
    steps: [
      'Mude o nível e ataque a perna da frente do adversário abraçando a coxa entre as suas pernas.',
      'Levante-se mantendo a postura ereta com a perna dele travada na sua costela.',
      'Comande o movimento girando em círculo para trás enquanto empurra o ombro dele para baixo ("Run the pipe").',
      'Conduza a aterrissagem no chão com controle posicional.'
    ],
    invisibleDetails: [
      'A cabeça fica do lado de dentro do peito do oponente, mantendo a pressão no esterno.',
      'Aperte os joelhos ao redor da perna dele para que ele não consiga retirar o pé.'
    ],
    commonMistakes: [
      'Deixar a cabeça do lado de fora exposta a contra-ataque de guilhotina.'
    ],
    counters: ['Whizzer (esgrima por cima do ombro)', 'Sprawl na perna'],
    followUps: ['Passagem de guarda direta', 'Entrada para 100kg'],
    ibjjfLegalityNote: 'Permitido para todas as faixas.',
    tags: ['Single Leg', 'Wrestling', 'Em Pé', 'Alavanca']
  },
  {
    id: 'queda-seoi-nage',
    name: 'Seoi Nage (Projeção por Cima do Ombro de Judô)',
    japaneseName: 'Ippon Seoi Nage',
    category: 'queda',
    subCategory: 'projeção_judo',
    difficulty: 'intermediario',
    minBelt: 'branca',
    modality: 'gi',
    points: 2,
    summary: 'A mais famosa projeção do Judô. O atacante gira de costas entrando por baixo do centro de gravidade do oponente e projeta-o por cima do ombro com impacto espetacular.',
    startingPosition: 'Em Pé com pegada na gola e manga',
    targetPositionOrSub: 'Queda Ippon / 2 pontos IBJJF',
    steps: [
      'Puxe a manga e a gola para frente criando o desequilíbrio (Kuzushi).',
      'Gire 180 graus de costas para o oponente, flexionando os joelhos mais baixo que o quadril dele.',
      'Encaixe o cotovelo debaixo da axila dele travando o braço com a mão na gola.',
      'Estenda as pernas e curve o tronco para frente projetando o adversário por cima do seu ombro.'
    ],
    invisibleDetails: [
      'Quem fica mais baixo ganha: seu quadril DEVE entrar abaixo da faixa do oponente.',
      'O puxão inicial da manga deve ser direcionado para o seu relógio de pulso para arrancar o oponente da base.'
    ],
    commonMistakes: [
      'Entrar com as pernas retas sem agachar o quadril.',
      'Deixar as costas expostas sem travar o braço do oponente.'
    ],
    counters: ['Dar passo para o lado e pular para as costas do aplicador'],
    followUps: ['100kg ou Joelho na Barriga'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Seoi Nage', 'Judô', 'Kuzushi', 'Projeção', 'Clássico']
  },
  {
    id: 'queda-o-soto-gari',
    name: 'O-Soto-Gari (Grande Ceifa Externa de Judô)',
    japaneseName: 'Osoto-Gari',
    category: 'queda',
    subCategory: 'projeção_judo',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'gi',
    points: 2,
    summary: 'A primeira grande queda ensinada nas artes marciais japonesas. Quebra a postura do adversário para trás e ceifa a perna de apoio dele com força e precisão.',
    startingPosition: 'Em Pé com pegada gola e manga',
    targetPositionOrSub: 'Queda de 2 pontos',
    steps: [
      'Dê um passo com o pé de apoio rente ao pé do oponente.',
      'Empurre o peito e puxe a manga dele transferindo 100% do peso para a perna de trás dele.',
      'Lance a sua perna livre bem alto por fora e ceife a perna dele de trás para frente.',
      'Acompanhe o movimento com o peito colado no dele até a aterrissagem no tatame.'
    ],
    invisibleDetails: [
      'O oponente só cai se o calcanhar da perna ceifada estiver preso ao chão pelo peso do tronco que você impôs.'
    ],
    commonMistakes: [
      'Tentar ceifar sem ter quebrado o equilíbrio do oponente para trás (risco de levar contra-golpe Gaeshi).'
    ],
    counters: ['Osoto Gaeshi (contra-queda ceifando de volta)'],
    followUps: ['100kg direto'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Osoto Gari', 'Judô', 'Ceifa', 'Força', 'Tradicional']
  },

  // ==================== NOVAS DEFESAS, ESCAPES E GUARDAS ====================
  {
    id: 'fuga-hitchhiker-armlock',
    name: 'Fuga do Carona no Armlock (Hitchhiker Escape)',
    category: 'defesa',
    subCategory: 'saida_montada',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'ambos',
    summary: 'A fuga mais plástica e surpreendente contra chaves de braço esticadas. Gira o polegar para fora ("pedindo carona") e corre em direção à cabeça do atacante.',
    startingPosition: 'Defesa de Armlock esticado',
    targetPositionOrSub: 'Cair na Guarda ou Passando a Guarda do Oponente',
    steps: [
      'Gire o polegar da mão presa para baixo e para fora em direção aos seus próprios pés.',
      'Faça a ponte sobre o ombro e corra com os pés em círculo ao redor da cabeça do adversário.',
      'Gire o corpo de bruços e desencaixe o cotovelo da linha do quadril dele.',
      'Suba para o 100kg ou fique de pé na guarda aberta.'
    ],
    invisibleDetails: [
      'O armlock só funciona se o cotovelo dobrar na direção contrária ao polegar; ao girar o polegar, a alavanca é desativada.',
      'A corrida com as pernas deve ser imediata e sem hesitação.'
    ],
    commonMistakes: [
      'Hesitar no meio do giro e permitir que o atacante redirecione o polegar.'
    ],
    counters: ['O atacante cruza as pernas e abraça o bíceps oposto'],
    followUps: ['Passagem de guarda no 100kg'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Hitchhiker', 'Carona', 'Defesa', 'Armlock', 'Fuga']
  },
  {
    id: 'fuga-costas-dois-ombros',
    name: 'Fuga de Costas Colocando os Ombros no Tatame',
    category: 'defesa',
    subCategory: 'saida_costas',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'O princípio fundamental de sobrevivência quando o oponente pega as costas com ganchos: proteger o pescoço e escorregar o quadril para colar as costas no tatame.',
    startingPosition: 'Preso no Controle de Costas com Ganchos',
    targetPositionOrSub: 'Meia Guarda ou Guarda Fechada',
    steps: [
      'Cole o queixo no peito e faça pegada de duas mãos no punho do braço que tenta estrangular (Two-on-One grip).',
      'Escolha o lado de escape e escorregue o quadril por cima do gancho inferior do oponente.',
      'Empurre com os pés no chão para colar as duas escápulas e a nuca no tatame.',
      'Gire o peito e o quadril de frente para o oponente repondo a meia guarda ou guarda fechada.'
    ],
    invisibleDetails: [
      'Nunca tente girar de frente antes de colar os dois ombros no chão; caso contrário o atacante monta diretamente.'
    ],
    commonMistakes: [
      'Soltar a defesa do pescoço para tentar empurrar as pernas.'
    ],
    counters: ['O atacante ajusta o Body Triangle ou monta'],
    followUps: ['Reposição de Meia Guarda'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Costas', 'Fuga', 'Sobrevivência', 'Defesa', 'Ganchos']
  },
  {
    id: 'guarda-aranha-spider',
    name: 'Guarda Aranha (Spider Guard)',
    category: 'guarda',
    subCategory: 'guarda_aberta',
    difficulty: 'intermediario',
    minBelt: 'azul',
    modality: 'gi',
    summary: 'A guarda de controle total de distância com pegadas nas mangas e solas dos pés apoiadas nos bíceps do passador, esticando os braços dele como teias.',
    startingPosition: 'Guarda Aberta com quimono',
    targetPositionOrSub: 'Raspagens, Triângulo, Omoplata',
    steps: [
      'Faça pegadas firmes em quatro dedos nas duas mangas do adversário.',
      'Coloque a sola de um pé no bíceps dele esticando o braço completamente.',
      'O outro pé pode ficar no bíceps oposto ou laçado na perna dele.',
      'Use a pressão constante dos pés para empurrar enquanto suas mãos puxam as mangas.'
    ],
    invisibleDetails: [
      'Mantenha sempre um braço dele bem esticado e o outro recolhido para desequilibrá-lo.',
      'O quadril deve se movimentar de um lado para o outro acompanhando os passos do passador.'
    ],
    commonMistakes: [
      'Deixar os braços do oponente dobrados com os cotovelos colados nas costelas.'
    ],
    counters: ['Torreando Pass empurrando os pés para baixo'],
    followUps: ['Triângulo imediato', 'Omoplata', 'Raspagem Balão'],
    ibjjfLegalityNote: 'Permitido para todas as faixas (Gi).',
    tags: ['Aranha', 'Spider Guard', 'Controle', 'Mangas', 'Romulo Barral']
  },
  {
    id: 'guarda-borboleta-butterfly',
    name: 'Guarda Borboleta (Butterfly Guard)',
    category: 'guarda',
    subCategory: 'guarda_aberta',
    difficulty: 'basico',
    minBelt: 'branca',
    modality: 'ambos',
    summary: 'Uma das guardas mais ofensivas e dinâmicas do Jiu-Jitsu. O atleta senta-se com os dois ganchos dentro das coxas do oponente, pronto para raspar ou armar guilhotinas.',
    startingPosition: 'Guarda Sentada',
    targetPositionOrSub: 'Raspagens com Gancho, Pegada de Costas, Finalizações',
    steps: [
      'Sente-se com as costas eretas sem encostar as escápulas no chão.',
      'Encaixe os dois peitos dos pés por dentro das virilhas do adversário.',
      'Busque a esgrima sob as axilas do oponente ou controle de golas/cabeça.',
      'Mantenha a mobilidade do quadril para deslizar para baixo do centro de gravidade dele.'
    ],
    invisibleDetails: [
      'Quem fica com as costas no chão na guarda borboleta é amassado; a postura sentada com a cabeça à frente dos quadris é a chave da posição.'
    ],
    commonMistakes: [
      'Deitar de costas no tatame antes de encaixar a esgrima e o gancho.'
    ],
    counters: ['Over-Under Pass', 'Body Lock Pass'],
    followUps: ['Hook Sweep', 'Guilhotina', 'Entrada na Guarda X'],
    ibjjfLegalityNote: 'Válido para todas as faixas.',
    tags: ['Borboleta', 'Butterfly', 'Marcelo Garcia', 'Dinâmico', 'No-Gi']
  }
];
