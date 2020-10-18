import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BlockTypes, EnumaretedBlockTypes } from '../block-service/block.service';
import { BrushType } from '../enums/BrushType';
import { ForgeComponent } from '../forge/forge.component';
import { ClickEvent } from '../the-eye/the-eye.component';
import { TheEyeService } from '../the-eye/the-eye.service';

@Component({
    selector: 'app-live-builder',
    templateUrl: './live-builder.component.html',
    styleUrls: ['./live-builder.component.scss'],
    providers: [TheEyeService]
})
export class LiveBuilderComponent implements OnInit {

    @ViewChild('editor')
    public editor: ElementRef;

    @ViewChild("forge")
    public forge: ForgeComponent;

    public editorReady = false;

    public get heightOffset(): number {
        return this.editor.nativeElement.getBoundingClientRect().height;
    }

    public editType = BrushType.ADD;

    public blockType = BlockTypes.DIRT.name;

    public mapFlag = true;

    constructor(
        private cdr: ChangeDetectorRef,
        private theEyeService: TheEyeService
    ) { }

    public ngOnInit(): void { }

    public ngAfterViewInit(): void {
        this.editorReady = true;
        this.cdr.detectChanges();
    }

    public clearAll(): void {
        this.forge.clearAll();
        this.focusCanvas();
    }

    public focusCanvas(): void {
        (document.activeElement as any).blur();
        this.forge.focusCanvas();
    }

    public showMap(): void {
        this.mapFlag = !this.mapFlag;
    }

    public async theEyeClick({ position: { x, z } }: ClickEvent): Promise<void> {
        const { blocks } = await this.theEyeService.getChunkData(x, z);
        this.forge.clearAll();
        this.forge.import(blocks);
    }

    public get enumBlockTypes(): {
        label: string;
        value: string;
    }[] {
        return EnumaretedBlockTypes;
    }
}
