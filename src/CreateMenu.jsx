import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import Tags from "@yaireo/tagify/dist/react.tagify";
import "@yaireo/tagify/dist/tagify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
 
class CreateMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {name: "", tags: [], gameCreated: false};
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeTags = this.onChangeTags.bind(this);
		this.onCreate = this.onCreate.bind(this);
	}
	
	onChangeTags(e) {
		const value = JSON.parse(e.detail.value)
        this.setState({tags: value.map(tag => tag.value)});
		console.log(this.state);
	}
	
	onChangeName(e) {
        this.setState({name: e.target.value});
	}
	
	tagifySettings = {		
		maxTags: 10
	  };
	
	onCreate(e) {
		fetch('createGame', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({name: this.state.name, tags: this.state.tags})
		}).then(response => {
			if(response.ok){
				response.json().then(gameID => {
					this.gameID = gameID
					this.setState({gameCreated: true});
				})
				
			}
		});        
    }
	
	render() {
		if(this.state.gameCreated)
			return <Redirect to={"/game/" + this.gameID} />; 
		return (
		<div>
				<div className="form-group mb-3">
					<label>Tags</label>
					<Tags 					
						settings={this.tagifySettings}
						onChange={this.onChangeTags}
						className="form-control form-control-lg"
					/>
				< /div>
				<div className="form-group mb-3">
					<label>Name of game</label>
					<input 
						type="text" 
						name="name"
						value={this.state.name} 
						onChange={this.onChangeName}
						className="form-control form-control-lg"
					/>
				< /div>
				<button onClick={this.onCreate} className="btn btn-secondary mr-1 ">Create</button>
		< /div>
		);
	}
}
 
export default CreateMenu;