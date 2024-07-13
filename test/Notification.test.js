const { expect } = require("chai");
const { deployContract } = require('../util');

describe("Notification contract", function () {
    let Notification;
    let notification;
    let owner, user; // Sample addresses for testing

    beforeEach(async () => {
        // Deploy the contract before each test
        Notification = await ethers.getContractFactory("Notification");
        notification = await Notification.deploy();
        await notification.deployed();

        // Sample addresses for testing
        [owner, user] = await ethers.getSigners();
    });

    it("Should send a notification", async function () {
        const message = "Hello, World!";

        // Send a notification from owner to user
        await notification.connect(owner).sendNotification(user.address, message);

        // Retrieve notifications for user
        const notifications = await notification.getNotifications(user.address);

        // Check the notification details
        expect(notifications.length).to.equal(1);
        expect(notifications[0].from).to.equal(owner.address);
        expect(notifications[0].to).to.equal(user.address);
        expect(notifications[0].message).to.equal(message);
    });

    it("Should retrieve notifications for a user", async function () {
        // Send multiple notifications to user
        const messages = ["Hello", "World", "Hello, World"];
        for (let message of messages) {
            await notification.connect(owner).sendNotification(user.address, message);
        }

        // Retrieve notifications for user
        const notifications = await notification.getNotifications(user.address);

        // Check the number of notifications and their details
        expect(notifications.length).to.equal(messages.length);
        for (let i = 0; i < notifications.length; i++) {
            expect(notifications[i].from).to.equal(owner.address);
            expect(notifications[i].to).to.equal(user.address);
            expect(notifications[i].message).to.equal(messages[i]);
        }
    }
    );
}
);