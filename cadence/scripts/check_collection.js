export const get_user_collection = `
import MyNFT from 0x3f42e39a475baeba
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): &MyNFT.Collection{NonFungibleToken.CollectionPublic, MyNFT.CollectionPublic}{
    
    let collection = getAccount(account).getCapability(/public/MyNFTCollection)
                        .borrow<&MyNFT.Collection{NonFungibleToken.CollectionPublic, MyNFT.CollectionPublic}>()
                        ?? panic("can't get the users collection")

    
    return collection
}
`;
