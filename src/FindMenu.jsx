import React, { Component } from "react";
import GamesTable from "./GamesTable";
import Tags from "@yaireo/tagify/dist/react.tagify";
import "@yaireo/tagify/dist/tagify.css";
import 'bootstrap/dist/css/bootstrap.min.css';

 
class FindMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {name: "", games: [], whiteList: [], shownGames: []};
		this.onChangeName = this.onChangeName.bind(this);
		this.getGames = this.getGames.bind(this);
		this.getTags = this.getTags.bind(this);
		this.onChangeTags = this.onChangeTags.bind(this);
		this.getGames();		
	}
	
	onChangeTags(e) {
		const value = JSON.parse(e.detail.value);
		const tags = value.map(tag => tag.value);
		let games = this.state.games.slice();
		console.log(this.state);
		console.log(tags);
		const shownGames = games.filter(game => tags.every((tag) => game.tags.includes(tag)))
		this.setState({shownGames: shownGames});
		console.log(this.state);
	}
	
	getTags(){
		let tags = [];
		this.state.games.forEach(game => {
			tags = tags.concat(game.tags);
		})
		this.setState({whiteList: Array.from(new Set(tags))});
		console.log(this.state);
	}
	
	async getGames(){
		let response = await fetch('getGames');
		if (response.ok) {
			let games = await response.json();
			console.log(games);
			this.setState({games: games});
			this.setState({shownGames: games});
			this.getTags();
			console.log(this.state);
		}
	}
	
	tagifySettings = {		
		maxTags: 10,
		dropdown: {
			maxItems: 4,           // <- mixumum allowed rendered suggestions
			classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
			enabled: 0,             // <- show suggestions on focus
			closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
		  }
	  };
	
	onChangeName(e) {
        this.setState({name: e.target.value});
    }
	
	render() {
		return (
				<div className="form-group mb-3">
					<label>Tags</label>
					<Tags 					
						settings={this.tagifySettings}
						onChange={this.onChangeTags}
						whitelist= {this.state.whiteList}
						className="mb-3"
					/>					
				<GamesTable games={this.state.shownGames}/>
				< /div>
		);
	}
}
 
export default FindMenu;