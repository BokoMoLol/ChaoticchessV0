document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 8;
    const chessboard = document.getElementById('chessboard');
    let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
    let selectedPiece = null;
    let walls = [];

    function initializeBoard() {
        chessboard.innerHTML = '';
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                createTile(row, col);
            }
        }
        setupPieces();
    }

    function createTile(row, col) {
        const tile = document.createElement('div');
        tile.id = `tile-${row}-${col}`;
        tile.className = 'tile ' + ((row + col) % 2 === 0 ? 'light' : 'dark');
        tile.addEventListener('click', () => clickTile(row, col));
        chessboard.appendChild(tile);
    }

    function setupPieces() {
        const pieces = [
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
        
        for (let row = 0; row < pieces.length; row++) {
            for (let col = 0; col < pieces[row].length; col++) {
                if (pieces[row][col]) {
                    board[row][col] = pieces[row][col];
                }
            }
        }
        board[1][3] = board[6][3] = 'T'; // Turrets
        updateBoard();
    }

    function updateBoard() {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const tile = document.getElementById(`tile-${row}-${col}`);
                if (board[row][col]) {
                    tile.textContent = board[row][col];
                } else {
                    tile.textContent = '';
                }
                tile.style.backgroundColor = ((row + col) % 2 === 0 ? '#eee' : '#444');
                if (walls.includes(`${row}-${col}`)) {
                    tile.style.backgroundColor = '#000';
                }
            }
        }
    }

    function clickTile(row, col) {
        if (selectedPiece) {
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            selectedPiece = null;
        } else if (board[row][col]) {
            selectedPiece = { row, col };
        }
    }

    function movePiece(fromRow, fromCol, toRow, toCol) {
        if (walls.includes(`${toRow}-${toCol}`)) return;
        
        const piece = board[fromRow][fromCol];
        const targetPiece = board[toRow][toCol];

        if (piece && piece === 'N') {
            const knightMoves = [
                [2, 1], [2, -1], [-2, 1], [-2, -1],
                [1, 2], [1, -2], [-1, 2], [-1, -2],
                [3, 1], [3, -1], [-3, 1], [-3, -1],
                [1, 3], [1, -3], [-1, 3], [-1, -3]
            ];
            const validMove = knightMoves.some(([dx, dy]) => fromRow + dx === toRow && fromCol + dy === toCol);
            if (!validMove) return;
        }

        if (targetPiece && targetPiece === 'R') {
            walls.push(`${fromRow}-${fromCol}`);
        }

        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = null;
        updateBoard();
    }

    initializeBoard();
});
