// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transaction 
{
    struct Owner 
    {
        string ownerName;
        address payable ownerAddress;
        bytes32[] productHashes; //? Pending: keep it sorted
    }

    struct Product 
    {
        bytes32 productHash;
        string description;
        uint price;
        bool isForSale;
        address payable owner;
    }

    struct NotificationInfo 
    {
        address sender;
        address reciever;
        string message;
    }

    uint256 public productCount = 0;
    uint256 public ownerCount = 0;
    mapping(address => Owner) public OwnersList;
    mapping(bytes32 => Product) public ProductsList;
    mapping(address => NotificationInfo[]) public notificationsList;

    // indexed variables are selected in a way to uniquely identify the event according to the
    // situation
    event OwnerRegistered(address indexed ownerAddress, string ownerName); 
    event ProductRegistered(bytes32 indexed productHash, address ownerAddress);
    event ProductSold(address indexed seller, address indexed buyer, bytes32 indexed productHash, uint price);
    event ProductForSaleSet(bytes32 indexed productHash, bool forSale);
    event OwnerVerified(address indexed ownerAddress, bytes32 productHash, bool verified, uint256 indexed timestamp);
    event ProductDescriptionChanged(bytes32 indexed productHash, string newDescription);
    event ProductPriceChanged(bytes32 indexed productHash, uint newPrice);
    event GetOwnerOfProd(bytes32 indexed productHash, address indexed owner);
    event NotificationSent(address indexed sender, address indexed reciever, string message);

    // Register a new owner
    function registerOwner(address ownerAddress, string memory ownerName) public returns (bool) 
    {
        require(ownerAddress != address(0), "Invalid address");
        require(OwnersList[ownerAddress].ownerAddress == address(0), "Owner already registered");

        ownerCount++;
        OwnersList[ownerAddress] = Owner
        ({
            ownerName: ownerName,
            ownerAddress: payable(ownerAddress),
            productHashes: new bytes32[](0)
        });

        emit OwnerRegistered(ownerAddress, ownerName);
        return true;
    }

    // Generate a hash for a product
    function generateHash(address ownerAddress, uint256 number) public pure returns (bytes32) 
    {
        return keccak256(abi.encodePacked(ownerAddress, number*number));
    }

    // Register a new product
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
            owner: payable(ownerAddress)
        });

        ProductsList[productHash] = product;
        
        OwnersList[ownerAddress].productHashes.push(productHash);

        emit ProductRegistered(productHash, ownerAddress);
        return true;
    }

    // Set a product for sale
    function setProductForSale(bytes32 productHash) public returns (bool) 
    {
        require(ProductsList[productHash].owner == msg.sender, "Only the owner can set the product for sale");
        require(ProductsList[productHash].productHash != bytes32(0), "Product does not exist");

        ProductsList[productHash].isForSale = true;

        emit ProductForSaleSet(productHash, ProductsList[productHash].isForSale);
        return true;
    }

    

    // Verify if the owner is the owner of the product
    function verifyOwner(address ownerAddress, bytes32 productHash, uint256 timestamp) public returns (bool) 
    {
        require(OwnersList[ownerAddress].ownerAddress != address(0), "Owner not registered");
        require(ProductsList[productHash].productHash != bytes32(0), "Product does not exist");

        if(ProductsList[productHash].owner == ownerAddress)
        {
            emit OwnerVerified(ownerAddress, productHash, true, timestamp);
            return true;
        }
        return false;
    }

    // Buy a product
    function buyProduct(address seller, address buyer, bytes32 productHash, uint256 timestamp) external payable returns (bool) 
    {
        require(verifyOwner(seller, productHash,timestamp), "Seller is not the owner");

        sendNotification(seller, "Owner verified");
        emit NotificationSent(seller, buyer, "Owner verified");

        require(OwnersList[seller].ownerAddress != address(0), "Seller not registered");
        require(OwnersList[buyer].ownerAddress != address(0), "Buyer not registered");
        require(ProductsList[productHash].isForSale, "Product is not for sale");

        // Money sent should be equal to the price of the product
        require(msg.value == ProductsList[productHash].price, "Incorrect price");

        // Transfer ownership
        ProductsList[productHash].owner = payable(buyer);
        ProductsList[productHash].isForSale = false;

        // Remove product from seller
        removeProductFromOwner(seller, productHash);

        // Add product to buyer
        OwnersList[buyer].productHashes.push(productHash);

        // Transfer funds to seller
        payable(seller).transfer(msg.value);

        emit ProductSold(seller, buyer, productHash, msg.value);
        return true;
    }

    // Remove product from owner
    function removeProductFromOwner(address owner, bytes32 productHash) internal 
    {
        bytes32[] storage productHashes = OwnersList[owner].productHashes;
        for (uint i = 0; i < productHashes.length; i++) 
        {
            if (productHashes[i] == productHash) 
            {
                productHashes[i] = productHashes[productHashes.length - 1];
                productHashes.pop();
                break;
            }
        }
    }

    // Get all products of an owner
    function getAllProductsByOwner(address ownerAddress) public view returns (Product[] memory) 
    {
        require(OwnersList[ownerAddress].ownerAddress != address(0), "Owner not registered");

        bytes32[] storage productHashes = OwnersList[ownerAddress].productHashes;
        Product[] memory products = new Product[](productHashes.length);

        for (uint i = 0; i < productHashes.length; i++) 
        {
            products[i] = ProductsList[productHashes[i]];
        }

        return products;
    }

    // Change description of a product 
    function changeDescription(bytes32 productHash, string memory newDescription) public returns (bool)  
    {
        require(ProductsList[productHash].owner == msg.sender, "Only the owner can change the description");
        require(ProductsList[productHash].productHash != bytes32(0), "Product does not exist");

        ProductsList[productHash].description = newDescription;

        emit ProductRegistered(productHash, msg.sender);
        emit ProductDescriptionChanged(productHash, newDescription);
        return true;
    }

    // Change price of a product
    function changePrice(bytes32 productHash, uint newPrice) public returns (bool) 
    {
        require(ProductsList[productHash].owner == msg.sender, "Only the owner can change the price");
        require(ProductsList[productHash].productHash != bytes32(0), "Product does not exist");

        ProductsList[productHash].price = newPrice;

        emit ProductRegistered(productHash, msg.sender);
        emit ProductPriceChanged(productHash, newPrice);
        return true;
    }

    function getOwnerOfProduct(bytes32 productHash) public returns (address)
    {
        require(ProductsList[productHash].productHash != bytes32(0), "Product does not exist");
        emit GetOwnerOfProd(productHash, ProductsList[productHash].owner);
        return ProductsList[productHash].owner;
    }

    function sendNotification(address reciever, string memory message) internal  
    {
        notificationsList[reciever].push(NotificationInfo(msg.sender, reciever, message));
        emit NotificationSent(msg.sender, reciever, message);
    }

    function getNotifications(address user) public view returns (NotificationInfo[] memory) 
    {
        return notificationsList[user];                 
    }

    // seller scan one product, and this function returns the product structure of the product to the front end
    function sellerScan(bytes32 productHash) public returns (Product memory) 
    {
        require(ProductsList[productHash].owner == msg.sender, "Only the owner can scan the product");
        require(ProductsList[productHash].productHash != bytes32(0), "Product does not exist");

        ProductsList[productHash].isForSale = true;
        return ProductsList[productHash];
        //this function is for only one product
        //will be run in a loop for combined all products that buyer wants to buy->done by seller.
    }


    // buyer scan one product, and this function returns the product structure of the product to the front end
    // seller clicks generate QR code from the front-end on the basket, a QR code is generated
    // that will get all the product hashes, total price, and the seller's address to the buyer's phone. Where he 
    // can check and verify the payment
    // now we will transfer ownership of an array of product hashes


    function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) 
    {
        uint8 i = 0;
        bytes memory bytesArray = new bytes(64);
        for (i = 0; i < 32; i++) 
        {
            bytes1 char = bytes1(bytes32(uint256(_bytes32) * 2 ** (8 * i)));
            bytesArray[i * 2] = char;
            char = bytes1(bytes32(uint256(_bytes32) * 2 ** (8 * i + 4)));
            bytesArray[i * 2 + 1] = char;
        }
        return string(bytesArray);
    }
    
}
