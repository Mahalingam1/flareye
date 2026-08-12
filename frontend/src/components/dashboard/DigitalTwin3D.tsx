import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSafetyBrain } from '../../context/SafetyBrainContext';
import { RotateCw, ZoomIn, ZoomOut, Flame } from 'lucide-react';

export const DigitalTwin3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { safetyStatus, activeFloor, setActiveFloor } = useSafetyBrain();
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // References for animation and rotation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 520;

    // --- 1. SCENE & ISOMETRIC CAMERA SETUP ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a); // Dark slate background

    // Isometric Angle Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(34, 30, 36);
    camera.lookAt(0, 1.5, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // --- 2. LIGHTING (Match Isometric Studio Lighting) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    dirLight.position.set(30, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(-20, 20, -20);
    scene.add(fillLight);

    // --- 3. MATERIALS PALETTE (Matching Screenshot 3) ---
    const matFloorPink = new THREE.MeshStandardMaterial({ color: 0xfce7f3, roughness: 0.3 }); // Room floor
    const matFloorGray = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 }); // Corridor floor
    const matWallMint = new THREE.MeshStandardMaterial({ color: 0x2dd4bf, roughness: 0.2 });  // Mint green walls
    const matWallYellowTrim = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2 }); // Yellow accent trim
    const matDoorYellow = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 }); // Yellow door frames
    const matGlass = new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.4, roughness: 0.1 });
    
    // Furniture Materials
    const matBedSheetPurple = new THREE.MeshStandardMaterial({ color: 0xa855f7 });
    const matBedSheetBlue = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const matMetal = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    const matCurtainTeal = new THREE.MeshStandardMaterial({ color: 0x0d9488, side: THREE.DoubleSide });
    const matSofaBlue = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
    const matWheelchairBrown = new THREE.MeshStandardMaterial({ color: 0xd97706 });
    const matPlantGreen = new THREE.MeshStandardMaterial({ color: 0x15803d });

    // --- 4. ISOMETRIC HOSPITAL FLOOR PLAN MESH BUILDER ---

    const hospitalGroup = new THREE.Group();
    scene.add(hospitalGroup);

    // Floor Base Slabs
    const floorBaseGeo = new THREE.BoxGeometry(32, 0.4, 24);
    const floorBase = new THREE.Mesh(floorBaseGeo, matFloorGray);
    floorBase.position.set(0, -0.2, 0);
    floorBase.receiveShadow = true;
    hospitalGroup.add(floorBase);

    // Pink Tiled Floor Sections for Rooms
    const roomFloorGeo1 = new THREE.BoxGeometry(14, 0.05, 11);
    const roomFloor1 = new THREE.Mesh(roomFloorGeo1, matFloorPink);
    roomFloor1.position.set(-8, 0.03, 5);
    hospitalGroup.add(roomFloor1);

    const roomFloorGeo2 = new THREE.BoxGeometry(14, 0.05, 11);
    const roomFloor2 = new THREE.Mesh(roomFloorGeo2, matFloorPink);
    roomFloor2.position.set(8, 0.03, 5);
    hospitalGroup.add(roomFloor2);

    // --- WALL HELPER BUILDER ---
    const createWall = (w: number, h: number, d: number, x: number, y: number, z: number, mat = matWallMint) => {
      const wallGeo = new THREE.BoxGeometry(w, h, d);
      const wall = new THREE.Mesh(wallGeo, mat);
      wall.position.set(x, y, z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      hospitalGroup.add(wall);

      // Add Yellow Accent Trim Bar
      const trimGeo = new THREE.BoxGeometry(w + 0.05, 0.4, d + 0.05);
      const trim = new THREE.Mesh(trimGeo, matWallYellowTrim);
      trim.position.set(x, y + 0.8, z);
      hospitalGroup.add(trim);

      return wall;
    };

    // Outer & Room Divider Walls
    createWall(32, 4, 0.6, 0, 2, -11.5); // Back Outer Wall
    createWall(0.6, 4, 23, -15.5, 2, 0); // Left Outer Wall
    createWall(0.6, 4, 23, 15.5, 2, 0);  // Right Outer Wall
    createWall(14, 4, 0.6, -8, 2, -0.5); // Room 204 Front Divider
    createWall(14, 4, 0.6, 8, 2, -0.5);  // Room 205 Front Divider
    createWall(0.6, 4, 11, 0, 2, 5);    // Center Room Partition Wall

    // --- YELLOW DOORS ---
    const createDoor = (x: number, z: number) => {
      const frameGeo = new THREE.BoxGeometry(2.4, 3.4, 0.4);
      const doorFrame = new THREE.Mesh(frameGeo, matDoorYellow);
      doorFrame.position.set(x, 1.7, z);
      hospitalGroup.add(doorFrame);

      const glassGeo = new THREE.BoxGeometry(1.2, 1.4, 0.1);
      const glass = new THREE.Mesh(glassGeo, matGlass);
      glass.position.set(x, 2.2, z);
      hospitalGroup.add(glass);
    };

    createDoor(-8, -0.5); // Room 204 Door
    createDoor(8, -0.5);  // Room 205 Door

    // --- 5. 3D HOSPITAL FURNITURE & MEDICAL EQUIPMENT (Matching Screenshot 3) ---

    // Helper: 3D Hospital Bed
    const createHospitalBed = (x: number, z: number, rotY = 0, sheetMat = matBedSheetPurple) => {
      const bedGroup = new THREE.Group();
      bedGroup.position.set(x, 0, z);
      bedGroup.rotation.y = rotY;

      // Bed Frame Base
      const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 3.8), matWhite);
      frameMesh.position.set(0, 0.5, 0);
      bedGroup.add(frameMesh);

      // Mattress
      const matMesh = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.4, 3.6), sheetMat);
      matMesh.position.set(0, 0.9, 0);
      bedGroup.add(matMesh);

      // Pillow
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 0.8), matWhite);
      pillow.position.set(0, 1.15, -1.2);
      bedGroup.add(pillow);

      // Metal Safety Rails
      const railLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 2.8), matMetal);
      railLeft.position.set(-1.1, 1.2, 0);
      bedGroup.add(railLeft);

      const railRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 2.8), matMetal);
      railRight.position.set(1.1, 1.2, 0);
      bedGroup.add(railRight);

      hospitalGroup.add(bedGroup);
    };

    // Beds in ICU Room 205 (Top Right Room in Screenshot)
    createHospitalBed(11, 3, 0, matBedSheetPurple);
    createHospitalBed(11, 8, 0, matBedSheetBlue);

    // Bed in ICU Room 204 (Bottom Room in Screenshot)
    createHospitalBed(-8, 3, Math.PI / 2, matBedSheetBlue);

    // --- PRIVACY CURTAIN PANELS (Matching Screenshot 3) ---
    const createCurtain = (x: number, z: number) => {
      const curtainMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 3.2), matCurtainTeal);
      curtainMesh.position.set(x, 1.6, z);
      curtainMesh.rotation.y = Math.PI / 2;
      hospitalGroup.add(curtainMesh);

      // Rod
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4), matMetal);
      rod.position.set(x, 3.3, z);
      rod.rotation.z = Math.PI / 2;
      hospitalGroup.add(rod);
    };

    createCurtain(5, 5);
    createCurtain(5, 9);

    // --- 3D WHEELCHAIR (In Hallway) ---
    const wheelchairGroup = new THREE.Group();
    wheelchairGroup.position.set(-12, 0, -5);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 1.2), matWheelchairBrown);
    seat.position.set(0, 0.8, 0);
    wheelchairGroup.add(seat);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.2), matWheelchairBrown);
    backrest.position.set(0, 1.4, -0.5);
    wheelchairGroup.add(backrest);

    const wheelLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1), matMetal);
    wheelLeft.position.set(-0.7, 0.6, 0);
    wheelLeft.rotation.z = Math.PI / 2;
    wheelchairGroup.add(wheelLeft);

    const wheelRight = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1), matMetal);
    wheelRight.position.set(0.7, 0.6, 0);
    wheelRight.rotation.z = Math.PI / 2;
    wheelchairGroup.add(wheelRight);

    hospitalGroup.add(wheelchairGroup);

    // --- 3D EMERGENCY STRETCHER (In Hallway) ---
    const stretcherGroup = new THREE.Group();
    stretcherGroup.position.set(-5, 0, -7);

    const stretcherBed = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 3.6), matWhite);
    stretcherBed.position.set(0, 0.7, 0);
    stretcherGroup.add(stretcherBed);

    const stretcherFrame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 3.7), matMetal);
    stretcherFrame.position.set(0, 0.4, 0);
    stretcherGroup.add(stretcherFrame);

    hospitalGroup.add(stretcherGroup);

    // --- 3D BLUE WAITING SOFA & ARMCHAIR (In Hallway & Rooms) ---
    const sofaMesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 1.4), matSofaBlue);
    sofaMesh.position.set(-2, 0.6, -5);
    hospitalGroup.add(sofaMesh);

    const armchairMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 1.4), matWhite);
    armchairMesh.position.set(2, 0.6, 3);
    hospitalGroup.add(armchairMesh);

    // --- 3D POTTED PLANT ---
    const plantGroup = new THREE.Group();
    plantGroup.position.set(-6, 0, -10);

    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 1.2), matWhite);
    pot.position.set(0, 0.6, 0);
    plantGroup.add(pot);

    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), matPlantGreen);
    leaves.position.set(0, 1.8, 0);
    plantGroup.add(leaves);

    hospitalGroup.add(plantGroup);

    // --- 6. LIVE FIRE HAZARD NODE (Room 204) ---
    let fireLight: THREE.PointLight | null = null;
    let fireMesh: THREE.Mesh | null = null;

    if (safetyStatus === 'CRITICAL') {
      const fireGeo = new THREE.SphereGeometry(1.4, 16, 16);
      const fireMat = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true });
      fireMesh = new THREE.Mesh(fireGeo, fireMat);
      fireMesh.position.set(-8, 2, 3);
      hospitalGroup.add(fireMesh);

      fireLight = new THREE.PointLight(0xef4444, 4, 15);
      fireLight.position.set(-8, 2.5, 3);
      hospitalGroup.add(fireLight);
    }

    // --- 7. ANIMATION LOOP & MOUSE ORBIT DRAGGING ---
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Flickering Fire effect
      if (fireMesh && fireLight) {
        fireMesh.rotation.y += 0.04;
        fireLight.intensity = 3 + Math.sin(Date.now() * 0.01) * 1.5;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse Dragging to Orbit 360° around 3D Hospital
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaMove = {
        x: e.clientX - previousMousePositionRef.current.x,
        y: e.clientY - previousMousePositionRef.current.y
      };

      hospitalGroup.rotation.y += deltaMove.x * 0.008;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);

      if (mountRef.current && domElement) {
        mountRef.current.removeChild(domElement);
      }
    };
  }, [safetyStatus, activeFloor]);

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.85);
      setZoomLevel((prev) => +(prev + 0.15).toFixed(2));
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.15);
      setZoomLevel((prev) => +(prev - 0.15).toFixed(2));
    }
  };

  return (
    <div className="bg-stone-900/95 border-2 border-stone-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl backdrop-blur-md">
      
      {/* Header controls & Floor Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black text-white font-heading">🏢 3D ISOMETRIC HOSPITAL INTERIOR TWIN</h2>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-xs border border-cyan-500/40">
              THREE.JS ISOMETRIC
            </span>
          </div>
          <p className="text-sm font-extrabold text-stone-300">
            3D Isometric Hospital view with real beds, wheelchairs, stretchers, yellow doors, and privacy curtains
          </p>
        </div>

        {/* Floor Selector Buttons */}
        <div className="flex items-center bg-stone-950 p-1.5 rounded-2xl border-2 border-stone-800">
          {[1, 2, 3].map((fNum) => (
            <button
              key={fNum}
              onClick={() => setActiveFloor(fNum)}
              className={`px-4 py-2 rounded-xl font-black text-sm transition-all cursor-pointer ${
                activeFloor === fNum
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg border border-orange-400/50'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Floor {fNum} {fNum === 2 && ' (ICU)'}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div ref={mountRef} className="w-full h-[500px] sm:h-[560px] bg-stone-950 rounded-3xl border-2 border-stone-800 overflow-hidden relative shadow-2xl cursor-grab active:cursor-grabbing">
        
        {/* Overlay 3D Controls Legend */}
        <div className="absolute top-4 left-4 bg-stone-900/90 backdrop-blur-md p-3.5 rounded-2xl border-2 border-stone-800 text-xs font-extrabold space-y-1.5 text-stone-200 z-10 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400">
            <RotateCw className="w-4 h-4 animate-spin" />
            <span>Click & Drag Mouse to Orbit 360°</span>
          </div>
          <div>Active Selected: Floor {activeFloor} (ICU & Cardiac)</div>
          {safetyStatus === 'CRITICAL' && (
            <div className="text-red-400 font-black animate-pulse flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>🔴 Room 204 3D Thermal Fire Active</span>
            </div>
          )}
        </div>

        {/* 3D Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border-2 border-stone-800 z-10 shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-orange-400" />
          </button>
          <span className="px-2 text-xs font-black text-white">{zoomLevel}x</span>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-orange-400" />
          </button>
        </div>

        {/* 3D Visual Badges */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[11px] font-black z-10">
          <span className="px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
            🛏️ 3D ICU BEDS
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
            🧑‍🦽 WHEELCHAIRS
          </span>
          <span className="px-3 py-1 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
            🚪 YELLOW DOORS
          </span>
        </div>

      </div>

    </div>
  );
};
