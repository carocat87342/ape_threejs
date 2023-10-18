import { AnimationMixer } from "../../../../vendor/three/build/three.module.js";
import * as THREE from "three";

function setupModel(data) {
  const clock = new THREE.Clock()
  console.log("qbirdaaaaaaaaaaaaaa");
  const model = data.scene.children[0];
  const clip = data.animations[0];
  console.log(model);
  console.log('animations = ', data.animations);
  const mixer = new AnimationMixer(model);
  const action = mixer.clipAction(clip);
  action.play();
  
  model.tick = (delta) => mixer.update(delta);

  return model;
}

export { setupModel };
