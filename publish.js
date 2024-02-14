const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const reactScriptsPath = path.join(__dirname, 'packages/react-scripts');
const craTemplateCohtmlPath = path.join(
  __dirname,
  'packages/cra-template-cohtml'
);
const chalk = require('chalk');

const reactScriptsPackageJSON = getPackageJSON(reactScriptsPath);
const craTemplateCohtmlPackageJSON = getPackageJSON(craTemplateCohtmlPath);

/**
 * Will get package json from some component
 * @param {string} component
 * @param {string} folder
 * @returns {Object}
 */
function getPackageJSON(directory) {
  const packageJSONPath = path.join(directory, 'package.json');
  const fsStats = fs.lstatSync(packageJSONPath, { throwIfNoEntry: false });
  if (!fsStats || !fsStats.isFile()) {
    console.error(`Could not find package.json in ${directory}.`);
    return null;
  }
  return JSON.parse(fs.readFileSync(packageJSONPath));
}

/**
 * Gets the latest version of some npm package
 * @param {string} npmPackage - The npm package name
 * @returns {string}
 */
function getPublicVersion(npmPackage) {
  return execSync(`npm view ${npmPackage} version`, {
    encoding: 'utf8',
  }).replace('\n', '');
}

/**
 * Checks if some component should be updated in npm if its version is bumped
 * @param {string} packageJSON
 * @returns {boolean}
 */
function shouldUpdate(packageJSON) {
  if (!packageJSON) return false;

  const name = packageJSON.name;
  console.log(chalk.blue(`Checking if ${name} should be published...`));
  // if a package doesn't exist in the registry then it must be published
  if (
    !JSON.parse(execSync(`npm search ${name} --json`, { encoding: 'utf8' }))
      .length
  ) {
    console.log(
      chalk.blue(
        `Package ${name} does not exist on the public registry - it should be published!`
      )
    );
    return true;
  }

  const localVersion = packageJSON.version;
  const publicVersion = getPublicVersion(name);

  if (localVersion !== publicVersion) {
    console.log(
      chalk.blue(
        `Package ${name} has new local version - ${localVersion}. The current npm version is ${publicVersion}.`
      )
    );
    return true;
  }

  console.log(`Package ${name} needs no publish.`);
  return false;
}

/**
 * Publish a package to npm
 * @param {string} name
 * @param {string} directory
 */
function publish(name) {
  try {
    console.log(chalk.blue(`Should execute Publish here _________${name}`));
    // execSync(`npm publish`, { cwd: directory, encoding: 'utf8', stdio: 'inherit' });
    console.log(chalk.green(`Successfully published ${name}.`));
  } catch (error) {
    console.error(chalk.red(err));
  }
}

module.exports = (() => {
  if (shouldUpdate(reactScriptsPackageJSON))
    publish(reactScriptsPackageJSON.name, reactScriptsPath);
  if (shouldUpdate(craTemplateCohtmlPackageJSON))
    publish(craTemplateCohtmlPackageJSON.name, craTemplateCohtmlPath);
})();
