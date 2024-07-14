// contracts/Notification.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Notification 
{
    struct NotificationInfo 
    {
        address sender;
        address reciever;
        string message;
    }

    mapping(address => NotificationInfo[]) private notifications;

    event NotificationSent(address indexed sender, address indexed reciever, string message);

    function sendNotification(address reciever, string memory message) public 
    {
        notifications[reciever].push(NotificationInfo(msg.sender, reciever, message));
        emit NotificationSent(msg.sender, reciever, message);
    }

    function getNotifications(address user) public view returns (NotificationInfo[] memory) 
    {
        require(msg.sender == user, "only a user can get his notifications");
        return notifications[user];                 
    }
}
