import React from 'react';
import Board from "./Board";
import ReactModal from 'react-modal'
import {Redirect} from "react-router-dom";
import "./css/tic-tac-toe.css";

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			squares: Array(9).fill(null),
			xIsNext: true,
			isX: true,
			start: false,
			showModal: false,
			finished: false,
			status: "Waiting for 2 player"
		};
		this.connectToTheGame = this.connectToTheGame.bind(this);
		this.sendMove = this.sendMove.bind(this);
		this.makeMove = this.makeMove.bind(this);
		this.sendMove = this.sendMove.bind(this);
		this.createWebSocket = this.createWebSocket.bind(this);
		this.socketOnClose = this.socketOnClose.bind(this);
		this.socketOnError = this.socketOnError.bind(this);
		this.socketOnMessage = this.socketOnMessage.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.finish = this.finish.bind(this);
		this.calculateWinner = this.calculateWinner.bind(this);
		this.createWebSocket();
	}
	
	socketOnClose(event) {
		if(event.wasClean){
			console.log("Closed clean");
		}
		else {
			console.log("Closed bad");
			console.log(event.code);
			console.log(event.reason);				
		}
	}
	
	socketOnError(err) {
		console.log(err);
	}
	
	socketOnMessage(message){
		console.log(message);
		const json = JSON.parse(message.data);
		console.log(json);
		switch(json.event) {
			case "connected":
				this.setState({isX: json.isX});
			break;
			
			case "move":
				this.makeMove(json.move);
			break;
			
			case "start":
				this.setState({start: true, status: 'In process'});
				console.log(this.state);
			break;
			
			default:
				console.log("wrong event");
		}
	}
	
	createWebSocket(){	
		this.socket = new WebSocket("ws://"+window.location.host, 'echo-protocol');
		this.socket.onerror = this.socketOnError;
		this.socket.onclose = this.socketOnClose;		
		this.socket.onmessage = this.socketOnMessage;
		this.socket.onopen = (e) => {
			console.log("Socket opend")
			this.connectToTheGame(this.props.match.params.id);		
		}
	}
	
	connectToTheGame(){
		console.log(this.socket.readyState);
		console.log(this.socket);
		this.socket.send(JSON.stringify({event: "connect", id: this.props.match.params.id}));
	}
	
	sendMove(move){
		this.socket.send(JSON.stringify({event: "move",  id: this.props.match.params.id, move: move}));
	}
	
	makeMove(move){
		let squares = this.state.squares.slice();
		squares[move] = this.state.xIsNext ? 'X' : 'O';    
		this.setState({
			xIsNext: !this.state.xIsNext,
			squares: squares
		});
		this.calculateWinner(squares)
	}
		
	handleClick(i) {
		console.log(this.state);
		if (this.state.status === "Draw" 
			|| this.state.status === "Winner X" 
			|| this.state.status === "Winner O" 
			|| this.state.squares[i] 
			|| !this.state.start 
			|| (this.state.xIsNext ^ this.state.isX)) 
			return;
		console.log(i)
		this.makeMove(i);
		this.sendMove(i);		
	}
	
	async finish(){
		console.log('finish' + this.state.finished);
		this.setState({showModal: true});
	}
	
	handleCloseModal(){
		this.socket.send(JSON.stringify({event: "finish",  id: this.props.match.params.id}))
		this.socket.close();
		this.setState({showModal: false, finished: true})
	}
	
	calculateWinner(squares) {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				this.setState({status: ('Winner ' + squares[a])})
				this.finish()
			}
		}
		if(!squares.includes(null)) {
			this.setState({status: 'Draw'})
			this.finish()
		}
	}
	
	render() {
		if(this.state.finished)
			return <Redirect to={"/create"} />; 
		return (
		  <div className="game">
			<h4>{"You are " + (this.state.isX ? 'X' : 'O')}</h4>
			<div className="game-board">
			  <Board 
				  squares={this.state.squares}
				  onClick={(i) => this.handleClick(i)}
			   />
			</div><br/>
			<div className="game-info">
			  <h2>{this.state.status}</h2>
			</div>
			<ReactModal isOpen={this.state.showModal}>
				<h2>{this.state.status}</h2>
				<button className="btn btn-primary" onClick={this.handleCloseModal}>OK</button>
			</ReactModal>
		  </div>
		);
	 }
}

export default Game;