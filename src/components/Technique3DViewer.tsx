import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Eye,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  Activity,
  Flame,
  Shield,
  Zap,
  Video,
  Box,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Technique, Technique3DData } from '../types';
import { getTechnique3DData, STANDARD_CAMERA_ANGLES } from '../utils/technique3dData';

interface Technique3DViewerProps {
  technique: Technique;
  compact?: boolean;
  onOpenFullscreen?: () => void;
}

export const Technique3DViewer: React.FC<Technique3DViewerProps> = ({
  technique,
  compact = false,
  onOpenFullscreen
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const data: Technique3DData = getTechnique3DData(technique);

  // States
  const [activeAngleId, setActiveAngleId] = useState<string>('isometric');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0.65); // 0 to 1
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showFocalPoints, setShowFocalPoints] = useState<boolean>(true);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [selectedFocalPointIndex, setSelectedFocalPointIndex] = useState<number | null>(0);
  const [viewMode, setViewMode] = useState<'3d' | 'diagram'>('3d');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References for Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const meshesRef = useRef<{
    attackerGroup: THREE.Group;
    defenderGroup: THREE.Group;
    vectorsGroup: THREE.Group;
    focalGroup: THREE.Group;
    skeletonGroup: THREE.Group;
    attackerLimbs: Record<string, THREE.Mesh | THREE.Group>;
    defenderLimbs: Record<string, THREE.Mesh | THREE.Group>;
    focalMarkers: THREE.Mesh[];
  }>({
    attackerGroup: new THREE.Group(),
    defenderGroup: new THREE.Group(),
    vectorsGroup: new THREE.Group(),
    focalGroup: new THREE.Group(),
    skeletonGroup: new THREE.Group(),
    attackerLimbs: {},
    defenderLimbs: {},
    focalMarkers: []
  });

  // Orbit controls state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({
    radius: 5.5,
    theta: Math.PI / 4, // horizontal angle
    phi: Math.PI / 3    // vertical angle
  });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0.5, 0));
  const targetCameraPosRef = useRef(new THREE.Vector3(3.5, 2.5, 4.0));
  const isTransitioningCameraRef = useRef(false);

  // Active step calculation based on progress (0 -> phaseNames.length - 1)
  const currentPhaseIndex = Math.min(
    Math.floor(progress * data.phaseNames.length),
    data.phaseNames.length - 1
  );

  // Build Procedural Mannequins and Tatame Environment
  useEffect(() => {
    if (!mountRef.current || viewMode !== '3d') return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b); // Zinc-950
    scene.fog = new THREE.FogExp2(0x09090b, 0.08);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.5, 2.5, 4.0);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // ==================== LIGHTING ====================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xfbbf24, 2.5, 20, Math.PI / 4, 0.4);
    mainSpot.position.set(3, 7, 4);
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    scene.add(mainSpot);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xa855f7, 0.9, 10);
    fillLight.position.set(0, 4, -2);
    scene.add(fillLight);

    // ==================== TATAME MAT DOJO ====================
    const dojoGroup = new THREE.Group();

    // Floor base
    const matGeo = new THREE.BoxGeometry(8, 0.1, 8);
    const matMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Dark mat
      roughness: 0.8,
      metalness: 0.1
    });
    const matMesh = new THREE.Mesh(matGeo, matMat);
    matMesh.position.y = -0.05;
    matMesh.receiveShadow = true;
    dojoGroup.add(matMesh);

    // Center Combat Zone Area (Red/Amber Border)
    const combatZoneGeo = new THREE.RingGeometry(1.6, 1.68, 48);
    const combatZoneMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide
    });
    const combatZoneMesh = new THREE.Mesh(combatZoneGeo, combatZoneMat);
    combatZoneMesh.rotation.x = -Math.PI / 2;
    combatZoneMesh.position.y = 0.002;
    dojoGroup.add(combatZoneMesh);

    // Grid Lines on Mat
    const gridHelper = new THREE.GridHelper(8, 16, 0x3f3f46, 0x27272a);
    gridHelper.position.y = 0.001;
    dojoGroup.add(gridHelper);

    scene.add(dojoGroup);

    // ==================== MANNEQUIN CREATION HELPERS ====================
    const createSegment = (
      geo: THREE.BufferGeometry,
      color: number,
      castShadow = true,
      wireframe = false
    ) => {
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.45,
        metalness: 0.15,
        wireframe
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      return mesh;
    };

    // Groups
    const attackerGroup = new THREE.Group();
    const defenderGroup = new THREE.Group();
    const vectorsGroup = new THREE.Group();
    const focalGroup = new THREE.Group();
    const skeletonGroup = new THREE.Group();

    scene.add(attackerGroup);
    scene.add(defenderGroup);
    scene.add(vectorsGroup);
    scene.add(focalGroup);
    scene.add(skeletonGroup);

    // Colors: Attacker = Royal Blue Gi (0x1e40af), Belt = Black/Amber (0xf59e0b)
    // Defender = White / Light Gray Gi (0xe4e4e7), Belt = Dark (0x09090b)
    const ATTACKER_COLOR = 0x2563eb;
    const ATTACKER_GI_COLLAR = 0x1d4ed8;
    const DEFENDER_COLOR = 0xe2e8f0;
    const DEFENDER_TRIM = 0x94a3b8;
    const SKIN_COLOR = 0xd97706;

    // Helper: Build an articulated character
    const buildFighter = (isAttacker: boolean) => {
      const fighterGroup = new THREE.Group();
      const giColor = isAttacker ? ATTACKER_COLOR : DEFENDER_COLOR;
      const trimColor = isAttacker ? ATTACKER_GI_COLLAR : DEFENDER_TRIM;

      // Pelvis / Hips
      const pelvis = createSegment(new THREE.CylinderGeometry(0.2, 0.18, 0.22, 12), giColor);
      fighterGroup.add(pelvis);

      // Spine / Chest
      const chest = createSegment(new THREE.BoxGeometry(0.38, 0.42, 0.24), giColor);
      chest.position.y = 0.32;
      fighterGroup.add(chest);

      // Belt knot
      const belt = createSegment(
        new THREE.TorusGeometry(0.22, 0.035, 8, 16),
        isAttacker ? 0x09090b : 0xd97706
      );
      belt.rotation.x = Math.PI / 2;
      belt.position.y = 0.12;
      fighterGroup.add(belt);

      // Head
      const headGroup = new THREE.Group();
      const head = createSegment(new THREE.SphereGeometry(0.13, 16, 16), SKIN_COLOR);
      headGroup.add(head);
      // Nose indicator for gaze direction
      const nose = createSegment(new THREE.ConeGeometry(0.03, 0.08, 8), 0xb45309);
      nose.rotation.x = Math.PI / 2;
      nose.position.set(0, 0, 0.14);
      headGroup.add(nose);
      headGroup.position.y = 0.64;
      fighterGroup.add(headGroup);

      // Limbs: Arms & Legs
      const leftArm = new THREE.Group();
      const upperLArm = createSegment(new THREE.CylinderGeometry(0.065, 0.055, 0.28, 8), trimColor);
      upperLArm.position.y = -0.14;
      leftArm.add(upperLArm);
      const lowerLArm = createSegment(new THREE.CylinderGeometry(0.055, 0.045, 0.26, 8), SKIN_COLOR);
      lowerLArm.position.y = -0.38;
      leftArm.add(lowerLArm);
      leftArm.position.set(-0.25, 0.45, 0);
      fighterGroup.add(leftArm);

      const rightArm = new THREE.Group();
      const upperRArm = createSegment(new THREE.CylinderGeometry(0.065, 0.055, 0.28, 8), trimColor);
      upperRArm.position.y = -0.14;
      rightArm.add(upperRArm);
      const lowerRArm = createSegment(new THREE.CylinderGeometry(0.055, 0.045, 0.26, 8), SKIN_COLOR);
      lowerRArm.position.y = -0.38;
      rightArm.add(lowerRArm);
      rightArm.position.set(0.25, 0.45, 0);
      fighterGroup.add(rightArm);

      const leftLeg = new THREE.Group();
      const upperLLeg = createSegment(new THREE.CylinderGeometry(0.09, 0.075, 0.38, 8), giColor);
      upperLLeg.position.y = -0.19;
      leftLeg.add(upperLLeg);
      const lowerLLeg = createSegment(new THREE.CylinderGeometry(0.075, 0.06, 0.36, 8), giColor);
      lowerLLeg.position.y = -0.52;
      leftLeg.add(lowerLLeg);
      leftLeg.position.set(-0.14, -0.08, 0);
      fighterGroup.add(leftLeg);

      const rightLeg = new THREE.Group();
      const upperRLeg = createSegment(new THREE.CylinderGeometry(0.09, 0.075, 0.38, 8), giColor);
      upperRLeg.position.y = -0.19;
      rightLeg.add(upperRLeg);
      const lowerRLeg = createSegment(new THREE.CylinderGeometry(0.075, 0.06, 0.36, 8), giColor);
      lowerRLeg.position.y = -0.52;
      rightLeg.add(lowerRLeg);
      rightLeg.position.set(0.14, -0.08, 0);
      fighterGroup.add(rightLeg);

      return {
        root: fighterGroup,
        pelvis,
        chest,
        headGroup,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg
      };
    };

    const attackerLimbs = buildFighter(true);
    const defenderLimbs = buildFighter(false);

    attackerGroup.add(attackerLimbs.root);
    defenderGroup.add(defenderLimbs.root);

    // ==================== VECTOR FORCES & 3D ARROWS ====================
    const vectorMeshes: THREE.Object3D[] = [];
    data.vectorForces.forEach((v) => {
      const vGroup = new THREE.Group();
      const arrowDir = new THREE.Vector3(...v.direction).normalize();
      const length = 0.65;
      const arrowColor = parseInt(v.color.replace('#', '0x'), 16) || 0xf59e0b;

      const arrowHelper = new THREE.ArrowHelper(
        arrowDir,
        new THREE.Vector3(0, 0, 0),
        length,
        arrowColor,
        0.2,
        0.12
      );
      vGroup.add(arrowHelper);
      vGroup.position.set(...v.origin);
      vectorsGroup.add(vGroup);
      vectorMeshes.push(vGroup);
    });

    // ==================== FOCAL POINTS GLOW MARKERS ====================
    const focalMarkers: THREE.Mesh[] = [];
    data.focalPoints.forEach((fp, index) => {
      const markerGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const markerMat = new THREE.MeshStandardMaterial({
        color: fp.dangerLevel === 'critico' ? 0xef4444 : fp.dangerLevel === 'alto' ? 0xf59e0b : 0x3b82f6,
        emissive: fp.dangerLevel === 'critico' ? 0xef4444 : fp.dangerLevel === 'alto' ? 0xf59e0b : 0x3b82f6,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(...fp.position);

      // Pulsing glow ring
      const ringGeo = new THREE.RingGeometry(0.1, 0.14, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: markerMat.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      marker.add(ring);

      focalGroup.add(marker);
      focalMarkers.push(marker);
    });

    meshesRef.current = {
      attackerGroup,
      defenderGroup,
      vectorsGroup,
      focalGroup,
      skeletonGroup,
      attackerLimbs: {
        root: attackerLimbs.root,
        pelvis: attackerLimbs.pelvis,
        chest: attackerLimbs.chest,
        headGroup: attackerLimbs.headGroup,
        leftArm: attackerLimbs.leftArm,
        rightArm: attackerLimbs.rightArm,
        leftLeg: attackerLimbs.leftLeg,
        rightLeg: attackerLimbs.rightLeg
      },
      defenderLimbs: {
        root: defenderLimbs.root,
        pelvis: defenderLimbs.pelvis,
        chest: defenderLimbs.chest,
        headGroup: defenderLimbs.headGroup,
        leftArm: defenderLimbs.leftArm,
        rightArm: defenderLimbs.rightArm,
        leftLeg: defenderLimbs.leftLeg,
        rightLeg: defenderLimbs.rightLeg
      },
      focalMarkers
    };

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
    };
  }, [technique.id, data, viewMode]);

  // Update Poses according to Technique Preset and Progress/Phase
  const applyPresetPose = useCallback(
    (timeValue: number, currentProg: number) => {
      const { attackerLimbs, defenderLimbs } = meshesRef.current;
      if (!attackerLimbs.root || !defenderLimbs.root) return;

      const p = currentProg;
      const breathing = Math.sin(timeValue * 2) * 0.03;
      const preset = data.preset;

      if (preset === 'armlock') {
        // Defender lying flat on back
        defenderLimbs.root.position.set(0, 0.12, 0);
        defenderLimbs.root.rotation.set(-Math.PI / 2, 0, 0);
        defenderLimbs.rightArm.rotation.set(0, 0, 0.4 + p * 0.3); // Arm extended up
        defenderLimbs.leftArm.rotation.set(0, 0, -0.6);

        // Attacker sitting across chest with legs clamping
        attackerLimbs.root.position.set(0.1, 0.28 + p * 0.15 + breathing, 0.1);
        attackerLimbs.root.rotation.set(0, Math.PI / 2, 0);

        // Attacker legs over head and chest
        attackerLimbs.leftLeg.rotation.set(1.4, 0, 0.4);
        attackerLimbs.rightLeg.rotation.set(1.4, 0, -0.4);

        // Attacker arms pulling wrist
        attackerLimbs.leftArm.rotation.set(-0.8 - p * 0.3, 0.3, 0);
        attackerLimbs.rightArm.rotation.set(-0.8 - p * 0.3, -0.3, 0);
        attackerLimbs.headGroup.rotation.set(0.2, 0, 0);
      } else if (preset === 'triangulo') {
        // Attacker lying on back
        attackerLimbs.root.position.set(0, 0.12, 0);
        attackerLimbs.root.rotation.set(-Math.PI / 2, 0, 0);
        // Triangle legs locking around neck
        attackerLimbs.leftLeg.rotation.set(1.2, 0.4, 0.8 + p * 0.2);
        attackerLimbs.rightLeg.rotation.set(1.5, -0.6, -0.3);

        // Defender trapped inside guard
        defenderLimbs.root.position.set(0, 0.38 - p * 0.12 + breathing, 0.3);
        defenderLimbs.root.rotation.set(-0.8 + p * 0.3, 0, 0);
        defenderLimbs.rightArm.rotation.set(-0.4, 0.5, 0); // Trapped arm crossed
        defenderLimbs.leftArm.rotation.set(0.6, -0.4, 0); // Arm outside
        defenderLimbs.headGroup.rotation.set(-0.4 - p * 0.2, 0, 0);
      } else if (preset === 'mata_leao') {
        // Defender sitting/kneeling forward
        defenderLimbs.root.position.set(0, 0.35, 0);
        defenderLimbs.root.rotation.set(0.2, 0, 0);
        defenderLimbs.headGroup.rotation.set(-0.3 - p * 0.15, 0, 0);

        // Attacker attached behind back with hooks
        attackerLimbs.root.position.set(0, 0.42 + breathing, -0.28);
        attackerLimbs.root.rotation.set(0.1, 0, 0);

        // Attacker arms choking with bicep lock
        attackerLimbs.rightArm.rotation.set(-1.4, 0.8, -0.2);
        attackerLimbs.leftArm.rotation.set(-1.3, -0.7, 0.3);

        // Hooks in
        attackerLimbs.leftLeg.rotation.set(1.1, 0.6, 0);
        attackerLimbs.rightLeg.rotation.set(1.1, -0.6, 0);
      } else if (preset === 'kimura' || preset === 'americana') {
        // Defender on back in side control / guard
        defenderLimbs.root.position.set(0, 0.12, 0);
        defenderLimbs.root.rotation.set(-Math.PI / 2, 0, 0);
        defenderLimbs.rightArm.rotation.set(0, 0, preset === 'americana' ? 1.6 + p * 0.3 : -1.2 - p * 0.3);

        // Attacker in side control
        attackerLimbs.root.position.set(-0.35, 0.35 + breathing, 0.1);
        attackerLimbs.root.rotation.set(0.2, 1.2, 0);
        attackerLimbs.leftArm.rotation.set(-1.1, 0.3, 0.5);
        attackerLimbs.rightArm.rotation.set(-1.0, -0.2, -0.4);
      } else if (preset === 'knee_cut') {
        // Defender on back in half guard
        defenderLimbs.root.position.set(0, 0.12, 0);
        defenderLimbs.root.rotation.set(-Math.PI / 2, 0, 0.3);

        // Attacker slicing knee through
        attackerLimbs.root.position.set(0.25 - p * 0.3, 0.42 + breathing, 0.15);
        attackerLimbs.root.rotation.set(0.4, 0.8, 0);
        attackerLimbs.leftLeg.rotation.set(1.3, 0.6, 0);
        attackerLimbs.rightLeg.rotation.set(0.3, -0.3, 0.8);
      } else if (preset === 'single_leg' || preset === 'double_leg') {
        // Attacker driving forward into takedown
        attackerLimbs.root.position.set(0, 0.65 - p * 0.3, 0.5 - p * 0.4);
        attackerLimbs.root.rotation.set(0.7 + p * 0.3, 0, 0);
        attackerLimbs.leftArm.rotation.set(-1.2, 0.3, 0);
        attackerLimbs.rightArm.rotation.set(-1.2, -0.3, 0);

        // Defender upright getting taken down
        defenderLimbs.root.position.set(0, 0.85 - p * 0.5, 0 - p * 0.3);
        defenderLimbs.root.rotation.set(-0.2 - p * 0.8, 0, 0);
      } else {
        // Generic dynamic grapple pose
        defenderLimbs.root.position.set(0, 0.15, 0);
        defenderLimbs.root.rotation.set(-Math.PI / 2, 0, 0);
        attackerLimbs.root.position.set(0.15, 0.45 + breathing, 0.1);
        attackerLimbs.root.rotation.set(0.3, 0.5, 0);
      }
    },
    [data.preset]
  );

  // Main Render Loop
  useEffect(() => {
    if (viewMode !== '3d') return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update progress if playing
      if (isPlaying) {
        setProgress((prev) => {
          const next = prev + delta * 0.35 * playbackSpeed;
          return next > 1 ? 0 : next;
        });
      }

      // Auto-rotation around Tatame
      if (isAutoRotate && !isDraggingRef.current && !isTransitioningCameraRef.current) {
        sphericalRef.current.theta += delta * 0.4;
      }

      // Smooth camera position interpolation
      if (cameraRef.current) {
        const { radius, theta, phi } = sphericalRef.current;
        const targetX = cameraTargetRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
        const targetY = cameraTargetRef.current.y + radius * Math.cos(phi);
        const targetZ = cameraTargetRef.current.z + radius * Math.sin(phi) * Math.cos(theta);

        if (isTransitioningCameraRef.current) {
          cameraRef.current.position.lerp(targetCameraPosRef.current, 0.08);
          if (cameraRef.current.position.distanceTo(targetCameraPosRef.current) < 0.05) {
            isTransitioningCameraRef.current = false;
          }
        } else {
          cameraRef.current.position.set(targetX, targetY, targetZ);
        }

        cameraRef.current.lookAt(cameraTargetRef.current);
      }

      // Apply procedural skeletal kinematics
      applyPresetPose(currentTime / 1000, progress);

      // Pulse vector arrows and focal point rings
      const timeSec = currentTime / 1000;
      meshesRef.current.focalMarkers.forEach((m, idx) => {
        const ring = m.children[0] as THREE.Mesh;
        if (ring) {
          const s = 1 + Math.sin(timeSec * 4 + idx) * 0.2;
          ring.scale.set(s, s, s);
        }
      });

      // Visibility toggles
      meshesRef.current.vectorsGroup.visible = showVectors;
      meshesRef.current.focalGroup.visible = showFocalPoints;

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [viewMode, isPlaying, playbackSpeed, isAutoRotate, showVectors, showFocalPoints, progress, applyPresetPose]);

  // Camera preset selector
  const selectCameraAngle = (angle: (typeof STANDARD_CAMERA_ANGLES)[0]) => {
    setActiveAngleId(angle.id);
    targetCameraPosRef.current.set(...angle.position);
    cameraTargetRef.current.set(...angle.target);
    isTransitioningCameraRef.current = true;

    // Calculate spherical coords for orbit continuity
    const diff = new THREE.Vector3(...angle.position).sub(new THREE.Vector3(...angle.target));
    const radius = diff.length();
    const phi = Math.acos(Math.max(-1, Math.min(1, diff.y / radius)));
    const theta = Math.atan2(diff.x, diff.z);

    sphericalRef.current = { radius, theta, phi };
  };

  // Mouse / Touch Orbit Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    sphericalRef.current.theta -= deltaX * 0.008;
    sphericalRef.current.phi = Math.max(
      0.1,
      Math.min(Math.PI / 2 - 0.05, sphericalRef.current.phi - deltaY * 0.008)
    );

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    setActiveAngleId('free');
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(
      2.0,
      Math.min(10.0, sphericalRef.current.radius + e.deltaY * 0.005)
    );
  };

  return (
    <div
      id={`viewer-3d-${technique.id}`}
      className={`relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl border-amber-500/50' : 'w-full'
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-zinc-900/90 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <span>Simulador 3D de Mecânica & Alavanca</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              360° Interativo
            </span>
          </h3>
        </div>

        {/* View mode toggle (3D WebGL vs Diagrama Biomecânico) */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewMode === '3d'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Tatame 3D</span>
          </button>
          <button
            onClick={() => setViewMode('diagram')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'diagram'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Biomecânica</span>
          </button>
        </div>
      </div>

      {/* Main Canvas & 3D Stage */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] bg-zinc-950">
        {viewMode === '3d' ? (
          <>
            {/* Three.js Canvas Container */}
            <div
              ref={mountRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              className="w-full h-full min-h-[380px] sm:min-h-[440px] cursor-grab active:cursor-grabbing select-none"
            />

            {/* In-Canvas Floating Legend (Fighters Gi identification) */}
            <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1.5 bg-zinc-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-zinc-800/80 text-[11px]">
              <div className="flex items-center gap-2 text-zinc-200">
                <span className="w-3 h-3 rounded-full bg-blue-600 border border-blue-400" />
                <span className="font-bold">Atacante (Kimono Azul)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="w-3 h-3 rounded-full bg-zinc-200 border border-zinc-400" />
                <span className="font-medium">Defensor (Kimono Branco)</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400 pt-1 border-t border-zinc-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-[10px]">Fulcro: {data.fulcrumName}</span>
              </div>
            </div>

            {/* Floating Top-Right Tools (Reset / Auto-rotate / Fullscreen) */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-xl border border-zinc-800/80">
              <button
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                title={isAutoRotate ? 'Pausar Auto-Rotação' : 'Ativar Giro 360° Contínuo'}
                className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                  isAutoRotate ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white bg-zinc-800'
                }`}
              >
                <Compass className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sphericalRef.current = { radius: 5.5, theta: Math.PI / 4, phi: Math.PI / 3 };
                  setActiveAngleId('isometric');
                }}
                title="Resetar Câmera"
                className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {onOpenFullscreen ? (
                <button
                  onClick={onOpenFullscreen}
                  title="Expandir Tela Cheia"
                  className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-800 transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? 'Reduzir' : 'Tela Cheia'}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-800 transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* HUD Layer Toggles (Floating Bottom-Left) */}
            <div className="absolute bottom-16 left-3 flex flex-wrap items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-xl border border-zinc-800/80 text-[11px]">
              <button
                onClick={() => setShowVectors(!showVectors)}
                className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  showVectors ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-zinc-500'
                }`}
              >
                <ArrowUpRight className="w-3 h-3" />
                <span>Vetores</span>
              </button>
              <button
                onClick={() => setShowFocalPoints(!showFocalPoints)}
                className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  showFocalPoints ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-zinc-500'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Pontos de Tensão</span>
              </button>
            </div>
          </>
        ) : (
          /* Biomechanics & Force Diagram Mode */
          <div className="p-5 sm:p-8 space-y-6 max-h-[460px] overflow-y-auto">
            {/* Top Stat Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Tipo de Alavanca</span>
                <p className="text-sm font-black text-amber-400 mt-0.5">{data.leverageType}</p>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Ponto de Fulcro</span>
                <p className="text-sm font-black text-white mt-0.5">{data.fulcrumName}</p>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Zona sob Pressão</span>
                <p className="text-sm font-black text-red-400 mt-0.5">{data.primaryPressureZone}</p>
              </div>
            </div>

            {/* Kinetic Biomechanical Summary */}
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Princípio Físico Fundamental
              </h4>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                {data.biomechanicalSummary}
              </p>
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>Vantagem Mecânica: <strong className="text-emerald-400 font-semibold">{data.tacticalAdvantage}</strong></span>
              </div>
            </div>

            {/* Focal Points Anatomy Table */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-red-400" /> Tensão Articular & Pontos de Alavanca
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.focalPoints.map((fp, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedFocalPointIndex(i)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedFocalPointIndex === i
                        ? 'bg-zinc-900 border-amber-500/60 shadow-md shadow-amber-500/10'
                        : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            fp.dangerLevel === 'critico'
                              ? 'bg-red-500 animate-pulse'
                              : fp.dangerLevel === 'alto'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        {fp.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          fp.dangerLevel === 'critico'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {fp.pressureKgEstimate}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">{fp.description}</p>
                    <div className="mt-2 text-[10px] text-amber-300 font-semibold">
                      Ângulo Alvo: {fp.targetAngle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Camera Angles Quick Switcher Ribbon */}
      {viewMode === '3d' && (
        <div className="px-4 py-2.5 bg-zinc-900/90 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold uppercase text-zinc-400 whitespace-nowrap shrink-0 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Ângulos de Câmera:</span>
          </span>
          {STANDARD_CAMERA_ANGLES.map((ang) => (
            <button
              key={ang.id}
              onClick={() => selectCameraAngle(ang)}
              title={ang.description}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeAngleId === ang.id
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-zinc-950 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <span>{ang.icon}</span>
              <span>{ang.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step Motion Scrubber & Playback Controls */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800 space-y-3">
        {/* Current phase indicator */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-black text-[11px]">
              Fase {currentPhaseIndex + 1} de {data.phaseNames.length}
            </span>
            <span className="font-bold text-white">
              {data.phaseNames[currentPhaseIndex] || 'Execução Técnica'}
            </span>
          </div>
          <span className="text-zinc-400 font-mono text-[11px]">
            {Math.round(progress * 100)}% de Finalização
          </span>
        </div>

        {/* Timeline Slider */}
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={(e) => {
              setIsPlaying(false);
              setProgress(parseFloat(e.target.value));
            }}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
          />
        </div>

        {/* Playback Buttons Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pausar' : 'Reproduzir Movimento'}</span>
            </button>

            {/* Speed selector */}
            <div className="flex items-center bg-zinc-950 p-0.5 rounded-xl border border-zinc-800 text-[11px]">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    playbackSpeed === spd
                      ? 'bg-zinc-800 text-amber-400'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <span>💡 Clique e arraste para orbitar 360° | Scroll para Zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};
