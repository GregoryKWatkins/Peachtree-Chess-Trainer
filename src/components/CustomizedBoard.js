// import React, { Component } from "react";
// import Chessboard from "chessboardjsx";
// import Chess from  "chess.js";
// import PropTypes from "prop-types";

// class ChessGame extends Component {
//     static propTypes = { children: PropTypes.func };

//     state = {
//         fen: "",
//         // square styles for active drop square
//         dropSquareStyle: {},
//         // custom square styles
//         squareStyles: {},
//         // square with the currently clicked piece
//         pieceSquare: "",
//         // currently clicked square
//         square: "",
//         // array of past game moves
//         history: []
//     };

//     componentDidMount() {
//         //var fen = "start";
//         // var h = this;
//         // fetch('https://jgmysjlzii.execute-api.us-east-2.amazonaws.com/prod/module').then(function(data) {
//         //   return data.json();
//         // }).then(function(result) {
//         //   var moduleJSON = JSON.parse(result.module.module);
//         //   var fenString = moduleJSON[0].content[0].board_config;
//         //   fen = fenString;
//         //   h.game = new Chess(fen);
//         //   h.setState(() => ({
//         //      fen: fen
//         //   }));
//         // });
//         let fen = this.props.position
//         this.game = new Chess(fen)
//         this.setState({fen: fen})
//     }

//     onDrop = ({ sourceSquare, targetSquare }) => {
//         // see if the move is legal
//         let move = this.game.move({
//           from: sourceSquare,
//           to: targetSquare,
//           promotion: "q" // always promote to a queen for example simplicity
//         });

//         // illegal move
//         if (move === null) return;
//         this.setState(({ history, pieceSquare }) => ({
//           fen: this.game.fen(),
//           history: this.game.history({ verbose: true }),
//           squareStyles: squareStyling({ pieceSquare, history })
//         }));
//     };

//     // show possible moves
//     highlightSquare = (sourceSquare, squaresToHighlight) => {
//     const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
//       (a, c) => {
//         return {
//           ...a,
//           ...{
//             [c]: {
//               background:
//                 "radial-gradient(circle, #fffc00 36%, transparent 40%)",
//               borderRadius: "50%"
//             }
//           },
//           ...squareStyling({
//             history: this.state.history,
//             pieceSquare: this.state.pieceSquare
//           })
//         };
//       },
//       {}
//     );

//         this.setState(({ squareStyles }) => ({
//             squareStyles: { ...squareStyles, ...highlightStyles }
//         }));
//     };

//     // When you mouse over, the legal moves show as yellow circles. Calls highlightsquare function above.
//     onMouseOverSquare = square => {
//         // get list of possible moves for this square
//         let moves = this.game.moves({
//           square: square,
//           verbose: true
//         });

//         // exit if there are no moves available for this square
//         if (moves.length === 0) return;

//         let squaresToHighlight = [];
//         for (var i = 0; i < moves.length; i++) {
//           squaresToHighlight.push(moves[i].to);
//         }

//         this.highlightSquare(square, squaresToHighlight);
//     };

//     // keep clicked square style and remove hint squares
//     removeHighlightSquare = () => {
//         this.setState(({ pieceSquare, history }) => ({
//                 squareStyles: squareStyling({ pieceSquare, history })
//         }));
//     };

//     onMouseOutSquare = square => this.removeHighlightSquare(square);

//     onSquareClick = square => {
//         this.setState(({ history }) => ({
//           squareStyles: squareStyling({ pieceSquare: square, history }),
//           pieceSquare: square
//         }));

//         let move = this.game.move({
//           from: this.state.pieceSquare,
//           to: square,
//           promotion: "q" // always promote to a queen for example simplicity
//         });

//         // illegal move
//         if (move === null) return;

//         this.setState({
//           fen: this.game.fen(),
//           history: this.game.history({ verbose: true }),
//           pieceSquare: ""
//         });
//     };

//     render() {
//         const { fen, dropSquareStyle, squareStyles } = this.state;

//         return this.props.children({
//           squareStyles,
//           position: fen,
//           onMouseOverSquare: this.onMouseOverSquare,
//           onMouseOutSquare: this.onMouseOutSquare,
//           onDrop: this.onDrop,
//           dropSquareStyle,
//           onDragOverSquare: this.onDragOverSquare,
//           onSquareClick: this.onSquareClick,
//           onSquareRightClick: this.onSquareRightClick
//         });
//     }
// }

// export default function WithMoveValidation() {
//     return (
//       <div>
//         <ChessGame>
//           {({
//             position,
//             onDrop,
//             onMouseOverSquare,
//             onMouseOutSquare,
//             squareStyles,
//             dropSquareStyle,
//             onDragOverSquare,
//             onSquareClick,
//             onSquareRightClick,
//           }) => (
//             <Chessboard
//               id="humanVsHuman"
//               width={500}
//               position={position}
//               onDrop={onDrop}
//               onMouseOverSquare={onMouseOverSquare}
//               onMouseOutSquare={onMouseOutSquare}
//               boardStyle={{
//                 borderRadius: "5px",
//                 boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
//               }}
//               squareStyles={squareStyles}
//               dropSquareStyle={dropSquareStyle}
//               onDragOverSquare={onDragOverSquare}
//               onSquareClick={onSquareClick}
//               onSquareRightClick={onSquareRightClick}
//             />
//           )}
//         </ChessGame>
//       </div>
//     );
// }

// const squareStyling = ({ pieceSquare, history }) => {
//     const sourceSquare = history.length && history[history.length - 1].from;
//     const targetSquare = history.length && history[history.length - 1].to;

//     return {
//       // Highlights the currently clicked square
//       [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },

//       //Highlights the history (square you moved from)
//       // ...(history.length && {
//       //   [sourceSquare]: {
//       //     backgroundColor: "rgba(255, 255, 0, 0.4)"
//       //   }
//       // })
//       //,

//       // This highlights where you move to.
//       ...(history.length && {
//         [targetSquare]: {
//           backgroundColor: "rgba(255, 255, 0, 0.4)"
//         }
//       })
//     };
// };