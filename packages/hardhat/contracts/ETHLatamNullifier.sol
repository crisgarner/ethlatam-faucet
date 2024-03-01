// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * @dev A simple user registry managed by a trusted entity.
 */
contract ETHLatamNullifier is Ownable {

  mapping(uint256 => bool) private semaphoreIds;

  // Events
  event UserAdded(uint256 _semaphoreId);

  /**
    * @dev Add verified unique user to the registry.
    */
  function addUser(uint256 _semaphoreId)
    external
    onlyOwner
  {
    require(!semaphoreIds[_semaphoreId], 'ETHLatamNullifier: User already registred');
    semaphoreIds[_semaphoreId] = true;
    emit UserAdded(_semaphoreId);
  }

  /**
    * @dev Check if the user is verified.
    */
  function isVerifiedUser(uint256 _semaphoreId)
    external
    view
    returns (bool)
  {
    return semaphoreIds[_semaphoreId];
  }
}
