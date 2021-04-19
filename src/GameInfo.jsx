import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
 
class GameInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			connectedToGame: false
		}
		this.onConnect = this.onConnect.bind(this);
	}
	
	onConnect(e) {
		fetch('connectToTheGame', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({id: this.props.game.id})
		}).then(response => {
			if(response.ok){				
				this.setState({connectedToGame: true});
			}
		});        
    }
	
	render(){ 
		if(this.state.connectedToGame)
			return <Redirect to={"/game/" + this.props.game.id} />;
		return <tr key={this.props.game.id}>
			<td key="id">{this.props.game.id}</td>
			<td key="name">{this.props.game.name}</td>
			<td key="email">{this.props.game.tags.join()}</td>
			<td key="connect button">
				<button onClick={this.onConnect} className="btn btn-secondary mr-1 ">Connect</button>
			</td>
		</tr>;
	}
}
 
export default GameInfo;