// ZaUI stylesheet
import "zmp-ui/zaui.css";
// Tailwind stylesheet
import "@/css/tailwind.scss";
// Your stylesheet
import "@/css/app.scss";

// React core
import React from "react";
import { createRoot } from "react-dom/client";
import { App, ZMPRouter, SnackbarProvider } from 'zmp-ui';
import { RecoilRoot } from 'recoil';

// Mount the app
import AppContent from "@/components/AppContent";

// Expose app configuration
import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig as any;
}

const MyApp = () => {
  return React.createElement(
    RecoilRoot,
    null,
    React.createElement(
      App,
      null,
      React.createElement(
        SnackbarProvider,
        null,
        React.createElement(
          ZMPRouter,
          null,
          React.createElement(AppContent)
        )
      )
    )
  );
};

const root = createRoot(document.getElementById("app")!);
root.render(React.createElement(MyApp));

