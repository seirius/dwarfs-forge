import { MinecraftData } from './minecraft-data';

export interface MCBlock {
    mesh: THREE.Mesh;
    minecraftData?: MinecraftData;
}