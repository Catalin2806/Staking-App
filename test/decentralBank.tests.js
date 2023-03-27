const Tether=artifacts.require('Tether');
const RWD=artifacts.require('RWD');
const DecentralBank=artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank',([owner,customer])=>{
    //tot codul pt test vine aici

    let tether,rwd,decentralBank;

    function tokens(number){
        return web3.utils.toWei(number,'ether');
    }

    before(async()=>{
        //load contracts
       tether= await Tether.new();
       rwd=await RWD.new();
       decentralBank=await DecentralBank.new(rwd.address,tether.address)

       //transfer all tokens to DecentalBank(1 milion)
        await rwd.transfer(decentralBank.address,tokens('1000000'));

        //Transfer 100 mock Tethers to customer
        await tether.transfer(customer,tokens('100'),{from:owner});

    })

    describe('Tether Deployment', async()=>{

        it('matches name successfully', async()=>{
            const name=await tether.name();
            assert.equal(name,'Tether');
        })
    })

    describe('Reward Token Deployment', async()=>{
        it('matches name successfully', async()=>{
            const name=await rwd.name();
            assert.equal(name,'Reward Token');
        })
    })

    describe('Decental Bank Deployment', async()=>{
        it('matches name successfully', async()=>{
            const name=await decentralBank.name();
            assert.equal(name,'Decentral Bank');
        })

        it('contract has tokens',async()=>{
            let balance=await rwd.balanceOf(decentralBank.address);
            assert.equal(balance,tokens('1000000'));
        })

    describe('Yield Farming',async()=>{
        it('reword tokens for stacking',async ()=>{

            let result;
                //check inverstor balance
                result=await tether.balanceOf(customer);
                assert.equal(result.toString(),tokens('100'),'customer balance before stacking');
       

    //check stacking customer
        await tether.approve(decentralBank.address,tokens('100'),{from:customer});
        await decentralBank.depositTokens(tokens('100'),{from:customer});

    //check updated balance of customer
        result=await tether.balanceOf(customer);
        assert.equal(result.toString(),tokens('0'),'customer balance after stacking');
    
    //check updated balance of bank
        result=await tether.balanceOf(decentralBank.address);
        assert.equal(result.toString(),tokens('100'),'bank balance after stacking');

    //is stacking balance
        result=await decentralBank.isStacking(customer);
        assert.equal(result.toString(),'true','customer stacking status is true');

    //issue tokens
    await decentralBank.issueTokens({from:owner});

    //only owner can issue tokens
    await decentralBank.issueTokens({from:customer}).should.be.rejected;

    //unstake tokens
    await decentralBank.unstakeTokens({from:customer});

    //check unstacking balances
    result=await tether.balanceOf(customer);
        assert.equal(result.toString(),tokens('100'),'customer balance after unstacking');
    
    //check updated balance of bank
        result=await tether.balanceOf(decentralBank.address);
        assert.equal(result.toString(),tokens('0'),'bank balance after unstacking');

    //is stacking update
        result=await decentralBank.isStacking(customer);
        assert.equal(result.toString(),'false','customer is no longer stacking');    
        })
    })
    })
})