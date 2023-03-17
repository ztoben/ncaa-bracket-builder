'use client'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Theme, Header, HeaderName } from '@carbon/react';
import { GamePicker } from '@/components/game-picker';
import { bracket } from '@/bracket';
import styles from './page.module.css'

const ReactSteppedLineToWithNoSSR = dynamic(
  () => import('@/components/react-stepped-line-to'),
  { ssr: false }
)

function buildSchedule(schedule) {
  const newSchedule = {};
  const numberOfGames = Object.keys(schedule).length * 2 - 1;

  for (let i = 1; i <= numberOfGames; i++) {
    const game = schedule[i];

    if (game) {
      newSchedule[i] = {
        ...game,
        index: i,
      };
    } else {
      newSchedule[i] = {
        team1: '',
        team2: '',
        winner: null,
        index: i,
      };
    }
  }

  return newSchedule;
}

function getScheduleRows(schedule) {
  const scheduleRows = [];

  if(Object.keys(schedule).length === 1) {
    scheduleRows.push(Object.values(schedule).slice(0, 1));

    return scheduleRows;
  }

  const halfOfGamesValues = Object.values(schedule).slice(0, Object.keys(schedule).length / 2 + 1);
  const secondHalfOfGamesValues = Object.values(schedule).slice(Object.keys(schedule).length / 2 + 1);

  scheduleRows.push(halfOfGamesValues);
  
  return scheduleRows.concat(getScheduleRows(secondHalfOfGamesValues));
}

export default function Home() {
  const [schedule, setSchedule] = useState(buildSchedule(bracket));
  const [scheduleRows, setScheduleRows] = useState(getScheduleRows(schedule));

  useEffect(() => {
    setScheduleRows(getScheduleRows(schedule));
  }, [schedule]);

  const updateSchedule = (newWinner, gameIndex, rowIndex, rowGameIndex) => {
    const newSchedule = JSON.parse(JSON.stringify(schedule));

    // set new winner
    newSchedule[gameIndex].winner = newWinner;

    // update next row
    const nextRow = scheduleRows[rowIndex + 1];
    if (nextRow) {
      const equivalentPositionInNextRow = Math.floor(rowGameIndex / 2);
      const nextGameIndex = nextRow[equivalentPositionInNextRow].index;

      if (gameIndex % 2 === 0) {
        newSchedule[nextGameIndex].team2 = newWinner;
      } else {
        newSchedule[nextGameIndex].team1 = newWinner;
      }

      newSchedule[nextGameIndex].winner = null;
    }

    // search through the new schedule rows to be sure that the next row contains one of the winning teams in the current row
    const newScheduleRows = getScheduleRows(newSchedule);
    let currentSearchIndex = 0;

    while (currentSearchIndex < newScheduleRows.length - 1) {
      const currentRow = newScheduleRows[currentSearchIndex];
      const nextRow = newScheduleRows[currentSearchIndex + 1];
      const currentRowWinningTeams = currentRow.map(game => game.winner).concat(currentRow.map(game => game.winner)).filter(team => team);

      nextRow.forEach(game => {
        if (game.team1 && !currentRowWinningTeams.includes(game.team1)) {
          newSchedule[game.index].team1 = '';
          newSchedule[game.index].winner = null;
        }

        if (game.team2 && !currentRowWinningTeams.includes(game.team2)) {
          newSchedule[game.index].team2 = '';
          newSchedule[game.index].winner = null;
        }
      });

      currentSearchIndex += 1;
    }

    setSchedule(newSchedule);
  };

  return (
    <Theme theme="g100">
      <Header aria-label="NCAA Bracket Builder">
        <HeaderName href="#" prefix="">
          NCAA Bracket Builder
        </HeaderName>
      </Header>
      <main className={styles.main}>
        <div className={styles.row}>
          {scheduleRows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className={styles.column}>
              {row.map((game, rowGameIndex) => (
                <div key={`${rowIndex}-${game.index}-${game.team1}-${game.team2}-game-picker-container`} className="game-container" style={{zIndex: 10}}>
                  <GamePicker
                    game={game}
                    setWinner={winner => updateSchedule(winner, game.index, rowIndex, rowGameIndex)}
                  />
                  {scheduleRows[rowIndex + 1] && (
                    <ReactSteppedLineToWithNoSSR
                      from={`game-${game.index}`}
                      to={`game-${scheduleRows[rowIndex + 1][Math.floor(rowGameIndex / 2)].index}`}
                      orientation="h"
                      borderColor="white"
                      fromAnchor="right"
                      toAnchor="left"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </Theme>
  )
}
