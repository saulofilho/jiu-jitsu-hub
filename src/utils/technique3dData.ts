import { Technique, Technique3DData, Technique3DCameraAngle, Technique3DJointFocalPoint, Technique3DVector } from '../types';

export const STANDARD_CAMERA_ANGLES: Technique3DCameraAngle[] = [
  {
    id: 'isometric',
    label: 'Isométrica 3D Livre',
    description: 'Visão orbital tridimensional livre com rotação em 360° e zoom interativo.',
    icon: '🧭',
    position: [3.5, 2.5, 4.0],
    target: [0, 0.6, 0]
  },
  {
    id: 'top',
    label: 'Vista Superior (Tatame 90°)',
    description: 'Ângulo zenital para avaliar enquadramento de quadril, alinhamento espinhal e fechamento de guarda.',
    icon: '📐',
    position: [0, 5.5, 0.1],
    target: [0, 0.4, 0]
  },
  {
    id: 'side_lever',
    label: 'Lateral / Eixo de Alavanca',
    description: 'Perfil biomecânico para inspeção de fulcro, hiperextensão articular e altura de quadril.',
    icon: '⚖️',
    position: [4.5, 1.2, 0],
    target: [0, 0.5, 0]
  },
  {
    id: 'attacker_pov',
    label: 'Visão do Atacante (1ª Pessoa)',
    description: 'Ponto de vista de quem aplica a técnica, facilitando ajuste de pegadas, golas e quebra de postura.',
    icon: '👁️',
    position: [-1.2, 1.8, 1.5],
    target: [0.5, 0.6, -0.2]
  },
  {
    id: 'defender_pov',
    label: 'Visão do Defensor (Escapes)',
    description: 'Ponto de vista do oponente, evidenciando as linhas de fuga, posturas de bloqueio e contra-ataques.',
    icon: '🛡️',
    position: [1.6, 0.8, -1.8],
    target: [-0.3, 0.7, 0.2]
  },
  {
    id: 'referee',
    label: 'Câmera Mestre / Árbitro',
    description: 'Visão frontal neutra em nível de tatame para análise de pontuação e estabilização de posição.',
    icon: '🥋',
    position: [0, 1.5, 4.8],
    target: [0, 0.6, 0]
  }
];

export function getTechnique3DData(technique: Technique): Technique3DData {
  if (technique.visual3d) {
    return technique.visual3d;
  }

  const techId = technique.id.toLowerCase();
  const cat = technique.category;
  const sub = technique.subCategory;

  // Preset resolver
  if (techId.includes('armlock') || techId.includes('juji') || sub === 'chave_braco') {
    return {
      preset: 'armlock',
      fulcrumName: 'Púbis & Crista Ilíaca do Atacante',
      leverageType: 'Alavanca Interfixa (Classe 1)',
      primaryPressureZone: 'Articulação do Cotovelo & Ligamento Colateral Ulnar',
      biomechanicalSummary: 'O quadril atua como fulcro mecânico entre a força aplicada pelas duas mãos no punho e a resistência do tronco do defensor. A elevação pélvica combinada com a adução dos joelhos bloqueia a rotação do ombro e hiperextende o cotovelo além de 180°.',
      tacticalAdvantage: 'Alavanca corporal de corpo inteiro (tronco + pernas) contra apenas um membro isolado do oponente.',
      cameraAngles: STANDARD_CAMERA_ANGLES,
      phaseNames: ['Quebra de Postura & Domínio de Manga', 'Abertura Angular 90° & Perna Alta', 'Perna Sobre a Cabeça & Pinçamento', 'Elevação Pélvica & Hiperextensão Final'],
      focalPoints: [
        {
          name: 'Ponto de Fulcro (Quadril)',
          anatomyZone: 'Púbis / Fossa Pélvica',
          targetAngle: 'Quadril rente à axila (<2cm)',
          pressureKgEstimate: '85 - 120 kg/cm²',
          dangerLevel: 'critico',
          position: [0, 0.35, 0],
          description: 'Quanto mais colado o quadril na axila, menor o braço de momento da resistência e maior a eficiência mecânica.'
        },
        {
          name: 'Ponto de Força (Punho)',
          anatomyZone: 'Articulação Rádio-Cárpica',
          targetAngle: 'Polegar 90° apontado para o zênite',
          pressureKgEstimate: '35 - 50 kg de tração',
          dangerLevel: 'alto',
          position: [0.3, 0.7, 0.4],
          description: 'A rotação do punho com o polegar para cima garante que o olécrano do cotovelo pressione diretamente contra o osso púbico.'
        },
        {
          name: 'Trava Cervical (Perna da Cabeça)',
          anatomyZone: 'Região Occipital / Nuca',
          targetAngle: 'Calcanhar pesado apontado para baixo',
          pressureKgEstimate: '40 kg de compressão',
          dangerLevel: 'moderado',
          position: [-0.4, 0.55, 0.3],
          description: 'Impede o oponente de sentar ou empilhar (stacking) antes da extensão.'
        }
      ],
      vectorForces: [
        {
          id: 'v_hip_lift',
          label: 'Elevação do Quadril (+Y)',
          type: 'leverage',
          origin: [0, 0.2, 0],
          direction: [0, 1, 0],
          color: '#f59e0b',
          description: 'Vetor de força ascendente gerado pelos glúteos e isquiotibiais.'
        },
        {
          id: 'v_wrist_pull',
          label: 'Tração do Punho (-Y / -Z)',
          type: 'pressure',
          origin: [0.2, 0.8, 0.3],
          direction: [0, -0.8, -0.4],
          color: '#ef4444',
          description: 'Força de tração dos braços e dorsais trazendo o punho colado ao peito.'
        },
        {
          id: 'v_knee_clamp',
          label: 'Adução dos Joelhos (Pinçamento)',
          type: 'trapping',
          origin: [-0.3, 0.45, 0.1],
          direction: [0.6, 0, 0],
          color: '#3b82f6',
          description: 'Trava lateral que anula a rotação interna/externa do ombro do adversário.'
        }
      ]
    };
  }

  if (techId.includes('triang') || techId.includes('sankaku') || (sub === 'estrangulamento' && cat === 'finalizacao' && techId.includes('guarda'))) {
    return {
      preset: 'triangulo',
      fulcrumName: 'Canela Travada na Fossa Poplítea (Estrutura em 4)',
      leverageType: 'Estrangulamento Vascular Bilateral',
      primaryPressureZone: 'Artérias Carótidas Comuns (Esquerda e Direita)',
      biomechanicalSummary: 'A coxa do atacante comprime a carótida de um lado, enquanto o ombro preso do próprio adversário comprime a carótida oposta. O fechamento do triângulo em formato de 4 com dorsiflexão do tornozelo reduz a luz arterial em até 95%, causando hipóxia cerebral em 6-8 segundos.',
      tacticalAdvantage: 'Usa a maior musculatura do corpo humano (membros inferiores) contra a anatomia vascular do pescoço.',
      cameraAngles: STANDARD_CAMERA_ANGLES,
      phaseNames: ['Controle 1 Braço Dentro / 1 Fora', 'Lançamento do Quadril & Cruzamento Alto', 'Ajuste Angular (Corte para 45°-90°)', 'Fechamento em 4 & Tração de Nuca'],
      focalPoints: [
        {
          name: 'Constrição Carotídea Esquerda',
          anatomyZone: 'Triângulo Carotídeo Anterior',
          targetAngle: 'Pressão direta da coxa adutora',
          pressureKgEstimate: '60 - 80 kg/cm²',
          dangerLevel: 'critico',
          position: [-0.1, 0.6, 0.1],
          description: 'Oclusão do fluxo sanguíneo carotídeo esquerdo pela face interna da coxa.'
        },
        {
          name: 'Constrição Carotídea Direita (Ombro)',
          anatomyZone: 'Músculo Deltoide / Tríceps do Oponente',
          targetAngle: 'Braço cruzado na linha média',
          pressureKgEstimate: '55 - 75 kg/cm²',
          dangerLevel: 'critico',
          position: [0.15, 0.58, 0.1],
          description: 'O próprio ombro do adversário é pressionado contra o lado direito do pescoço.'
        },
        {
          name: 'Trava Poplítea (Formato 4)',
          anatomyZone: 'Dobra do Joelho & Peito do Pé',
          targetAngle: '90° de flexão sem sobrepor os dedos',
          pressureKgEstimate: '45 kg de aperto',
          dangerLevel: 'alto',
          position: [-0.25, 0.7, -0.1],
          description: 'O encaixe deve ser na canela e não no peito do pé para evitar hiperextensão do tornozelo do atacante.'
        }
      ],
      vectorForces: [
        {
          id: 'v_adduction',
          label: 'Adução Bilateral das Coxas',
          type: 'pressure',
          origin: [-0.3, 0.6, 0],
          direction: [0.6, 0, 0],
          color: '#ef4444',
          description: 'Fechamento de tesoura aproximando os joelhos para estreitar o espaço carotídeo.'
        },
        {
          id: 'v_head_pull',
          label: 'Flexão Cervical (Tração de Nuca)',
          type: 'posture',
          origin: [0, 0.75, 0.2],
          direction: [0, -0.7, 0.2],
          color: '#f59e0b',
          description: 'Quebra contínua da coluna cervical impossibilitando a postura.'
        },
        {
          id: 'v_angle_cut',
          label: 'Giro Angular do Quadril (90°)',
          type: 'rotation',
          origin: [0, 0.3, 0],
          direction: [0.7, 0, 0.7],
          color: '#8b5cf6',
          description: 'Criação de ângulo perpendicular para alinhar a canela retilínea na nuca.'
        }
      ]
    };
  }

  if (techId.includes('mata-leao') || techId.includes('costas') || techId.includes('hadaka') || techId.includes('choke')) {
    return {
      preset: 'mata_leao',
      fulcrumName: 'Vértice do Cotovelo na Fúrcula Espinhal / Queixo',
      leverageType: 'Estrangulamento Vascular Bilateral',
      primaryPressureZone: 'Carótidas Comuns & Bulbo Carotídeo',
      biomechanicalSummary: 'A ponta do cotovelo alinha com a traqueia (protegendo a cartilagem tireóidea de fraturas enquanto foca a pressão nas artérias carótidas). A mão de apoio empurra a nuca do oponente contra a trava de bíceps com retração escapular profunda.',
      tacticalAdvantage: 'Ataque pelas costas onde o oponente tem zero campo visual e nenhuma alavanca direta de contra-golpe articular.',
      cameraAngles: STANDARD_CAMERA_ANGLES,
      phaseNames: ['Controle de Costas com Ganchos & Seatbelt', 'Deslize de Braço Profundo Sob o Queixo', 'Trava Mão no Bíceps & Mão Atrás da Cabeça', 'Expansão Torácica & Retração Escapular'],
      focalPoints: [
        {
          name: 'Vértice de Estrangulamento (V-Choke)',
          anatomyZone: 'Fossa Antecubital / Bíceps',
          targetAngle: 'Cotovelo alinhado com o esterno',
          pressureKgEstimate: '70 - 90 kg/cm²',
          dangerLevel: 'critico',
          position: [0, 0.85, -0.1],
          description: 'A musculatura do bíceps e do antebraço forma um "V" que aperta simultaneamente as duas carótidas.'
        },
        {
          name: 'Ponto de Pressão Nucal',
          anatomyZone: 'Osso Occipital Posterior',
          targetAngle: 'Mão em faca atrás da cabeça',
          pressureKgEstimate: '30 kg de empuxo para frente',
          dangerLevel: 'alto',
          position: [0, 0.95, -0.25],
          description: 'Elimina qualquer folga empurrando a cabeça do defensor para dentro do V de estrangulamento.'
        }
      ],
      vectorForces: [
        {
          id: 'v_chest_expand',
          label: 'Expansão Torácica Dorsal (+Z)',
          type: 'leverage',
          origin: [0, 0.7, -0.3],
          direction: [0, 0.2, -0.8],
          color: '#f59e0b',
          description: 'Abertura peitoral e retração de escápulas que estica o tronco do oponente.'
        },
        {
          id: 'v_carotid_crush',
          label: 'Compressão Vascular Radial',
          type: 'pressure',
          origin: [0, 0.85, 0],
          direction: [0, -0.3, -0.6],
          color: '#ef4444',
          description: 'Fechamento concêntrico dos braços em torno do pescoço.'
        }
      ]
    };
  }

  if (techId.includes('kimura') || techId.includes('americana') || sub === 'chave_ombro') {
    const isAmericana = techId.includes('americana');
    return {
      preset: isAmericana ? 'americana' : 'kimura',
      fulcrumName: 'Antebraço Transversal no Punho (Trava em 4 / Figura 4)',
      leverageType: 'Alavanca Rotacional / Torque Espiral',
      primaryPressureZone: 'Manguito Rotador, Cápsula Articular Glenoumeral & Úmero',
      biomechanicalSummary: `A trava em quatro cria um braço de alavanca de classe 3 com torque rotacional contínuo sobre o ombro. Ao isolar o cotovelo a 90° e rotacionar o punho (${isAmericana ? 'rotação externa' : 'rotação interna'}), o torque é transmitido diretamente aos ligamentos glenoumerais e tendões do supraespinhal.`,
      tacticalAdvantage: 'Controle bidimensional que anula defesas com as duas mãos e permite transições para montada, costas ou armlock.',
      cameraAngles: STANDARD_CAMERA_ANGLES,
      phaseNames: ['Isolamento do Braço & Pegada de Punho', 'Encaixe da Trava em Figura 4', 'Controle do Cotovelo no Tronco', 'Torque Rotacional & Finalização'],
      focalPoints: [
        {
          name: 'Articulação do Ombro (Torque Máximo)',
          anatomyZone: 'Articulação Glenoumeral & Escápula',
          targetAngle: 'Ângulo de 90° no cotovelo com rotação limite',
          pressureKgEstimate: '55 - 80 Nm de Torque',
          dangerLevel: 'critico',
          position: [0.35, 0.4, 0.2],
          description: 'A rotação sem folga tensiona a cápsula anterior do ombro antes da subluxação.'
        },
        {
          name: 'Trava de Duplo Punho (Figura 4)',
          anatomyZone: 'Punho & Antebraço Distal',
          targetAngle: 'Pegada sem polegar (Monkey Grip)',
          pressureKgEstimate: '45 kg de trava',
          dangerLevel: 'alto',
          position: [0.55, 0.45, 0.4],
          description: 'A pegada em macaco (sem polegar) mantém os dois punhos conectados sem fraqueza na pinça.'
        }
      ],
      vectorForces: [
        {
          id: 'v_shoulder_torque',
          label: isAmericana ? 'Torque Externo do Ombro' : 'Torque Interno Posterior',
          type: 'rotation',
          origin: [0.4, 0.4, 0.2],
          direction: isAmericana ? [0, 0.8, -0.6] : [0, -0.8, 0.6],
          color: '#ef4444',
          description: 'Vetor circular de torção forçando a amplitude anatômica além de 90 graus.'
        },
        {
          id: 'v_elbow_pin',
          label: 'Fixação do Cotovelo ao Tatame',
          type: 'trapping',
          origin: [0.3, 0.35, 0.1],
          direction: [0, -1, 0],
          color: '#3b82f6',
          description: 'Impede o adversário de esticar o braço para escapar da chave.'
        }
      ]
    };
  }

  if (techId.includes('knee') || techId.includes('passagem') || cat === 'passagem') {
    return {
      preset: 'knee_cut',
      fulcrumName: 'Canela Cortando a Coxa & Esgrima Superior',
      leverageType: 'Cisalhamento Articular',
      primaryPressureZone: 'Quadril & Escápulas do Guardeiro Pinadas ao Tatame',
      biomechanicalSummary: 'A passagem knee cut divide o corpo do guardeiro em dois hemisférios. A canela corta a linha média da coxa impedindo a recuperação de guarda, enquanto a esgrima (underhook) profunda e o crossface giram o queixo para o lado oposto, anulando qualquer capacidade de giro do adversário.',
      tacticalAdvantage: 'Gera 3 pontos IBJJF imediatos e estabilização de 100kg com controle de cabeça.',
      cameraAngles: STANDARD_CAMERA_ANGLES,
      phaseNames: ['Abertura de Base & Quebra de Pegadas', 'Corte de Joelho Diagonal Sobre a Coxa', 'Esgrima Profunda & Crossface no Queixo', 'Deslize de Quadril & Estabilização 100kg'],
      focalPoints: [
        {
          name: 'Corte de Joelho (Diagonal Slice)',
          anatomyZone: 'Quadril & Coxa Interna',
          targetAngle: 'Ângulo de 45° rente ao tatame',
          pressureKgEstimate: '75 kg de peso corporal',
          dangerLevel: 'alto',
          position: [0.1, 0.3, 0.2],
          description: 'O joelho deve tocar o tatame o mais próximo possível da axila para matar a meia guarda.'
        },
        {
          name: 'Crossface (Pressão de Ombro na Mandíbula)',
          anatomyZone: 'Mandíbula & Cervical',
          targetAngle: 'Cabeça do oponente virada 80° para longe',
          pressureKgEstimate: '40 kg de pressão contínua',
          dangerLevel: 'moderado',
          position: [-0.1, 0.45, 0.5],
          description: 'Para onde a cabeça do oponente olha, o corpo não consegue girar.'
        }
      ],
      vectorForces: [
        {
          id: 'v_slice',
          label: 'Deslize Diagonal de Joelho',
          type: 'leverage',
          origin: [0.1, 0.4, 0],
          direction: [0.7, -0.3, 0.6],
          color: '#f59e0b',
          description: 'Vetor de penetração abrindo a estrutura de pernas do adversário.'
        },
        {
          id: 'v_underhook',
          label: 'Esgrima Ascendente (+Y)',
          type: 'trapping',
          origin: [-0.2, 0.35, 0.3],
          direction: [0, 0.8, 0.4],
          color: '#3b82f6',
          description: 'Trava a escápula do adversário contra o solo impedindo que ele fique de quatro.'
        }
      ]
    };
  }

  if (cat === 'queda' || techId.includes('single') || techId.includes('double') || techId.includes('queda')) {
    const isDouble = techId.includes('double') || techId.includes('baiana');
    return {
      preset: isDouble ? 'double_leg' : 'single_leg',
      fulcrumName: 'Cabeça nas Costelas / Esterno com Trava Atrás dos Joelhos',
      leverageType: 'Alavanca Inter-resistente (Classe 2)',
      primaryPressureZone: 'Fossas Poplíteas (Joelhos) & Centro de Gravidade Pélvico',
      biomechanicalSummary: 'Mudança explosiva de nível com passo de penetração entre as pernas do oponente. A cabeça posicionada no esterno/costelas atua como ariete empurrando o centro de gravidade para trás, enquanto os braços cortam as pernas (fossas poplíteas) bloqueando a base de apoio.',
      tacticalAdvantage: 'Conquista de 2 pontos IBJJF imediatos caindo já na guarda aberta ou meia guarda ofensiva.',
      cameraAngles: STANDARD_CAMERA_ANGLES,
      phaseNames: ['Mudança de Nível & Quebra de Postura', 'Passo de Penetração com Joelho no Tatame', 'Abraço nas Coxas / Joelhos & Cabeça no Peito', 'Impulso Angular & Queda em Diagonal'],
      focalPoints: [
        {
          name: 'Ponto de Pressão de Cabeça (Ariete)',
          anatomyZone: 'Costelas Flutuantes / Esterno',
          targetAngle: 'Pescoço ereto sem olhar para o chão',
          pressureKgEstimate: '60 kg de força de empuxo',
          dangerLevel: 'alto',
          position: [0, 1.1, 0.2],
          description: 'Manter a cabeça colada e coluna ereta evita guilhotinas e aumenta o vetor de projeção.'
        },
        {
          name: 'Trava nas Pernas',
          anatomyZone: 'Tendões Isquiotibiais / Joelhos',
          targetAngle: 'Braços fechados com as mãos conectadas',
          pressureKgEstimate: '50 kg de tração',
          dangerLevel: 'moderado',
          position: [0, 0.5, 0.1],
          description: 'Puxar os joelhos para perto enquanto a cabeça empurra o peito anula a base.'
        }
      ],
      vectorForces: [
        {
          id: 'v_drive',
          label: 'Impulso de Tronco & Cabeça (+Z)',
          type: 'posture',
          origin: [0, 1.0, 0.1],
          direction: [0, 0.2, 0.9],
          color: '#f59e0b',
          description: 'Projeção linear empurrando o centro de gravidade do oponente para trás.'
        },
        {
          id: 'v_leg_cut',
          label: 'Corte de Joelho / Tração (-Z)',
          type: 'leverage',
          origin: [0, 0.45, 0.3],
          direction: [0, 0, -0.8],
          color: '#ef4444',
          description: 'Retirada da base de sustentação inferior.'
        }
      ]
    };
  }

  if (cat === 'raspagem' || techId.includes('raspagem') || techId.includes('sweep') || techId.includes('tesoura') || techId.includes('pendulo')) {
    return {
      preset: 'berimbolo',
      fulcrumName: 'Perna de Apoio no Quadril / Pêndulo de Gravidade',
      leverageType: 'Alavanca Interpotente (Classe 3)',
      primaryPressureZone: 'Desequilíbrio de Base & Eixo Sagital do Oponente',
      biomechanicalSummary: 'Combina a quebra de postura, domínio de braço/manga e movimento de pêndulo com as pernas para girar o adversário sobre o próprio eixo longitudinal, transferindo o peso corporal e finalizando por cima (2 pontos).',
      tacticalAdvantage: 'Reverte a desvantagem da luta de costas no chão para uma posição dominante por cima.',
      cameraAngles: STANDARD_CAMERA_ANGLES,
      phaseNames: ['Domínio de Manga & Gola Cruzada', 'Desequilíbrio Lateral (Kuzushi)', 'Pêndulo de Perna & Rotação de Quadril', 'Subida na Montada ou 100kg (+2 Pts)'],
      focalPoints: [
        {
          name: 'Eixo de Rotação (Quadril)',
          anatomyZone: 'Pelve & Fêmur',
          targetAngle: 'Giro de 180° sobre o quadril',
          pressureKgEstimate: '70 kg de torque dinâmico',
          dangerLevel: 'moderado',
          position: [0, 0.3, 0],
          description: 'O momento angular do chute pendular catapulta o tronco do oponente.'
        }
      ],
      vectorForces: [
        {
          id: 'v_pendulum',
          label: 'Vetor Pêndulo de Perna',
          type: 'rotation',
          origin: [-0.4, 0.3, 0.2],
          direction: [0.8, 0.4, -0.4],
          color: '#8b5cf6',
          description: 'Chute em arco que cria o desequilíbrio centrífugo.'
        },
        {
          id: 'v_sleeve_pull',
          label: 'Tração de Manga (Anulação de Apoio)',
          type: 'trapping',
          origin: [0.3, 0.6, 0.2],
          direction: [-0.6, -0.4, 0],
          color: '#3b82f6',
          description: 'Impede o adversário de colocar a mão no chão para posturar.'
        }
      ]
    };
  }

  // Fallback Generic 3D Biomechanics Configuration
  return {
    preset: 'generic',
    fulcrumName: 'Ponto de Contato Anatômico & Distribuição de Peso',
    leverageType: 'Alavanca Interfixa (Classe 1)',
    primaryPressureZone: 'Centro de Gravidade & Articulações Principais',
    biomechanicalSummary: 'Aplicação clássica dos princípios de alavanca de Hélio e Carlos Gracie: minimização do esforço muscular através do alinhamento esquelético e maximização da pressão no ponto de fulcro.',
    tacticalAdvantage: 'Execução técnica de alta precisão válida segundo os regulamentos da IBJJF.',
    cameraAngles: STANDARD_CAMERA_ANGLES,
    phaseNames: ['Posicionamento Inicial & Pegadas', 'Quebra de Equilíbrio (Kuzushi)', 'Execução da Alavanca / Pressão', 'Finalização ou Estabilização'],
    focalPoints: [
      {
        name: 'Ponto de Fulcro Central',
        anatomyZone: 'Centro de Massa / Pelve',
        targetAngle: 'Alinhamento ótimo de alavanca',
        pressureKgEstimate: '50 - 75 kg/cm²',
        dangerLevel: 'moderado',
        position: [0, 0.4, 0],
        description: 'Centro mecânico de distribuição de forças.'
      }
    ],
    vectorForces: [
      {
        id: 'v_primary_force',
        label: 'Vetor de Força Principal',
        type: 'leverage',
        origin: [0, 0.4, 0],
        direction: [0, 0.7, 0.7],
        color: '#f59e0b',
        description: 'Direção do esforço biomecânico para conclusão da técnica.'
      }
    ]
  };
}
