import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let camera, scene, renderer, stats, object, loader;
const clock = new THREE.Clock();

let mixer; // Mixer para controlar las animaciones
let actions = {}; // Objeto para almacenar las acciones de animación
let activeAction, previousAction; // Variables para manejar la acción activa y anterior

let moveSpeed = 70; // Velocidad de movimiento del objeto
const moveDirection = new THREE.Vector3(); // Vector de dirección de movimiento
const keysPressed = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    ' ': false // Estado de la barra espaciadora
};

const collidableObjects = []; // Array de objetos con los que se puede colisionar

// Inicialización de la escena, cámara, luces y eventos
init();
function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Configuración de la cámara
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(100, 200, 300);

    // Configuración de la escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1f62c2); // Color de fondo azul vibrante
    scene.fog = new THREE.Fog(0x061a3b, 600, 1200); // Neblina azul

    // Configuración de las luces
    const hemiLight = new THREE.HemisphereLight(0xff9900, 0x003399, 1); // Luces de hemisferio naranja y azul
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1); // Luz direccional blanca
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 1000;
    dirLight.shadow.camera.bottom = -1000;
    dirLight.shadow.camera.left = -1000;
    dirLight.shadow.camera.right = 1000;

    // Aumentar la resolución del mapa de sombras
    dirLight.shadow.mapSize.width = 4000;
    dirLight.shadow.mapSize.height = 4000;

    // Configurar la distancia de las sombras
    dirLight.shadow.camera.near = 0.8;
    dirLight.shadow.camera.far = 5000;
    scene.add(dirLight);

    // Configuración del suelo tipo circo
    const circleGeometry = new THREE.CircleGeometry(2000, 64); // Geometría de círculo con más segmentos
    const circleMaterial = new THREE.MeshPhongMaterial({ color: 0xffcc00, depthWrite: false }) // Material amarillo
    const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    circleMesh.rotation.x = -Math.PI / 2;
    circleMesh.receiveShadow = true;
    scene.add(circleMesh);

    // Crear un patrón de colores alternos para el suelo
    const floorSize = 2000;
    const tileSize = 100;
    const floor = new THREE.Group();
    for (let x = -floorSize / 2; x < floorSize / 2; x += tileSize) {
        for (let z = -floorSize / 2; z < floorSize / 2; z += tileSize) {
            const tileGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
            const tileMaterial = new THREE.MeshPhongMaterial({ color: (x + z) % 200 === 0 ? 0xffcc00 : 0xff3300, side: THREE.DoubleSide });
            const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
            tileMesh.position.set(x + tileSize / 2, 0, z + tileSize / 2);
            tileMesh.rotation.x = -Math.PI / 2;
            tileMesh.receiveShadow = true;
            floor.add(tileMesh);
        }
    }
    scene.add(floor);

    // Cargador de modelos
    loader = new FBXLoader();
    loadAsset('Stand', 'Stand');
    loadAsset('Walk', 'Walk');
    loadAsset('Jump', 'Jump');
    loadAsset('Run', 'Run');
    loadAsset('Left', 'Left');
    loadAsset('Right', 'Right');
    loadAsset('Back', 'Back');
    loadAsset('Dancing', 'Dancing');
    loadAsset('Fall', 'Fall');
    loadAsset('Dance2', 'Dance2');
    loadAsset('RunRight', 'RunRight');
    loadAsset('RunLeft', 'RunLeft');
    loadAsset('RunBack', 'RunBack');


    // Configuración del renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Tipo de mapa de sombras
    container.appendChild(renderer.domElement);

    // Controles de la cámara
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();

    controls.minDistance = 50;
    controls.maxDistance = 1200;

    // Añadir figuras aleatorias representativas de un circo con sombras
    const ballGeometry = new THREE.SphereGeometry(20, 32, 50); // Geometría de bola con más segmentos
    const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xf7f5f5, flatShading: true });

    const balloonGeometry = new THREE.SphereGeometry(24, 32, 50); // Geometría de globo con más segmentos
    const stringGeometry = new THREE.CylinderGeometry(0.5, 1, 50, 50);
    const balloonMaterial = new THREE.MeshPhongMaterial({ color: 0xba2020, flatShading: true });
    const stringMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    for (let i = 0; i < 20; i++) {
        const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
        ballMesh.position.x = Math.random() * 1600 - 800;
        ballMesh.position.y = 20; // Asegúrate de que la pelota esté en el suelo
        ballMesh.position.z = Math.random() * 1600 - 800;
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        scene.add(ballMesh);
        collidableObjects.push(ballMesh); // Añadir a la lista de objetos colisionables

        const balloonMesh = new THREE.Mesh(balloonGeometry, balloonMaterial);
        balloonMesh.position.x = Math.random() * 1600 - 800;
        balloonMesh.position.y = Math.random() * 150 + 60; // Asegúrate de que el globo esté flotando
        balloonMesh.position.z = Math.random() * 1600 - 800;
        balloonMesh.castShadow = true;
        balloonMesh.receiveShadow = true;
        scene.add(balloonMesh);
        collidableObjects.push(balloonMesh); // Añadir a la lista de objetos colisionables

        const stringMesh = new THREE.Mesh(stringGeometry, stringMaterial);
        stringMesh.position.x = balloonMesh.position.x;
        stringMesh.position.y = balloonMesh.position.y - 25; // Colocar la cuerda debajo del globo
        stringMesh.position.z = balloonMesh.position.z;
        stringMesh.castShadow = true;
        stringMesh.receiveShadow = true;
        scene.add(stringMesh);
    }

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Estadísticas de rendimiento
    stats = new Stats();
    container.appendChild(stats.dom);
}

// Función para cargar modelos y sus animaciones
function loadAsset(assetName, actionName) {
    loader.load('models/fbx/' + assetName + '.fbx', function (group) {
        group.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        if (!mixer) {
            mixer = new THREE.AnimationMixer(group);
        }

        // Configuración de la acción de animación
        const action = mixer.clipAction(group.animations[0]);
        action.clampWhenFinished = true; // Mantener la última posición
        if (actionName === 'Jump') {
            action.setLoop(THREE.LoopOnce); // Repetir la animación solo una vez para el salto
            action.onComplete = () => { // Callback cuando la animación de salto termina
                if (!keysPressed['w'] && !keysPressed['a'] && !keysPressed['s'] && !keysPressed['d'] && !keysPressed[' ']) {
                    activateAction(actions['Stand']);
                }
                keysPressed[' '] = false; // Resetear el estado de la barra espaciadora
            };
        } else {
            action.setLoop(THREE.LoopRepeat); // Repetir la animación en loop para otras acciones
        }
        actions[actionName] = action;

        if (!object) {
            object = group;
            scene.add(object);
            activateAction(actions['Stand']);
        }
    });
}

// Función para mover el objeto según las teclas presionadas
function moveObject(delta) {
    const moveX = (keysPressed['d'] ? 1 : 0) - (keysPressed['a'] ? 1 : 0);
    const moveZ = (keysPressed['s'] ? 1 : 0) - (keysPressed['w'] ? 1 : 0);

    if (moveX !== 0 || moveZ !== 0) {
        moveDirection.set(moveX, 0, moveZ).normalize();
        const previousPosition = object.position.clone(); // Guardar la posición anterior

        object.position.addScaledVector(moveDirection, moveSpeed * delta);
        object.updateMatrixWorld(); // Actualizar la matriz del objeto para la detección de colisiones

        checkCollisions();

        // Si hay colisión, revertir la posición del objeto
        if (actions['Fall'].isRunning()) {
            object.position.copy(previousPosition);
            object.updateMatrixWorld(); // Actualizar la matriz del objeto a la posición anterior
        }
    }
}

// Función para verificar colisiones
// Función para verificar colisiones y hacer que el objeto colisionado desaparezca
// Función para verificar colisiones y hacer que el objeto colisionado desaparezca
// Función para verificar colisiones y hacer que el objeto colisionado desaparezca
// Función para verificar colisiones y hacer que el objeto colisionado desaparezca
function checkCollisions() {
    const objectBox = new THREE.Box3().setFromObject(object).expandByScalar(-0.5); // Reducir el tamaño del objeto para colisiones

    for (let i = 0; i < collidableObjects.length; i++) {
        const obj = collidableObjects[i];
        const objBox = new THREE.Box3().setFromObject(obj);
        
        // Verificar colisión entre el objeto controlado y los objetos colisionables
        if (objectBox.intersectsBox(objBox)) {
            // Si el objeto colisionado es un globo o su círculo, eliminar el globo y su cuerda
            if (obj.type === 'Mesh' && (obj.geometry.type === 'SphereGeometry' || obj.geometry.type === 'CircleGeometry')) {
                // Buscar el palito asociado al globo
                const string = scene.getObjectByName(obj.name + "_string"); 
                if (string) {
                    scene.remove(string); // Eliminar el palito
                }
                
                scene.remove(obj); // Eliminar el globo o su círculo
                collidableObjects.splice(i, 1);
                
                // Activar la animación de 'Fall' al colisionar
                activateAction(actions['Fall']); 
                
                return;
            }
        }
    }
}





// Función para activar una animación
function activateAction(action) {
    if (action !== activeAction) {
        previousAction = activeAction;
        activeAction = action;

        if (previousAction) {
            previousAction.fadeOut(0.5);
        }

        activeAction.reset().fadeIn(0.5).play();
    } else {
        activeAction.reset().play(); // Permitir repetir la misma animación
    }
}

// Manejo de la redimensión de la ventana
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
    const key = event.key.toLowerCase();
    if (!keysPressed[key]) {
        keysPressed[key] = true;

        // Combinaciones de teclas
        if (keysPressed['s'] && keysPressed['z']) {
            activateAction(actions['Run']);
            moveSpeed = 200;
        } else if (keysPressed['w'] && keysPressed['z']) {
            activateAction(actions['RunBack']);
            moveSpeed = 200;
        } else if (keysPressed['a'] && keysPressed['z']) {
            activateAction(actions['RunLeft']);
            moveSpeed = 200;
        } else if (keysPressed['d'] && keysPressed['z']) {
            activateAction(actions['RunRight']);
            moveSpeed = 200;
        } else {
            switch (key) {
                case 'w':
                    activateAction(actions['Back']);
                    moveSpeed = 70;
                    break;
                case 'a':
                    activateAction(actions['Left']);
                    moveSpeed = 70;

                    break;
                case 's':
                    activateAction(actions['Walk']);
                    moveSpeed = 70;

                    break;
                case 'd':
                    activateAction(actions['Right']);
                    moveSpeed = 70;

                    break;
                case ' ':
                    activateAction(actions['Jump']);
                    moveSpeed = 90;
                    break;
                case 'g':
                    activateAction(actions['Dancing']);
                    break;
                case 'h':
                    activateAction(actions['Dance2']);
                    break;
                case 'control':
                    keysPressed['z'] = true;
                    break;
            }
        }
    }
}


// Manejo de teclas liberadas
function onKeyUp(event) {
    const key = event.key.toLowerCase();
    keysPressed[key] = false;

    if (key !== ' ' && key !== 'control' &&
        !keysPressed['w'] && !keysPressed['a'] && !keysPressed['s'] && !keysPressed['d'] &&
        !actions['Jump'].isRunning() && !actions['Dancing'].isRunning() && !actions['Fall'].isRunning() && !actions['Dance2'].isRunning()) {
        activateAction(actions['Stand']);
    }
}



// Función de animación
function animate() {
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta); // Actualizar el mixer de animaciones

    moveObject(delta); // Mover el objeto según las teclas presionadas

    renderer.render(scene, camera); // Renderizar la escena

    stats.update(); // Actualizar estadísticas de rendimiento
}
