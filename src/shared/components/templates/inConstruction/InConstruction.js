import React from "react";
import { Image } from 'primereact/image';

import { MdConstruction } from 'react-icons/md';

import './InConstruction.css';

export default function InConstruction() {
  return (
    <div className="inConstruction__container">
      <div className="inConstruction__content">
        <div className="inConstruction__header">
          <p className="inConstruction__title">COMING SOON</p>
          <MdConstruction className="inConstruction__icon"/>
        </div>
        <p className="inConstruction__subheader">Sit tight, it'll be here soon.</p>
      </div>
    </div>
    )
};