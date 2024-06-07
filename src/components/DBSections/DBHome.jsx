import React from "react";

const DBHome = () => {
  return (
    <div
      className="container-fluid d-flex flex-column"
      // style={{ backgroundColor: "white" }}
      data-bs-theme="dark"
    >
      <div className="row flex-grow-1">
        <div className="col">
          <div class="jumbotron">
            <h1 class="display-4">Hello, world!</h1>
            <p class="lead">
              This is a simple hero unit, a simple jumbotron-style component for
              calling extra attention to featured content or information.
            </p>
            <hr class="my-4" />
            <p>
              It uses utility classes for typography and spacing to space
              content out within the larger container.
            </p>
            <p class="lead">
              <a class="btn btn-primary btn-lg" href="#" role="button">
                Learn more
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBHome;
