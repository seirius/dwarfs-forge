import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BlockTypes } from '../block-service/block.service';
import { DownloadService } from '../download-service/download.service';
import { ForgeComponent } from '../forge/forge.component';
import { BrushType } from './../enums/BrushType';

@Component({
    selector: 'app-simple-builder',
    templateUrl: './simple-builder.component.html',
    styleUrls: ['./simple-builder.component.scss']
})
export class SimpleBuilderComponent implements OnInit, AfterViewInit {

    @ViewChild('editor')
    public editor: ElementRef;

    @ViewChild('importFile')
    public importFile: ElementRef;

    @ViewChild('importRegionFile')
    public importRegionFile: ElementRef;

    @ViewChild("forge")
    public forge: ForgeComponent;

    public editorReady = false;

    public get heightOffset(): number {
        return this.editor.nativeElement.getBoundingClientRect().height;
    }

    public editType = BrushType.ADD;

    public blockType = BlockTypes.DIRT.name;

    constructor(
        private downloadService: DownloadService,
        private cdr: ChangeDetectorRef
    ) { }

    public ngOnInit(): void { }

    public ngAfterViewInit(): void {
        this.editorReady = true;
        this.cdr.detectChanges();
    }

    public export(): void {
        const blocks = this.forge.export();
        this.downloadService.downloadObjectAsJson({ blocks }, "simple");
        this.focusCanvas();
    }

    public import(event: {
        target: {
            files: any[]
        }
    }): void {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const { blocks } = JSON.parse(ev.target.result as string);
            this.forge.import(blocks);
            this.importFile.nativeElement.value = null;
            this.focusCanvas();
        };
        reader.readAsText(event.target.files[0]);
    }

    public clearAll(): void {
        this.forge.clearAll();
        this.focusCanvas();
    }

    public focusCanvas(): void {
        (document.activeElement as any).blur();
        this.forge.focusCanvas();
    }

}
