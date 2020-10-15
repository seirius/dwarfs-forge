import { MinecraftData } from './minecraft-data';

export const CUBE_SIZE = 16;
export const HALF_CUBE_SIZE = CUBE_SIZE / 2;

export function PrepareForExportBlocks(blocks: MinecraftData[]): MinecraftData[] {
    return blocks.map(({
        type, position
    }) => ({
        position: {
            x: position.x / CUBE_SIZE + HALF_CUBE_SIZE,
            y: position.y / CUBE_SIZE,
            z: position.z / CUBE_SIZE + HALF_CUBE_SIZE
        },
        type
    }));
}

export function PrepareForImportBlocks(blocks: MinecraftData[]): MinecraftData[] {
    return blocks.map(({
        type, position
    }) => ({
        position: {
            x: (position.x - HALF_CUBE_SIZE) * CUBE_SIZE,
            y: position.y * CUBE_SIZE,
            z: (position.z - HALF_CUBE_SIZE) * CUBE_SIZE
        },
        type
    })
    );
}