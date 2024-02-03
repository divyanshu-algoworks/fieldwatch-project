import "./assets/stylesheets/application.css.scss";
import { BrowserRouter } from "react-router-dom";
import View from "./Pages/index";
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="container">
          <View />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
