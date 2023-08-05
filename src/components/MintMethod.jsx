import React, { useState } from 'react'
import { useStorage } from "@thirdweb-dev/react";

const MintMethod = ({ set_ipfs_hash }) => {

    const storage = useStorage();
    const [isLoading, setLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "row",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <p style={{ marginLeft: "76px" }}>Select Image - </p>
            {!isUploaded ?
                (
                    isLoading ?
                        "uploading please wait.."
                        :
                        <input
                            type="file"
                            className="text"
                            required
                            onChange={(async (e) => {
                                setLoading(true);
                                const ipfs_upload = await storage.upload(e.target.files[0]);
                                set_ipfs_hash(ipfs_upload);
                                console.log(ipfs_upload);
                                setLoading(false);
                                setIsUploaded(true);
                            })}
                            style={{ margin: "12px 0", padding: "4px" }}
                        />
                )
                :
                <p style={{ marginLeft: "10px" }}>Succesfully uploaded :) </p>
            }

        </div>
    )
}

export default MintMethod