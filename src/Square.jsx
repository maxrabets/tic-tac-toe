import React from 'react';
import "./css/tic-tac-toe.css";

function Square(props){
	return (
		<button className="square" onClick={props.onClick}> 
		{props.value}
		</button>
	);
}

export default Square;