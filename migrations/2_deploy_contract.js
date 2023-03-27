const Tether=artifacts.require('Tether');
const RWD=artifacts.require('RWD');
const DecentralBank=artifacts.require('DecentralBank');

module.exports=async function(deployer,network,accounts){
    //deploy tether contract
    await deployer.deploy(Tether);
    const tether=await Tether.deployed();
    //deploy RWD contract
    await deployer.deploy(RWD);
    const rwd=await RWD.deployed();
    //deploy DecentralBank contract
    await deployer.deploy(DecentralBank,rwd.address,tether.address);
    const decentralBank=await DecentralBank.deployed();

    //transfer all RWD tokens to decentralBank
    await rwd.transfer(decentralBank.address,'1000000000000000000000000');

    //distribute 100 Tether tokens to investor
    await tether.transfer(accounts[1],'100000000000000000000');  
};