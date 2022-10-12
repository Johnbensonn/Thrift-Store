// SPDX-License-Identifier: MIT   
 
pragma solidity >=0.7.0 <0.9.0; 
 
// Interface of an ERC-20 token so this contract can interact with it 
interface IERC20Token { 
  function transfer(address, uint256) external returns (bool); 
  function approve(address, uint256) external returns (bool); 
  function transferFrom(address, address, uint256) external returns (bool); 
  function totalSupply() external view returns (uint256); 
  function balanceOf(address) external view returns (uint256); 
  function allowance(address, address) external view returns (uint256); 
 
  event Transfer(address indexed from, address indexed to, uint256 value); 
  event Approval(address indexed owner, address indexed spender, uint256 value); 
} 
 
contract clothingThriftstore {   
 
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1; 
 
    event newThriftstore(string brand, address _seller, uint _price); 
 
    struct Thriftstore { 
        address payable owner; 
        string brand; 
        string image; 
        string color; 
        string category; 
        uint size; 
        uint price; 
        uint sold; 
    } 
 
    // keep track how many clothings 
    uint internal thriftstoreLength = 0; 
 
    mapping(uint => Thriftstore) internal thriftstores; 
 
    function addThriftstore(  
        string memory _brand, 
        string memory _image, 
        string memory _color, 
        string memory _category, 
        uint _size, 
        uint _price 
    ) public { 
        // 0: is available, 
        uint _sold = 0; 
 
        thriftstores[thriftstoreLength] = Thriftstore( 
            payable(msg.sender), 
            _brand, 
            _image, 
            _color, 
            _category, 
            _size, 
            _price, 
            _sold 
        ); 
 
        // increase whenever we have a new brand added 
        thriftstoreLength++; 
 
        // emit event to update UI 
        emit newThriftstore(_brand, msg.sender, _price); 
    } 
 
    function getThriftstoreLength() public view returns (uint) { 
        return thriftstoreLength; 
    } 
 
    function getThriftstore(uint _index) public view returns ( 
        address payable, 
        string memory, 
        string memory, 
        string memory, 
        string memory, 
        uint, 
        uint, 
        uint 
    ) { 
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
 
 //Function to delete thriftstore brand 
    function deleteThriftstore(uint _index) external { 
         require(msg.sender == thriftstores[_index].owner, "Only the owner can delete brand");          
            thriftstores[_index] = thriftstores[thriftstoreLength - 1]; 
            delete thriftstores[thriftstoreLength - 1]; 
            thriftstoreLength--;  
  } 
 
 
    // buy a product from our contract 
    function buyThriftstore(uint _index) public payable { 
        require( 
            IERC20Token(cUsdTokenAddress).transferFrom( 
                msg.sender, 
                thriftstores[_index].owner, 
                thriftstores[_index].price 
            ), 
            "Transfer failed" 
        ); 
 
        thriftstores[_index].sold++; 
    } 
 
}