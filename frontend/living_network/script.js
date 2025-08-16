import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

class LivingNetwork {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('webgl-canvas'),
            antialias: true,
            alpha: true
        });

        this.textLayer = document.getElementById('text-layer');

        this.narrativeData = null;
        this.graphData = null;
        this.nodes = new THREE.Group();
        this.filaments = new THREE.Group();
        this.clock = new THREE.Clock();

        this.init();
    }

    async init() {
        this.setupRenderer();
        this.setupCamera();
        await this.loadData();
        this.createNetwork();
        this.addEventListeners();
        this.animate();

        // Start the narrative flow
        this.runAnimationTimeline();
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    setupCamera() {
        this.camera.position.z = 5;
    }

    async loadData() {
        try {
            const [narrativeResponse, graphResponse] = await Promise.all([
                fetch('./assets/data/narrative.json'),
                fetch('./assets/data/graph.json')
            ]);
            this.narrativeData = await narrativeResponse.json();
            this.graphData = await graphResponse.json();
            console.log("Data loaded successfully:", this.narrativeData, this.graphData);
        } catch (error) {
            console.error("Failed to load scene data:", error);
        }
    }

    createNetwork() {
        if (!this.graphData) return;

        // Create nodes
        const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xffc75f });

        this.graphData.nodes.forEach(nodeData => {
            const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
            nodeMesh.position.set(nodeData.position.x, nodeData.position.y, nodeData.position.z);
            nodeMesh.userData = nodeData;
            this.nodes.add(nodeMesh);
        });
        this.scene.add(this.nodes);

        // Create filaments
        const filamentMaterial = new THREE.LineBasicMaterial({ color: 0x4f2a9f, transparent: true, opacity: 0.5 });
        const nodeMap = new Map(this.nodes.children.map(node => [node.userData.id, node]));

        this.graphData.filaments.forEach(filamentData => {
            const startNode = nodeMap.get(filamentData.from);
            const endNode = nodeMap.get(filamentData.to);
            if (startNode && endNode) {
                const points = [startNode.position, endNode.position];
                const filamentGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const filamentLine = new THREE.Line(filamentGeometry, filamentMaterial);
                this.filaments.add(filamentLine);
            }
        });
        this.scene.add(this.filaments);
    }

    runAnimationTimeline() {
        // This will be driven by the timeline from the tech plan
        console.log("Animation timeline started.");
        if (!this.narrativeData) return;

        const openingStanzas = this.narrativeData.stanzas.filter(s => s.beat === 'OPENING');
        let delay = 500;

        openingStanzas.forEach(stanzaData => {
            const stanza = document.createElement('p');
            stanza.className = 'text-layer__stanza';
            stanza.textContent = stanzaData.text;
            this.textLayer.appendChild(stanza);
            
            setTimeout(() => {
                stanza.style.opacity = 1;
            }, delay);

            delay += 3000; // Stagger the appearance of each line
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const elapsedTime = this.clock.getElapsedTime();

        // Implement Node Pulse animation
        this.nodes.children.forEach(node => {
            const pulsePhase = node.userData.pulsePhase || 0;
            const pulseSpeed = 0.5; // Controls the speed of the pulse

            // Sine wave for smooth oscillation (from 0 to 1)
            const pulseFactor = (Math.sin(elapsedTime * pulseSpeed + pulsePhase * Math.PI * 2) + 1) / 2;

            // Animate scale (e.g., between 1.0 and 1.15)
            const scale = 1.0 + pulseFactor * 0.15;
            node.scale.set(scale, scale, scale);

            // Animate color intensity (e.g., from 70% to 100% brightness)
            const baseColor = new THREE.Color(0xffc75f);
            const intensity = 0.7 + pulseFactor * 0.3;
            node.material.color.set(baseColor).multiplyScalar(intensity);
        });

        // Gentle rotation of the whole network
        this.nodes.rotation.y += 0.0005;
        this.filaments.rotation.y += 0.0005;

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    addEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LivingNetwork();
});
