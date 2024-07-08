// contracts/Notification.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Notification 
{
    struct NotificationInfo 
    {
        address from;
        address to;
        string message;
    }

    mapping(address => NotificationInfo[]) public notifications;

    event NotificationSent(address indexed from, address indexed to, string message);

    function sendNotification(address to, string memory message) public 
    {
        notifications[to].push(NotificationInfo(msg.sender, to, message));
        emit NotificationSent(msg.sender, to, message);
    }

    function getNotifications(address user) public view returns (NotificationInfo[] memory) 
    {
        return notifications[user];                 
    }
}
