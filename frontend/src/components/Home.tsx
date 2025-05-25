import React from "react";
import Nav from "./Nav";
import Main from "./Main";
import { ImageGallery } from "./Images";

function Home() {
  return (
    <div>
      <Nav />
      <Main />
      <ImageGallery />
    </div>
  );
}

export default Home;
