import React, { useContext, useEffect, useState } from "react";
import "../../Global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { themeContext } from "../../App";
import "../../Utils/Theme.css";
import "./Searchbar.css";
import { Web3WalletContext } from "../../Utils/MetamskConnect";
import { Link, useLocation } from "react-router-dom";
import fistPump from "../../Assets/High-Resolutions-Svg/Updated/fist pump small.svg";
import metamask from "../../Assets/metamask.png";
import SystemStateLogo from "../../Assets/High-Resolutions-Svg/Updated/logo.svg";
import { functionsContext } from "../../Utils/Functions";
import { PSD_ADDRESS, conciseAddress } from "../../Utils/ADDRESSES/Addresses";
import { ethers } from "ethers";

export default function Searchbar() {
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState("");
  const [searches, setSearches] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [TargetValue, setTargetValue] = useState("");
  const [BurnValue, setBurnValue] = useState("");
  const [isDashboardInputDisabled, setIsDashboardInputDisabled] =
    useState(false);
  const [isBuyTokenInputDisabled, setIsBuyTokenInputDisabled] = useState(false);

  const { theme } = useContext(themeContext);
  let block =
    (theme === "lightTheme" && theme + " translite") ||
    (theme === "darkTheme" && theme + " transdark") ||
    (theme === "dimTheme" && theme + " transdim");
  let dark = theme === "lightTheme" && "text-dark";

  function addCommasAsYouType(e) {
    try {
      const inputValue = e.target.value;
      setDepositAmount(inputValue);
      if (/^[0-9,.]*$/.test(inputValue)) {
        const numericValue = inputValue.replace(/,/g, "");
        const formattedValue = numericValue.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        );
        const formattedWithDecimals = `${formattedValue} .00`;
        setSearch(formattedValue);
      }
    } catch (error) {
      console.error("error:", error);
    }
  }
  function addCommasAsYouTypeForStake(e) {
    try {
      const inputValue = e.target.value;
      if (/^[0-9,.]*$/.test(inputValue)) {
        setTargetValue(inputValue); // Set the original input value without modifications
        const numericValue = inputValue.replace(/,/g, "");
        const formattedValue = numericValue.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        );
        setSearching(formattedValue);
      }
    } catch (error) {
      console.error("error:", error);
    }
  }

  function addCommasAsYouTypeForBurn(e) {
    try {
      const inputValue = e.target.value;
      setBurnValue(inputValue);
      if (/^[0-9,.]*$/.test(inputValue)) {
        const numericValue = inputValue.replace(/,/g, "");
        const formattedValue = numericValue.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        );
        setSearches(formattedValue);
      }
    } catch (error) {
      console.error("error:", error);
    }
  }

  const handleBlur = () => {
    if (search != undefined && search != "" && !search.includes(".")) {
      setSearch(`${search}.00`);
    }
  };
  const handleBlurStake = () => {
    if (searching != undefined && searching != "" && !searching.includes(".")) {
      setSearching(`${searching}.00`);
    }
  };
  const handleBlurBurn = () => {
    if (searches != undefined && searches != "" && !searches.includes(".")) {
      setSearches(`${searches}.00`);
    }
  };
  const location = useLocation();
  const isHome = location.pathname == "/vlp";
  const isVisible = !isHome && "isVisible";
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [tokenBalance, setTokenBAlance] = useState(0);
  const [DistributedAM, setDIA] = useState(0);
  const [selectedValue, setSelectedValue] = useState("Deposit");
  const [buyTokenSelector, setBuyTokenSelector] = useState("Inscribe");
  const [tokenSelector, setTokenSelector] = useState("Polygon Mumbai");
  const [balance, setBalance] = useState("Enter Amount");
  const [navigateToExplorer, setNavigateToExplorer] = useState("");
  const [toBeClaimed, setToBeClaimed] = useState("0");
  const [LimitDeposit, setLimitDeposit] = useState("0");
  const [claimParityTokens, setClaimParityTokens] = useState("0");
  const [protocolFee, setProtocolFee] = useState("0");
  const [placeHolder, setPlaceHolder] = useState("");
  const [allRewardAmount, setAllRewardAmount] = useState("");
  const [price, setprice] = useState(0);

  const {
    socket,
    handleDeposit,
    getToBeClaimed,
    handle_Claim_IPT_and_RPT,
    handle_Claim_Protocol_Fee,
    handle_Claim_Parity_Tokens,
    handle_Claim_All_Reward_Amount,
    getParityDollarClaimed,
    getUserDistributedTokens,
    getFormatEther,
    getProtocolFee,
    getParityTokensDeposits,
    getPrice,
    balanceOFMint,
    CreateTargets,
    BurnAmount,
  } = useContext(functionsContext);
  const {
    accountAddress,
    networkName,
    userConnected,
    WalletBalance,
    currencyName,
  } = useContext(Web3WalletContext);

  const ParityTokensDeposits = async () => {
    try {
      let ParityTokensDeposits = await getParityTokensDeposits(accountAddress);
      let formattedParityTokensDeposits = ethers.utils.formatEther(
        ParityTokensDeposits || "0"
      );
      let limtDeposit = parseFloat(formattedParityTokensDeposits).toFixed(2);
      console.log("limit deposit from search", LimitDeposit);
      setLimitDeposit(limtDeposit);
      setTotalDeposits(parseFloat(limtDeposit));
    } catch (error) {
      console.error(error);
    }
  };
  const balanceOF = async () => {
    try {
      let totalBalance = await balanceOFMint(accountAddress);

      // let formated = ethers.utils.formatEther(totalBalance || "0");

      const formattedTotalSupply = totalBalance + " vlpPLS";

      console.log("balance of ", formattedTotalSupply);
      setTokenBAlance(formattedTotalSupply);
    } catch (error) {
      console.error(error);
    }
  };
  const UserDistributedTokens = async () => {
    try {
      let totalBalance = await getUserDistributedTokens(accountAddress);

      let fixed = Number(totalBalance).toFixed(4);

      const formattedTotalSupply = fixed + " vlpPLS";

      console.log("balance of distribution ", formattedTotalSupply);
      setDIA(formattedTotalSupply);
    } catch (error) {
      console.error(error);
    }
  };

  const isHandleDeposit = async (e) => {
    e.preventDefault();

    if (selectedValue === "Deposit") {
      // Check the deposit limit
      let currentDeposit = parseFloat(LimitDeposit); // Get the current deposit amount
      let newDepositAmount = parseFloat(
        ethers.utils.formatEther(depositAmount)
      ); // Get the new deposit amount
      let totalDeposit = currentDeposit + newDepositAmount;

      // If the total deposit exceeds 100,000, block the deposit
      if (totalDeposit > 100000) {
        alert(
          "Deposit limit of 100,000 has been reached. Cannot deposit more."
        );
        return;
      }

      const isSuccess = await handleDeposit(depositAmount);
      if (isSuccess) {
        setSearch("");
      }
    } else if (selectedValue === "tokenBalance") {
      tokenBalance(accountAddress);
    } else if (selectedValue === "Targets") {
      CreateTargets(TargetValue);
    } else if (selectedValue === "Claim Protocol Fee") {
      handle_Claim_Protocol_Fee(accountAddress);
    } else if (selectedValue === "Claim All Reward") {
      handle_Claim_All_Reward_Amount(accountAddress);
    }
  };
  const DistributeAmounts = async (e) => {
    e.preventDefault();

    // Remove commas from the input value and parse it as a float
    let numericValue = TargetValue.replace(/,/g, "");
    let DistributeTokensANDBURn = parseFloat(numericValue);

    if (isNaN(DistributeTokensANDBURn)) {
      console.error("Invalid input value:", numericValue);
      return;
    }

    const isSuccess = await CreateTargets(DistributeTokensANDBURn);
    if (isSuccess) {
      setSearch("");
    }
  };
  const BurnTheTokens = async (e) => {
    e.preventDefault();

    // Remove commas from the input value and parse it as a float
    let numericValue = BurnValue.replace(/,/g, "");
    let DistributeTokensANDBURn = parseFloat(numericValue);

    if (isNaN(DistributeTokensANDBURn)) {
      console.error("Invalid input value:", numericValue);
      return;
    }

    const isSuccess = await BurnAmount(DistributeTokensANDBURn);
    if (isSuccess) {
      setSearch("");
    }
  };

  const fetchPrice = async () => {
    try {
      let price = await getPrice();
      let formattedPrice = ethers.utils.formatEther(price || "0");
      setprice(formattedPrice);
    } catch (error) {
      console.error("error:", error);
    }
  };
  const getPlaceHolder = async () => {
    if (isHome) {
      if (selectedValue === "Deposit") {
        setPlaceHolder(balance);
        setIsDashboardInputDisabled(false);
      } else if (selectedValue === "tokenBalance") {
        setPlaceHolder(tokenBalance);
        setIsDashboardInputDisabled(true);
        setSearch("");
      } else if (selectedValue === "Claim Protocol Fee") {
        console.log("setPlaceHolder(protocolFee):", protocolFee);
        setPlaceHolder(protocolFee);
        setIsBuyTokenInputDisabled(true);
        setSearch("");
      } else if (selectedValue === "Claim All Reward") {
        console.log("allrewardAmount:", allRewardAmount);
        setPlaceHolder(allRewardAmount);
        setIsDashboardInputDisabled(true);
        setSearch("");
      }
    } else {
      if (buyTokenSelector === "Inscribe") {
        setPlaceHolder(balance);
        setIsBuyTokenInputDisabled(false);
      }
    }
  };
  const ProtocolFee = async () => {
    try {
      let protocolFee = await getProtocolFee(accountAddress);
      let protocolAmount = await protocolFee?.protocolAmount;
      let fixed = Number(protocolAmount).toFixed(4) + " " + currencyName;
      setProtocolFee(fixed);
    } catch (error) {
      console.error("error:", error);
    }
  };
  const getSelector = () => {
    if (userConnected && networkName === "Polygon Mumbai") {
      return (
        <option className={`${theme} option-list `} value="Polygon Mumbai">
          {" "}
          Polygon (MATIC)
        </option>
      );
    } else if (userConnected && networkName === "Pulsechain") {
      return (
        <option className={`${theme} option-list `} value="PLS">
          {" "}
          Pulsechain (PLS)
        </option>
      );
    } else if (userConnected && networkName === "PulsechainX") {
      return (
        <option className={`${theme} option-list `} value="PLSX">
          {" "}
          PulseX (PLSX)
        </option>
      );
    } else {
      return (
        <>
          <option className={`${theme} option-list `} value="Matic">
            {" "}
            Matic (MATIC)
          </option>
          <option className={`${theme} option-list `} value="PLS">
            {" "}
            Pulsechain (PLS)
          </option>
          <option className={`${theme} option-list `} value="PLSX">
            {" "}
            PulseX (PLSX)
          </option>
          <option className={`${theme} option-list `} value="2">
            HEX (pHEX)
          </option>
          <option className={`${theme} option-list `} value="3">
            XEN (pXEN)
          </option>
          <option className={`${theme} option-list `} value="3">
            Atropa (ATROPA)
          </option>
          <option className={`${theme} option-list `} value="3">
            Dai (pDAI)
          </option>
          <option className={`${theme} option-list `} value="3">
            Teddybear (BEAR)
          </option>
          <option className={`${theme} option-list `} value="3">
            TSFi (TSFi)
          </option>
          <option className={`${theme} option-list `} value="3">
            BTC (pwBTC)
          </option>
          <option className={`${theme} option-list `} value="3">
            Shiba (pSHIB)
          </option>
          <option className={`${theme} option-list `} value="3">
            Pepe (pPEPE)
          </option>
        </>
      );
    }
  };

  const explorer_URL = async () => {
    if ((await networkName) === "Polygon Mumbai") {
      return `https://mumbai.polygonscan.com/address`;
    } else {
      return `https://mumbai.polygonscan.com/address`;
    }
  };
  const navToExplorer = async () => {
    const baseUrl = await explorer_URL();
    if (isHome) {
      return `${baseUrl}/${PSD_ADDRESS}`;
    } else {
      // return `${baseUrl}/${STATE_TOKEN_ADDRES}`
    }
  };

  // Done
  const ToBeClaimed = async () => {
    try {
      let toBeClaimed = await getToBeClaimed(accountAddress);
      let formattedToBeClaimed = ethers.utils.formatEther(
        toBeClaimed ? toBeClaimed : "0"
      );
      let fixed = Number(formattedToBeClaimed).toFixed(4);
      setToBeClaimed(fixed);
    } catch (error) {
      console.log("error:", error);
    }
  };
  const getClaimParityTokens = async () => {
    let ParityShareTokensDetail = await getParityDollarClaimed(accountAddress);
    let parityClaimableAmount = ParityShareTokensDetail?.parityClaimableAmount;
    let parityClaimableAmountFormatted = await getFormatEther(
      parityClaimableAmount
    );
    let fixed = Number(parityClaimableAmountFormatted).toFixed(4);
    setClaimParityTokens(fixed);
  };
  const AllRewardAmount = async () => {
    let userBucketBalance = await getToBeClaimed(accountAddress);
    let formattedToBeClaimed = await getFormatEther(userBucketBalance || "0");

    let ParityShareTokensDetail = await getParityDollarClaimed(accountAddress);
    let parityClaimableAmount = ParityShareTokensDetail?.parityClaimableAmount;
    let parityClaimableAmountFormatted = await getFormatEther(
      parityClaimableAmount
    );

    let protocolFee = await getProtocolFee(accountAddress);
    let protocolAmount = await protocolFee?.protocolAmount;

    let AllFee =
      Number(formattedToBeClaimed) +
      Number(parityClaimableAmountFormatted) +
      Number(protocolAmount);

    let fixed =
      (AllFee.toFixed(4) === "NaN" ? "0" : AllFee.toFixed(4)) +
      " " +
      currencyName;
    setAllRewardAmount(fixed);
  };
  useEffect(() => {
    try {
      getSelector();
      navToExplorer()
        .then((res) => {
          setNavigateToExplorer(res);
        })
        .catch((error) => {});
      if (!userConnected) {
        let fixedBalance =
          Number(WalletBalance || "0").toFixed(4) + " " + currencyName;
        setBalance(fixedBalance);
      }
    } catch (error) {}
  }, [accountAddress, networkName]);
  useEffect(() => {
    if (userConnected) {
      let fixedBalance =
        Number(WalletBalance || "0").toFixed(4) + " " + currencyName;
      setBalance(fixedBalance);
      ToBeClaimed();
      getClaimParityTokens();
      fetchPrice();
      balanceOF();
      UserDistributedTokens();
      ParityTokensDeposits();
      getPlaceHolder();
      ProtocolFee();
      AllRewardAmount();
    }
  }, [socket]);

  return (
    <>
      <div
        className={`main-search p-5 lightBg darkBg ${
          (theme === "darkTheme" && "seachThemeBgDark") ||
          (theme === "dimTheme" && "seachThemeBgDim")
        }`}
      >
        <div
          className={`d-flex serach-container container-xxl ${
            theme === "darkTheme" ? "dark-theme-background" : ""
          }`}
        >
          <div className="d-flex w-100 my-auto">
            <div className="d-flex flex-wrap justify-content-center w-100 searchBar">
              <div className="input-search firstSeach_small col-md-7 py-3">
                <div
                  style={{
                    fontSize: "14px",
                    color: "#ffffff",
                    // marginBottom: "15px" ,
                    marginLeft: "10px",
                    marginTop: "-35px",
                    paddingBottom:"10px"
                  }}
                >
                  Vaulting Liquidity Pools (VLP) is the process through which a
                  smart contract employs ratio vaults to mitigate token
                  inflation-erosion and directly create multiple copies of your
                  crypto assets over natural market cycles.
                </div>
                {isHome ? (
                  <div className="d-flex flex-column align-items-center w-100">
                    <div
                      style={{ width: "130%" }} // Increase the width here
                      className={`search ${theme} ${
                        theme === "lightTheme" && "text-dark"
                      } ${
                        (theme === "darkTheme" && "Theme-block-container") ||
                        (theme === "dimTheme" && "dimThemeBg")
                      }`}
                    >
                      <div
                        className="box w-50  align-items-center justify-content-center"
                        style={{
                          border: "1px solid #000",
                          borderRadius: "25px",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        <span>STEP 1 - MINT</span>
                      </div>
                      <p
                        className={`m-0 ms-3 tokenSize d-none d-md-block ${
                          block + dark
                        } ${
                          (theme === "lightTheme" && "depositInputLight") ||
                          (theme === "dimTheme" && "depositInputGrey darkColor")
                        } ${
                          theme === "darkTheme" && "depositInputDark darkColor"
                        }`}
                      >
                        <div style={{ marginLeft: "0px" }}>
                          {currencyName}&nbsp;<span></span>
                        </div>
                      </p>
                      <form className="w-100 search-form">
                        <input
                          className={`w-100 ms-3 me-4 form-control inputactive ${block} ${
                            (theme === "lightTheme" && "depositInputLight") ||
                            (theme === "dimTheme" &&
                              "depositInputGrey darkColor")
                          } ${
                            theme === "darkTheme" &&
                            "depositInputDark darkColor"
                          }`}
                          pattern={`[0-9,.]*`} // Only allow digits, commas, and dots
                          type="text"
                          disabled={isDashboardInputDisabled}
                          onBlur={handleBlur}
                          value={search}
                          placeholder={placeHolder}
                          onChange={(e) => addCommasAsYouType(e)}
                        />
                        <button
                          disabled={
                            selectedValue === "Deposit" &&
                            (Number(search) <= 0 ||
                              search === "" ||
                              totalDeposits >= 100000)
                          }
                          className={`fist-pump-img first_pump_serchbar ${
                            (theme === "darkTheme" && "firstdumDark") ||
                            (theme === "dimTheme" && "dimThemeBg")
                          } `}
                          onClick={(e) => {
                            isHandleDeposit(e);
                          }}
                        >
                          <img
                            src={fistPump}
                            alt="depositBtn"
                            className="w-100 h-100"
                          />
                        </button>
                      </form>
                    </div>
                    <div style={{ marginBottom: "-20px" }}>
                      <hr />
                    </div>
                    <div className="d-flex flex-column align-items-center w-100">
                      <div
                        style={{ width: "130%" }} // Increase the width here
                        className={`search ${theme} ${
                          theme === "lightTheme" && "text-dark"
                        } ${
                          (theme === "darkTheme" && "Theme-block-container") ||
                          (theme === "dimTheme" && "dimThemeBg")
                        }`}
                      >
                        <div
                          className="box w-50  align-items-center"
                          style={{
                            border: "1px solid #000",
                            borderRadius: "25px",
                            padding: "10px",
                            width: "10%",
                            textAlign: "center",
                          }}
                        >
                          <span>STEP 2 - RATIO STAKE</span>
                        </div>
                        <p
                          className={`m-0 ms-3 tokenSize d-none d-md-block ${
                            block + dark
                          } ${
                            (theme === "lightTheme" && "depositInputLight") ||
                            (theme === "dimTheme" &&
                              "depositInputGrey darkColor")
                          } ${
                            theme === "darkTheme" &&
                            "depositInputDark darkColor"
                          }`}
                        >
                          <div style={{ marginLeft: "1px" }}>
                            <span>vlpPLS</span>
                          </div>
                        </p>
                        <form className="w-100 search-form">
                          <input
                            className={`w-100 ms-3 me-4 form-control inputactive ${block} ${
                              (theme === "lightTheme" && "depositInputLight") ||
                              (theme === "dimTheme" &&
                                "depositInputGrey darkColor")
                            } ${
                              theme === "darkTheme" &&
                              "depositInputDark darkColor"
                            }`}
                            pattern={`[0-9,.]*`} // Only allow digits, commas, and dots
                            type="text"
                            disabled={isDashboardInputDisabled}
                            onBlur={handleBlurStake}
                            value={searching}
                            placeholder={tokenBalance}
                            onChange={(e) => addCommasAsYouTypeForStake(e)}
                            style={{ marginLeft: "-100px" }} // Move input box slightly to the left
                          />
                          <button
                            className={`fist-pump-img first_pump_serchbar ${
                              (theme === "darkTheme" && "firstdumDark") ||
                              (theme === "dimTheme" && "dimThemeBg")
                            } `}
                            onClick={(e) => {
                              DistributeAmounts(e);
                            }}
                          >
                            <img
                              src={fistPump}
                              alt="depositBtn"
                              className="w-100 h-100"
                            />
                          </button>
                        </form>
                      </div>
                    </div>
                    <div style={{ marginBottom: "-20px" }}>
                      <hr />
                    </div>
                    <div className="d-flex flex-column align-items-center w-100">
                      <div
                        style={{ width: "130%" }} // Increase the width here
                        className={`search ${theme} ${
                          theme === "lightTheme" && "text-dark"
                        } ${
                          (theme === "darkTheme" && "Theme-block-container") ||
                          (theme === "dimTheme" && "dimThemeBg")
                        }`}
                      >
                        <div
                          className="box w-50  align-items-center"
                          style={{
                            border: "1px solid #000",
                            borderRadius: "25px",
                            padding: "10px",
                            textAlign: "center",
                          }}
                        >
                          <span>STEP 3 - BURN & EARN</span>
                        </div>
                        <p
                          className={`m-0 ms-3 tokenSize d-none d-md-block ${
                            block + dark
                          } ${
                            (theme === "lightTheme" && "depositInputLight") ||
                            (theme === "dimTheme" &&
                              "depositInputGrey darkColor")
                          } ${
                            theme === "darkTheme" &&
                            "depositInputDark darkColor"
                          }`}
                        >
                          vlpPLS
                        </p>
                        <form className="w-100 search-form">
                          <input
                            className={`w-100 ms-3 me-4 form-control inputactive ${block} ${
                              (theme === "lightTheme" && "depositInputLight") ||
                              (theme === "dimTheme" &&
                                "depositInputGrey darkColor")
                            } ${
                              theme === "darkTheme" &&
                              "depositInputDark darkColor"
                            }`}
                            pattern={`[0-9,.]*`} // Only allow digits, commas, and dots
                            type="text"
                            onBlur={handleBlurBurn}
                            value={searches}
                            placeholder={DistributedAM}
                            onChange={(e) => addCommasAsYouTypeForBurn(e)}
                          />
                          <button
                            className={`fist-pump-img first_pump_serchbar ${
                              (theme === "darkTheme" && "firstdumDark") ||
                              (theme === "dimTheme" && "dimThemeBg")
                            } `}
                            onClick={(e) => {
                              BurnTheTokens(e);
                            }}
                          >
                            <img
                              src={fistPump}
                              alt="depositBtn"
                              className="w-100 h-100"
                            />
                          </button>
                        </form>
                      </div>
                    </div>
                    <div style={{ marginBottom: "-20px" }}>
                      <hr />
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
