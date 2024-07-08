// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transaction 
{
    struct Owner 
    {
        string ownerName;
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

    event OwnerRegistered(address ownerAddress, string ownerName);
    event ProductRegistered(bytes32 productHash, address ownerAddress);
    event ProductSold(address seller, address buyer, bytes32 productHash, uint price);
    event ProductForSaleSet(bytes32 productHash, bool forSale);
    event OwnerVerified(address ownerAddress, bytes32 productHash, bool verified);

    // Change description of a product 
    function changeDescription(bytes32 productHash, string memory newDescription) public returns (bool)  
    {
        require(ProductsList[productHash].owner == msg.sender, "Only the owner can change the description");
        require(ProductsList[productHash].productHash != bytes32(0), "Product does not exist");

        ProductsList[productHash].description = newDescription;

        emit ProductRegistered(productHash, msg.sender);
        return true;
    }

    // Change price of a product
    function changePrice(bytes32 productHash, uint newPrice) public returns (bool) 
    {
        require(ProductsList[productHash].owner == msg.sender, "Only the owner can change the price");
        require(ProductsList[productHash].productHash != bytes32(0), "Product does not exist");

        ProductsList[productHash].price = newPrice;

        emit ProductRegistered(productHash, msg.sender);
        return true;
    }

    // Register a new owner
    function registerOwner(address ownerAddress,string memory ownerName) public returns (bool) 
    {
        require(ownerAddress != address(0), "Invalid address");
        require(OwnersList[ownerAddress].ownerAddress == address(0), "Owner already registered");

        ownerCount++;
        OwnersList[ownerAddress] = Owner
        ({
            ownerName: ownerName,
            ownerAddress: ownerAddress,
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
            owner: ownerAddress
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
    function verifyOwner(address ownerAddress, bytes32 productHash) internal view returns (bool) 
    {
        return ProductsList[productHash].owner == ownerAddress;
    }

    // Buy a product
    function buyProduct(address seller, address buyer, bytes32 productHash) public payable returns (bool) 
    {
        require(verifyOwner(seller, productHash), "Seller is not the owner");
        emit OwnerVerified(seller, productHash, verifyOwner(seller, productHash));

        require(OwnersList[seller].ownerAddress != address(0), "Seller not registered");
        require(OwnersList[buyer].ownerAddress != address(0), "Buyer not registered");
        require(ProductsList[productHash].isForSale, "Product is not for sale");
       
        // Money sent should be equal to the price of the product
        require(msg.value == ProductsList[productHash].price, "Incorrect price");
        
        // Transfer ownership
        ProductsList[productHash].owner = buyer;
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
}
