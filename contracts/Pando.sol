pragma solidity ^0.4.19;

import "./apps/AragonApp.sol";

contract Pando is AragonApp {
  
  bytes32 constant public PUSH = bytes32(1);
      
  string public repository;


  function initialize() onlyInit {
      initialized();
  }

  function setRepository(string _repository) auth(PUSH) {
      repository = _repository;
  }

  function getRepository() constant returns (string) {
      return repository;
  }
}