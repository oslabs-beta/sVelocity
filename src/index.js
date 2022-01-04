import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
const terminal = new Terminal({rendererType: 'dom',});
const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal-container'));
fitAddon.fit();

// async function readClipboard() {
//   if (!navigator.clipboard) {
//     // Clipboard API not available
//     return;
//   }

//   try {
//     const text = await navigator.clipboard.readText();
//     return text;
//   } catch (err) {
//     console.error('Failed to copy!', err);
//   }
// }
// let clipboard = readClipboard();

let cache = [];
let input;
terminal.onKey((e) => {
  // console.log(e.key);
  terminal.write(e.key);
  if (
    e.key !== '\r' &&
    e.key !== '\x03' &&
    e.key !== '\x16' &&
    e.key.charCodeAt(0) !== 127
  ) {
    cache.push(e.key);
  }
  console.log(cache);
  if (e.key == '\r') terminal.write('\n');
  const code = e.key.charCodeAt(0);
  if (code == 127) {
    //Backspace
    console.log(cache);
    terminal.write('\b \b');
    cache.pop();
    console.log(cache);
    // console.log(clipboard);
  }
  //paste using the keys control-v
  if (e.key === '\x03' || e.key === '\x16') {
    console.log(clipboard);
    clipboard.then((result) => {
      terminal.write(result);
      cache.push(result);
      console.log(`should have ${result}`, cache);
    });
  }
});

terminal
  .onLineFeed(async (e) => {
    try {
      input = cache.join('');
      console.log('input in index.js', input);

      if (input == 'clear') {
        terminal.clear();
      }

      cache.splice(0, cache.length); // Empty buffer

      console.log('should be empty cache', cache);
      if (input !== 'clear') {
        const indexOfWhitespace = input.indexOf(' ');
        const termCommand =
          indexOfWhitespace === -1 ? input : input.slice(0, indexOfWhitespace);
        console.log('command in index.js', termCommand);
        let args =
          indexOfWhitespace === -1
            ? undefined
            : input.slice(indexOfWhitespace + 1, input.length).split(' ');
        console.log('logging argssss', args);
        await terminalHandler.runTerminal('runTerminal', termCommand, args);
      }
    } catch (error) {
      console.log('error', error);
    }
  })
  .then(
    terminalHandler.terminalOutput((content) => {
      console.log('console logging from the renderer:', content);
      terminal.write(content);
      terminal.write('\n');
      terminal.write('\x1b[2K\r');
    })
  );
