import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const terminal = new Terminal();
const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal-container'));
fitAddon.fit();
terminal.onKey(e => {
  console.log(e.key);
  terminal.write(e.key);
  if (e.key == '\r') 
    terminal.write('\n');
    const code = e.key.charCodeAt(0);
    if(code == 127){   //Backspace
        terminal.write("\b \b");
    }
})