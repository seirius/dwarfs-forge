import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { MinecraftData } from '../util/minecraft-data';

@Injectable()
export class TheEyeService {

    private static readonly GET_CHUNK_DATA = "/api/chunk";
    private static readonly HOST = "http://localhost:8080";

    constructor(
        private httpClient: HttpClient
    ) { }

    public getChunkData(x: number, z: number): Promise<{
        blocks: MinecraftData[];
    }> {
        const xS = Math.floor(x).toString();
        const zS = Math.floor(z).toString();
        return <any>this.httpClient.get(`${TheEyeService.HOST}${TheEyeService.GET_CHUNK_DATA}`, {
            params: {
                x: xS,
                z: zS
            }
        }).toPromise();
    }

}