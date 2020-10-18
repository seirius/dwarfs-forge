import { Injectable } from '@angular/core';
import * as THREE from 'three';

export interface BlockType {
    label: string;
    name: string;
    path: string | string[];
}

export const BlockTypes: {
    DIRT: BlockType;
    COBBLESTONE: BlockType;
    STONE: BlockType;
    WATER: BlockType;
    SAND: BlockType;
} = {
    DIRT: {
        label: 'Dirt',
        name: 'Block{minecraft:dirt}',
        path: 'dirt.png'
    },
    COBBLESTONE: {
        label: 'Cobblestone',
        name: 'Block{minecraft:cobblestone}',
        path: 'cobblestone.png'
    },
    STONE: {
        label: 'Stone',
        name: 'Block{minecraft:stone}',
        path: 'stone.png'
    },
    WATER: {
        label: 'Water',
        name: 'Block{minecraft:water}[level=0]',
        path: 'water.png'
    },
    SAND: {
        label: 'Sand',
        name: 'Block{minecraft:sand}',
        path: 'sand.png'
    }
};

export const EnumaretedBlockTypes = Object
    .values(BlockTypes)
    .map(({ label, name }) => ({ label, value: name }));

@Injectable()
export class BlockService {
    private static readonly ASSETS_PATH = 'assets/';

    public readonly BLOCK_MATERIALS: {
        [key: string]: THREE.Material;
    } = {};

    public textureLoader: THREE.TextureLoader;

    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.textureLoader.setPath(BlockService.ASSETS_PATH);
        Object.values(BlockTypes).forEach(({
            name, path
        }) => {
            const textures = this.loadTextures(path);
            let mesh;
            if (textures.length === 1) {
                mesh = new THREE.MeshLambertMaterial({
                    map: textures[0],
                });
            }
            this.BLOCK_MATERIALS[name] = mesh;
        });
    }

    public loadTextures(path: string | string[]): THREE.Texture[] {
        const paths = typeof (path) === 'string' ? [path] : path;
        return paths.map(p => {
            const texture = this.textureLoader.load(p);
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.NearestFilter;
            return texture;
        });
    }
}
