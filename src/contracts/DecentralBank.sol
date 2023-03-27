pragma solidity >0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank{
    string public name='Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stackers;

    mapping(address =>uint) public stackingBalance;
    mapping(address => bool)public hasStacked;
    mapping(address => bool)public isStacking;
    
    constructor(RWD _rwd,Tether _tether)public{
        rwd=_rwd;
        tether=_tether;
        owner=msg.sender;
    }

    function depositTokens(uint _amount)public{
        require(_amount>0,'amount cannot be 0');

        //transfer tether to this contract address for stacking
        tether.transferFrom(msg.sender, address(this), _amount);

        //update stacking balance
        stackingBalance[msg.sender]=stackingBalance[msg.sender]+ _amount;


     if(!hasStacked[msg.sender]){
        stackers.push(msg.sender);
        }

    //update stacking balance
    isStacking[msg.sender]=true;
    hasStacked[msg.sender]=true;

    }

    //unstake tokens
    function unstakeTokens()public{
        
        uint balance=stackingBalance[msg.sender];
        require(balance>0,'stacking balance cant be 0');

        //transfer the tokens to a contract from our bank
        tether.transfer(msg.sender,balance);
        stackingBalance[msg.sender]=0;
        isStacking[msg.sender]=false;
    }

    //issue rewards
    function issueTokens()public{
        //require owner to issue tokens only
        require(msg.sender==owner,'caller must be the owner');

        for(uint i=0;i<stackers.length;i++){
            address recipient=stackers[i];
            uint balance=stackingBalance[recipient]/9;
            if(balance>0){
            rwd.transfer(recipient,balance);
            }
        }

    }

    

}