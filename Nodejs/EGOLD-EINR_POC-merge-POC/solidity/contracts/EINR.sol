//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC20/ERC20.sol";
import "./ERC20/Ownable.sol";

contract EINRContract is ERC20 {
    event Minted(
        address indexed _owner,
        address indexed _to,
        uint256 indexed _amount
    );
    event EGOLDAddressSet(address indexed _setBy, address indexed _EGOLDAdd);
    event TransferEINRtoEGOLD(
        address indexed _from,
        address _to,
        uint256 _amount
    );
    event OwnableAddressSet(address indexed _setBy, address indexed _OwnableAddress);

    OwnableContract public ownable;
    address public EGOLD;

    constructor() ERC20("EINR", "EINR") {}

    modifier onlyEGOLD() {
        require(msg.sender == EGOLD, "EINR: only EGOLD contract");
        _;
    }

    function setOwnable(address _ownable) external returns (bool) {
        require(_ownable != address(0), "EINR: new _ownalbe is the zero address");
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

    function mint(address _account, uint256 _amount) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "EINR: Ownable address not set"
        );
        _mint(_account, _amount);
        emit Minted(msg.sender, _account, _amount);
    }

    function setEGOLD(address _Egold) public {
        require(
            address(ownable) != address(0) && ownable.checkOwner(msg.sender),
            "EINR: Ownable address not set"
        );
        EGOLD = _Egold;
        emit EGOLDAddressSet(msg.sender, _Egold);
    }

    function transferBal(address _from, uint256 _amount) external onlyEGOLD {
        _transfer(_from, EGOLD, _amount);
        emit TransferEINRtoEGOLD(_from, EGOLD, _amount);
    }
}
