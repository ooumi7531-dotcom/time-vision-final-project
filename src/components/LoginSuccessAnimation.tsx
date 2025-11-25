import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LoginSuccessAnimationProps {
  onComplete: () => void;
}

const LoginSuccessAnimation: React.FC<LoginSuccessAnimationProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const checkmarkGeometry = new THREE.TorusGeometry(1.5, 0.3, 16, 100);
    const checkmarkMaterial = new THREE.MeshPhongMaterial({
      color: 0xD4AF37,
      emissive: 0xD4AF37,
      emissiveIntensity: 0.5,
      shininess: 100,
    });
    const checkmark = new THREE.Mesh(checkmarkGeometry, checkmarkMaterial);
    scene.add(checkmark);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xD4AF37,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xD4AF37, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      checkmark.rotation.x += 0.01;
      checkmark.rotation.y += 0.02;

      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
      checkmarkGeometry.dispose();
      checkmarkMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-luxury-obsidian transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div ref={containerRef} className="absolute inset-0" />

      <div className={`relative z-10 text-center space-y-6 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}>
        <h1 className="text-6xl md:text-7xl font-playfair font-bold text-luxury-gold animate-pulse">
          Thank you for logging in!
        </h1>
        <p className="text-2xl text-white">
          Welcome to your exclusive luxury experience
        </p>
      </div>
    </div>
  );
};

export default LoginSuccessAnimation;
