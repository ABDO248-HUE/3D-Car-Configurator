
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ========================================
// DOM Elements
// ========================================

const container = document.querySelector(".scene-container");
const sceneElement = document.querySelector("#scene");

const rotateBtn = document.querySelector("#rotateBtn");
const resetBtn = document.querySelector("#resetBtn");

// ========================================
// Three.js Scene
// ========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xfafafa);

// ========================================
// Camera
// ========================================

const camera = new THREE.PerspectiveCamera(
  45,
  sceneElement.clientWidth / sceneElement.clientHeight,
  0.1,
  1000
);

camera.position.set(4, 2.5, 5);

// ========================================
// Renderer
// ========================================

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  sceneElement.clientWidth,
  sceneElement.clientHeight
);

sceneElement.appendChild(renderer.domElement);

// ========================================
// Lights
// ========================================

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  2
);

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(
  0xffffff,
  3
);

directionalLight.position.set(5, 10, 5);

scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(
  0xffffff,
  1.5
);

directionalLight2.position.set(-5, 5, -5);

scene.add(directionalLight2);

// ========================================
// Orbit Controls
// ========================================

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;
controls.enablePan = false;

controls.minDistance = 3;
controls.maxDistance = 10;

controls.target.set(0, 0.5, 0);

controls.update();

// ========================================
// Car Group
// ========================================

const car = new THREE.Group();

scene.add(car);

// ========================================
// Materials
// ========================================

const carBodyMaterials = [];
const wheelMaterials = [];

// ========================================
// Car Color Controls
// ========================================

const colorButtons = document.querySelectorAll(".color");

colorButtons.forEach((button) => {

  button.addEventListener("click", () => {

    // Get selected color
    const color = button.dataset.color;

    // Change car body color
    carBodyMaterials.forEach((material) => {

      material.color.set(color);

    });

    // Change active button
    colorButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    console.log("Car color changed to:", color);

  });

});

// ========================================
// Wheel Color Controls
// ========================================

const wheelButtons =
  document.querySelectorAll(".wheel-options button");

wheelButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const wheelColor =
      button.dataset.wheel;

    let color;

    if (wheelColor === "black") {
      color = "#111111";
    }

    if (wheelColor === "silver") {
      color = "#b8b8b8";
    }

    // Change wheel color
    wheelMaterials.forEach((material) => {

      material.color.set(color);

    });

    // Active button
    wheelButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    console.log(
      "Wheel color changed to:",
      wheelColor
    );

  });

});




// ========================================
// Auto Rotate
// ========================================

let autoRotate = false;

rotateBtn.addEventListener("click", () => {

  autoRotate = !autoRotate;

  controls.autoRotate = autoRotate;

  rotateBtn.textContent = autoRotate
    ? "Stop Rotate"
    : "Auto Rotate";

});

// ========================================
// Lazy Loading
// ========================================

const loader = new GLTFLoader();

let carLoaded = false;

const observer = new IntersectionObserver(
  (entries) => {

    const entry = entries[0];

    if (!entry.isIntersecting || carLoaded) {
      return;
    }

    console.log(
      "3D section is near viewport. Loading car..."
    );

    carLoaded = true;

    loader.load(
      "/models/car.glb",

      // ========================================
      // SUCCESS
      // ========================================

      (gltf) => {

        const model = gltf.scene;

        car.add(model);

        console.log(
          "CAR LOADED!",
          model
        );

        // ========================================
        // Find Body & Wheels
        // ========================================

        model.traverse((child) => {

          if (!child.isMesh) {
            return;
          }

          console.log(
            "PART:",
            child.name
          );

          // ========================================
          // BODY
          // ========================================

          if (
            child.name
              .toUpperCase()
              .includes("_EXT_")
          ) {

            if (child.material) {

              if (!Array.isArray(child.material)) {

                const newMaterial =
                  child.material.clone();

                newMaterial.map = null;
                newMaterial.metalness = 0.7;
                newMaterial.roughness = 0.25;

                child.material = newMaterial;

                carBodyMaterials.push(
                  newMaterial
                );

              } else {

                child.material =
                  child.material.map(
                    (material) => {

                      const newMaterial =
                        material.clone();

                      newMaterial.map = null;
                      newMaterial.metalness = 0.7;
                      newMaterial.roughness = 0.25;

                      carBodyMaterials.push(
                        newMaterial
                      );

                      return newMaterial;
                    }
                  );

              }

            }

          }

          // ========================================
          // WHEELS / RIMS
          // ========================================

          if (
            child.name
              .toUpperCase()
              .includes("WHEEL")
          ) {

            if (child.material) {

              if (!Array.isArray(child.material)) {

                const newMaterial =
                  child.material.clone();

                newMaterial.map = null;
                newMaterial.metalness = 0.8;
                newMaterial.roughness = 0.3;

                child.material = newMaterial;

                wheelMaterials.push(
                  newMaterial
                );

              } else {

                child.material =
                  child.material.map(
                    (material) => {

                      const newMaterial =
                        material.clone();

                      newMaterial.map = null;
                      newMaterial.metalness = 0.8;
                      newMaterial.roughness = 0.3;

                      wheelMaterials.push(
                        newMaterial
                      );

                      return newMaterial;
                    }
                  );

              }

            }

          }

        });

        // ========================================
        // Find Model Size
        // ========================================

        const box =
          new THREE.Box3().setFromObject(model);

        const size =
          box.getSize(
            new THREE.Vector3()
          );

        const center =
          box.getCenter(
            new THREE.Vector3()
          );

        // ========================================
        // Center Model
        // ========================================

        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        // ========================================
        // Automatic Scale
        // ========================================

        const maxDimension =
          Math.max(
            size.x,
            size.y,
            size.z
          );

        const scale =
          4 / maxDimension;

        model.scale.setScalar(scale);

        // ========================================
        // Put Car on Ground
        // ========================================

        model.position.y = 0;

        // ========================================
        // Camera
        // ========================================

        camera.position.set(
          4,
          2.5,
          5
        );

        controls.target.set(
          0,
          0.5,
          0
        );

        controls.update();

        // ========================================
        // Hide Fallback
        // ========================================

        const fallback =
          document.querySelector("#fallback");

        if (fallback) {
          fallback.style.display = "none";
        }

        console.log(
          "3D CAR READY!"
        );

      },

      // ========================================
      // Loading Progress
      // ========================================

      (xhr) => {

        if (xhr.total) {

          const percent =
            Math.round(
              (xhr.loaded / xhr.total) * 100
            );

          console.log(
            `Loading: ${percent}%`
          );

        }

      },

      // ========================================
      // ERROR
      // ========================================

      (error) => {

        console.error(
          "CAR ERROR:",
          error
        );

        carLoaded = false;

      }
    );

    // Stop observing after starting load
    observer.unobserve(container);

  },

  {
    root: null,

    // يبدأ التحميل قبل ظهور الـ section بـ 300px
    rootMargin: "300px",

    threshold: 0
  }
);

// ========================================
// Start Observer
// ========================================

observer.observe(container);

// ========================================
// Resize
// ========================================

window.addEventListener(
  "resize",
  () => {

    const width =
      sceneElement.clientWidth;

    const height =
      sceneElement.clientHeight;

    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
      width,
      height
    );

  }
);

// ========================================
// Reset
// ========================================

resetBtn.addEventListener("click", () => {

  camera.position.set(
    4,
    2.5,
    5
  );

  controls.target.set(
    0,
    0.5,
    0
  );

  controls.autoRotate = false;

  autoRotate = false;

  rotateBtn.textContent = "Auto Rotate";

  controls.update();

});

// ========================================
// FPS Measurement
// ========================================

let fpsFrames = 0;
let fpsLastTime = performance.now();

const fpsDisplay = document.createElement("div");

fpsDisplay.style.position = "absolute";
fpsDisplay.style.top = "15px";
fpsDisplay.style.left = "15px";
fpsDisplay.style.padding = "8px 12px";
fpsDisplay.style.background = "rgba(0, 0, 0, 0.75)";
fpsDisplay.style.color = "#00ff00";
fpsDisplay.style.fontFamily = "monospace";
fpsDisplay.style.fontSize = "14px";
fpsDisplay.style.borderRadius = "6px";
fpsDisplay.style.zIndex = "10";

fpsDisplay.textContent = "FPS: --";

container.appendChild(fpsDisplay);


// ========================================
// Calculate FPS
// ========================================

function measureFPS() {

  fpsFrames++;

  const currentTime = performance.now();

  const elapsed =
    currentTime - fpsLastTime;

  // Update every 1 second
  if (elapsed >= 1000) {

    const fps =
      Math.round(
        (fpsFrames * 1000) / elapsed
      );

    fpsDisplay.textContent =
      `FPS: ${fps}`;

    fpsFrames = 0;

    fpsLastTime = currentTime;

  }

}


// ========================================
// Animation Loop
// ========================================

function animate() {

  requestAnimationFrame(animate);

  controls.update();

  renderer.render(
    scene,
    camera
  );
  measureFPS();
}

animate();

