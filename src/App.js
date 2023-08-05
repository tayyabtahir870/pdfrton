import React, { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";

const App = () => {
  const viewer = useRef(null);

  const generateRandomToken = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  useEffect(() => {
    const token = process.env.REACT_APP_SECRET_TOKEN || generateRandomToken(32);

    WebViewer(
      {
        path: "lib",
        initialDoc:
          "https://pdftron.s3.amazonaws.com/downloads/pl/PDFTRON_about.pdf",

        pdftronServer: "https://demo.pdftron.com",
        config: {
          auth: token ? token : undefined,
        },
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer, annotationManager } = instance.Core;

      documentViewer.addEventListener("documentLoaded", () => {
        const rectangleAnnot = new instance.Annotations.RectangleAnnotation({
          PageNumber: 1,
          X: 100,
          Y: 150,
          Width: 200,
          Height: 50,
          Author: annotationManager.getCurrentUser(),
        });

        annotationManager.addAnnotation(rectangleAnnot);

        annotationManager.redrawAnnotation(rectangleAnnot);
      });
    });
  }, []);

  return (
    <div className="MyComponent">
      <div className="header">React Pdf</div>
      <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
    </div>
  );
};

export default App;
