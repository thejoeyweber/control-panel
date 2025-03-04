/*
  File: start.js
  Purpose: CLI script to choose between running prototype or app servers
  Dependencies: inquirer
*/

import inquirer from 'inquirer';
import { exec } from 'child_process';
import path from 'path';

const question = {
  type: 'list',
  name: 'project',
  message: 'Which project would you like to run?',
  choices: [
    { name: 'Prototype (npm start)', value: 'prototype' },
    { name: 'App (npm run dev)', value: 'app' }
  ]
};

inquirer.prompt([question]).then(answers => {
  const cwd = path.join(process.cwd(), answers.project);
  const command = answers.project === 'prototype' ? 'npm start' : 'npm run dev';
  
  console.log(`\nStarting ${answers.project} in ${cwd}...\n`);
  
  const child = exec(command, { cwd });
  
  // Pipe output to console
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  
  child.on('error', (error) => {
    console.error(`Error: ${error.message}`);
  });
}); 