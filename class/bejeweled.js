const Screen = require("./screen");
const Cursor = require("./cursor");

class Bejeweled {

  constructor() {

    this.playerTurn = "O";
    

    
    this.grid = 
    [[' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' ']];

    Screen.initialize(8, 8);
    Screen.setGridlines(false);

    this.fillGaps(); //fills board
    this.processMove(); //clears/replaces until no comobos left
    this.score = 0;

    this.cursor = new Cursor(8, 8);

  

    Screen.addCommand('up', 'move cursor up', this.cursor.up.bind(this.cursor));
    Screen.addCommand('down', 'move cursor down', this.cursor.down.bind(this.cursor));
    Screen.addCommand('left', 'move cursor left', this.cursor.left.bind(this.cursor));
    Screen.addCommand('right', 'move cursor right', this.cursor.right.bind(this.cursor));
    Screen.addCommand('return', 'select two items to switch', this.switchChars.bind(this));

    this.cursor.setBackgroundColor();
    Screen.render();
  };

  static checkSequence(grid, startRow, startCol, rowStep, colStep, num) {
   
    let character = grid[startRow][startCol];
    let positions = [];

    for (let i = 0; i < num; i++) {
      if(grid[startRow + i * rowStep][startCol + i * colStep] !== character) {
        return false;
      } else {
        positions.push({row: (startRow + i * rowStep), col: (startCol + i * colStep)});
      }
    }

    return positions;
    
  }

  static checkForMatches(grid) {

    for (let row = 0; row < grid.length; row++) {
      for(let col = 0; col < grid[0].length; col++) {
        
        //checks horizontal wins
        if (col <= grid[0].length - 3) {
          let result = Bejeweled.checkSequence(grid, row, col, 0, 1, 3);
          if(result) {
            return result;
          }
        }
        //checks vertical wins
        if (row <= grid.length - 3) {
          
          let result = Bejeweled.checkSequence(grid, row, col, 1, 0, 3);

          if(result) {
            return result;
          }
        }
      }
    }
  };

  clearCharacters(positions) {
    positions.forEach(position => {
      this.grid[position.row][position.col] = ' ';
      Screen.setGrid(position.row, position.col, ' ');
      Screen.render();
    });
  }

  static findNextChar(grid, startPosition) {
    let oneUp = {row: startPosition.row -1, col: startPosition.col};

    if (oneUp.row === -1 || (grid[oneUp.row][oneUp.col] === ' ' && oneUp.row === 0)) {
      return false
    } else if (grid[oneUp.row][oneUp.col] !== ' ') {
      return oneUp
    } else {
      return Bejeweled.findNextChar(grid, oneUp)
    }

    }

  fillDown() {
    let falling = true;
    while (falling) {
      falling = false;
      for (let row = 0; row < this.grid.length; row++) {
        for (let col = 0; col < this.grid[0].length; col++) {
          if (this.grid[row][col] === ' ') {
            let nextCharPosition = Bejeweled.findNextChar(this.grid, {row: row, col: col});
            if (nextCharPosition) {
              this.grid[row][col] = this.grid[nextCharPosition.row][nextCharPosition.col];
              Screen.setGrid(row, col, this.grid[nextCharPosition.row][nextCharPosition.col]);
              this.grid[nextCharPosition.row][nextCharPosition.col] = ' ';
              Screen.setGrid(nextCharPosition.row, nextCharPosition.col, ' ');
              falling = true;
            }
          }
        }
      }
    }
    Screen.render();
  }

  fillGaps() {
    const chars = 'ABCDEFGHIJ';
    this.grid.forEach((row, i) => row.forEach((char, j) => {
      if (char === ' ') {
        let randChar = Math.floor(Math.random() * chars.length);
        this.grid[i][j] = chars[randChar];
        Screen.setGrid(i, j, chars[randChar]);
        Screen.setTextColor(i, j, 'white');
        Screen.render();
      };
    }));

  };

  processMove() {
    let combo = Bejeweled.checkForMatches(this.grid);
    if(combo) {
      this.score += 1;
      this.clearCharacters(combo);
      this.fillDown();
      this.fillGaps();
      this.processMove();
    }

    let possible = Bejeweled.possibleMoves(this.grid);

    if(possible) {
      if(this.score) {
        Screen.setMessage(`Keep going! You've gotten ${this.score} combo(s)!`);
        Screen.render()
      }
    } else {
      Screen.setQuitMessage(`No more possible moves. Score: ${this.score}`);
      Screen.quit(true);
    }

  };

  static isWithinBounds(grid, row, col) {
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
  }

  static possibleMoves(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        let current = grid[row][col];
        
        // Check horizontal possible moves
        if (col <= grid[0].length - 2) {
          let result = Bejeweled.checkSequence(grid, row, col, 0, 1, 2);
          if (result) {
            // Check adjacent moves
            if (
              Bejeweled.isWithinBounds(grid, row, col - 2) && current === grid[row][col - 2] || // left side
              Bejeweled.isWithinBounds(grid, row, col + 3) && current === grid[row][col + 3] || // right side
              Bejeweled.isWithinBounds(grid, row + 1, col + 2) && current === grid[row + 1][col + 2] || // diagonal right down
              Bejeweled.isWithinBounds(grid, row - 1, col + 2) && current === grid[row - 1][col + 2] || // diagonal right up
              Bejeweled.isWithinBounds(grid, row + 1, col - 1) && current === grid[row + 1][col - 1] || // diagonal left down
              Bejeweled.isWithinBounds(grid, row - 1, col - 1) && current === grid[row - 1][col - 1]  // diagonal left up
            ) {
              return true;
            }
          }
        }
  
        // Check vertical possible moves
        if (row <= grid.length - 2) {
          let result = Bejeweled.checkSequence(grid, row, col, 1, 0, 2);
          if (result) {
            // Check adjacent moves
            if (
              Bejeweled.isWithinBounds(grid, row - 2, col) && current === grid[row - 2][col] || // above
              Bejeweled.isWithinBounds(grid, row + 3, col) && current === grid[row + 3][col] ||   // below
              Bejeweled.isWithinBounds(grid, row - 1, col + 1) && current === grid[row - 1][col + 1] || // up right
              Bejeweled.isWithinBounds(grid, row - 1, col - 1) && current === grid[row - 1][col - 1] || // up left
              Bejeweled.isWithinBounds(grid, row + 2, col + 1) && current === grid[row + 2][col + 1] || // down right
              Bejeweled.isWithinBounds(grid, row + 2, col - 1) && current === grid[row + 2][col - 1] // down left
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  static selected = []

  switchChars() {
    if(Bejeweled.selected.length === 0) {
      Bejeweled.selected.push({row: this.cursor.row, col: this.cursor.col, char: this.grid[this.cursor.row][this.cursor.col]});
      this.cursor.selected();
    } else {
      Bejeweled.selected.push({row: this.cursor.row, col: this.cursor.col, char: this.grid[this.cursor.row][this.cursor.col]});
      this.cursor.selected();
      let first = Bejeweled.selected[0];
      let second = Bejeweled.selected[1];
      this.grid[first.row][first.col] = second.char;
      Screen.setGrid(first.row, first.col, second.char);
      this.grid[second.row][second.col] = first.char;
      Screen.setGrid(second.row, second.col, first.char);
      Screen.render();
      this.processMove();
      Bejeweled.selected = [];
    }
    
    
  }

}


// let board = new Bejeweled();
// // console.log(board.grid);
// board.grid =   
// [['A','B','C','D','E','F','G','H'], 
// ['I','J','K','L','M','N','O','P'],
// ['Q','R','S','T','U','V','W','X'],
// ['Y','X','A','B','C','A','B','C'],
// ['A','X','C','D','E','F','G','H'],
// ['I','X','K','L','M','N','O','P'],
// ['Q','R','S','T','U','V','W','X'],
// ['A','R','C','D','E','F','G','H']];

// board.cursor.row = 2;
// board.cursor.col = 3;

// board.switchChars();

// board.processMove();

// let positions = Bejeweled.checkForMatches(board.grid);
// console.log(positions);
// board.fillDown(positions);
// console.log(board.grid[0]);
// console.log(board.grid[1]);
// console.log(board.grid[2]);
// console.log(board.grid[3]);
// console.log(board.grid[4]);
// console.log(Bejeweled.findNextChar(board.grid,{row: 1, col: 2}));


module.exports = Bejeweled;
