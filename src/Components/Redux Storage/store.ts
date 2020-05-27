import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import fetchDecksReducer from './Fetch Decks/reducer';
import fetchDicesReducer from './Fetch Dices/reducer';
import filterReducer from './Deck Filter/reducer';

const rootReducer = combineReducers({
    fetchDecksReducer,
    fetchDicesReducer,
    filterReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export const store = createStore(
    rootReducer,
    process.env.NODE_ENV === 'development'
        ? composeWithDevTools(applyMiddleware())
        : undefined
);
