import "./App.css";
import ProductCard from "./components/ProductCard/ProductCard";
import GalleryImage from "./components/GalleryImage/GalleryImage";
import { useState, useEffect, useCallback } from "react";

// web3 imports

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";

import THRIFTSTORE from "./contracts/THRIFTSTORE.abi.json";
import IERC from "./contracts/IERC.abi.json";
import StoreForm from "./components/ApartmentsForm/ApartmentsForm";

const ERC20_DECIMALS = 18;

const contractAddress = "0xdE60CF5150b971262676A315380453EF8EDBa2Eb";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
  const [Loading, setLoading] = useState(false);
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [stores, setStores] = useState([]);
  const [storeLoading, setStoresLoading] = useState(true);
  const [tab, setTab] = useState("1");

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

  const getStores = useCallback(async () => {
    const storeLength = await contract.methods.getThriftstoreLength().call();
    console.log(storeLength);
    const stores = [];
    for (let index = 0; index < storeLength; index++) {
      let _stores = new Promise(async (resolve, reject) => {
        let store = await contract.methods.getThriftstore(index).call();

        resolve({
          index: index,
          owner: store[0],
          brand: store[1],
          image: store[2],
          color: store[3],
          category: store[4],
          size: store[5],
          price: store[6],
          sold: store[7],
        });
      });
      stores.push(_stores);
    }

    const _stores = await Promise.all(stores);
    console.log(_stores);
    setStores(_stores);
    setStoresLoading(false);
  }, [contract]);

  useEffect(() => {
    if (contract) {
      getStores();
    }
  }, [contract, getStores]);
  const deleteStore = async (index) => {
    try {
      await contract.methods.deleteThriftstore(index).send({ from: address });
    } catch (error) {
      console.log(error);
    } finally {
      getStores();
    }
  };
  const buyShortlet = async (_index) => {
    // console.log(_index);
    // return;
    const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
    try {
      await cUSDContract.methods
        .approve(contractAddress, stores[_index].price)
        .send({ from: address });
      await contract.methods.buyThriftstore(_index).send({ from: address });
      getStores();
      getBalance();
      alert("you have successfully rented a shortlet");
    } catch (error) {
      alert(error);
    }
  };

  const addStore = async (
    _brand,
    _image,
    _color,
    _category,
    _size,
    _price,
    _sold
  ) => {
    try {
      console.log(_brand, _image, _color, _category, _size, _price, _sold);
      // return;
      let price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
      await contract.methods
        .addThriftstore(
          _brand,
          _image,
          _color,
          _category,
          _size,
          price /*_sold*/
        )
        .send({ from: address });
      getStores();
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className="App">
      <section className="nav-section">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="./index.html">
              THRIFT STORE{" "}
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li
                  className="nav-item  me-3 mt-1 fw-3"
                  onClick={() => {
                    setTab(1);
                  }}
                >
                  HOME
                </li>
                <li
                  className="nav-item me-3 mt-1 fw-3"
                  onClick={() => {
                    setTab(2);
                  }}
                >
                  Upload
                </li>
                <li className="nav-item">
                  {contract !== null && cUSDBalance !== null ? (
                    <div className="mt-1">
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

      {tab !== 2 ? (
        <>
          <section className="carousel-section">
            <div
              id="carouselExampleFade"
              className="carousel slide carousel-fade"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src="https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://images.pexels.com/photos/1488507/pexels-photo-1488507.jpeg?auto=compress&cs=tinysrgb&w=600"
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://images.pexels.com/photos/2263952/pexels-photo-2263952.jpeg?auto=compress&cs=tinysrgb&w=600"
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleFade"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleFade"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </section>
          <h2 className="text-center mt-5">OUR GALLERY</h2>
          <section className="cards-section">
            <GalleryImage />
          </section>{" "}
          <h2 className="text-center mt-5">PRODUCTS</h2>
          <section className="cards-section">
            <div className="container-lg">
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {storeLoading ? (
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
                    {stores.map((store) => {
                      // console.log(store);
                      const {
                        index,
                        brand,
                        image,
                        color,
                        category,
                        size,
                        price,
                        sold,
                      } = store;

                      return (
                        <div className="col" key={index}>
                          <ProductCard
                            id={index}
                            brand={brand}
                            image={image}
                            color={color}
                            category={category}
                            size={size}
                            price={price}
                            sold={sold}
                            deleteStore={deleteStore}
                            buyShortlet={buyShortlet}
                          />
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </section>
        </>
      ) : null}
      {tab === 2 ? (
        <section className="my-5">
          <StoreForm
            addStore={addStore}
            contract={contract}
            cUSDBalance={cUSDBalance}
            Loading={Loading}
            connectToWallet={connectToWallet}
          />
        </section>
      ) : null}
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

export default App;
