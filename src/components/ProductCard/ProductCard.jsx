import React from "react";

function ProductCard({
  id,
  brand,
  image,
  color,
  category,
  size,
  price,
  sold,
  deleteStore,
  buyShortlet,
}) {
  return (
    <div
      className="card h-100"
      style={{
        maxWidth: "350px",
        margin: "0 auto",
      }}
    >
      <img
        src={image}
        className="card-img-top"
        alt="..."
        style={{ height: "250px" }}
      />
      <div className="card-body">
        <h5 className="card-title">
          <b>Brand:</b> {brand}
        </h5>
        <div className="card-text">
          <ul className="nav flex-column">
            <li className="my-2">
              <b>Color:</b> {color}
            </li>
            <li className="my-2">
              <b>category:</b> {category}
            </li>
            <li className="my-2">
              <b>Size:</b> {size}
            </li>
            <li className="my-2">
              <b>Price:</b> ${price / 1000000000000000000}
            </li>
            <li className="my-2">
              <b>Sold:</b> {sold}
            </li>
          </ul>
        </div>
      </div>
      <div className="card-footer">
        <button
          className="btn btn-primary w-50"
          onClick={() => buyShortlet(id)}
        >
          Buy now
        </button>
        <button className="btn btn-danger w-50" onClick={() => deleteStore(id)}>
          delete item
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
