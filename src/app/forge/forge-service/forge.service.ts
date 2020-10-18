import { ElementRef, Injectable } from '@angular/core';
import { CUBE_SIZE, HALF_CUBE_SIZE, PrepareForExportBlocks, PrepareForImportBlocks } from 'src/app/util/forge-parser';
import { MCBlock } from 'src/app/util/mcblock';
import { MinecraftData } from 'src/app/util/minecraft-data';
import * as THREE from 'three';
import * as Orbit from 'three-orbit-controls';
import { BlockService, BlockTypes } from '../../block-service/block.service';
import { DownloadService } from '../../download-service/download.service';
import { BrushType } from '../../enums/BrushType';
import { KeyService } from '../../keys/key.service';


const OrbitControls = Orbit(THREE);

@Injectable()
export class ForgeService {
    public get blocks(): MCBlock[] {
        return this.objects
            .filter(({ minecraftData }) => minecraftData);
    }

    private static readonly FOV = 45;
    private static readonly NEAR = 1;
    private static readonly FAR = 10000;
    private gridWidth = 256;
    private gridWidthSegments = 16;
    private static readonly BACKGROUND_COLOR = '#1f2e30';

    private static readonly SUB_VECTOR = new THREE.Vector3(
        HALF_CUBE_SIZE,
        HALF_CUBE_SIZE,
        HALF_CUBE_SIZE
    );

    public heightOffset = 0;

    public editType = BrushType.ADD;
    public blockType = BlockTypes.DIRT.name;

    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public cube: THREE.Mesh;
    public controls: any;
    public plane: THREE.Mesh;

    private objects: MCBlock[] = [];

    public cubeGeo: THREE.BoxBufferGeometry;
    public cubeMaterial: THREE.MeshLambertMaterial;

    public mouse: THREE.Vector2;

    public raycaster: THREE.Raycaster;

    public rollOverMaterial: THREE.MeshBasicMaterial;
    public rollOverMesh: THREE.Mesh;

    constructor(
        private keyService: KeyService,
        private blockService: BlockService,
        private downloadService: DownloadService
    ) {
        this.keyService.mouseDown.subscribe(event => this.onMouseDown(event));
        this.keyService.mouseMove.subscribe(event => this.onMouseMove(event));
        this.keyService.controlB.subscribe(() => this.editType = BrushType.ADD);
        this.keyService.controlD.subscribe(() => this.editType = BrushType.REMOVE);
    }

    public init({
        main,
        width,
        height,
        gridSegments,
        gridWidth,
        heightOffset: offsetHeight
    }: {
        main: ElementRef;
        width: number;
        height: number;
            gridSegments: number;
            gridWidth: number;
        heightOffset?: number;
    }): void {
        this.gridWidth = gridWidth;
        this.gridWidthSegments = gridSegments;
        if (offsetHeight) {
            this.heightOffset = offsetHeight;
        }
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            ForgeService.FOV,
            width / height,
            ForgeService.NEAR,
            ForgeService.FAR
        );
        this.camera.position.set(180, 286, 466);
        this.camera.lookAt(0, 0, 0);

        this.scene.background = new THREE.Color(ForgeService.BACKGROUND_COLOR);

        this.initCubeGeo();
        this.addPlane();
        this.initRaycaster();
        this.initMouse();
        this.initRollOver();

        this.light();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.setAttribute('tabindex', '0');
        console.log(this.renderer.domElement);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        main.nativeElement.appendChild(this.renderer.domElement);

        this.animate();
        console.log(this.camera);
    }

    public updateCanvasSize(width: number, height: number): void {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    public animate(): void {
        window.requestAnimationFrame(() => this.animate());
        this.render();
        this.controls.enabled = this.keyService.isSpacePressed;
        this.controls.update();
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }

    public addPlane(): void {
        this.scene.add(new THREE.GridHelper(this.gridWidth, this.gridWidthSegments));
        const geometry = new THREE.PlaneBufferGeometry(this.gridWidth, this.gridWidth);
        geometry.rotateX(-Math.PI / 2);
        this.plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        this.objects.push({
            mesh: this.plane
        });
        this.scene.add(this.plane);
    }

    public initCubeGeo(): void {
        this.cubeGeo = new THREE.BoxBufferGeometry(
            CUBE_SIZE,
            CUBE_SIZE,
            CUBE_SIZE
        );
    }

    public light(): void {
        this.scene.add(new THREE.AmbientLight(0x606060));
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.scene.add(directionalLight);
    }

    public initRaycaster(): void {
        this.raycaster = new THREE.Raycaster();
    }

    public initMouse(): void {
        this.mouse = new THREE.Vector2();
    }

    public initRollOver(): void {
        const rollOverGeo = new THREE.BoxBufferGeometry(
            CUBE_SIZE,
            CUBE_SIZE,
            CUBE_SIZE
        );
        this.rollOverMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.5,
            transparent: true
        });
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, this.rollOverMaterial);
        this.rollOverMesh.visible = false;
        this.scene.add(this.rollOverMesh);
    }

    private calculateMouse(event: MouseEvent): void {
        const mouseX = event.clientX;
        const mouseY = event.clientY - this.heightOffset;
        this.mouse.set((mouseX / window.innerWidth) * 2 - 1, - (mouseY / window.innerHeight) * 2 + 1);
    }

    private getIntersects(coords: THREE.Vector2): THREE.Intersection[] {
        this.raycaster.setFromCamera(coords, this.camera);
        return this.raycaster
            .intersectObjects(this.objects.map(({ mesh }) => mesh))
            .filter(intersection => intersection.object !== this.scene);
    }

    public canEdit(): boolean {
        return !this.keyService.isSpacePressed;
    }

    private adjustRollOverPosition(): void {
        this.rollOverMesh.position
            .divideScalar(CUBE_SIZE)
            .floor()
            .multiplyScalar(CUBE_SIZE)
            .addScalar(HALF_CUBE_SIZE);
    }

    public onMouseMove(event: MouseEvent): void {
        if (this.canEdit()) {
            this.calculateMouse(event);
            const intersects = this.getIntersects(this.mouse);
            if (intersects.length > 0) {
                const [{ point, face: { normal } }] = intersects;
                if (this.editType === BrushType.ADD) {
                    this.rollOverMesh.visible = true;
                    this.rollOverMesh.position.copy(point).add(normal);
                    this.adjustRollOverPosition();
                } else {
                    const cubes = intersects.filter(({ object }) => object !== this.plane);
                    if (cubes.length > 0) {
                        this.rollOverMesh.visible = true;
                        const [{ point: cubePoint, face: { normal: cubeNormal } }] = cubes;
                        this.rollOverMesh.position.copy(cubePoint).sub(cubeNormal);
                        this.adjustRollOverPosition();
                    } else {
                        this.rollOverMesh.visible = false;
                    }
                }
            } else {
                this.rollOverMesh.visible = false;
            }
        } else {
            this.rollOverMesh.visible = false;
        }
    }

    public addBlock(intersect: THREE.Intersection): void {
        const voxel = new THREE.Mesh(this.cubeGeo, this.blockService.BLOCK_MATERIALS[this.blockType]);
        voxel.position.copy(intersect.point).add(intersect.face.normal);
        voxel.position
            .divideScalar(CUBE_SIZE)
            .floor()
            .multiplyScalar(CUBE_SIZE)
            .addScalar(HALF_CUBE_SIZE);
        this.scene.add(voxel);
        const { x, y, z } = voxel.position.clone().sub(ForgeService.SUB_VECTOR);
        this.objects.push({
            mesh: voxel,
            minecraftData: {
                position: { x, y, z },
                type: this.blockType
            }
        });
    }

    public removeBlock(object: THREE.Object3D): void {
        if (object !== this.plane) {
            this.scene.remove(object);
            const index = this.objects.findIndex(({ mesh }) => mesh === object);
            if (index > -1) {
                this.objects.splice(index, 1);
            }
        }
    }

    public onMouseDown(event: MouseEvent): void {
        if (this.canEdit()) {
            this.calculateMouse(event);
            const intersects = this.getIntersects(this.mouse);
            if (intersects.length > 0) {
                const [intersect] = intersects;
                if (this.editType === BrushType.ADD) {
                    this.addBlock(intersect);
                } else {
                    this.removeBlock(intersect.object);
                }
            }
        }
    }

    public clearAll(): void {
        this.blocks.forEach(({ mesh }) => this.removeBlock(mesh));
    }

    public export(): MinecraftData[] {
        return PrepareForExportBlocks(this.blocks.map(({ minecraftData }) => minecraftData));
    }

    public import(blocks: MinecraftData[]): void {
        this.clearAll();
        PrepareForImportBlocks(blocks)
            .forEach(({ position, type }) => {
                const voxel = new THREE.Mesh(this.cubeGeo, this.blockService.BLOCK_MATERIALS[type]);
                voxel.position.set(position.x, position.y, position.z);
                voxel.position
                    .divideScalar(CUBE_SIZE)
                    .floor()
                    .multiplyScalar(CUBE_SIZE)
                    .addScalar(HALF_CUBE_SIZE);
                this.scene.add(voxel);
                this.objects.push({
                    mesh: voxel,
                    minecraftData: {
                        position,
                        type
                    }
                });
            });
    }
}