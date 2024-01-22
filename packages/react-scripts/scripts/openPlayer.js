const path = require('path');
const chalk = require('react-dev-utils/chalk');
const fs = require('fs');
const { execFile } = require('child_process');

function openPlayer(url) {
    return new Promise((_, reject) => {
        if (!process.env.PLAYER_PATH) {
            console.error(chalk.red('PLAYER_PATH environment variable not set. Set it in the ".env" file to run the player.'));
            return reject();
        }

        const playerPath = path.resolve(__dirname, process.env.PLAYER_PATH);
        if (!fs.existsSync(playerPath)) {
            console.error(chalk.red(`Player not found at ${playerPath}. Set the PLAYER_PATH environment variable in the ".env" file to run the player.`));
            return reject();
        }

        if (path.extname(process.env.PLAYER_PATH) !== '.exe') {
            console.error(chalk.red('PLAYER_PATH environment variable should point to the player executable. Set it in the ".env" file to run the player.'));
            return reject();
        }


        execFile(playerPath, ['--player', `--url=${url}`, '--root'], { stdio: 'inherit' });
    });
}

module.exports = openPlayer;
