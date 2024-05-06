import { Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { nftDropContractAddress } from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";
import webGLFluidEnhanced from "./Fluid/Fluid";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination } from "swiper/modules";
import Link from "next/link";

const imgList = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png"];

const Mint: NextPage = () => {
  const router = useRouter();
  const canvasRef2 = useRef<any>();

  useEffect(() => {
    console.log(canvasRef2);
    const webGlFluid = new webGLFluidEnhanced();
    webGlFluid.simulation(canvasRef2.current, {
      SIM_RESOLUTION: 256,
      DENSITY_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 30,
      COLOR_PALETTE: ["#428dcf"],
      TRANSPARENT: false,
      BLOOM: false,
    });
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef2} className="fluid-canvas"></canvas>
      <div className="absolute right-2 top-2">
        <Link href="/stake" className="link relative !inline-block">
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
                Click this to stake an NFTs
              </textPath>
            </text>
          </svg>
        </Link>
      </div>
      <div className="flex pointer-events-none justify-center items-center back-image"></div>
      <div className="relative mb-20 mt-20  pointer-events-none">
        <h1 className="relative text-[3em] text-center   pointer-events-none">
          Discover the Future of Digital
          <br />
          Collectibles with NFT Launcher
        </h1>
        <p className="text-white relative text-center pointer-events-none text-[#aaa]">
          Harness the Power of NFTs: Mint, Stake, and Profit from Your Assets
        </p>
      </div>

      <div className="z-[20] relative">
        <div className="w-full h-full relative flex justify-center">
          <div className="mb-20">
            <Web3Button
              theme="dark"
              contractAddress={nftDropContractAddress}
              action={(contract) => contract.erc721.claim(1)}
              onSuccess={() => {
                alert("NFT Claimed!");
                router.push("/stake");
              }}
              onError={(error) => {
                alert(error);
              }}
            >
              Claim An NFT
            </Web3Button>
          </div>
        </div>
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={5}
          loop={true}
          coverflowEffect={{
            scale: 1,
            rotate: 20,
            stretch: 20,
            depth: 300,
            modifier: 1,
            slideShadows: true,
          }}
          height={300}
          pagination={true}
          modules={[EffectCoverflow, Pagination]}
          className="mySwiper"
        >
          {imgList.map((src, index) => {
            return (
              <SwiperSlide key={"card" + index}>
                <img src={`./nfts/${src}`} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default Mint;
