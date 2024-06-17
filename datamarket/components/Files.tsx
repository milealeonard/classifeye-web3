import React from "react";

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL
  ? process.env.NEXT_PUBLIC_GATEWAY_URL
  : "https://gateway.pinata.cloud";

export default function Files(props) {
  return (
    <div className="file-viewer flex flex-col gap-1">
      <button
        className="bg-accent text-light rounded-3xl py-2 px-4 hover:bg-secondary hover:text-light transition-all duration-300 ease-in-out"
        onClick={props.onDownload}
      >
        Download
      </button>
      <input
        type="text"
        onChange={(event) => props.setCid(event.target.value)}
        placeholder="CID"
        style={{ borderRadius: "4px", padding: "4px", border: "1px solid #ccc", backgroundColor: "inherit" }}
      />
      <button
        className="bg-accent text-light rounded-3xl py-2 px-4 hover:bg-secondary hover:text-light transition-all duration-300 ease-in-out"
        onClick={props.onView}
      >
        View
      </button>
      {props.filesToView.map((file, index) => {
        return (
          <div key={index} className="file flex flex-row justify-between items-center">
            <img src={file} alt="file" className="file-image" />
          </div>
        );
      })}
    </div>
  );
}
