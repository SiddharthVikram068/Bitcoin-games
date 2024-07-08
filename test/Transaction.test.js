const { expect } = require("chai");
const { deployContract } = require('../util');

describe("Transaction contract", function () {
    let Transaction;
    let transaction;
    let owner, user; // Sample addresses for testing

    beforeEach(async () => {
        // Deploy the contract before each test
        Transaction = await ethers.getContractFactory("Transaction");
        transaction = await Transaction.deploy();
        await transaction.deployed();

        // Sample addresses for testing
        [owner, user] = await ethers.getSigners();
    });

    it("Should send a transaction", async function () {
        const amount = 100;

        // Send a transaction from owner to user
        await transaction.connect(owner).sendTransaction(user.address, amount);

        // Retrieve transactions for user
        const transactions = await transaction.getTransactions(user.address);

        // Check the transaction details
        expect(transactions.length).to.equal(1);
        expect(transactions[0].from).to.equal(owner.address);
        expect(transactions[0].to).to.equal(user.address);
        expect(transactions[0].amount).to.equal(amount);
    });

    it("Should retrieve transactions for a user", async function () {
        // Send multiple transactions to user
        const amounts = [100, 200, 300];
        for (let amount of amounts) {
            await transaction.connect(owner).sendTransaction(user.address, amount);
        }

        // Retrieve transactions for user
        const transactions = await transaction.getTransactions(user.address);

        // Check the number of transactions and their details
        expect(transactions.length).to.equal(amounts.length);
        for (let i = 0; i < transactions.length; i++) {
            expect(transactions[i].from).to.equal(owner.address);
            expect(transactions[i].to).to.equal(user.address);
            expect(transactions[i].amount).to.equal(amounts[i]);
        }
    }
    );
}
);