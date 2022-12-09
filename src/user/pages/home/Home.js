import React from 'react';
import { Button } from 'primereact/button';
import './Home.css';

export default function Home() {

    return (
        <div className="homepage-container">

          <div className="homepage-title">
            <h3>LEAGUE  LIFE</h3>
          </div>

          <div className="surface-0 text-700 text-center border-round p-3">
            <br/>
              <div className="text-blue-600 font-bold mb-3"><i className="pi pi-discord"></i>&nbsp;POWERED BY DISCORD</div>
              <div className="text-900 font-bold text-5xl mb-3">Join Our Esports Community</div>
              <div className="text-700 text-2xl mb-5">Ask Questions, Provide Feedback, Join Communities and More!</div>
              <Button label="Join Now" icon="pi pi-discord" className="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap" />
            <br/>
            <br/>
          </div>

          <br/>
          <br/>

          <div className="surface-0 text-center border-round">
            <br/>

              <div className="mb-4 font-bold text-2xl">
                  <span className="text-900">League Life</span>
                  <span className="text-blue-600"> Updates</span>
              </div>

              <div className="text-900 mb-4 font-medium">Coming Soon...</div>

              <div className="grid">

                  <div className="col-12 md:col-4 mb-4 px-5">
                      <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                          <i className="pi pi-desktop text-4xl text-blue-500"></i>
                      </span>
                      <div className="text-900 mb-3 font-medium">Expanded League Customization</div>
                      <span className="text-700 text-sm line-height-3">...</span>
                  </div>

                  <div className="col-12 md:col-4 mb-4 px-5">
                      <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                          <i className="pi pi-check-circle text-4xl text-blue-500"></i>
                      </span>
                      <div className="text-900 mb-3 font-medium">League Driver Involvement</div>
                      <span className="text-700 text-sm line-height-3">...</span>
                  </div>

                  <div className="col-12 md:col-4 mb-4 px-5">
                      <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                          <i className="pi pi-lock text-4xl text-blue-500"></i>
                      </span>
                      <div className="text-900 mb-3 font-medium">Privacy Tools</div>
                      <span className="text-700 text-sm line-height-3">...</span>
                  </div>

                  <div className="col-12 md:col-4 mb-4 px-5">
                      <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                          <i className="pi pi-globe text-4xl text-blue-500"></i>
                      </span>
                      <div className="text-900 mb-3 font-medium">Advanced Analytics</div>
                      <span className="text-700 text-sm line-height-3">...</span>
                  </div>

                  <div className="col-12 md:col-4 mb-4 px-5">
                      <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                          <i className="pi pi-discord text-4xl text-blue-500"></i>
                      </span>
                      <div className="text-900 mb-3 font-medium">Discord Messaging & More!</div>
                      <span className="text-700 text-sm line-height-3">...</span>
                  </div>

                  <div className="col-12 md:col-4 md:mb-4 mb-0 px-3">
                      <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                          <i className="pi pi-shield text-4xl text-blue-500"></i>
                      </span>
                      <div className="text-900 mb-3 font-medium">Trusted Securitty</div>
                      <span className="text-700 text-sm line-height-3">...</span>
                  </div>

              </div>

              <br/>

          </div>

        </div>
    );
};