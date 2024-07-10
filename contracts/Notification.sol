// contracts/Notification.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Notification 
{
    struct NotificationInfo 
    {
        address sender;
        address reciever;
        string message;
    }

    mapping(address => NotificationInfo[]) public notificationsList;

    event NotificationSent(address indexed sender, address indexed reciever, string message);

    function sendNotification(address reciever, string memory message) external  
    {
        notificationsList[reciever].push(NotificationInfo(msg.sender, reciever, message));
        emit NotificationSent(msg.sender, reciever, message);
    }

    function getNotifications(address user) external view returns (NotificationInfo[] memory) 
    {
        return notificationsList[user];                 
    }
}
