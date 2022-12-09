import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import { Create as CreateDivision} from "../../modals/division/Create";
import { Delete } from "../../modals/division/Delete";
import { Create as CreateSeason} from "../../modals/season/Create";

import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from "primereact/dropdown";

export default function Overview(props) {
  const { sendRequest } = useHttpClient();
  let navigate = useNavigate();
  const leagueId = useParams().leagueId;
  const seriesId = useParams().sid;

  const series = props.series;
  const [loadedDivisions, setLoadedDivisions] = useState();

  return (
      <div>
          <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
              <div>
                  <div className="font-medium text-3xl text-900">Series Overview</div>
                  <div className="flex align-items-center text-700 flex-wrap">
                      <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-users mr-2"></i>
                          <span>332 Drivers</span>
                      </div>
                      <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-globe mr-2"></i>
                          <span>9402 Divisions</span>
                      </div>
                      <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-globe mr-2"></i>
                          <span>9402 Seasons</span>
                      </div>
                      <div className="flex align-items-center mt-3">
                          <i className="pi pi-clock mr-2"></i>
                          <span>2.32m Events</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};