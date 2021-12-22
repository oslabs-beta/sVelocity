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
  cache.push(e.key);
  console.log(cache)
  if (e.key == '\r') 
    terminal.write('\n');
    const code = e.key.charCodeAt(0);
    if(code == 127){   //Backspace
        terminal.write("\b \b");
        cache.pop();
    }
})
terminal.onLineFeed(e => {
  input = cache.join('');
  console.log(input)
  cache = [];  // Empty buffer

const command = input.slice(0, input.indexOf(" "))
const args = input.slice(input.indexOf(" ")+1, input.length).split(" ")
console.log(command)
console.log(args)


const ls = spawn(command, args, { shell: true });

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
});
// const input = "yarn add create-react-app"
