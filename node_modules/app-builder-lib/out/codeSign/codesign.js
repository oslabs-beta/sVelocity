"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCertificate = void 0;
const fs_extra_1 = require("fs-extra");
const os_1 = require("os");
const path = require("path");
const builder_util_1 = require("builder-util");
const fs_1 = require("builder-util/out/fs");
const binDownload_1 = require("../binDownload");
/** @private */
async function downloadCertificate(urlOrBase64, tmpDir, currentDir) {
    urlOrBase64 = urlOrBase64.trim();
    let file = null;
    if ((urlOrBase64.length > 3 && urlOrBase64[1] === ":") || urlOrBase64.startsWith("/") || urlOrBase64.startsWith(".")) {
        file = urlOrBase64;
    }
    else if (urlOrBase64.startsWith("file://")) {
        file = urlOrBase64.substring("file://".length);
    }
    else if (urlOrBase64.startsWith("~/")) {
        file = path.join(os_1.homedir(), urlOrBase64.substring("~/".length));
    }
    else {
        const isUrl = urlOrBase64.startsWith("https://");
        if (isUrl || urlOrBase64.length > 2048 || urlOrBase64.endsWith("=")) {
            const tempFile = await tmpDir.getTempFile({ suffix: ".p12" });
            if (isUrl) {
                await binDownload_1.download(urlOrBase64, tempFile);
            }
            else {
                await fs_extra_1.outputFile(tempFile, Buffer.from(urlOrBase64, "base64"));
            }
            return tempFile;
        }
        else {
            file = urlOrBase64;
        }
    }
    file = path.resolve(currentDir, file);
    const stat = await fs_1.statOrNull(file);
    if (stat == null) {
        throw new builder_util_1.InvalidConfigurationError(`${file} doesn't exist`);
    }
    else if (!stat.isFile()) {
        throw new builder_util_1.InvalidConfigurationError(`${file} not a file`);
    }
    else {
        return file;
    }
}
exports.downloadCertificate = downloadCertificate;
//# sourceMappingURL=codesign.js.map