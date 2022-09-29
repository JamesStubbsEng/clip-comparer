import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["WAV", "MP3"];

function DragDrop(props) {
  return (
    <div>
      <FileUploader handleChange={props.handleDragDrop} name="file" types={fileTypes} />
      <p>{props.file ? `File name: ${props.file.name}` : "no files uploaded yet"}</p>
    </div>
  );
}

export default DragDrop;