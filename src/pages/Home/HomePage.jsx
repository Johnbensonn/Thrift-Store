import React from "react";
import { useState, useEffect, useCallback } from "react";
// import ProductCard from "../../components/ProductCard/ProductCard";
// import GalleryImage from "../../components/GalleryImage/GalleryImage";
// import ApartmentsForm from "../../components/ApartmentsForm/ApartmentsForm";

// web3 imports

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";

import THRIFTSTORE from "./../../contracts/THRIFTSTORE.abi.json";
import IERC from "./../../contracts/IERC.abi.json";
import { Route, Router } from "react-router-dom";
// import HomePage from "../pages/Home/HomePage";
import ProductCard from "./../../components/ProductCard/ProductCard";
import ApartmentsForm from "./../../components/ApartmentsForm/ApartmentsForm";
import GalleryImage from "./../../components/GalleryImage/GalleryImage";

const ERC20_DECIMALS = 18;

const contractAddress = "0xdE60CF5150b971262676A315380453EF8EDBa2Eb";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function HomePage() {
  const [shortlets, setShortlets] = useState([]);
  const [shortletLoading, setShortletsLoading] = useState(true);

  const [Loading, setLoading] = useState(false);
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);

  const connectToWallet = async () => {
    setLoading(true);
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        setAddress(user_address);
        setKit(kit);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      setLoading(false);
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(THRIFTSTORE, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  const getShortlets = useCallback(async () => {
    const shortletLength = await contract.methods.getShortletLength().call();
    console.log(shortletLength);
    const shortlets = [];
    for (let index = 0; index < shortletLength; index++) {
      let _shortlets = new Promise(async (resolve, reject) => {
        let shortlet = await contract.methods.getShortlet(index).call();

        resolve({
          index: index,
          owner: shortlet[0],
          typeOfApartment: shortlet[1],
          image: shortlet[2],
          location: shortlet[3],
          wifi: shortlet[4],
          numberOfBedroom: shortlet[5],
          amount: shortlet[6],
          likes: shortlet[7],
        });
      });
      shortlets.push(_shortlets);
    }

    const _shortlets = await Promise.all(shortlets);
    setShortlets(_shortlets);
    setShortletsLoading(false);
  }, [contract]);

  // useEffect(() => {
  //   if (contract) {
  //     getShortlets();
  //   }
  // }, [contract, getShortlets]);

  const likeShortlet = async (index) => {
    try {
      await contract.methods.likeShortlet(index).send({ from: address });
    } catch (error) {
      console.log(error);
    } finally {
      getShortlets();
    }
  };
  const rentShortlet = async (_index) => {
    // console.log(_index);
    // return;
    const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
    try {
      await cUSDContract.methods
        .approve(contractAddress, shortlets[_index].amount)
        .send({ from: address });
      await contract.methods.buyShortlet(_index).send({ from: address });
      getShortlets();
      getBalance();
      alert("you have successfully rented a shortlet");
    } catch (error) {
      alert(error);
    }
  };

  const addShortlet = async (
    _typeOfApartment,
    _image,
    _location,
    _wifi,
    _numberOfBedroom,
    _amount
  ) => {
    try {
      let amount = new BigNumber(_amount).shiftedBy(ERC20_DECIMALS).toString();
      await contract.methods
        .addShortlet(
          _typeOfApartment,
          _image,
          _location,
          _wifi,
          _numberOfBedroom,
          amount
        )
        .send({ from: address });
      getShortlets();
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <div className="App">
        <section class="nav-section">
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
              <a class="navbar-brand" href="./index.html">
                THRIFT STORE{" "}
              </a>
              <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      aria-current="page"
                      href="./index.html"
                    >
                      HOME
                    </a>
                  </li>
                  <li class="nav-item">
                    {contract !== null && cUSDBalance !== null ? (
                      <div className="mt-2">
                        <b>{cUSDBalance} cUSD</b>
                      </div>
                    ) : (
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setLoading(true);
                          connectToWallet();
                        }}
                      >
                        {Loading ? "Loading..." : "Connect"}
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </section>
      </div>{" "}
      <section class="carousel-section">
        <div
          id="carouselExampleFade"
          class="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                src="https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                class="d-block w-100"
                alt="..."
              />
            </div>
            <div class="carousel-item">
              <img
                src="https://images.pexels.com/photos/1488507/pexels-photo-1488507.jpeg?auto=compress&cs=tinysrgb&w=600"
                class="d-block w-100"
                alt="..."
              />
            </div>
            <div class="carousel-item">
              <img
                src="https://images.pexels.com/photos/2263952/pexels-photo-2263952.jpeg?auto=compress&cs=tinysrgb&w=600"
                class="d-block w-100"
                alt="..."
              />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </section>
      <h2 className="text-center mt-5">OUR GALLERY</h2>
      <section className="cards-section">
        <GalleryImage />
      </section>
      <h2 className="text-center mt-5">PRODUCTS</h2>
      <section className="cards-section">
        <div className="container-lg">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {/* {shortletLoading ? (
        <div
          className="w-100 fs-2"
          style={{
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Loading products...
        </div>
      ) : (
        <>
          {shortlets.map((shortlet) => {
            // console.log(shortlet);
            const {
              amount,
              image,
              index,
              likes,
              location,
              numberOfBedroom,
              owner,
              typeOfApartment,
              wifi,
            } = shortlet;

            return ( */}
            <div className="col" /* key={index}*/>
              {/* <ProductCard
          rentShortlet={rentShortlet}
          imageUrl={image}
          typeOfApartment={typeOfApartment}
          location={location}
          numberOfBedroom={numberOfBedroom}
          wifi={wifi}
          amount={amount}
          likes={likes}
          id={index}
          likeShortlet={likeShortlet}
        /> */}
              <ProductCard
                rentShortlet="{rentShortlet}"
                imageUrl="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                typeOfApartment="{typeOfApartment}"
                location="{location}"
                numberOfBedroom="{numberOfBedroom}"
                wifi="{wifi}"
                amount="{amount}"
                likes="{likes}"
                id="{index}"
                likeShortlet="{likeShortlet}"
              />
            </div>
            {/* );
          })}
        </>
      )} */}
          </div>
        </div>
      </section>
      <h2 className="text-center mt-5">ADD SHORTLET</h2>
      <section className="my-5">
        <ApartmentsForm
          // apartments={apartments}
          // setApartments={setApartments}
          addShortlet={addShortlet}
          contract={contract}
          cUSDBalance={cUSDBalance}
          Loading={Loading}
          connectToWallet={connectToWallet}
        />
      </section>
      <section className="footer-section mt-5">
        <footer className="d-flex justify-content-around align-items-center py-3 py-4 border-top">
          <a
            href="/"
            className="mx-auto d-block text-muted text-decoration-none lh-1"
          >
            <span className="text-muted">© 2021 Company, Inc</span>
          </a>
        </footer>
      </section>
    </div>
  );
}

export default HomePage;
