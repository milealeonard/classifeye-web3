import { colors } from "@/styles/theme";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>DataMarket</title>
        <meta name="description" content="Generated with create-pinata-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/pinnie.png" />
      </Head>
      <body
        className="w-screen"
        style={{ backgroundColor: colors.lightGray, color: colors.darkBlue }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
