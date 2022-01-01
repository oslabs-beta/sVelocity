"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeygenPublisher = void 0;
const builder_util_1 = require("builder-util");
const nodeHttpExecutor_1 = require("builder-util/out/nodeHttpExecutor");
const electron_publish_1 = require("electron-publish");
const builder_util_runtime_1 = require("builder-util-runtime");
const filename_1 = require("../util/filename");
class KeygenPublisher extends electron_publish_1.HttpPublisher {
    constructor(context, info, version) {
        super(context);
        this.providerName = "keygen";
        this.hostname = "api.keygen.sh";
        const token = process.env.KEYGEN_TOKEN;
        if (builder_util_1.isEmptyOrSpaces(token)) {
            throw new builder_util_1.InvalidConfigurationError(`Keygen token is not set using env "KEYGEN_TOKEN" (see https://www.electron.build/configuration/publish#KeygenOptions)`);
        }
        this.info = info;
        this.auth = `Bearer ${token.trim()}`;
        this.version = version;
        this.basePath = `/v1/accounts/${this.info.account}/releases`;
    }
    doUpload(fileName, _arch, dataLength, requestProcessor, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _file) {
        return builder_util_runtime_1.HttpExecutor.retryOnServerError(async () => {
            const { data, errors } = await this.upsertRelease(fileName, dataLength);
            if (errors) {
                throw new Error(`Keygen - Upserting release returned errors: ${JSON.stringify(errors)}`);
            }
            const releaseId = data === null || data === void 0 ? void 0 : data.id;
            if (!releaseId) {
                builder_util_1.log.warn({ file: fileName, reason: "UUID doesn't exist and was not created" }, "upserting release failed");
                throw new Error(`Keygen - Upserting release returned no UUID: ${JSON.stringify(data)}`);
            }
            await this.uploadArtifact(releaseId, dataLength, requestProcessor);
            return releaseId;
        });
    }
    async uploadArtifact(releaseId, dataLength, requestProcessor) {
        const upload = {
            hostname: this.hostname,
            path: `${this.basePath}/${releaseId}/artifact`,
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Length": dataLength,
            },
        };
        await nodeHttpExecutor_1.httpExecutor.doApiRequest(builder_util_runtime_1.configureRequestOptions(upload, this.auth, "PUT"), this.context.cancellationToken, requestProcessor);
    }
    async upsertRelease(fileName, dataLength) {
        const req = {
            hostname: this.hostname,
            method: "PUT",
            path: this.basePath,
            headers: {
                "Content-Type": "application/vnd.api+json",
                Accept: "application/vnd.api+json",
            },
        };
        const data = {
            data: {
                type: "release",
                attributes: {
                    filename: fileName,
                    filetype: filename_1.getCompleteExtname(fileName),
                    filesize: dataLength,
                    version: this.version,
                    platform: this.info.platform,
                    channel: this.info.channel || "stable",
                },
                relationships: {
                    product: {
                        data: {
                            type: "product",
                            id: this.info.product,
                        },
                    },
                },
            },
        };
        builder_util_1.log.debug({ data: JSON.stringify(data) }, "Keygen upsert release");
        return builder_util_runtime_1.parseJson(nodeHttpExecutor_1.httpExecutor.request(builder_util_runtime_1.configureRequestOptions(req, this.auth, "PUT"), this.context.cancellationToken, data));
    }
    async deleteRelease(releaseId) {
        const req = {
            hostname: this.hostname,
            path: `${this.basePath}/${releaseId}`,
            headers: {
                Accept: "application/vnd.api+json",
            },
        };
        await nodeHttpExecutor_1.httpExecutor.request(builder_util_runtime_1.configureRequestOptions(req, this.auth, "DELETE"), this.context.cancellationToken);
    }
    toString() {
        const { account, product, platform } = this.info;
        return `Keygen (account: ${account}, product: ${product}, platform: ${platform}, version: ${this.version})`;
    }
}
exports.KeygenPublisher = KeygenPublisher;
//# sourceMappingURL=KeygenPublisher.js.map