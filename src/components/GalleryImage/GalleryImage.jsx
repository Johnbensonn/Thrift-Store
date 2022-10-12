import React from "react";

function GalleryImage() {
  return (
    <div className="container-lg">
      <div className="row">
        <div
          className="col-md-4 mx-auto"
          style={{
            maxWidth: "250px",
          }}
        >
          <img
            src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            className="img-fluid rounded mx-auto d-block"
            alt="..."
            style={{
              maxWidth: "250px",
            }}
          />
        </div>
        <div
          className="col-md-4 mx-auto"
          style={{
            maxWidth: "250px",
          }}
        >
          <img
            src="https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=400"
            className="img-fluid rounded mx-auto d-block"
            alt="..."
            style={{
              maxWidth: "250px",
            }}
          />
        </div>
        <div
          className="col-md-4 mx-auto"
          style={{
            maxWidth: "250px",
          }}
        >
          <img
            src="https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=400"
            className="img-fluid rounded mx-auto d-block"
            alt="..."
            style={{
              maxWidth: "250px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default GalleryImage;
