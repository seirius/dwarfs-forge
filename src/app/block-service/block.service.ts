import { Injectable } from '@angular/core';
import * as THREE from 'three';

export interface BlockType {
    name: string;
    path: string | string[];
}

export const BlockTypes: {
    DIRT: BlockType;
    COBBLESTONE: BlockType;
    STONE: BlockType;
} = {
    DIRT: {
        name: 'dirt',
        path: 'dirt.png'
    },
    COBBLESTONE: {
        name: 'cobblestone',
        path: 'cobblestone.png'
    },
    STONE: {
        name: 'stone',
        path: 'stone.png'
    }
};

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
