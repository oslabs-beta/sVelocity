/// <reference types="node" />
import { Arch } from "builder-util";
import { ClientRequest } from "http";
import { HttpPublisher, PublishContext } from "electron-publish";
import { KeygenOptions } from "builder-util-runtime/out/publishOptions";
export declare class KeygenPublisher extends HttpPublisher {
    readonly providerName = "keygen";
    readonly hostname = "api.keygen.sh";
    private readonly info;
    private readonly auth;
    private readonly version;
    private readonly basePath;
    constructor(context: PublishContext, info: KeygenOptions, version: string);
    protected doUpload(fileName: string, _arch: Arch, dataLength: number, requestProcessor: (request: ClientRequest, reject: (error: Error) => void) => void, _file: string): Promise<any>;
    private uploadArtifact;
    private upsertRelease;
    deleteRelease(releaseId: string): Promise<void>;
    toString(): string;
}
