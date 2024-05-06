import {
  ConnectWallet,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import NFTCard from "../components/NFTCard";
import { nftDropContractAddress, stakingContractAddress, tokenContractAddress } from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";
import webGLFluidEnhanced from "./Fluid/Fluid";
import Link from "next/link";

const Stake: NextPage = () => {
  const address = useAddress();
  const { contract: nftDropContract } = useContract(nftDropContractAddress, "nft-drop");
  const { contract: tokenContract } = useContract(tokenContractAddress, "token");
  const { contract, isLoading } = useContract(stakingContractAddress);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [address]);
  const canvasRef = useRef<any>();

  useEffect(() => {
    const webGlFluid = new webGLFluidEnhanced();
    webGlFluid.simulation(canvasRef.current, {
      SIM_RESOLUTION: 256,
      DENSITY_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 30,
      COLOR_PALETTE: ["#428dcf"],
      TRANSPARENT: false,
      BLOOM: false,
    });
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await contract?.call("getStakeInfo", [address]);
      setClaimableRewards(stakeInfo[1]);
    }

    loadClaimableRewards();
  }, [address, contract]);

  async function stakeNft(id: string) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(address, stakingContractAddress);
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    await contract?.call("stake", [[id]]);
  }

  if (isLoading) {
    return (
      <div className="relative">
        <canvas ref={canvasRef} className="fluid-canvas"></canvas>
        Loading...
      </div>
    );
  }

  return (
    <div className={"relative w-full flex justify-center flex-col items-center"}>
      <canvas ref={canvasRef} className="fluid-canvas"></canvas>
      <div className="absolute right-2 top-2">
        <Link href="/mint" className="link relative !inline-block">
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            xmlns="http://www.w3.org/2000/svg"
            className="link__svg"
            aria-labelledby="link1-title link1-desc"
          >
            <title id="link1-title">Come quick and click this</title>
            <desc id="link1-desc">A rotating link with text placed around a circle with an arrow inside</desc>

            <path
              id="link-circle"
              className="link__path"
              d="M 20, 100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
              stroke="none"
              fill="none"
            />

            <path className="link__arrow" d="M 75 100 L 125 100 L 110 85 M 125 100 L 110 115" fill="none" />

            <text className="link__text">
              <textPath href="#link-circle" stroke="none">
                Click this to mint an NFT
              </textPath>
            </text>
          </svg>
        </Link>
      </div>
      <div className="flex pointer-events-none justify-center items-center back-image"></div>

      <h1 className="relative flex items-center justify-center  gap-2 text-[2em] mt-10">
        <span className="bg-white inline-block w-[40px] px-2 py-1 rounded">
          <img src="nft.png" />
        </span>
        Stake
      </h1>

      <h2 className="relative text-[1.5em] text-center my-10">Stake Your NFTs - Earn ERC20</h2>
      <hr className={`relative border-gray-300 border-opacity-25 w-[90%]`} />

      {!address ? (
        <div className="relative mt-3">
          <ConnectWallet />
        </div>
      ) : (
        <>
          <div className={`${styles.tokenGrid} relative`}>
            <div className={`${styles.tokenItem} bg-[#aaaaaa1a] border-ani-box`}>
              <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
              <p className={styles.tokenValue}>
                <b>{!claimableRewards ? "Loading..." : ethers.utils.formatUnits(claimableRewards, 18)}</b> {tokenBalance?.symbol}
              </p>
            </div>
            <div className={`${styles.tokenItem} bg-[#aaaaaa1a]`}>
              <h3 className={styles.tokenLabel}>Current Balance</h3>
              <p className={styles.tokenValue}>
                <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
              </p>
            </div>
          </div>

          <div className="relative">
            <Web3Button action={(contract) => contract.call("claimRewards")} contractAddress={stakingContractAddress}>
              Claim Rewards
            </Web3Button>
          </div>

          <hr className={`border-gray-300 border-opacity-25 mt-10 mb-2 w-[90%] relative`} />
          <h2 className="text-[1.6em] relative">Your Staked NFTs</h2>
          <div className={`${styles.nftBoxGrid} relative`}>
            {stakedTokens && stakedTokens[0].length > 0 ? (
              stakedTokens[0].map((stakedToken: BigNumber) => (
                <NFTCard tokenId={stakedToken.toNumber()} key={stakedToken.toString()} />
              ))
            ) : (
              <p className="text-[#aaa] text-[0.8em]">You don&apos;t have staked NFTs</p>
            )}
          </div>

          <hr className={`relative border-gray-300 border-opacity-25 mt-10 mb-2 w-[90%]`} />
          <h2 className="relative text-[1.6em]">Your Unstaked NFTs</h2>
          <div className={`${styles.nftBoxGrid} relative`}>
            {ownedNfts?.map((nft) => (
              <div className={`${styles.nftBox} relative`} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia metadata={nft.metadata} className={styles.nftMedia} />
                <h3 className="text-[15px] text-[#ccc]">{nft.metadata.name}</h3>
                <Web3Button
                  contractAddress={stakingContractAddress}
                  className="!min-w-[100px] !min-h-[20px] mt-2 h-[20px] !p-2"
                  action={() => stakeNft(nft.metadata.id)}
                >
                  Stake
                </Web3Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Stake;
