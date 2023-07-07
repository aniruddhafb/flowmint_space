export const setupUserTx = `
import MyNFT from 0x848c318deca591e8
import NonFungibleToken from 0x631e88ae7f1d7c20
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import NFTMarketplace from 0x848c318deca591e8
transaction(){

    prepare(acct: AuthAccount){
        acct.save(<- MyNFT.createEmptyCollection(), to: /storage/MyNFTCollection)
        acct.link<&MyNFT.Collection{MyNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/MyNFTCollection, target: /storage/MyNFTCollection)
        acct.link<&MyNFT.Collection>(/private/MyNFTCollection, target: /storage/MyNFTCollection)

        
        let MyNFTCollection = acct.getCapability<&MyNFT.Collection>(/private/MyNFTCollection)
        let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        
        acct.save(<- NFTMarketplace.createSaleCollection(MyNFTCollection: MyNFTCollection, FlowTokenVault: FlowTokenVault ),
         to: /storage/MySaleCollection)

        acct.link<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>
            (/public/MySaleCollection, target: /storage/MySaleCollection)

    }

    execute{
        log("User stored a collection & sale collection")
    }
}

`;
