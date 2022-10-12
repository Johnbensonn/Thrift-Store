// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

// Interface of an ERC-20 token so this contract can interact with it
interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract clothingThriftstore {
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    event newThriftstore(string brand, address _seller, uint256 _price);

    struct Thriftstore {
        address payable owner;
        string brand;
        string image;
        string color;
        string category;
        uint256 size;
        uint256 price;
        uint256 sold;
    }

    // keep track how many clothings
    uint256 private thriftstoreLength = 0;

    mapping(uint256 => Thriftstore) private thriftstores;

    // keeps track of thrift stores that exist
    mapping(uint256 => bool) private _exists;

    // checks if thrift store's index is a valid one
    modifier exists(uint256 _index) {
        require(_exists[_index], "Query of nonexistent thrift store");
        _;
    }

    /**
        * @dev allow users to add a thrift store to the marketplace
        * @notice Input data needs to contain only valid/non-empty values
     */
    function addThriftstore(
        string calldata _brand,
        string calldata _image,
        string calldata _color,
        string calldata _category,
        uint256 _size,
        uint256 _price
    ) public {
        require(bytes(_brand).length > 0, "Empty brand");
        require(bytes(_image).length > 0, "Empty image");
        require(bytes(_color).length > 0, "Empty color");
        require(bytes(_category).length > 0, "Empty category");
        require(_size > 1, "Invalid size");

        // 0: is available,
        uint256 _sold = 0;
        uint256 index = thriftstoreLength;
        // increase whenever we have a new brand added
        thriftstoreLength++;

        thriftstores[index] = Thriftstore(
            payable(msg.sender),
            _brand,
            _image,
            _color,
            _category,
            _size,
            _price,
            _sold
        );
        _exists[index] = true;

        // emit event to update UI
        emit newThriftstore(_brand, msg.sender, _price);
    }

    function getThriftstoreLength() public view returns (uint256) {
        return thriftstoreLength;
    }

    function getThriftstore(uint256 _index)
        public
        view
        exists(_index)
        returns (
            address payable,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256
        )
    {
        Thriftstore storage thriftstore = thriftstores[_index];
        return (
            thriftstore.owner,
            thriftstore.brand,
            thriftstore.image,
            thriftstore.color,
            thriftstore.category,
            thriftstore.size,
            thriftstore.price,
            thriftstore.sold
        );
    }

    /// @dev Function to delete thriftstore brand
    function deleteThriftstore(uint256 _index) external exists(_index) {
        require(
            msg.sender == thriftstores[_index].owner,
            "Only the owner can delete brand"
        );
        uint256 newThriftStoreLength = thriftstoreLength - 1;
        thriftstores[_index] = thriftstores[newThriftStoreLength];
        delete thriftstores[newThriftStoreLength];
        _exists[newThriftStoreLength] = false;
        thriftstoreLength = newThriftStoreLength;
    }

    /// @dev buy a product from a thrift store
    function buyThriftstore(uint256 _index) public payable exists(_index) {
        Thriftstore storage currentThriftStore = thriftstores[_index];
        require(
            currentThriftStore.owner != msg.sender,
            "You can't buy your own product"
        );
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                currentThriftStore.owner,
                currentThriftStore.price
            ),
            "Transfer failed"
        );

        currentThriftStore.sold++;
    }
}
