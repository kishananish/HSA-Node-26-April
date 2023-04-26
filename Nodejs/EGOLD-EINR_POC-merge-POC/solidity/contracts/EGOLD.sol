//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC20/ERC20.sol";
import "./ERC20/Ownable.sol";
import "./EINR.sol";
import "./EUSD.sol";

contract EGOLDContract is ERC20 {
    event Minted(address indexed _to, uint256 _amount);
    event Burned(address indexed _to, uint256 _amount);
    event InventoryAddressSet(
        address indexed _setBy,
        address indexed _InventoryAdd
    );
    event EINRAddressSet(address indexed _setBy, address indexed _EINRAdd);
    event EUSDAddressSet(address indexed _setBy, address indexed _EUSDAdd);
    event OwnableAddressSet(
        address indexed _setBy,
        address indexed _OwnableAddress
    );
    event EGOLD_INR_PriceSet(address indexed _setBy, uint256 _EGOLDPriceINR);
    event EGOLD_USD_PriceSet(address indexed _setBy, uint256 _EGOLDPriceUSD);
    event EGOLD_EINR_Transfer(
        address _from,
        address indexed _to,
        uint256 _EGoldAmount,
        uint256 _EINRAmount
    );
    event EGOLD_INR_Transfer(
        address _from,
        address indexed _to,
        bytes32 indexed _receipt,
        uint256 _EGoldmount,
        uint256 _INRAmount
    );
    event EGOLD_EUSD_Transfer(
        address _from,
        address indexed _to,
        uint256 _EGoldAmount,
        uint256 _EUSDAmount
    );
    event EGOLD_USD_Transfer(
        address _from,
        address indexed _to,
        bytes32 indexed _receipt,
        uint256 _EGoldmount,
        uint256 _USDAmount
    );

    OwnableContract public ownable;
    EINRContract public _EINR;
    EUSDContract public _EUSD;
    uint256 public EGoldPriceINR;
    uint256 public EGoldPriceUSD;
    uint256 public availableSupply;
    address public inventoryHandler;

    modifier onlyInventoryHandler() {
        require(
            msg.sender == inventoryHandler,
            "EGOLD: Only Inventory Handler Contract allowed."
        );
        _;
    }

    constructor() ERC20("EGOLD", "EGOLD") {}

    function setOwnable(address _ownable) external returns (bool) {
        require(
            _ownable != address(0),
            "EGOLD: new _ownalbe is the zero address"
        );
        if (address(ownable) == address(0)) {
            ownable = OwnableContract(_ownable);
            emit OwnableAddressSet(msg.sender, _ownable);
            return true;
        }
        require(ownable.checkOwner(msg.sender));
        ownable = OwnableContract(_ownable);
        emit OwnableAddressSet(msg.sender, _ownable);
        return true;
    }

    function setInventoryHandler(address _address) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "EGOLD: Ownable address not set"
        );
        require(
            inventoryHandler == address(0),
            "EGOLD: nventory Handler already set."
        );
        inventoryHandler = _address;
        emit InventoryAddressSet(msg.sender, inventoryHandler);
    }

    function mint(uint256 _amount) public onlyInventoryHandler {
        _mint(address(this), _amount);
        availableSupply = balanceOf(address(this));
        emit Minted(address(this), _amount);
    }

    function burn(uint256 _amount) public onlyInventoryHandler {
        require(
            balanceOf(address(this)) >= _amount,
            "EGOLD: Insufficient EGOLD in Contract."
        );
        _burn(address(this), _amount);
        availableSupply = balanceOf(address(this));
        emit Burned(address(this), _amount);
    }

    function setEINR(address _Einr) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "EGOLD: Ownable address not set"
        );
        _EINR = EINRContract(_Einr);
        emit EINRAddressSet(msg.sender, _Einr);
    }

    function setEUSD(address _Eusd) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "EGOLD: Ownable address not set"
        );
        _EUSD = EUSDContract(_Eusd);
        emit EUSDAddressSet(msg.sender, _Eusd);
    }

    function setEGoldPriceINR(uint256 _price) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "EGOLD: Ownable address not set"
        );
        EGoldPriceINR = _price;
        emit EGOLD_INR_PriceSet(msg.sender, EGoldPriceINR);
    }

    function setEGoldPriceUSD(uint256 _price) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "EGOLD: Ownable address not set"
        );
        EGoldPriceUSD = _price;
        emit EGOLD_USD_PriceSet(msg.sender, EGoldPriceUSD);
    }

    function buyEGoldEINR(uint256 _EGoldAmount) public {
        require(
            balanceOf(address(this)) >= _EGoldAmount,
            "EGOLD: Insufficient EGOLD in Contract."
        );
        require(EGoldPriceINR > 0, "EGOLD: EGOLD Price not set");
        uint256 totalEINR = EGoldPriceINR * (_EGoldAmount / 10 ** 18);
        require(
            _EINR.balanceOf(msg.sender) >= totalEINR,
            "EGOLD: Insuffcient EINR Balance"
        );
        _EINR.transferBal(msg.sender, totalEINR);
        _transfer(address(this), msg.sender, _EGoldAmount);
        availableSupply -= _EGoldAmount;
        emit EGOLD_EINR_Transfer(
            address(this),
            msg.sender,
            _EGoldAmount,
            totalEINR
        );
    }

    function buyEGoldINR(
        uint256 _EGoldAmount,
        address _to,
        bytes32 _receipt
    ) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "EGOLD: Ownable address not set"
        );
        require(
            balanceOf(address(this)) >= _EGoldAmount,
            "EGOLD: Insufficient EGOLD in Contract."
        );
        require(EGoldPriceINR > 0, "EGOLD: EGOLD Price not set");
        uint256 totalINR = (EGoldPriceINR / 10 ** 18) *
            (_EGoldAmount / 10 ** 18);
        _transfer(address(this), _to, _EGoldAmount);
        availableSupply -= _EGoldAmount;
        emit EGOLD_INR_Transfer(
            address(this),
            _to,
            _receipt,
            _EGoldAmount,
            totalINR
        );
    }

    function buyEGoldEUSD(uint256 _EGoldAmount) public {
        require(
            balanceOf(address(this)) >= _EGoldAmount,
            "EGOLD: Insufficient EGOLD in Contract."
        );
        require(EGoldPriceUSD > 0, "EGOLD: EGOLD Price not set");
        uint256 totalEUSD = EGoldPriceUSD * (_EGoldAmount / 10 ** 18);
        require(
            _EUSD.balanceOf(msg.sender) >= totalEUSD,
            "EGOLD: Insuffcient EUSD Balance"
        );
        _EUSD.transferBal(msg.sender, totalEUSD);
        _transfer(address(this), msg.sender, _EGoldAmount);
        availableSupply -= _EGoldAmount;
        emit EGOLD_EUSD_Transfer(
            address(this),
            msg.sender,
            _EGoldAmount,
            totalEUSD
        );
    }

    function buyEGoldUSD(
        uint256 _EGoldAmount,
        address _to,
        bytes32 _receipt
    ) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "EGOLD: Ownable address not set"
        );
        require(
            balanceOf(address(this)) >= _EGoldAmount,
            "EGOLD: Insufficient EGOLD in Contract."
        );
        require(EGoldPriceUSD > 0, "EGOLD: EGOLD Price not set");
        uint256 totalUSD = (EGoldPriceUSD / 10 ** 18) *
            (_EGoldAmount / 10 ** 18);
        _transfer(address(this), _to, _EGoldAmount);
        availableSupply -= _EGoldAmount;
        emit EGOLD_USD_Transfer(
            address(this),
            _to,
            _receipt,
            _EGoldAmount,
            totalUSD
        );
    }

    function BalEINR()
        public
        view
        returns (uint256 _BalEINR, uint256 _BalEUSD)
    {
        _BalEINR = _EINR.balanceOf(address(this));
        _BalEINR = _EUSD.balanceOf(address(this));
        return (_BalEINR, _BalEUSD);
    }
}
