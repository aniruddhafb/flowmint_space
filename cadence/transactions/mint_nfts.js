export const mintNFT = `
import MyNFT from 0xbdcf8c2d966d8ac9

transaction(ipfsHash: String, name: String, coordinate: String){

    prepare(acct: AuthAccount){
        let collection = acct.borrow<&MyNFT.Collection>(from: /storage/MyNFTCollection)
                            ?? panic("this collection does not exist")

        let nft <- MyNFT.createToken(ipfsHash: ipfsHash, metadata: {"name": name}, token_coordinate: coordinate)
    
        collection.deposit(token: <- nft)
    }

    execute{
        log("User Minted NFT")
    }
}`;
