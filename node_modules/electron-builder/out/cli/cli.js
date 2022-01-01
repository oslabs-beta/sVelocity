#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_util_1 = require("builder-util");
const chalk = require("chalk");
const electronVersion_1 = require("app-builder-lib/out/electron/electronVersion");
const fs_extra_1 = require("fs-extra");
const isCi = require("is-ci");
const path = require("path");
const read_config_file_1 = require("read-config-file");
const updateNotifier = require("update-notifier");
const util_1 = require("builder-util/out/util");
const builder_1 = require("../builder");
const create_self_signed_cert_1 = require("./create-self-signed-cert");
const install_app_deps_1 = require("./install-app-deps");
const start_1 = require("./start");
const yarn_1 = require("app-builder-lib/out/util/yarn");
// tslint:disable:no-unused-expression
void builder_1.createYargs()
    .command(["build", "*"], "Build", builder_1.configureBuildCommand, wrap(builder_1.build))
    .command("install-app-deps", "Install app deps", install_app_deps_1.configureInstallAppDepsCommand, wrap(install_app_deps_1.installAppDeps))
    .command("node-gyp-rebuild", "Rebuild own native code", install_app_deps_1.configureInstallAppDepsCommand /* yes, args the same as for install app deps */, wrap(rebuildAppNativeCode))
    .command("create-self-signed-cert", "Create self-signed code signing cert for Windows apps", yargs => yargs
    .option("publisher", {
    alias: ["p"],
    type: "string",
    requiresArg: true,
    description: "The publisher name",
})
    .demandOption("publisher"), wrap(argv => create_self_signed_cert_1.createSelfSignedCert(argv.publisher)))
    .command("start", "Run application in a development mode using electron-webpack", yargs => yargs, wrap(() => start_1.start()))
    .help()
    .epilog(`See ${chalk.underline("https://electron.build")} for more documentation.`)
    .strict()
    .recommendCommands().argv;
function wrap(task) {
    return (args) => {
        checkIsOutdated();
        read_config_file_1.loadEnv(path.join(process.cwd(), "electron-builder.env"))
            .then(() => task(args))
            .catch(error => {
            process.exitCode = 1;
            // https://github.com/electron-userland/electron-builder/issues/2940
            process.on("exit", () => (process.exitCode = 1));
            if (error instanceof builder_util_1.InvalidConfigurationError) {
                builder_util_1.log.error(null, error.message);
            }
            else if (!(error instanceof util_1.ExecError) || !error.alreadyLogged) {
                builder_util_1.log.error({ failedTask: task.name, stackTrace: error.stack }, error.message);
            }
        });
    };
}
function checkIsOutdated() {
    if (isCi || process.env.NO_UPDATE_NOTIFIER != null) {
        return;
    }
    fs_extra_1.readJson(path.join(__dirname, "..", "..", "package.json"))
        .then(async (it) => {
        if (it.version === "0.0.0-semantic-release") {
            return;
        }
        const packageManager = (await fs_extra_1.pathExists(path.join(__dirname, "..", "..", "package-lock.json"))) ? "npm" : "yarn";
        const notifier = updateNotifier({ pkg: it });
        if (notifier.update != null) {
            notifier.notify({
                message: `Update available ${chalk.dim(notifier.update.current)}${chalk.reset(" → ")}${chalk.green(notifier.update.latest)} \nRun ${chalk.cyan(`${packageManager} upgrade electron-builder`)} to update`,
            });
        }
    })
        .catch(e => builder_util_1.log.warn({ error: e }, "cannot check updates"));
}
async function rebuildAppNativeCode(args) {
    const projectDir = process.cwd();
    // this script must be used only for electron
    return yarn_1.nodeGypRebuild(args.platform, args.arch, { version: await electronVersion_1.getElectronVersion(projectDir), useCustomDist: true });
}
//# sourceMappingURL=cli.js.map