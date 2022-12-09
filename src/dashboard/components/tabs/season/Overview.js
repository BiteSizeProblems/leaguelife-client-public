import React, { useState } from "react";

import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';

import { Delete } from "../../modals/season/Delete";

export default function Overview(props) {

  const [loadedDivision, setLoadedDivision] = useState(props.division);
  const [loadedSeason, setLoadedSeason] = useState(props.season);

  let recruitment;
    if (loadedSeason.properties.isRecruiting === true) {
      recruitment = "Actively Recruiting"
    } else {
      recruitment = "Not Recruiting"
    }

  const footer = (
    <span>
        <Delete season={loadedSeason} />
    </span>
  );

  return (
    <Card 
      title={`Season: ${loadedSeason.properties.identifier}`} 
      subTitle={`Division: ${loadedDivision.properties.title}`} 
      style={{ padding:'5px' }} 
      footer={footer} >
        <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
          <div>
            <div className="flex align-items-center text-700 flex-wrap">
              <div className="mr-5 flex align-items-center mt-3">
                <i className="pi pi-users mr-2"></i>
                <span>{loadedSeason.drivers.length} Drivers</span>
              </div>
              <div className="mr-5 flex align-items-center mt-3">
                <i className="pi pi-globe mr-2"></i>
                <span>{recruitment}</span>
              </div>
              <div className="flex align-items-center mt-3">
                <i className="pi pi-clock mr-2"></i>
                <span>{loadedSeason.properties.status}</span>
              </div>
            </div>
          </div>
        </div>
      <br/>
      <Divider/>
    </Card>
  );
};