//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC20/Ownable.sol";
import "./EGOLD.sol";

contract Inventory {
    event EGOLDAddressSet(address indexed _EGOLDAddress);
    event eGOLDRatio(uint256 _eGOLDTokens);
    event InventoryAdded(address indexed _addBy, uint256 indexed _amount);
    event InventoryRemoved(address indexed _removeBy, uint256 indexed _amount);
    event OwnableAddressSet(
        address indexed _setBy,
        address indexed _OwnableAddress
    );

    OwnableContract public ownable;
    EGOLDContract public EGOLDAdd;
    uint256 public inventory;
    uint256 public eGOLDratio;

    constructor(uint256 _eGOLDRatio) {
        eGOLDratio = _eGOLDRatio * 10 ** 18;
    }

    function setOwnable(address _ownable) external returns (bool) {
        require(
            _ownable != address(0),
            "Inventory: new _ownalbe is the zero address"
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

    function setEGOLDAddress(address _EGOLDAddress) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "Inventory: Ownable address not set"
        );
        EGOLDAdd = EGOLDContract(_EGOLDAddress);
        emit EGOLDAddressSet(_EGOLDAddress);
    }

    function addInventory(uint256 _amount) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "Inventory: Ownable address not set"
        );
        require(
            address(EGOLDAdd) != address(0),
            "Inventory: EGOLD address not set."
        );
        require(eGOLDratio > 0, "Inventory: eGOLDRatio should not be zero.");
        inventory += _amount;
        EGOLDAdd.mint(_amount * eGOLDratio);
        emit InventoryAdded(msg.sender, _amount);
    }

    function removeInventory(uint256 _amount) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "Inventory: Ownable address not set"
        );
        require(
            address(EGOLDAdd) != address(0),
            "Inventory: EGOLD address not set."
        );
        require(eGOLDratio > 0, "Inventory: eGOLDRatio should not be zero.");
        require(inventory >= _amount, "Inventory: Insufficient inventory.");
        inventory -= _amount;
        EGOLDAdd.burn(_amount * eGOLDratio);
        emit InventoryRemoved(msg.sender, _amount);
    }
}
