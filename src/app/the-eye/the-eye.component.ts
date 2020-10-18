import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import { TheEyeService } from './the-eye.service';

export interface PlayerPosition {
    avatar: string;
    name: string;
    position: {
        x: number;
        y: number;
        z: number;
    },
    uuid: string;
}

export interface ClickEvent {
    position: {
        x: number;
        z: number;
    };
}

@Component({
    selector: 'app-the-eye',
    templateUrl: './the-eye.component.html',
    styleUrls: ['./the-eye.component.scss']
})
export class TheEyeComponent implements OnInit {

    private static readonly MAX_ZOOM = 12;
    private static readonly KEY = 'MY_CONF';
    private static readonly T_VALUE = 1;
    private static readonly API_PATH = '/api/map/{z}/{x}/{y}.png';
    private static readonly PLAYER_API_PATH = '/api/players';
    private static readonly ATTRIBUTION = '&copy; Made by SeiRiuS';
    private static readonly PLAYER_INTERVAL = 3000;

    private map: L.Map;

    private interval;

    private markers: {
        [key: string]: L.Marker;
    } = {};

    @Input()
    public host = "http://localhost:8080";

    @Output()
    public mapClick = new EventEmitter<ClickEvent>();


    constructor(
        private httpClient: HttpClient
    ) { }

    ngOnInit(): void {
        L.CRS[TheEyeComponent.KEY] = L['extend']({}, L.CRS.Simple, {
            transformation: new L.Transformation(TheEyeComponent.T_VALUE, 0, TheEyeComponent.T_VALUE, 0)
        });

        this.map = L.map('map', {
            zoomControl: true,
            minZoom: 8,
            maxZoom: TheEyeComponent.MAX_ZOOM,
            zoom: TheEyeComponent.MAX_ZOOM,
            center: [0, 0],
            crs: L.CRS[TheEyeComponent.KEY],
        }).on("click", (event: any) => {
            const { latlng } = event;
            const multiplier = this.getMultiplier();
            let { x, y } = this.map.project(latlng, undefined);
            x /= multiplier;
            y /= multiplier;
            this.mapClick.next({
                position: {
                    x, z: y
                }
            });
        });

        L.tileLayer(`${this.host}${TheEyeComponent.API_PATH}`, {
            attribution: TheEyeComponent.ATTRIBUTION,
            tileSize: 160,
            noWrap: true
        }).addTo(this.map);

        this.playerPosition();
    }

    private normalizedZoom(): number {
        return TheEyeComponent.MAX_ZOOM - this.map.getZoom() + 1;
    }

    private getMultiplier(): number {
        return 10 / this.normalizedZoom();
    }

    private playerPosition(): void {
        this.interval = setInterval(async () => {
            try {
                const response: PlayerPosition[] = <any>await this.httpClient
                    .get(`${this.host}${TheEyeComponent.PLAYER_API_PATH}`)
                    .toPromise();
                const multiplier = this.getMultiplier();
                response.forEach(({
                    name,
                    position: { x, z },
                    avatar
                }) => {
                    let playerMarker = this.markers[name];
                    x *= multiplier;
                    z *= multiplier;
                    const latLng = this.map.unproject(L.point(x, z), undefined);
                    if (!playerMarker) {
                        playerMarker = L.marker(latLng, {
                            title: name,
                            icon: L.icon({
                                iconUrl: avatar,
                                iconSize: [16, 16],
                                iconAnchor: [8, 8]
                            })
                        }).addTo(this.map);
                        this.markers[name] = playerMarker;
                    } else {
                        playerMarker.setLatLng(latLng);
                    }
                });
            } catch (error) {
                console.error(error);
                clearInterval(this.interval);
            }
        }, TheEyeComponent.PLAYER_INTERVAL);
    }

}
