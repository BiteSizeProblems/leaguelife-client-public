import React, { useState } from "react";

import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import TeamIconTemplate from "../../../../shared/components/templates/TeamIconTemplate";

export default function Standings(props) {
  const season = props.season;

  const [constructors, setConstructors] = useState(
    season.drivers.reduce((group, constructor) => {
    const { team } = constructor;
    group[team] = group[team] ?? [];
    group[team].push(constructor);
    return group;
    }, {})
  );

  const test = season.drivers.map((driver) => { return { team: driver.team, points: driver.points }});
  
  var holder = {};

  test.forEach(function(d) {
    if (holder.hasOwnProperty(d.team)) {
      holder[d.team] = holder[d.team] + d.points;
    } else {
      holder[d.team] = d.points;
    }
  }); 

  var obj2 = [];

  for (var prop in holder) {
    obj2.push({ team: prop, points: holder[prop] });
  };
  const rowIndexTemplate = (rowData, props) => { let index = parseInt(props.rowIndex + 1, 10); return <span>{index}</span> };

  const teamNameTemplate = (option) => { return <TeamIconTemplate team={option}/> };

  const roleBodyTemplate = (rowData, props) => { return "" };

  const customFunction = (value, filter) => {
    return value !== 'Reserve'
  }

  return (
      <TabView>

        <TabPanel header="Drivers">
          <DataTable value={season.drivers} sortField="points" sortOrder={-1} dataKey="id" responsiveLayout="stack" >
            <Column field="Index" header="" style={{ width: "2rem" }} body={rowIndexTemplate} />
            <Column field="username" header="Driver" />
            <Column field="team" header="Team" body={teamNameTemplate} filterMatchMode="custom" filterFunction={customFunction}/>
            <Column field="role" body={roleBodyTemplate} filterMatchMode="custom" filterFunction={customFunction}/>
            <Column field="points" header="Points" />
          </DataTable>
        </TabPanel>

        <TabPanel header="Contructors">
            <DataTable value={obj2} sortField="points" sortOrder={-1} dataKey="id" responsiveLayout="scroll" >
              <Column field="Index" header="" style={{ width: "2rem" }} body={rowIndexTemplate} />
              <Column field="team" header="Team" body={teamNameTemplate} filterMatchMode="custom" filterFunction={customFunction}/>
              <Column field="points" header="Points" />
            </DataTable>
        </TabPanel>

      </TabView>
  );
};