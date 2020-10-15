import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { BrushType } from '../enums/BrushType';
import { MinecraftData } from '../util/minecraft-data';
import { ForgeService } from './forge-service/forge.service';

@Component({
    selector: 'app-forge',
    templateUrl: './forge.component.html',
    styleUrls: ['./forge.component.scss'],
    providers: [ForgeService]
})
export class ForgeComponent implements OnInit, AfterViewInit {

    @ViewChild("main")
    public main: ElementRef;

    private _heightOffset: number;

    @Input()
    public set heightOffset(heightOffset: number) {
        this._heightOffset = heightOffset;
        this.forgeService.heightOffset = heightOffset;
    }

    public get heightOffset(): number {
        return this._heightOffset;
    }

    @Input()
    public set brushType(brushType: BrushType) {
        this.forgeService.editType = brushType;
    }

    @Input()
    public set blockType(blockType: string) {
        this.forgeService.blockType = blockType;
    }

    constructor(
        private forgeService: ForgeService
    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        const { width, height } = this.main.nativeElement.getBoundingClientRect();
        this.forgeService.init({
            main: this.main,
            heightOffset: this.heightOffset,
            width,
            height
        });
    }

    @HostListener('window:resize', ['$event'])
    private onResize(event: any): void {
        const { width, height } = this.main.nativeElement.getBoundingClientRect();
        this.forgeService.updateCanvasSize(width, height);
    }

    public focusCanvas(): void {
        this.forgeService.renderer.domElement.focus();
    }

    public clearAll(): void {
        this.forgeService.clearAll();
    }

    public export(): MinecraftData[] {
        return this.forgeService.export();
    }

    public import(blocks: MinecraftData[]): void {
        this.forgeService.import(blocks);
    }

}
