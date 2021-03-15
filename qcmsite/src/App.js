import "./App.css";
import { Route, Router, Switch } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ListUsers from "./pages/ListUsers";
import Login from "./pages/Login";
import RequestId from "./pages/RequestId";
import Loading from "./components/Loading";
import Alerty from "./components/Alerty";
import ListRequests from "./pages/ListRequests";
import ListQcms from "./pages/ListQcms";
import localStorage from 'store'
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Profile from "./pages/Profile";
import EditQcm from "./pages/EditQcm";
import ListCategories from "./pages/ListCategories";
import EditCategory from "./pages/EditCategory";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress"
import Dialog from "./components/Dialog";
import ResultFinal from "./pages/ResultFinal";
import Splash from "./pages/Splash";
import Me from "./pages/Me";


function App() {

  let {user} = useSelector(state=>state.appReducer)

  const [splashing,setSplash] = useState(true)

  useEffect(() => {
    
    
   
  }, [user])

  useEffect(()=>{

    setTimeout(() => {
      setSplash(false)
    }, 2000);

  },[])


  if(splashing){
    return <Splash />
  }
  return (
    <div className="App">
      
     
        <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/list_users">
          <ListUsers />
        </Route>

        <Route exact path="/list_requests">
          <ListRequests />
        </Route>

        <Route exact path="/profile/:id">
          <Profile />
        </Route>

        <Route exact path="/me">
          <Me />
        </Route>

        <Route exact path="/qcm/:id?">
          <EditQcm />
        </Route>

        <Route exact path="/category/:id?">
          <EditCategory />
        </Route>


        <Route exact path="/list_qcms">
          <ListQcms />
        </Route>

        <Route exact path="/list_categories">
          <ListCategories />
        </Route>

        <Route exact path="/login">
          <Login />
        </Route>

        <Route exact path="/request">
          <RequestId />
        </Route>

        <Route exact path="/practice/:id/:progress?">
          <Practice />
        </Route>

        <Route exact path="/progress">
          <Progress />
        </Route>

        <Route exact path="/result/:id">
          <ResultFinal />
        </Route>

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      <Alerty />
      <Loading />

      <Dialog />
      
    </div>
  );
}

export default App;
