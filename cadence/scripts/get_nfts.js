export const getNFTs = `
import MyNFT from 0xf73c8cad96ae5176
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): [&MyNFT.NFT]{

    let collection = getAccount(account).getCapability(/public/MyNFTCollection)
                        .borrow<&MyNFT.Collection{NonFungibleToken.CollectionPublic, MyNFT.CollectionPublic}>()
                        ?? panic("can't get the users collection")
                        
    let returnVals: [&MyNFT.NFT] = []
    let ids = collection.getIDs()
    for id in ids {
        returnVals.append(collection.borrowEntireNFT(id: id))
    }
    return returnVals
}
`;
