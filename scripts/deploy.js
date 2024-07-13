const { deployContract } = require('../util');

async function main() {
  // try {
  //   const rskStarterLogs = await deployContract('RskStarterLogs');
  //   await deployContract('RskStarter', rskStarterLogs.address);
  // } catch (error) {
  //   console.error(error);
  //   process.exitCode = 1;
  // }

  try {
    await deployContract('Transaction');
    await deployContract('Notification');
  } catch(error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
