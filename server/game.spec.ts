import { buildBoardStateForPlayer } from "./game"
import { PrivateGameState } from "./types"

const initialGameState: PrivateGameState = {
  type: 'private',
  internalMoves: [],
  players: [],
  turn: 0,
}

describe('buildBoardState', () => {
  it('should return valid personalized game state when no moves', () => {
    const state = buildBoardStateForPlayer(initialGameState, 0);
    expect(state).toEqual({
      type: 'personalized',
      moves: [],
      players: [],
      turn: 0,
      winner: undefined,
    });
  });

  it('first move', () => {
    const internalState: PrivateGameState = {
      ...initialGameState,
      internalMoves: [
        { index: 0, player: 0, value: '1' },
      ],
    };

    expect(buildBoardStateForPlayer(internalState, 0).moves).toEqual([{
      index: 0, player: 0, pos: 0, value: '1',
    }]);

    expect(buildBoardStateForPlayer(internalState, 1).moves).toEqual([{
      index: 0, player: 0, pos: 0
    }]);
  });

  it('first 2 moves', () => {
    const internalState: PrivateGameState = {
      ...initialGameState,
      internalMoves: [
        { index: 0, player: 0, value: '1' },
        { index: 1, player: 1, value: '1' },
      ],
    };

    const boardStatePlayer0 = buildBoardStateForPlayer(internalState, 0).moves;

    expect(boardStatePlayer0[0]).toEqual({ index: 0, player: 0, pos: 0, value: '1', })
    expect(boardStatePlayer0[1]).toEqual({ index: 1, player: 1, pos: 0, })

    const boardStatePlayer1 = buildBoardStateForPlayer(internalState, 1).moves;

    expect(boardStatePlayer1[0]).toEqual({ index: 0, player: 0, pos: 0, })
    expect(boardStatePlayer1[1]).toEqual({ index: 1, player: 1, pos: 0, value: '1', })
  });

  it('B beats A', () => {
    const internalState: PrivateGameState = {
      ...initialGameState,
      internalMoves: [
        { index: 0, player: 0, value: '1' },
        { index: 0, player: 1, value: '2' },
      ],
    };

    const boardStatePlayer0 = buildBoardStateForPlayer(internalState, 0).moves;

    expect(boardStatePlayer0[0]).toEqual({ index: 0, player: 0, pos: 0, value: '1', })
    expect(boardStatePlayer0[1]).toEqual({ index: 0, player: 1, pos: 1, })

    const boardStatePlayer1 = buildBoardStateForPlayer(internalState, 1).moves;

    expect(boardStatePlayer1[0]).toEqual({ index: 0, player: 0, pos: 0, })
    expect(boardStatePlayer1[1]).toEqual({ index: 0, player: 1, pos: 1, value: '2', })
  });

  it('A loses to B ', () => {
    const internalState: PrivateGameState = {
      ...initialGameState,
      internalMoves: [
        { index: 0, player: 0, value: '2' },
        { index: 0, player: 1, value: '1' },
      ],
    };

    const boardStatePlayer0 = buildBoardStateForPlayer(internalState, 0).moves;

    expect(boardStatePlayer0[0]).toEqual({ index: 0, player: 0, pos: 1, value: '2', })
    expect(boardStatePlayer0[1]).toEqual({ index: 0, player: 1, pos: 0, })

    const boardStatePlayer1 = buildBoardStateForPlayer(internalState, 1).moves;

    expect(boardStatePlayer1[0]).toEqual({ index: 0, player: 0, pos: 1, })
    expect(boardStatePlayer1[1]).toEqual({ index: 0, player: 1, pos: 0, value: '1', })
  });

  it('A ties B ', () => {
    const internalState: PrivateGameState = {
      ...initialGameState,
      internalMoves: [
        { index: 0, player: 0, value: '1' },
        { index: 0, player: 1, value: '1' },
      ],
    };

    const boardStatePlayer0 = buildBoardStateForPlayer(internalState, 0).moves;

    expect(boardStatePlayer0[0]).toEqual({ index: 0, player: 0, pos: 0, value: '1', })
    expect(boardStatePlayer0[1]).toEqual({ index: 0, player: 1, pos: 0, })

    const boardStatePlayer1 = buildBoardStateForPlayer(internalState, 1).moves;

    expect(boardStatePlayer1[0]).toEqual({ index: 0, player: 0, pos: 0, })
    expect(boardStatePlayer1[1]).toEqual({ index: 0, player: 1, pos: 0, value: '1', })
  });

  it('A ties B are all beaten by C', () => {
    const internalState: PrivateGameState = {
      ...initialGameState,
      internalMoves: [
        { index: 0, player: 0, value: '1' },
        { index: 0, player: 1, value: '1' },
        { index: 0, player: 2, value: '2' },
      ],
    };

    const boardStatePlayer0 = buildBoardStateForPlayer(internalState, 0).moves;

    expect(boardStatePlayer0[0]).toEqual({ index: 0, player: 0, pos: 0, value: '1', })
    expect(boardStatePlayer0[1]).toEqual({ index: 0, player: 1, pos: 0, })
    expect(boardStatePlayer0[2]).toEqual({ index: 0, player: 2, pos: 1, })

    const boardStatePlayer1 = buildBoardStateForPlayer(internalState, 1).moves;

    expect(boardStatePlayer1[0]).toEqual({ index: 0, player: 0, pos: 0, })
    expect(boardStatePlayer1[1]).toEqual({ index: 0, player: 1, pos: 0, value: '1', })
    expect(boardStatePlayer1[2]).toEqual({ index: 0, player: 2, pos: 1, })

    const boardStatePlayer2 = buildBoardStateForPlayer(internalState, 2).moves;

    expect(boardStatePlayer2[0]).toEqual({ index: 0, player: 0, pos: 0, })
    expect(boardStatePlayer2[1]).toEqual({ index: 0, player: 1, pos: 0 })
    expect(boardStatePlayer2[2]).toEqual({ index: 0, player: 2, pos: 1, value: '2', })
  });

  it('Moves are hidden from specator', () => {
    const internalState: PrivateGameState = {
      ...initialGameState,
      internalMoves: [
        { index: 0, player: 0, value: '1' },
        { index: 0, player: 1, value: '1' },
        { index: 0, player: 2, value: '2' },
        { index: 1, player: 0, value: '3' },
        { index: 2, player: 1, value: '4' },
        { index: 3, player: 2, value: '5' },
      ],
    };

    const boardStateSpectator = buildBoardStateForPlayer(internalState, -0).moves;

    expect(boardStateSpectator[0]).toEqual({ index: 0, player: 0, pos: 0, })
    expect(boardStateSpectator[1]).toEqual({ index: 0, player: 1, pos: 0, })
    expect(boardStateSpectator[2]).toEqual({ index: 0, player: 2, pos: 1, })
    expect(boardStateSpectator[3]).toEqual({ index: 1, player: 0, pos: 2, })
    expect(boardStateSpectator[4]).toEqual({ index: 2, player: 1, pos: 3, })
    expect(boardStateSpectator[5]).toEqual({ index: 3, player: 2, pos: 4, })
  });
})
