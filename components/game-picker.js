import {TileGroup, RadioTile} from '@carbon/react';
import styles from './game-picker.module.css';

export function GamePicker({game, setWinner}) {
  const {
    team1,
    team2,
    winner,
    index,
  } = game;

  return (
    <div className={`game-${index} ${styles.container}`}>
      <TileGroup
        name="game-tile-group"
        orientation="vertical"
        labelPosition="right"
        onChange={setWinner}
        valueSelected={winner}
        className={styles.gamePicker}
        disabled={!team1 || !team2}
      >
        <RadioTile value={team1} name={team1} key={`game-${index}-${team1}`}>
          {team1}
        </RadioTile>
        <RadioTile value={team2} name={team2} key={`game-${index}-${team2}`}>
          {team2}
        </RadioTile>
      </TileGroup>
    </div>
  );
}