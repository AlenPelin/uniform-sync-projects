const { writeFileSync } = require('fs');
const { config } = require('dotenv');
const conf = config();

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const res = {...process.env};

const env = (name) => new Promise((resolve) => {
    if (process.env.UNIFORM_API_KEY && name === 'UNIFORM_API_KEY') {
        resolve();
        return;
    }

    rl.question(`Please specify ${name} (current value is '${res[name]}'): `, (answer) => {
        res[name] = answer;
        resolve(answer);
    });
});

env('UNIFORM_API_KEY').then(x => {
    env('UNIFORM_PROJECT_ID').then(() => {
        const text = `# GENERATED
UNIFORM_CLI_BASE_URL=${res.UNIFORM_CLI_BASE_URL ?? 'https://uniform.app'}
UNIFORM_API_KEY=${res.UNIFORM_API_KEY}
UNIFORM_PROJECT_ID=${res.UNIFORM_PROJECT_ID}
`;
        writeFileSync('./.env', text);
        rl.close();
    });
});
