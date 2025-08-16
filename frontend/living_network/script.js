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
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersectedIndex = null;

        this.backendUrl = 'https://your-backend-url.up.railway.app'; // <-- REPLACE WITH YOUR RAILWAY URL

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
            const [narrativeResponse, graphResponse, nodeVertResponse, nodeFragResponse, filamentVertResponse, filamentFragResponse] = await Promise.all([
                fetch(`${this.backendUrl}/world/narrative`),
                fetch(`${this.backendUrl}/world/graph`),
                fetch('./shaders/node.vert'),
                fetch('./shaders/node.frag'),
                fetch('./shaders/filament.vert'),
                fetch('./shaders/filament.frag')
            ]);
            this.narrativeData = await narrativeResponse.json();
            this.graphData = await graphResponse.json();
            this.nodeVertexShader = await nodeVertResponse.text();
            this.nodeFragmentShader = await nodeFragResponse.text();
            this.filamentVertexShader = await filamentVertResponse.text();
            this.filamentFragmentShader = await filamentFragResponse.text();
            console.log("Data and shaders loaded successfully");
        } catch (error) {
            console.error("Failed to load scene data or shaders:", error);
        }
    }

    createNetwork() {
        if (!this.graphData) return;

        // Create nodes
        const nodeGeometry = new THREE.BufferGeometry();
        const positions = [];
        const indices = [];
        this.graphData.nodes.forEach((nodeData, i) => {
            positions.push(nodeData.position.x, nodeData.position.y, nodeData.position.z);
            indices.push(i);
        });
        nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        nodeGeometry.setAttribute('a_index', new THREE.Float32BufferAttribute(indices, 1));

        const nodeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_size: { value: 15.0 * window.devicePixelRatio },
                u_color: { value: new THREE.Color(0xffc75f) },
                u_hovered: { value: -1.0 },
                u_selected: { value: -1.0 }
            },
            vertexShader: this.nodeVertexShader,
            fragmentShader: this.nodeFragmentShader,
            transparent: true,
            depthTest: false,
        });

        const points = new THREE.Points(nodeGeometry, nodeMaterial);
        points.userData.nodes = this.graphData.nodes;
        this.nodes.add(points);
        this.scene.add(this.nodes);


        // Create filaments
        const filamentMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: new THREE.Color(0x4f2a9f) }
            },
            vertexShader: this.filamentVertexShader,
            fragmentShader: this.filamentFragmentShader,
            transparent: true,
        });

        const nodePositionMap = new Map(this.graphData.nodes.map(node => [node.id, node.position]));

        this.graphData.filaments.forEach(filamentData => {
            const startPos = nodePositionMap.get(filamentData.from);
            const endPos = nodePositionMap.get(filamentData.to);
            if (startPos && endPos) {
                const points = [new THREE.Vector3(startPos.x, startPos.y, startPos.z), new THREE.Vector3(endPos.x, endPos.y, endPos.z)];
                const filamentGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const filamentLine = new THREE.Line(filamentGeometry, filamentMaterial);
                this.filaments.add(filamentLine);
            }
        });
        this.scene.add(this.filaments);
    }

    runAnimationTimeline() {
        console.log("Animation timeline started.");
        if (!this.narrativeData) return;

        const openingStanzas = this.narrativeData.stanzas.filter(s => s.beat === 'OPENING');
        let totalDelay = 500;

        openingStanzas.forEach(stanzaData => {
            const stanza = document.createElement('p');
            stanza.className = 'text-layer__stanza';
            this.textLayer.appendChild(stanza);

            setTimeout(() => {
                this.typewriterEffect(stanza, stanzaData.text, 50);
            }, totalDelay);

            totalDelay += (stanzaData.text.length * 50) + 1000; // Add a pause between stanzas
        });
    }

    typewriterEffect(element, text, speed) {
        let i = 0;
        element.innerHTML = ""; // Clear the element
        element.style.opacity = 1;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const elapsedTime = this.clock.getElapsedTime();

        // Update shader uniforms
        this.nodes.children.forEach(node => {
            node.material.uniforms.u_time.value = elapsedTime;
        });
        this.filaments.children.forEach(filament => {
            filament.material.uniforms.u_time.value = elapsedTime;
        });

        // Gentle rotation of the whole network
        this.nodes.rotation.y += 0.0005;
        this.filaments.rotation.y += 0.0005;

        this.updateRaycaster();

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
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('click', this.handleClick.bind(this));

        const closeButton = document.getElementById('close-panel');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                const narrativePanel = document.getElementById('narrative-panel');
                if (narrativePanel) {
                    narrativePanel.classList.remove('visible');
                }
            });
        }
    }

    handleMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    handleClick() {
        if (this.intersectedIndex !== null) {
            this.nodes.children[0].material.uniforms.u_selected.value = this.intersectedIndex;
            const nodeData = this.graphData.nodes[this.intersectedIndex];
            const narrative = this.narrativeData.stanzas.find(s => s.node_id === nodeData.id);

            if (narrative) {
                const narrativePanel = document.getElementById('narrative-panel');
                const narrativeContent = document.getElementById('narrative-content');
                if (narrativePanel && narrativeContent) {
                    narrativeContent.innerHTML = `<h3>${narrative.title}</h3><p>${narrative.text}</p>`;
                    narrativePanel.classList.add('visible');
                }
            }
        }
    }

    updateRaycaster() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.params.Points.threshold = 0.1;
        const intersects = this.raycaster.intersectObjects(this.nodes.children, true);
    
        if (intersects.length > 0) {
            const intersection = intersects[0];
            const index = intersection.index;
            this.intersectedIndex = index;
            this.nodes.children[0].material.uniforms.u_hovered.value = index;
    
            const nodeData = this.graphData.nodes[index];
            if (nodeData) {
                document.body.style.cursor = 'pointer';
                const tooltip = document.getElementById('tooltip');
                tooltip.textContent = nodeData.title;
                tooltip.style.left = `${(this.mouse.x * 0.5 + 0.5) * window.innerWidth + 15}px`;
                tooltip.style.top = `${(-this.mouse.y * 0.5 + 0.5) * window.innerHeight + 15}px`;
                tooltip.style.opacity = 1;
            }
        } else {
            this.intersectedIndex = null;
            this.nodes.children[0].material.uniforms.u_hovered.value = -1.0;
            document.body.style.cursor = 'default';
            const tooltip = document.getElementById('tooltip');
            tooltip.style.opacity = 0;
        }
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    new LivingNetwork();
});
