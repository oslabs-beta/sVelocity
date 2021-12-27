import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
// import { spawn } from 'node:child_process';

const terminal = new Terminal();
const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal-container'));
fitAddon.fit();

let cache = [];
let input;
terminal.onKey(e => {
  console.log(e.key);
  terminal.write(e.key);
  if(e.key !== '\r') {
    cache.push(e.key);
  }
  console.log(cache)
  if (e.key == '\r')
    terminal.write('\n');
  const code = e.key.charCodeAt(0);
  if (code == 127) {   //Backspace
    terminal.write("\b \b");
    cache.pop();
  }
})
terminal.onLineFeed(e => {
  input = cache.join('');
  console.log('input in index.js', input);
  cache = [];  // Empty buffer

  const termCommand = input.slice(0, input.indexOf(" "))
  console.log('command in index.js', termCommand);
  let args = input.slice(input.indexOf(" ") + 1, input.length).split(" ");
  console.log('logging argssss', args);
  terminalHandler.runTerminal('runTerminal', termCommand, args);
});
//figure out how to get the spawn functionality working. Try to use the main.js to expose in the main world and share info back and forth.