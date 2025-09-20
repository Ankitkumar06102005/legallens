// Relaxed JSX typings for react-three-fiber intrinsic elements to prevent TS noise in CRA setups.
// This ensures elements like <ambientLight />, <pointLight />, <meshStandardMaterial />, <boxGeometry /> type-check.
import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      meshStandardMaterial: any;
      boxGeometry: any;
    }
  }
}
