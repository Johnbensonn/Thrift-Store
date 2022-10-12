import React, { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function StoreForm({
  // apartments,
  // setApartments,
  addStore,
}) {
  const [editProfileFormData, setEditProfileFormDate] = useState({
    brand: "",
    image: "",
    color: "",
    category: "",
    size: "",
    price: "",
    sold: "0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfileFormDate({ ...editProfileFormData, [name]: value });
  };

  function handSubmit(e) {
    e.preventDefault();

    addStore(
      editProfileFormData.brand,
      editProfileFormData.image,
      editProfileFormData.color,
      editProfileFormData.category,
      editProfileFormData.size,
      editProfileFormData.price
      // editProfileFormData.sold
    );
  }
  return (
    <section class="my-5">
      <form onSubmit={(e) => handSubmit(e)}>
        <div class="container my-5">
          <h2 class="text-center">Upload your Product Here</h2>

          <div class="row mt-4 align-items-center">
            <div class="col-md-2">
              <label for="Brand" class="col-form-label">
                Brand{" "}
              </label>
            </div>
            <div class="col-md-10">
              <input
                name="brand"
                value={editProfileFormData.brand}
                onChange={(e) => handleChange(e)}
                type="text"
                id="Brand"
                class="form-control"
                aria-describedby="passwordHelpInline"
              />
            </div>
          </div>
          <div class="row mt-4 align-items-center">
            <div class="col-md-2">
              <label for="Image" class="col-form-label">
                Image{" "}
              </label>
            </div>
            <div class="col-md-10">
              <input
                name="image"
                value={editProfileFormData.image}
                onChange={(e) => handleChange(e)}
                type="text"
                id="Image"
                class="form-control"
                aria-describedby="passwordHelpInline"
              />
            </div>
          </div>
          <div class="row mt-4 align-items-center">
            <div class="col-md-2">
              <label for="Color" class="col-form-label">
                Color{" "}
              </label>
            </div>
            <div class="col-md-10">
              <input
                name="color"
                value={editProfileFormData.color}
                onChange={(e) => handleChange(e)}
                type="text"
                id="Color"
                class="form-control"
                aria-describedby="passwordHelpInline"
              />
            </div>
          </div>
          <div class="row mt-4 align-items-center">
            <div class="col-md-2">
              <label for="Category" class="col-form-label">
                Category{" "}
              </label>
            </div>
            <div class="col-md-10">
              <input
                name="category"
                value={editProfileFormData.category}
                onChange={(e) => handleChange(e)}
                type="text"
                id="Category"
                class="form-control"
                aria-describedby="passwordHelpInline"
              />
            </div>
          </div>
          <div class="row mt-4 align-items-center">
            <div class="col-md-2">
              <label for="Size" class="col-form-label">
                Size{" "}
              </label>
            </div>
            <div class="col-md-10">
              <input
                name="size"
                value={editProfileFormData.size}
                onChange={(e) => handleChange(e)}
                type="text"
                id="Size"
                class="form-control"
                aria-describedby="passwordHelpInline"
              />
            </div>
          </div>
          <div class="row mt-4 align-items-center">
            <div class="col-md-2">
              <label for="Price" class="col-form-label">
                Price{" "}
              </label>
            </div>
            <div class="col-md-10">
              <input
                name="price"
                value={editProfileFormData.price}
                onChange={(e) => handleChange(e)}
                type="text"
                id="Price"
                class="form-control"
                aria-describedby="passwordHelpInline"
              />
            </div>
          </div>
        </div>
        <div class="d-flex mt-4">
          <button type="submit" class="btn btn-primary w-75 ms-auto me-5">
            ADD NEW PRODUCT
          </button>
        </div>
      </form>
    </section>
  );
}

export default StoreForm;
