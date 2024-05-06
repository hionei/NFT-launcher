import { ThirdwebNftMedia, useContract, useNFT, Web3Button, MediaRenderer } from "@thirdweb-dev/react";
import { useEffect, type FC } from "react";
import { nftDropContractAddress, stakingContractAddress } from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";

interface NFTCardProps {
  tokenId: number;
}

const NFTCard: FC<NFTCardProps> = ({ tokenId }) => {
  const { contract } = useContract(nftDropContractAddress, "nft-drop");
  const { data: nft } = useNFT(contract, tokenId);

  useEffect(() => {
    console.log(nft?.metadata);
  }, []);

  return (
    <>
      {nft && (
        <div className={styles.nftBox}>
          {/* <MediaRenderer src={nft.metadata.uri} /> */}
          {nft.metadata && <ThirdwebNftMedia metadata={nft.metadata} className={styles.nftMedia} />}
          <h3 className="text-[15px] text-[#ccc]">{nft.metadata.name}</h3>
          <Web3Button
            action={(contract) => contract?.call("withdraw", [[nft.metadata.id]])}
            contractAddress={stakingContractAddress}
          >
            Withdraw
          </Web3Button>
        </div>
      )}
    </>
  );
};
export default NFTCard;
