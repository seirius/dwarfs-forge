import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Key } from 'ts-keycode-enum';


@Injectable()
export class KeyService {

    public spaceSubject = new Subject<KeyboardEvent>();
    public mouseMove = new Subject<MouseEvent>();
    public mouseDown = new Subject<MouseEvent>();
    public mouseup = new Subject<MouseEvent>();
    public controlB = new Subject<KeyboardEvent>();
    public controlD = new Subject<KeyboardEvent>();

    public isSpacePressed = false;

    constructor() {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            switch (event.keyCode) {
                case Key.Space:
                    this.isSpacePressed = true;
                    this.spaceSubject.next(event);
                    break;
                case Key.B:
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.controlB.next(event);
                    }
                    break;
                case Key.D:
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.controlD.next(event);
                    }
                    break;
            }
        }, false);
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.keyCode === Key.Space) {
                this.isSpacePressed = false;
                this.spaceSubject.next(event);
            }
        }, false);
        window.addEventListener('mousemove', (event: MouseEvent) => this.mouseMove.next(event), false);
        window.addEventListener('mousedown', (event: MouseEvent) => this.mouseDown.next(event), false);
        window.addEventListener('mouseup', (event: MouseEvent) => this.mouseup.next(event), false);
    }

}
