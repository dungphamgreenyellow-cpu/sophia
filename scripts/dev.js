#!/usr/bin/env node
const { spawn } = require('child_process');

function run(cmd, args, name) {
  const p = spawn(cmd, args, { stdio: 'inherit', shell: false });
  p.on('exit', (code, sig) => {
    if (code !== null) console.log(`${name} exited with code ${code}`);
    if (sig) console.log(`${name} killed with signal ${sig}`);
  });
  return p;
}

const b = run('npm', ['--prefix', 'backend', 'run', 'dev'], 'backend');
const f = run('npm', ['--prefix', 'frontend', 'run', 'dev', '--', '--host', '0.0.0.0', '--port', '5173'], 'frontend');

const procs = [b, f];
function shutdown() {
  console.log('Shutting down children...');
  procs.forEach((p) => p && p.kill());
  process.exit(0);
}
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((s) => process.on(s, shutdown));
