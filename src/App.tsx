/*
 * @Author       : ganbowen
 * @Date         : 2022-07-13 13:36:03
 * @LastEditors  : ganbowen
 * @LastEditTime : 2022-07-13 17:16:31
 * @Descripttion : 
 */
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Nothing from "./pages/Nothing";
import Game from './pages/Game'
import AppProviders from './components'; 
export  default function BasicExample() {
  return (
    <AppProviders>
        <Router>
            <div>
                <Switch>
                    <Route exact path="/game">
                        <Game />
                    </Route>
                    <Route path="/">
                        <Nothing />
                    </Route>
                </Switch>
            </div>
        </Router>
    </AppProviders>
  );
}

