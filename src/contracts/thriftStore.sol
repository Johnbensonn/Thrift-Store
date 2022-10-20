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
 
    modifier onlyOwner(uint _index){
        require(msg.sender == thriftstores[_index].owner, "not Owner");
        _;          
    }

    modifier validInput(uint _input){
        require(_input > 0, "not valid input");
        _;
    }

    modifier validString(string memory _input){
        require(bytes(_input).length > 0, "not valid input");
        _;
    }

    function addThriftstore(  
        string memory _brand, 
        string memory _image, 
        string memory _color, 
        string memory _category, 
        uint _size, 
        uint _price 
    ) public 
      validInput(_size) validInput(_price)
      validString(_brand) validString(_color){  

        thriftstores[thriftstoreLength] = Thriftstore( 
            payable(msg.sender), 
            _brand, 
            _image, 
            _color, 
            _category, 
            _size, 
            _price, 
            0 
        ); 
 
        // increase whenever we have a new brand added 
        thriftstoreLength++; 
 
        // emit event to update UI 
        emit newThriftstore(_brand, msg.sender, _price); 
    } 

    // buy a product from our contract 
    function buyThriftstore(uint _index) public payable {
        require(msg.sender != thriftstores[_index].owner, "owner cannot buy") ;
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
 
 //Function to delete thriftstore brand 
    function deleteThriftstore(uint _index) external onlyOwner(_index){ 
        thriftstores[_index] = thriftstores[thriftstoreLength - 1]; 
        delete thriftstores[thriftstoreLength - 1]; 
        thriftstoreLength--;  
   }

   function changePrice(uint _index, uint _price) external onlyOwner(_index) validInput(_price){
        thriftstores[_index].price = _price;
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

}