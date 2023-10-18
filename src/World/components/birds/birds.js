import { GLTFLoader } from "../../../../vendor/three/examples/jsm/loaders/GLTFLoader.js";
import { setupModel } from "./setupModel.js";

async function loadBirds() {
  const loader = new GLTFLoader();

  const [parrotData] = await Promise.all([
    loader.loadAsync("/assets/models/ape.glb"),
  ]);

  console.log("Squaaawk!!!", parrotData);

  const parrot = setupModel(parrotData);
  parrot.position.set(-70, 0, 565);
  parrot.rotation.set(3*Math.PI/2, Math.PI, Math.PI/2)
  parrot.scale.set(0.95, 0.95, .95)
  return {
    parrot
  };
}

export { loadBirds };
