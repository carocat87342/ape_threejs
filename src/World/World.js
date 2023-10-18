import { loadBirds } from "./components/birds/birds.js";
import { loadBuildings } from "./components/buildings/buildings.js";
import { createCamera } from "./components/camera.js";
import { createAxesHelper, createGridHelper } from "./components/helpers.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";

import { createControls } from "./systems/controls.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/Loop.js";
import { TWEEN } from "tween";
import { AmmoPhysics } from "three/addons/physics/AmmoPhysics.js";

import * as THREE from "three";

import { PointerLockControls } from "../../vendor/three/examples/jsm/controls/Pointerlockcontrols.js";

// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let controls;
let renderer;
let css3drenderer;
let scene;
let loop;

let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let vertex = new THREE.Vector3();
let color = new THREE.Color();

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

var collidableMeshList = [];

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    const {
      renderer,
      css3drenderer
    } = createRenderer();

    const onKeyDown = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward = true;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft = true;
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward = true;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight = true;
          break;
      }
    };

    const onKeyUp = (event) => {
      console.log(event.keyCode);
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward = false;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft = false;
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward = false;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight = false;
          break;
      }
    };

    document.addEventListener("touchstart", function () {
      console.log("touch");
      moveForward = true;
    });

    document.addEventListener("touchend", function () {
      console.log("end");
      moveForward = false;
    });

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const lightGroup = createLights();

    scene.add(lightGroup);

    const resizer = new Resizer(container, camera, renderer);

    scene.add(createAxesHelper(), createGridHelper());
  }

  async init() {
    // const {
    //   personCube,
    //   controls
    // } = await createControls(camera, renderer.domElement);

    controls = new PointerLockControls(camera, document.body);

    controls.tick = (delta) => {
      const time = performance.now();

      if (controls.isLocked === true) {
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward)
          velocity.z -= direction.z * 1500.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 1500.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        // personCube.position.set(
        //   controls.getObject().position.x,
        //   controls.getObject().position.y,
        //   controls.getObject().position.z
        // );

        // const firstBB = new THREE.Box3().setFromObject(personCube);
        // const secondBB = new THREE.Box3().setFromObject(collidableMeshList[0]);

        // var collision = firstBB.intersectsBox(secondBB);
      }

      prevTime = time;
    };

    const blocker = document.getElementById("blocker");
    const instructions = document.getElementById("instructions");

    instructions.addEventListener("click", () => {
      controls.lock();
    });

    controls.addEventListener("lock", () => {
      instructions.style.display = "none";
      blocker.style.display = "none";
    });

    controls.addEventListener("unlock", () => {
      blocker.style.display = "block";
      instructions.style.display = "";
    });

    controls.getObject().position.x = 0;
    controls.getObject().position.y = 120;
    controls.getObject().position.z = 0;

    // controls.getObject().position.x = 400;
    // controls.getObject().position.y = 830;
    // controls.getObject().position.z = 1100;

    const control_target = new THREE.Vector3();
    // control_target.x = 0;
    // control_target.y = 120;
    // control_target.z = 300;
    control_target.x = controls.getObject().position.x ;
    control_target.y = controls.getObject().position.y;
    control_target.z = controls.getObject().position.z + 100;

    controls.getObject().lookAt(control_target);

    console.log(controls.getObject());
    scene.add(controls.getObject());

    // let physics = await AmmoPhysics();

    // scene.add(controls.getObject(), personCube);

    // physics.addMesh(personCube);
    // const floor = new THREE.Mesh(
    //   new THREE.BoxGeometry(10000, 10, 10000),
    //   new THREE.MeshLambertMaterial({
    //     color: 0x111111
    //   })
    // );
    // floor.position.set(400, 700, 1100)
    // scene.add(floor);
    // physics.addMesh(floor, 0);

    //

    const material = new THREE.MeshLambertMaterial();

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    // Boxes

    // const geometryBox = new THREE.BoxGeometry(50, 50, 50);
    // let boxes = new THREE.Mesh(geometryBox, material);
    // boxes.position.set(450, 1500, 1100)
    // boxes.castShadow = true;
    // boxes.receiveShadow = true;
    // scene.add(boxes);

    // physics.addMesh(boxes, 10);

    loop.updatables.push(controls);

    ////////

    const building = await loadBuildings();
    const bird = await loadBirds()

    console.log(building.getObjectByName('Cube_044'));

    var elevator = building.children[1];
    var elevator_door = elevator.getObjectByName("elevator_Main_panel__1_");
    var leds = elevator.getObjectByName("led");
    building.children[0].getObjectByName("elevator_Main_panel").visible = false;
    building.children[0].getObjectByName("Panel_010__1_").visible = false;

    var led_13 = leds.children.slice(0, 13);
    leds.children[0].material.color.setHex(0x000000);
    led_13[0].material = new THREE.MeshLambertMaterial({ color: 0x000000 });
    led_13[0].material.emissive.setHex(0x00ff00);
    elevator_door.position.y -= 2;
    // floor1_elevator_door.position.z -= 200;
    document.addEventListener("keydown", (event) => {
      if (event.key == "b") {
        new TWEEN.Tween(elevator_door.position)
          .to(
            {
              y: elevator_door.position.y + 2,
            },
            2000
          )
          .start()
          .onComplete(() => {
            new TWEEN.Tween(elevator.position)
              .to(
                {
                  y: elevator.position.y + 675,
                },
                6000
              )
              .start();
            new TWEEN.Tween(camera.position)
              .to(
                {
                  y: camera.position.y + 675,
                },
                6000
              )
              .start();
            led_13.map((x, i) => {
              x.material = new THREE.MeshLambertMaterial({ color: 0x000000 });
              x.material.emissive.setHex(0x00ff00);
              x.material.emissiveIntensity = 0;
              console.log(x.material);
              new TWEEN.Tween(x.material)
                .to(
                  {
                    emissiveIntensity: 1,
                  },
                  500
                )
                .delay(1000 * i)
                .start();
              if (i != led_13.length - 1) {
                new TWEEN.Tween(x.material)
                  .to(
                    {
                      emissiveIntensity: 0,
                    },
                    10
                  )
                  .delay(1000 * (i + 1))
                  .start();
              }
            });
            new TWEEN.Tween(elevator_door.position)
              .to(
                {
                  y: elevator_door.position.y - 2,
                },
                2000
              )
              .delay(1000 * (led_13.length + 1))
              .start();
          })
          .update(() => renderer.render(scene, camera));

        // new TWEEN.Tween(elevator.position)
        // .to({
        //     y : elevator.position.y+10,
        //   },
        //   6000
        // )
        // .delay(6000)
        // .start()
        // .update(()=>{renderer.render(scene, camera);
        //   co})
      }
    });

    TWEEN.tick = (delta) => {
      TWEEN.update();
    };

    const clock = new THREE.Clock()
    bird.parrot.tick(clock.getDelta())


    loop.updatables.push(TWEEN);
    scene.add(building);
    scene.add(bird.parrot)

    loop.updatables.push(bird.parrot);

    collidableMeshList.push(building.getObjectByName("Wall"));
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
    // css3drenderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
