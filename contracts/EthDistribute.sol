//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./utils/Ownable.sol";
import "./libraries/SafeMath.sol";

// solhint-disable no-empty-blocks, avoid-low-level-calls
contract EthDistribute is Ownable {
    using SafeMath for uint256;

    address payable private _marketingWallet;
    address payable private _devWallet;
    address payable private _treasuryWallet;

    uint256 private _marketingShare = 40;
    uint256 private _devShare = 10;
    uint256 private _treasuryShare = 50;
    
    constructor(
        address payable marketingWallet_,
        address payable devWallet_,
        address payable treasuryWallet_
    ) {
        _marketingWallet = marketingWallet_;
        _devWallet = devWallet_;
        _treasuryWallet = treasuryWallet_;
    }

    fallback() external payable {}
    receive() external payable {}

    function claim() external {
        uint256 startingBalance = address(this).balance;
        (bool marketingSent, ) = _marketingWallet.call{value: startingBalance.mul(_marketingShare).div(100)}("");
        (bool devSent, ) = _devWallet.call{value: startingBalance.mul(_devShare).div(100)}("");
        (bool treasurySent, ) = _treasuryWallet.call{value: startingBalance.mul(_treasuryShare).div(100)}("");
        require(marketingSent && devSent && treasurySent, "Send failed");
    }

    function setMarketingWallet(address payable account) external onlyOwner {
        require(account != address(0), "Cannot be 0 address");
        _marketingWallet = account;
    }

    function setDevWallet(address payable account) external onlyOwner {
        require(account != address(0), "Cannot be 0 address");
        _devWallet = account;
    }

    function setTreasuryWallet(address payable account) external onlyOwner {
        require(account != address(0), "Cannot be 0 address");
        _treasuryWallet = account;
    }

    function setNewShares(uint256 marketingShare, uint256 devShare, uint256 treasuryShare) external onlyOwner {
        require(
            marketingShare.add(devShare).add(treasuryShare) == 100, "Does not add up to 100"
        );

        _marketingShare = marketingShare;
        _devShare = devShare;
        _treasuryShare = treasuryShare;
    }

    function getWallets() external view returns (address, address, address) {
        return (_marketingWallet, _devWallet, _treasuryWallet);
    }

    function getShare() external view returns (uint256, uint256, uint256) {
        return (_marketingShare, _devShare, _treasuryShare);
    }
}