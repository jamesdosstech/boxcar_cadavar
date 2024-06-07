import React from "react";
import DBLeftSection from "../../components/DBSections/DBLeftSection";
import DBRightSection from "../../components/DBSections/DBRightSection";

const Dashboard = () => {
  return (
    <div>
      {/* <div className="row">
        <div className="col-4 col-md-2 bg-white vh-100"> */}
      <DBLeftSection />
      {/* </div>
        <div className="col-auto"> */}
      <DBRightSection />
      {/* </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
