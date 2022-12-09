import React, { useRef, useState, useEffect } from 'react';
import Button from '../button/Button';

import './ImageUpload.css';

const ImageUpload = props => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const fileSelectorRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const selectedHandler = event => {
    let selectedFile;
    let fileIsValid = isValid;
    if (event.target.files || event.target.files.length === 1) {
      selectedFile = event.target.files[0];
      setFile(selectedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, selectedFile, fileIsValid)
  };

  const selectImageHandler = () => {
    fileSelectorRef.current.click(); 
  };

  return (
    <div className='form-control'>
        <input 
          id={props.id}
          ref={fileSelectorRef}
          style={{display: 'none'}} 
          type="file" 
          accept='.jpg,.png,.jpeg'
          onChange={selectedHandler}
        />
        <div className={`image-upload ${props.center && 'center'}`}>
          <div className='image-upload__preview'>
            {previewUrl && <img src={previewUrl} alt="Preview" />}
            {!previewUrl && <p>Please select an image</p>}
          </div>
          <Button 
            type="button" 
            onClick={selectImageHandler}
          >
              Pick Image
          </Button>
        </div>
        {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;