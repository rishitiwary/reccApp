import React from 'react';
import { WebView } from 'react-native-webview';

const SplashScreen = () => {
  return (
    <WebView
      originWhitelist={['*']}
      source={{
        html: `
          <html>
            <body style="margin:0;padding:0;">
              <img src="https://recc.org.in/splash.gif" style="width:100%;height:100%;" />
            </body>
          </html>
        `,
      }}
      style={{ flex: 1 }}
    />
  );
};

export default SplashScreen;
