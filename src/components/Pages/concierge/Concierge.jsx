import React from "react";
import ConciergeHero from "./ConciergeHero/ConciergeHero";
import GoodiesCard from "./GoodiesCard/GoodiesCard";
import ConciergeServices from "./ConciergeServices/ConciergeServices";
import { useUser } from "../../../services/showUserInfo/ShowUserInfo";

const Concierge = () => {
  const { userInfo } = useUser();

  // console.log("USER INFO", userInfo)

  return (
    <>
      <ConciergeHero />

      {userInfo?.isWelcomeGiftSent === false && <GoodiesCard />}

      <ConciergeServices />
    </>
  );
};

export default Concierge;
