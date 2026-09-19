let dragging = false;
let pinchStartDistance = 0;
let initialScale = 2;

const objeto = document.querySelector("#objeto").object3D;
const modelo = document.querySelector("#modelo");

/* AUTO AJUSTE AO CARREGAR MODELO */
modelo.addEventListener("model-loaded", () => {

    objeto.position.set(0, 0, 0);
    objeto.rotation.set(0, THREE.Math.degToRad(90), 0);

    modelo.setAttribute("scale", { x: 2, y: 2, z: 2 });

    const mesh = modelo.getObject3D("mesh");
    if (!mesh) return;

    const box = new THREE.Box3().setFromObject(mesh);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const desiredSize = 3;
    const scaleFactor = desiredSize / maxDim;

    modelo.setAttribute("scale", {
        x: scaleFactor,
        y: scaleFactor,
        z: scaleFactor
    });
});

/* FUNÇÃO DE DISTÂNCIA DO PINCH */
function getPinchDistance(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

/* TOUCH START */
window.addEventListener("touchstart", e => {
    if (e.touches.length === 2) {
        pinchStartDistance = getPinchDistance(e);
        initialScale = modelo.getAttribute("scale").x;
    } else if (e.touches.length === 1) {
        dragging = true;
    }
});

/* TOUCH END */
window.addEventListener("touchend", () => dragging = false);

/* TOUCH MOVE */
window.addEventListener("touchmove", e => {

    // PINCH ZOOM
    if (e.touches.length === 2) {
        const pinchDistance = getPinchDistance(e);
        const scaleFactor = pinchDistance / pinchStartDistance;
        const newScale = initialScale * scaleFactor;

        modelo.setAttribute("scale", {
            x: newScale,
            y: newScale,
            z: newScale
        });

        return;
    }

    // DRAG COM UM DEDO (MOVER NO MARCADOR)
    if (!dragging || e.touches.length !== 1) return;

    const touch = e.touches[0];

    const xNorm = (touch.clientX / window.innerWidth) * 2 - 1;
    const yNorm = (touch.clientY / window.innerHeight) * 2 - 1;

    objeto.position.x = xNorm * 1.5;
    objeto.position.z = yNorm * -1.5;
});

/* ROT Y */
document.querySelector("#rotateLeft").addEventListener("click", () => {
    objeto.rotation.y += THREE.Math.degToRad(5);
});
document.querySelector("#rotateRight").addEventListener("click", () => {
    objeto.rotation.y -= THREE.Math.degToRad(5);
});

/* MOVE Y */
document.querySelector("#moveUp").addEventListener("click", () => {
    objeto.position.y += 0.2;
});
document.querySelector("#moveDown").addEventListener("click", () => {
    objeto.position.y -= 0.2;
});


/* TILT X */
document.querySelector("#tiltForward").addEventListener("click", () => {
    objeto.rotation.x += THREE.Math.degToRad(5);
});
document.querySelector("#tiltBackward").addEventListener("click", () => {
    objeto.rotation.x -= THREE.Math.degToRad(5);
});

/* ROLL Z */
document.querySelector("#rollRight").addEventListener("click", () => {
    objeto.rotation.z += THREE.Math.degToRad(5);
});
document.querySelector("#rollLeft").addEventListener("click", () => {
    objeto.rotation.z -= THREE.Math.degToRad(5);
});

/* ZOOM DESKTOP */
document.querySelector("#zoomIn").addEventListener("click", () => {
    let scale = modelo.getAttribute("scale").x;
    scale += scale * 0.15;
    modelo.setAttribute("scale", { x: scale, y: scale, z: scale });
});

document.querySelector("#zoomOut").addEventListener("click", () => {
    let scale = modelo.getAttribute("scale").x;
    scale -= scale * 0.15;
    if (scale < 0.0001) scale = 0.0001;
    modelo.setAttribute("scale", { x: scale, y: scale, z: scale });
});

/* TROCA DE MODELO */
const modelButtons = document.querySelectorAll(".model-btn");

modelButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        modelButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const newModelURL = btn.dataset.src;

        modelo.setAttribute("src", newModelURL);

        objeto.rotation.set(0, THREE.Math.degToRad(-90), 0);
        objeto.position.set(0, 0, 0);
        modelo.setAttribute("scale", { x: 2, y: 2, z: 2 });
    });
});