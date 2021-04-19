import React, { Component } from "react";
import {Route, NavLink, HashRouter} from "react-router-dom";
import CreateMenu from "./CreateMenu";
import FindMenu from "./FindMenu";
import Game from "./Game";
import 'bootstrap/dist/css/bootstrap.min.css';
 
class Main extends Component {
  render() {
    return (
		<HashRouter>
			<div>
			  <h1>Tic-tac-toe</h1>
			  <ul className="nav">
				<li className="nav-item">
					<NavLink 
						className="nav-link" 
						activeStyle={{color:"green", fontWeight:"bold"}} 
						to="/create">
						Create
					</NavLink>
				</li>
				<li className="nav-item">
					<NavLink 
						className="nav-link" 
						activeStyle={{color:"green", fontWeight:"bold"}} 
						to="/find">
						Find
					</NavLink>
				</li>
			  </ul>
			  <div className="content">
				 <Route exact path="/create" component={CreateMenu}/>
				 <Route path="/find" component={FindMenu}/>
				 <Route path="/game/:id" component={Game}/>
			  </div>
			</div>
		</HashRouter>
    );
  }
}

export default Main;