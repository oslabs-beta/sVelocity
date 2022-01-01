# dmg-license

A TypeScript/JavaScript library and command-line tool for attaching license agreements to macOS `.dmg` files, which the user must accept before mounting the disk image. Doing this correctly is surprisingly complicated, so this package is here to automate it.

## Contents

* [License](#license)
* [Command Line Usage](#command-line-usage)
	* [Installation](#installation)
	* [Command Syntax](#command-syntax)
* [API](#api)

## License

`dmg-license` itself is provided under the terms of the MIT license. You can find the text of the MIT license in the [LICENSE](LICENSE) file.

## Command Line Usage

Although this package is mainly intended for use by `.dmg`-generating tools like [node-appdmg](https://github.com/LinusU/node-appdmg), it can also be used by itself from the command line, to attach a license agreement to an existing `.dmg` file.

### Installation

You can install this package and use the command-line tool by running `npm install --global dmg-license`. This will add a `dmg-license` command to your system.

Alternatively, you can run it without installing, using `npx dmg-license`. Note that running it this way is relatively slow.

### Command Syntax

Usage: <kbd>dmg-license [<var>options…</var>] <var>json-path</var> <var>dmg-path</var></kbd>

#### Parameters

<dl>
<dt><kbd><var>json-path</var></kbd></dt>
<dd>Path to a <a href="docs/License%20Specifications.md">JSON license specification</a> file.</dd>
<dt><kbd><var>dmg-path</var></kbd></dt>
<dd>Path to a disk image (`.dmg`) file.</dd>
</dl>

#### Options

<dl>
<dt><kbd>-v</kbd>, <kbd>--verbose</kbd></dt>
<dd>Show stack traces for warnings and errors.</dd>

<dt><kbd>-q</kbd>, <kbd>--quiet</kbd></dt>
<dd>Don't show warnings at all.</dd>

<dt><kbd>-h</kbd>, <kbd>-?</kbd>, <kbd>--help</kbd></dt>
<dd>Show help, without doing anything else.</dd>

<dt><kbd>-V</kbd>, <kbd>--version</kbd></dt>
<dd>Show version.</dd>
</dl>

## API

[API documentation is in the `docs/api` folder.](docs/api/index.md)
