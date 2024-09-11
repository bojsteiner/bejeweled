const { expect } = require('chai');

const Bejeweled = require("../class/bejeweled.js");

describe ('Bejeweled', function () {
  beforeEach(function() {
    board = new Bejeweled();
  });

  // Tests for setting up a basic board
  it ('should initialize an 8 by 8 board', () => {
    expect(board.grid.length).to.equal(8);
    expect(board.grid[0].length).to.equal(8);
  })

  // Tests for a valid swap that matches 3
  describe ('checkForMatches', () => {
    it ('should correctly identify horizontal combos of 3 matching characters', () => {
      grid = [['A','B','C','D','E','F','G','H'],
              ['I','J','K','L','M','N','O','P'],
              ['Q','R','S','T','U','V','W','X'],
              ['Y','Z','X','X','X','A','B','C'],
              ['A','B','C','D','E','F','G','H'],
              ['I','J','K','L','M','N','O','P'],
              ['Q','R','S','T','U','V','W','X'],
              ['A','B','C','D','E','F','G','H']]

      expect(Bejeweled.checkForMatches(grid)).to.eql([{row: 3, col: 2},{row: 3, col: 3}, {row: 3, col: 4}]);

    });

    it ('should correctly identify vertical combos of 3 matching characters', () => {
      grid = [['A','B','C','D','E','F','G','H'],
              ['I','J','K','L','M','N','O','P'],
              ['Q','R','S','T','U','V','W','X'],
              ['Y','X','A','B','C','A','B','C'],
              ['A','X','C','D','E','F','G','H'],
              ['I','X','K','L','M','N','O','P'],
              ['Q','R','S','T','U','V','W','X'],
              ['A','B','C','D','E','F','G','H']];

      expect(Bejeweled.checkForMatches(grid)).to.eql([{row: 3, col: 1},{row: 4, col: 1}, {row: 5, col: 1}]);
    });
  })

  describe("fillDown", () => {
    it('should update the grid so that characters from above drop to fill any empty positions', () => {
      let board2 = new Bejeweled();

      
      board.grid = 
              [['A','B','C','D','E','F','G','H'],
              ['I','J','K','L','M','N','O','P'],
              ['Q','R','S','T','U','V','W','X'],
              ['Y','Z','X','X','X','A','B','C'],
              ['A','B','C','D','E','F','G','H'],
              ['I','J','K','L','M','N','O','P'],
              ['Q','R','S','T','U','V','W','X'],
              ['A','B','C','D','E','F','G','H']];

      board2.grid = 
              [['A','B','C','D','E','F','G','H'], 
              ['I','J','K','L','M','N','O','P'],
              ['Q','R','S','T','U','V','W','X'],
              ['Y','X','A','B','C','A','B','C'],
              ['A','X','C','D','E','F','G','H'],
              ['I','X','K','L','M','N','O','P'],
              ['Q','R','S','T','U','V','W','X'],
              ['A','B','C','D','E','F','G','H']];
      
      const positions = Bejeweled.checkForMatches(board.grid);
      const positions2 = Bejeweled.checkForMatches(board2.grid);

      board.clearCharacters(positions);
      board2.clearCharacters(positions2)

      board.fillDown();
      board2.fillDown();

      expect(board.grid).to.eql(
        [['A','B',' ',' ',' ','F','G','H'],
        ['I','J','C','D','E','N','O','P'],
        ['Q','R','K','L','M','V','W','X'],
        ['Y','Z','S','T','U','A','B','C'],
        ['A','B','C','D','E','F','G','H'],
        ['I','J','K','L','M','N','O','P'],
        ['Q','R','S','T','U','V','W','X'],
        ['A','B','C','D','E','F','G','H']]
      );

      expect(board2.grid).to.eql(
        [['A',' ','C','D','E','F','G','H'], 
        ['I',' ','K','L','M','N','O','P'],
        ['Q',' ','S','T','U','V','W','X'],
        ['Y','B','A','B','C','A','B','C'],
        ['A','J','C','D','E','F','G','H'],
        ['I','R','K','L','M','N','O','P'],
        ['Q','R','S','T','U','V','W','X'],
        ['A','B','C','D','E','F','G','H']]
      );

    });
  });

  describe("fillGaps",() => {
    it("should fill in any empty spots in the grid with new random characters", () => {
      
      board.grid = 
              [['A',' ',' ',' ','E','F','G','H'],
              ['I','J','K','L','M','N','O','P'],
              ['Q','R','S','T','U','V','W','X'],
              ['Y','X','A','B','C','A','B','C'],
              ['A','G','C','D','E','F','G','H'],
              ['I','H','K','L','M','N','O','P'],
              ['Q','R','S','T','U','V','W','X'],
              ['A','B','C','D','E','F','G','H']];

      board.fillGaps();

      expect(board.grid[0][1]).to.not.equal(' ');
      expect(board.grid[0][2]).to.not.equal(' ');
      expect(board.grid[0][3]).to.not.equal(' ');
    })
  });

  // Tests for swaps that set up combos

  describe("processMove", () => {
    it("should identify when swaps set up additional combos, and replace those as well", () => {
      
      board.grid = 
      [['A','B','C','D','E','F','G','H'], 
      ['I','J','K','L','M','N','O','P'],
      ['Q','R','S','T','U','V','W','X'],
      ['Y','X','A','B','C','A','B','C'],
      ['A','X','C','D','E','F','G','H'],
      ['I','X','K','L','M','N','O','P'],
      ['Q','R','S','T','U','V','W','X'],
      ['A','R','C','D','E','F','G','H']];

      board.processMove();

      expect(board.grid[7][1]).to.equal('J');
      expect(board.grid[6][1]).to.equal('B');
    })
  });

  // Tests to check if there are no possible valid moves

  describe("possibleMoves", () => {
    context ("valid moves present", () => {
      it("should return true if there are valid moves present", () => {
        grid = 
        [['A','B','C','D','E','F','G','H'], 
        ['I','J','K','L','M','N','O','P'],
        ['Q','X','S','T','U','V','W','X'],
        ['Y','R','A','B','C','A','B','C'],
        ['A','X','C','D','E','F','G','H'],
        ['I','X','K','L','M','N','O','P'],
        ['Q','R','S','T','U','V','W','X'],
        ['A','B','C','D','E','F','G','H']];

        expect(Bejeweled.possibleMoves(grid)).to.be.true
      });
    });

    context("no valid moves present", () => {
      it("should return false if there are no valid moves present", () => {
        grid = 
        [['A','B','C','D','E','F','G','H'], 
        ['I','J','K','L','M','N','O','P'],
        ['Q','X','S','T','U','V','W','X'],
        ['Y','R','A','B','C','A','B','C'],
        ['A','Z','C','D','E','F','G','H'],
        ['I','X','K','L','M','N','O','P'],
        ['Q','R','S','T','U','V','W','X'],
        ['A','B','C','D','E','F','G','H']];

        expect(Bejeweled.possibleMoves(grid)).to.be.false
      });
    });
  });

});

