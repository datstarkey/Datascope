import React, { useEffect, useContext } from "react";
import "./App.css";
import { GameList } from "./Components/GameList";
import { Layout, Button } from "antd";
import { LoginDetails } from "./Components/Login/LoginDetails";
import { AppContext } from "./Components/Context/Context";
import Cookies from "universal-cookie";
import { RefreshLogin } from "./Utilities/LoginApi";
const { Header, Content, Footer } = Layout;

function App() {
  const context = useContext(AppContext);
  const cookies = new Cookies();

  useEffect(() => {
    var bearerToken = cookies.get("token");
    if (bearerToken) {
      RefreshLogin(bearerToken)
        .then((response) => response.json())
        .then((result) => {
          cookies.set("token", result);
          if (context.setAuthenticated) context.setAuthenticated(true);
          if (context.setBearer) context.setBearer(result);
        })
        .catch((err) => {
          console.log(err);
          cookies.remove("token");
        });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Layout className="layout">
      <Header style={{ background: "#002766" }} data-testid="header">
        <img style={{ display: "inline" }} src="/jgl-logo.png" alt="logo" className="logo" />

        <h1 style={{ display: "inline", marginLeft: 10 }} className="alt-color">
          Jakes Gaming List
        </h1>

        <LoginDetails />
      </Header>
      <Content style={{ padding: "0 50px" }} data-testid="main-content">
        <div className="site-layout-content">
          <GameList />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }} data-testid="footer">
        © Jake Starkey - Inteded for use as a demonstration Task for Datascope
        <Button href="https://github.com/datstarkey/DatascopeTask" style={{ marginLeft: 5 }}>
          Github
        </Button>
      </Footer>
    </Layout>
  );
}

export default App;
