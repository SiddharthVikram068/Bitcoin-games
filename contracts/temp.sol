// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract temp
{   
    // address payable public ownerAddress;

    struct Owner 
    {
        string ownerName;
        address payable ownerAddress;
        bytes32[] productHashes; 
    }

    struct Product 
    {
        bytes32 productHash;
        string description;
        uint price;
        bool isForSale;
        address payable owner;
    }

    uint256 public productCount = 0;
    uint256 public ownerCount = 0;
    mapping(address => Owner) public OwnersList;
    mapping(bytes32 => Product) public ProductsList;

    event OwnerRegistered(address indexed ownerAddress, string ownerName); 
    event ProductRegistered(bytes32 indexed productHash, address ownerAddress);
    event ProductSold(address indexed seller, address indexed buyer, bytes32 indexed productHash, uint price);
    event ProductForSaleSet(bytes32 indexed productHash, bool forSale);
    event OwnerVerified(address indexed ownerAddress, bytes32 productHash, bool verified, uint256 indexed timestamp);
    event ProductDescriptionChanged(bytes32 indexed productHash, string newDescription);
    event ProductPriceChanged(bytes32 indexed productHash, uint newPrice);
    event GetOwnerOfProd(bytes32 indexed productHash, address indexed owner);
    event NotificationSent(address indexed sender, address indexed reciever, string message);

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

    function SendEther(address reciever) external payable
    {
        require(msg.value > 0, "Amount should be greater than 0");
        payable(reciever).transfer(msg.value);
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
    // function verifyOwner(address ownerAddress, bytes32 productHash, uint256 timestamp) public view returns (bool) 
    function verifyOwner(address ownerAddress, bytes32 productHash) public view returns (bool) 
    {
        require(OwnersList[ownerAddress].ownerAddress != address(0), "Owner not registered");
        require(ProductsList[productHash].productHash != bytes32(0), "Product does not exist");

        if(ProductsList[productHash].owner == ownerAddress)
        {
            // emit OwnerVerified(ownerAddress, productHash, true, timestamp);
            return true;
        }
        return false;
    }

    function buyProduct(address seller, bytes32 productHash) public payable returns (bool) 
    {
        require(ProductsList[productHash].owner == seller, "Seller is not the owner");
        require(OwnersList[seller].ownerAddress != address(0), "Seller not registered");
        require(ProductsList[productHash].isForSale, "Product is not for sale");

        // Money sent should be equal to the price of the product
        // require(msg.value == ProductsList[productHash].price, "Incorrect price");

        // Remove product from seller
        removeProductFromOwner(seller, productHash);
        
        // Transfer ownership
        ProductsList[productHash].owner = payable(msg.sender);
        ProductsList[productHash].isForSale = false;

        // Add product to buyer
        OwnersList[msg.sender].productHashes.push(productHash);

        // Transfer funds to seller
        payable(seller).transfer(msg.value);

        emit ProductSold(seller, msg.sender, productHash, msg.value);
        return true;
    }

    // to buy multiple products 
    function buyManyProducts(address seller, bytes32[] memory productHashes, uint totalPrice) public payable
    {
        require(msg.value == totalPrice, "incorrect payment amount");
        for(uint i = 0; i<productHashes.length; i++) {
            bytes32 hash = productHashes[i];
            Product storage product = ProductsList[hash];

            require(product.owner == seller, "seller does not own the product");
            removeProductFromOwner(seller, hash);

            ProductsList[hash].owner = payable(msg.sender);
            ProductsList[hash].isForSale = false;

            OwnersList[msg.sender].productHashes.push(hash);

        }
        payable(seller).transfer(msg.value);

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
    

    // function seller scan for single item
    // function transfer ownership of an array of product Hashes -> DONE IN FRONTEND PART ONLY
}