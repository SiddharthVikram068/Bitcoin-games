// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Transaction
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
    // event OwnerRegistered(string indexed ownerAddress, string ownerName); 
    event ProductRegistered(bytes32 indexed productHash, address ownerAddress);
    event ProductSold(address indexed seller, address indexed buyer, bytes32 indexed productHash, uint price);
    event ProductForSaleSet(bytes32 indexed productHash, bool forSale);
    event OwnerVerified(address indexed ownerAddress, bytes32 productHash, bool verified, uint256 indexed timestamp);
    event ProductDescriptionChanged(bytes32 indexed productHash, string newDescription);
    event ProductPriceChanged(bytes32 indexed productHash, uint newPrice);
    event GetOwnerOfProd(bytes32 indexed productHash, address indexed owner);
    event NotificationSent(address indexed sender, address indexed reciever, string message);

    // Function to convert a valid hex string to an address
    function convertToAddress(string memory addressString) public pure returns (address) {
        bytes memory addr = bytes(addressString);
        require(addr.length == 42, "Invalid address length"); // Ensure it is a proper length for an address
        uint160 addressUint = 0;
        for (uint i = 2; i < 42; i++) {
            uint160 b = uint160(uint8(addr[i]));
            if (b >= 48 && b <= 57) {
                addressUint *= 16;
                addressUint += (b - 48);
            } else if (b >= 65 && b <= 70) {
                addressUint *= 16;
                addressUint += (b - 55);
            } else if (b >= 97 && b <= 102) {
                addressUint *= 16;
                addressUint += (b - 87);
            } else {
                revert("Invalid character in address");
            }
        }
        return address(addressUint);
    }

    function registerOwner(string memory ownerAddress, string memory ownerName) public returns (bool) 
    {
        address addr = convertToAddress(ownerAddress);
        require(addr != address(0), "Invalid address");
        require(OwnersList[addr].ownerAddress == address(0), "Owner already registered");

        ownerCount++;
        OwnersList[addr] = Owner
        ({
            ownerName: ownerName,
            ownerAddress: payable(addr),
            productHashes: new bytes32[](0)
        });

        emit OwnerRegistered(addr, ownerName);
        return true;
    }

    function SendEther(string memory addr) external payable
    {

        require(msg.value > 0, "Amount should be greater than 0");
        address reciever = convertToAddress(addr);
        payable(reciever).transfer(msg.value);
    }

    // Generate a hash for a product
    function generateHash(string memory addr, uint256 number) public pure returns (bytes32) 
    {
        address ownerAddress = convertToAddress(addr);
        return keccak256(abi.encodePacked(ownerAddress, number*number));
    }

    // Register a new product
    function registerProduct(string memory addr, string memory desc, uint256 price) public returns (bool) 
    {
        address ownerAddress = convertToAddress(addr);
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
    function verifyOwner(string memory addr, bytes32 productHash) public view returns (bool) 
    {
        address ownerAddress = convertToAddress(addr);
        require(OwnersList[ownerAddress].ownerAddress != address(0), "Owner not registered");
        require(ProductsList[productHash].productHash != bytes32(0), "Product does not exist");

        if(ProductsList[productHash].owner == ownerAddress)
        {
            // emit OwnerVerified(ownerAddress, productHash, true, timestamp);
            return true;
        }
        return false;
    }

    function buyProduct(string memory sellerAddr, bytes32 productHash) public payable returns (bool) 
    {   
        address seller = convertToAddress(sellerAddr);
        require(ProductsList[productHash].owner == seller, "Seller is not the owner");
        require(OwnersList[seller].ownerAddress != address(0), "Seller not registered");
        require(ProductsList[productHash].isForSale, "Product is not for sale");

        // Money sent should be equal to the price of the product
        // require(msg.value == ProductsList[productHash].price, "Incorrect price");

        // Remove product from seller
        removeProductFromOwner(sellerAddr, productHash);
        
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
    function buyManyProducts(string memory sellerAddr, bytes32[] memory productHashes, uint totalPrice) public payable
    {
        address seller = convertToAddress(sellerAddr);
        require(msg.value == totalPrice, "incorrect payment amount");
        for(uint i = 0; i<productHashes.length; i++) {
            bytes32 hash = productHashes[i];
            Product storage product = ProductsList[hash];

            require(product.owner == seller, "seller does not own the product");
            removeProductFromOwner(sellerAddr, hash);

            ProductsList[hash].owner = payable(msg.sender);
            ProductsList[hash].isForSale = false;

            OwnersList[msg.sender].productHashes.push(hash);

        }
        payable(seller).transfer(msg.value);

    }

    // Remove product from owner
    function removeProductFromOwner(string memory ownerAddr, bytes32 productHash) internal 
    {
        address owner = convertToAddress(ownerAddr);
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
    function getAllProductsByOwner(string memory owner) public view returns (Product[] memory) 
    {
        address ownerAddress = convertToAddress(owner);
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