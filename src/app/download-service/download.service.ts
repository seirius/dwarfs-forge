import { Injectable } from '@angular/core';

@Injectable()
export class DownloadService {

    private static readonly DATA_STR = 'data:text/json;charset=utf-8,';
    private static readonly LINK_ELEMENT = 'a';
    private static readonly HREF_ATTR = 'href';
    private static readonly DOWNLOAD_ATTR = 'download';
    private static readonly JSON_EXTENSION = '.json';

    public downloadObjectAsJson(exportObj: Record<string, any>, exportName: string): void {
        const dataStr = DownloadService.DATA_STR + encodeURIComponent(JSON.stringify(exportObj, null, 2));
        const downloadAnchorNode = document.createElement(DownloadService.LINK_ELEMENT);
        downloadAnchorNode.setAttribute(DownloadService.HREF_ATTR, dataStr);
        downloadAnchorNode.setAttribute(DownloadService.DOWNLOAD_ATTR, exportName + DownloadService.JSON_EXTENSION);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}
