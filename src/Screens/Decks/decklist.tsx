/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../Components/Redux Storage/store';
import Main from '../../Components/Main/main';
import Error from '../../Components/Error/error';
import LoadingScreen from '../../Components/Loading/loading';
import {
    fetchDecks,
    fetchDices,
    fetchAlts,
    clearError,
} from '../Misc/fetchData';
import Dice from '../../Components/Dice/dice';
import Dicelist from '../../Components/Dice/dicelist';
import './decklist.less';
import { FILTER_ACTION } from '../../Components/Redux Storage/Deck Filter/types';

export default function DeckList({
    deckType,
}: {
    deckType: string;
}): JSX.Element {
    const history = useHistory();
    const dispatch = useDispatch();
    const selection = useSelector((state: RootState) => state);
    const { error } =
        selection.fetchDecksReducer ||
        selection.fetchDicesReducer ||
        selection.fetchAltsReducer;
    const { decks } = selection.fetchDecksReducer;
    const { dices } = selection.fetchDicesReducer;
    const { filter } = selection.filterReducer;
    const { alts } = selection.fetchAltsReducer;
    const dicelist = Dicelist(dices);
    const [findAlt, setFindAlt] = useState({
        list: [] as number[],
        open: false,
    });

    if (dicelist.common.length > 0 && filter.legendary.length === 0) {
        dispatch({
            type: FILTER_ACTION,
            payload: {
                legendary: dicelist.legendary.map(legendary => ({
                    name: legendary,
                    checked: true,
                })),
                customSearch: filter.customSearch,
            },
        });
    }
    const legendaryMissing = filter.legendary
        .filter(legendary => !legendary.checked)
        .map(
            legendary => dices?.find(dice => dice.name === legendary.name)?.id
        );
    const customSearch =
        dices?.find(dice => dice.name === filter.customSearch)?.id || 0;

    let jsx;
    if (
        decks &&
        dicelist.common.length > 0 &&
        decks.length > 0 &&
        filter.legendary.length > 0
    ) {
        const Checkbox = ({
            legendary,
            i,
        }: {
            legendary: string;
            i: number;
        }): JSX.Element => (
            <input
                name={legendary}
                type='checkbox'
                defaultChecked={filter.legendary[i].checked}
                onChange={(evt): void => {
                    filter.legendary[i].checked = evt.target.checked;
                    dispatch({
                        type: FILTER_ACTION,
                        payload: filter,
                    });
                }}
            />
        );

        const options = [
            alts?.find(alt => alt.id === findAlt.list[0]),
            alts?.find(alt => alt.id === findAlt.list[1]),
            alts?.find(alt => alt.id === findAlt.list[2]),
            alts?.find(alt => alt.id === findAlt.list[3]),
            alts?.find(alt => alt.id === findAlt.list[4]),
        ];
        if (findAlt.open) {
            document.body.classList.add('popup-opened');
        } else {
            document.body.classList.remove('popup-opened');
        }

        const deckKeys = [
            'id',
            'type',
            'rating',
            'slot1',
            'slot2',
            'slot3',
            'slot4',
            'slot5',
            'alternatives',
            'added',
            'updated',
        ];

        const filteredDeck = decks
            .filter(deckData => {
                const deck = [
                    deckData.slot1,
                    deckData.slot2,
                    deckData.slot3,
                    deckData.slot4,
                    deckData.slot5,
                ];
                return (
                    deck.every(dice => !legendaryMissing.includes(dice)) &&
                    deckData.type === deckType &&
                    (filter.customSearch === '?'
                        ? true
                        : deck.includes(customSearch))
                );
            })
            .map(deck => {
                return {
                    id: deck.id,
                    type: deck.type,
                    rating: deck.rating,
                    slot1: deck.slot1,
                    slot2: deck.slot2,
                    slot3: deck.slot3,
                    slot4: deck.slot4,
                    slot5: deck.slot5,
                    alternatives: [
                        deck.slot1,
                        deck.slot2,
                        deck.slot3,
                        deck.slot4,
                        deck.slot5,
                    ],
                    added: deck.added,
                    updated: deck.updated ? deck.updated : '-',
                };
            });
        while (filteredDeck.length < 9 && filteredDeck.length !== 0) {
            filteredDeck.push({
                id: filteredDeck.length,
                type: '-',
                rating: 0,
                slot1: 0,
                slot2: 0,
                slot3: 0,
                slot4: 0,
                slot5: 0,
                alternatives: [],
                added: '-',
                updated: '-',
            });
        }
        jsx = (
            <>
                <div
                    className='popup-overlay'
                    role='button'
                    tabIndex={0}
                    onClick={(evt): void => {
                        const target = evt.target as HTMLDivElement;
                        if (target.classList.contains('popup-overlay')) {
                            setFindAlt({
                                list: [] as number[],
                                open: false,
                            });
                        }
                    }}
                    onKeyUp={(evt): void => {
                        if (evt.key === 'Escape') {
                            setFindAlt({
                                list: [] as number[],
                                open: false,
                            });
                        }
                    }}
                >
                    <div className='popup'>
                        <div className='container'>
                            <h3>Alternatives List</h3>
                            <div className='original'>
                                <Dice dice={findAlt.list[0]} />
                                <Dice dice={findAlt.list[1]} />
                                <Dice dice={findAlt.list[2]} />
                                <Dice dice={findAlt.list[3]} />
                                <Dice dice={findAlt.list[4]} />
                            </div>
                            {options?.map((alt, i) => (
                                <div key={Number(new Date()) + Math.random()}>
                                    <Dice dice={findAlt.list[i]} />
                                    <h4>
                                        {alt?.desc
                                            ? alt.desc
                                            : 'You should not need to replace this.'}
                                    </h4>
                                    {alt?.desc ? <h5>Alternatives :</h5> : null}
                                    <div className='replacement'>
                                        {options[
                                            i
                                        ]?.list?.map((altDice: number) =>
                                            altDice ? (
                                                <Dice
                                                    dice={altDice}
                                                    key={altDice}
                                                />
                                            ) : null
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                type='button'
                                className='close'
                                onClick={(): void =>
                                    setFindAlt({
                                        list: [] as number[],
                                        open: false,
                                    })
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
                <form className='filter'>
                    <div className='top-label'>
                        <label htmlFor='pvepvp'>
                            <span>PVE / PVE :</span>
                            <button
                                type='button'
                                name='pvepvp'
                                onClick={(): void =>
                                    history.replace(
                                        deckType === 'PvP' ? 'pve' : 'pvp'
                                    )
                                }
                            >
                                Switch to {deckType === 'PvP' ? 'PvE ' : 'PvP '}
                                view
                            </button>
                        </label>
                        <label htmlFor='Custom Search'>
                            <span>Custom Search :</span>
                            <select
                                name='Custom Search'
                                onChange={(evt): void => {
                                    filter.customSearch = evt.target.value;
                                    dispatch({
                                        type: FILTER_ACTION,
                                        payload: filter,
                                    });
                                }}
                                data-value={filter.customSearch}
                            >
                                <option value='?'>?</option>
                                {Object.values(dicelist)
                                    .flat()
                                    .map(dice => (
                                        <option value={dice} key={dice}>
                                            {dice}
                                        </option>
                                    ))}
                            </select>
                            <Dice dice={filter.customSearch} />
                        </label>
                    </div>
                    <div className='lower-label'>
                        <label htmlFor='legendariesOwned'>
                            <div className='label'>
                                <span>Legendaries Owned :</span>
                                <button
                                    type='button'
                                    data-select-all={filter.legendary.every(
                                        legendary => legendary.checked
                                    )}
                                    onClick={(): void => {
                                        filter.legendary = filter.legendary.map(
                                            legendary => ({
                                                name: legendary.name,
                                                checked: !filter.legendary.every(
                                                    f => f.checked
                                                ),
                                            })
                                        );
                                        dispatch({
                                            type: FILTER_ACTION,
                                            payload: filter,
                                        });
                                    }}
                                >
                                    {filter.legendary.every(f => f.checked)
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </button>
                            </div>
                            {dicelist.legendary.map((legendary: string, i) => (
                                <div
                                    className='legendary-filter'
                                    key={legendary}
                                >
                                    <Dice dice={legendary} />
                                    <Checkbox legendary={legendary} i={i} />
                                    <span className='checkbox-styler'>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                </div>
                            ))}
                        </label>
                    </div>
                </form>
                <div className='divisor' />
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                {deckKeys.map(key => {
                                    return <th key={key}>{key}</th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeck.length > 0 ? (
                                filteredDeck.map(deck => (
                                    <tr key={`deck-${deck.id}`}>
                                        {Object.values(deck).map((data, i) => (
                                            <td
                                                key={`deck-${deck.id}-datapoint-${deckKeys[i]}`}
                                            >
                                                {deckKeys[i].match(
                                                    /^slot[1-5]$/
                                                ) ? (
                                                    <Dice dice={Number(data)} />
                                                ) : deck.type === '-' ? (
                                                    '-'
                                                ) : deckKeys[i] ===
                                                  'alternatives' ? (
                                                    <button
                                                        type='button'
                                                        onClick={(): void => {
                                                            setFindAlt({
                                                                list: data as number[],
                                                                open: true,
                                                            });
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faExchangeAlt}
                                                        />
                                                    </button>
                                                ) : (
                                                    data
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr className='nomatch'>
                                    <td>Your Search returned no result!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    clearError(dispatch);
                    fetchDecks(dispatch);
                    fetchDices(dispatch);
                    fetchAlts(dispatch);
                }}
            />
        );
    } else {
        jsx = (
            <LoadingScreen
                fnDispatch={(): void => {
                    fetchDecks(dispatch);
                    fetchDices(dispatch);
                    fetchAlts(dispatch);
                }}
            />
        );
    }
    return (
        <Main
            title={`Deck List (${deckType})`}
            className='deck-list'
            content={jsx}
        />
    );
}
