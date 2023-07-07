export const mintNFT = `
import MyNFT from 0x848c318deca591e8

transaction(ipfsHash: String, name: String){

    prepare(acct: AuthAccount){
        let collection = acct.borrow<&MyNFT.Collection>(from: /storage/MyNFTCollection)
                            ?? panic("this collection does not exist")

        let nft <- MyNFT.createToken(ipfsHash: ipfsHash, metadata: {"name": name})

        collection.deposit(token: <- nft)
    }

    execute{
        log("User Minted NFT")
    }
}`;
