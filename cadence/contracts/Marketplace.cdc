import NonFungibleToken from 0x631e88ae7f1d7c20
import MyNFT from 0x3f42e39a475baeba
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

pub contract NFTMarketplace{

    pub resource interface SaleCollectionPublic{
        pub fun getIds(): [UInt64]
        pub fun getPrice(id: UInt64): UFix64
        pub fun purchase(id: UInt64, receipientCollection: &MyNFT.Collection{NonFungibleToken.CollectionPublic}, payment: @FlowToken.Vault)
    }

    pub resource SaleCollection: SaleCollectionPublic {
        pub var forSale: {UInt64: UFix64}
        pub let MyNFTCollection: Capability<&MyNFT.Collection>
        pub let FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>

        pub fun listForSale(id: UInt64, price: UFix64){
            pre{
                price > 0.0: "Please put the price greater than 0"
                self.MyNFTCollection.borrow()!.getIDs().contains(id): "This SaleCollection owner does not have this NFT"
            }

            self.forSale[id] = price
        }

        pub fun unListFromSale(id: UInt64){
            self.forSale.remove(key: id)
        }

        pub fun purchase(id: UInt64, receipientCollection: &MyNFT.Collection{NonFungibleToken.CollectionPublic}, payment: @FlowToken.Vault){
            pre{
                payment.balance == self.forSale[id]: "Payment is not eqal to the price of nft"
            }

            receipientCollection.deposit(token: <- self.MyNFTCollection.borrow()!.withdraw(withdrawID: id))
            self.FlowTokenVault.borrow()!.deposit(from: <- payment)
        }

        pub fun getPrice(id: UInt64): UFix64{
            return self.forSale[id]!        
        }

        pub fun getIds(): [UInt64]{
            return self.forSale.keys
        }

        init(_MyNFTCollection: Capability<&MyNFT.Collection>,
             _FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>){
             self.forSale = {}
             self.MyNFTCollection = _MyNFTCollection
             self.FlowTokenVault = _FlowTokenVault
        }

        
    }

    pub fun createSaleCollection(MyNFTCollection: Capability<&MyNFT.Collection>,
            FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>): @SaleCollection{
            
        return <- create SaleCollection(_MyNFTCollection: MyNFTCollection, _FlowTokenVault: FlowTokenVault)
    }

    init(){}

}