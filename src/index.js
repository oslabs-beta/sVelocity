import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
// import { spawn } from 'node:child_process';

const terminal = new Terminal();
const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal-container'));
fitAddon.fit();

// const observer = new ResizeObserver(entries => {
//   console.log(terminal)
//   const cellWidth = terminal._core.renderer.dimensions.actualCellWidth
//   const cellHeight = terminal._core.renderer.dimensions.actualCellHeight
//   const cols = Math.floor(entries[0].contentRect.width / cellWidth)
//   const rows = Math.floor(entries[0].contentRect.height / cellHeight)

//   terminal.resize(cols, rows)
// })
// observer.observe(document.querySelector('.outer-terminal'))
async function readClipboard() {
  if (!navigator.clipboard) {
    // Clipboard API not available
    return
  }

  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (err) {
    console.error('Failed to copy!', err)
  }
}
let clipboard = readClipboard();

let cache = [];
let input;
terminal.onKey(e => {
  // console.log(e.key);
  terminal.write(e.key);
  if (e.key !== '\r' && e.key !== '\x03' && e.key !== '\x16' && e.key.charCodeAt(0) !== 127) {
    cache.push(e.key);
  }
  console.log(cache)
  if (e.key == '\r')
    terminal.write('\n');
  const code = e.key.charCodeAt(0);
  if (code == 127) {   //Backspace
    console.log(cache);
    terminal.write("\b \b");
    cache.pop();
    // cache.pop();
    console.log(cache);
    console.log(clipboard);
  }
  //paste using the keys control-v
  if (e.key === '\x03' || e.key === '\x16') {
    console.log(clipboard);
    clipboard.then(result => {
      terminal.write(result);
      cache.push(result);
      console.log(`should have ${result}`, cache);
    })
  }
})

const enterPressed = terminal.onLineFeed(async (e) => {
  input = cache.join('');
  console.log('input in index.js', input);

  if (input == 'clear') {
    terminal.clear();
  }

  cache.splice(0, cache.length);  // Empty buffer

  console.log('should be empty cache', cache);
  if (input !== 'clear') {
    const termCommand = input.slice(0, input.indexOf(" "))
    console.log('command in index.js', termCommand);
    let args = input.slice(input.indexOf(" ") + 1, input.length).split(" ");
    console.log('logging argssss', args);

    await terminalHandler.runTerminal('runTerminal', termCommand, args);
  }
});

enterPressed.then(
  terminalHandler.terminalOutput((content) => {
    console.log("console logging from the renderer:", content);
    terminal.write(content);
    terminal.write('\n');
    terminal.write('\x1b[2K\r')
  }));
