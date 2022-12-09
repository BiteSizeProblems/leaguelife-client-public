import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { PickList } from 'primereact/picklist';
import { Divider } from 'primereact/divider';

import { TbSteeringWheel } from 'react-icons/tb';

import TeamIconTemplate from "./TeamIconTemplate";

export class ManageDrivers extends Component {

    constructor(props) {
      super(props);

      this.state = {
            displayBasic: false,
            title: this.props.eventName,
            existing: this.props.existing,
            available: this.props.available,
            source: this.props.available,
            target: this.props.existing,
            visible: false
      };

      this.onClick = this.onClick.bind(this);
      this.onHide = this.onHide.bind(this);

      this.driverTemplate = this.driverTemplate.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onCommit = this.onChange.bind(this);
      this.onTrigger = this.onTrigger.bind(this);
    }

    onClick(name, position) {
      let state = {
          [`${name}`]: true
      };

      if (position) {
          state = {
              ...state,
              position
          }
      }

      this.setState(state);
    };

    onHide(name) {
        this.setState({
            [`${name}`]: false
        });
    };

    driverTemplate = (driver) => {
      return (
        <div style={{fontSize:'16px'}}>
          <span><b>{driver.username}</b></span>
          <TeamIconTemplate team={driver.team} label={driver.role}/>
        </div>
      );
    };

    componentDidMount() {
      //console.log(this.source);
      //this.setState({ source: this.available });
      //console.log(this.source);
    };

    onChange(event) {
      this.setState({
          source: event.source,
          target: event.target
      });
    };

    onSourceSelectionChange(event) {
      //console.log(event);
    };

    onTargetSelectionChange(event) {
      //console.log(event.value);
    };

    onMoveToTarget(event) {
      //console.log(event.value);
    };

    onMoveToSource(event) {
      //console.log(event.value);
    };

    onCommit(event) {
      this.props.parentCallback('event.target.myname.value');
      event.preventDefault();
    }

    onTrigger = (event) => {
      let theSource = this.state.source;
      let theTarget = this.state.target;

      //this.props.parentCallback({source: theSource, target: theTarget});
      this.props.parentCallback({target: theTarget});
      event.preventDefault();

      this.onHide('displayBasic');
    }

    render() {
        return (
          <div>

            <Button 
              label='DRIVER MANAGER'
              icon={<TbSteeringWheel style={{marginRight:'5px', fontSize:'1.5em'}}/>} 
              className="p-button-text p-button-warning mr-2 mb-2" 
              aria-label="Drivers" 
              onClick={() => this.onClick('displayBasic')}
              />

            <Dialog 
              header={`Driver Manager: ${this.state.title}`}
              visible={this.state.displayBasic} 
              onHide={() => this.onHide('displayBasic')} 
              breakpoints={{'960px': '75vw', '640px': '100vw'}} 
              style={{width: '55vw'}}
              >

                <form onSubmit = {this.onTrigger}>

                  <PickList 
                  name="pickList"
                  source={this.state.source} 
                  target={this.state.target} 
                  itemTemplate={this.driverTemplate} 
                  sourceHeader="Available" 
                  targetHeader="Selected" 
                  sourceStyle={{ height: '400px' }} 
                  targetStyle={{ height: '400px' }} 
                  onChange={this.onChange} 
                  onSourceSelectionChange={this.onSourceSelectionChange}
                  onTargetSelectionChange={this.onTargetSelectionChange}
                  onMoveToTarget={this.onMoveToTarget}
                  onMoveToSource={this.onMoveToSource}
                  filterBy="username" 
                  sourceFilterPlaceholder="Search by username" 
                  targetFilterPlaceholder="Search by username" 
                  />

                  <br/>

                  <Divider/>

                  <br/>

                  <div className="center">
                    <Button 
                      type="submit"
                      value="Submit"
                      icon="pi pi-check"
                      className="p-button-rounded p-button-success p-button-outlined p-button-lg" 
                      aria-label="User" 
                      />
                  </div>
                  
                  <br/>

                </form>

            </Dialog>

          </div>
        )
    }
}