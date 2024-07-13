// Sources flattened with hardhat v2.9.7 https://hardhat.org

// File contracts/RskStarterLogs.sol

// SPDX-License-Identifier: GPL-3.0 OR MIT
pragma solidity 0.8.7;

interface IRskStarterLogs {
    function count() external view returns (uint256);

    function doTheThing(bool isLoud, string memory text) external;
}

contract RskStarterLogs is IRskStarterLogs {
    uint256 public override count;

    event RskStarterLog(
        address indexed source,
        bool indexed isLoud,
        string text
    );

    function doTheThing(bool isLoud, string memory text) external override {
        count += 1;
        emit RskStarterLog(msg.sender, isLoud, text);
    }
}


// File contracts/RskStarter.sol

// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

contract RskStarter {
    IRskStarterLogs private rskStarterLogs;

    constructor(address rskStarterLogsAddress) {
        rskStarterLogs = IRskStarterLogs(rskStarterLogsAddress);
    }

    function speak(string memory text) external {
        rskStarterLogs.doTheThing(false, text);
    }

    function shout(string memory text) external {
        rskStarterLogs.doTheThing(true, text);
    }
}


// File contracts/Notification.sol

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


// File contracts/Transaction.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transaction 
{
    struct Owner 
    {
        address ownerAddress;
        bytes32[] productHashes;
    }

    struct Product 
    {
        bytes32 productHash;
        string description;
        uint price;
        bool isForSale;
        address owner;
    }

    uint256 public productCount = 0;
    uint256 public ownerCount = 0;
    mapping(address => Owner) public OwnersList;
    mapping(bytes32 => Product) public ProductsList;

    event OwnerRegistered(address owner);
    event ProductRegistered(bytes32 productHash, address owner);
    event ProductSold(address buyer, bytes32 productHash, uint price);
    event ProductForSaleSet(bytes32 productHash, bool forSale);

    function registerOwner(address ownerAddress) public returns (bool) 
    {
        require(ownerAddress != address(0), "Invalid address");
        require(OwnersList[ownerAddress].ownerAddress == address(0), "Owner already registered");

        ownerCount++;
        OwnersList[ownerAddress] = Owner({
            ownerAddress: ownerAddress,
            productHashes: new bytes32[](0)
        });

        emit OwnerRegistered(ownerAddress);
        return true;
    }

    function generateHash(address ownerAddress, uint256 number) public pure returns (bytes32) 
    {
        return keccak256(abi.encodePacked(ownerAddress, number*number));
    }

    function registerProduct(address ownerAddress, string memory desc, uint256 price) public returns (bool) 
    {
        require(ownerAddress != address(0), "Invalid owner address");
        require(OwnersList[ownerAddress].ownerAddress != address(0), "Owner not registered");

        productCount++;
        bytes32 productHash = keccak256(abi.encodePacked(ownerAddress, productCount));
        Product memory product = Product
        ({
            productHash: productHash,
            description: desc,
            price: price,
            isForSale: false,
            owner: ownerAddress
        });

        ProductsList[productHash] = product;
        OwnersList[ownerAddress].productHashes.push(productHash);

        emit ProductRegistered(productHash, ownerAddress);
        return true;
    }

    function setProductForSale(bytes32 productHash, bool forSale) public returns (bool) 
    {
        require(ProductsList[productHash].owner == msg.sender, "Only the owner can set the product for sale");
        require(ProductsList[productHash].productHash != bytes32(0), "Product does not exist");

        ProductsList[productHash].isForSale = forSale;

        emit ProductForSaleSet(productHash, forSale);
        return true;
    }

    function buyProduct(address seller, address buyer, bytes32 productHash) public payable returns (bool) 
    {
        require(OwnersList[seller].ownerAddress != address(0), "Seller not registered");
        require(OwnersList[buyer].ownerAddress != address(0), "Buyer not registered");
        require(ProductsList[productHash].isForSale, "Product is not for sale");

        // Transfer ownership
        ProductsList[productHash].owner = buyer;
        ProductsList[productHash].isForSale = false;

        // Remove product from seller
        removeProductFromOwner(seller, productHash);

        // Add product to buyer
        OwnersList[buyer].productHashes.push(productHash);

        // Transfer funds to seller
        payable(seller).transfer(msg.value);

        emit ProductSold(buyer, productHash, msg.value);
        return true;
    }

    function removeProductFromOwner(address owner, bytes32 productHash) internal 
    {
        bytes32[] storage productHashes = OwnersList[owner].productHashes;
        for (uint i = 0; i < productHashes.length; i++) {
            if (productHashes[i] == productHash) {
                productHashes[i] = productHashes[productHashes.length - 1];
                productHashes.pop();
                break;
            }
        }
    }

    function getAllProductsByOwner(address ownerAddress) public view returns (Product[] memory) 
    {
        require(OwnersList[ownerAddress].ownerAddress != address(0), "Owner not registered");

        bytes32[] storage productHashes = OwnersList[ownerAddress].productHashes;
        Product[] memory products = new Product[](productHashes.length);

        for (uint i = 0; i < productHashes.length; i++) {
            products[i] = ProductsList[productHashes[i]];
        }

        return products;
    }
}
