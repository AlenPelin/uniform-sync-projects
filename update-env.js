const { writeFileSync } = require('fs');
const { config } = require('dotenv');
const conf = config();

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const env = (name) => new Promise((resolve) => {
    if (process.env.UNIFORM_API_KEY && name === 'UNIFORM_API_KEY') {
        resolve();
        return;
    }

    rl.question(`Please specify ${name}: `, (answer) => {
        process.env[name] = answer;
        resolve(answer);
        rl.close();
    });
});

Promise.all([env('UNIFORM_API_KEY'), env('UNIFORM_PROJECT_ID')]).then(() =>
{
    const text = `UNIFORM_CLI_BASE_URL=${process.env.UNIFORM_CLI_BASE_URL ?? 'https://uniform.app'}
UNIFORM_API_KEY=${process.env.UNIFORM_API_KEY}

UNIFORM_PROJECT_ID=${process.env.UNIFORM_PROJECT_ID}
`;
    writeFileSync('./.env', text);
})