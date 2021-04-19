import React from "react";
import GameInfo from "./GameInfo";
import 'bootstrap/dist/css/bootstrap.min.css';

class GamesTable extends React.Component{
	
	render() {
		return (
		<div className="table-responsive">
			<table className="table table-bordered table-hover">
			<thead key="thead" className="thead-dark">
			  <tr key="thead row">
				<th key="id">ID</th>
				<th key="Name">Name</th>
				<th key="Email">Tags</th>
				<th key="Connect">Connect</th>
			  </tr>
			</thead>
			<tbody key="tbody">
				{this.props.games.map( game => 
					<GameInfo key={game.id} game={game} />
				)}
			</tbody>
			</table>
		</div>
		)
	}
}

export default GamesTable;