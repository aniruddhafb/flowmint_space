export const mintNFT = `
import MyNFT from 0xf73c8cad96ae5176

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
