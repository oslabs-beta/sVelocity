"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpExecutor = exports.NodeHttpExecutor = void 0;
const builder_util_runtime_1 = require("builder-util-runtime");
const http_1 = require("http");
const https = require("https");
class NodeHttpExecutor extends builder_util_runtime_1.HttpExecutor {
    // noinspection JSMethodCanBeStatic
    // noinspection JSUnusedGlobalSymbols
    createRequest(options, callback) {
        return (options.protocol === "http:" ? http_1.request : https.request)(options, callback);
    }
}
exports.NodeHttpExecutor = NodeHttpExecutor;
exports.httpExecutor = new NodeHttpExecutor();
//# sourceMappingURL=nodeHttpExecutor.js.map