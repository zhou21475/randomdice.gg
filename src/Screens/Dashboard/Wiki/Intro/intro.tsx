import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Dashboard from '../../../../Components/Dashboard/dashboard';
import LoadingScreen from '../../../../Components/Loading/loading';
import PopUp from '../../../../Components/PopUp Overlay/popup';
import {
    OPEN_POPUP,
    CLOSE_POPUP,
} from '../../../../Misc/Redux Storage/PopUp Overlay/types';
import { WikiContent } from '../../../../Misc/Redux Storage/Fetch Firebase/Wiki/types';
import './intro.less';

export default function editIntro(): JSX.Element {
    const dispatch = useDispatch();
    const database = firebase.database();
    const dbRef = database.ref('/wiki/intro');
    const [content, setContent] = useState<WikiContent['intro']>();

    useEffect(() => {
        dbRef.once('value').then(snapshot => setContent(snapshot.val()));
    }, []);

    if (!content) {
        return (
            <Dashboard>
                <LoadingScreen />
            </Dashboard>
        );
    }

    return (
        <Dashboard className='intro'>
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>
                    Are you sure to want to submit all the content for game
                    introduction?
                </p>
                <button
                    type='button'
                    className='confirm'
                    onClick={(): void => {
                        dbRef.set(content);
                        dispatch({ type: CLOSE_POPUP });
                    }}
                >
                    Yes
                </button>
            </PopUp>
            {['PvP', 'PvE', 'Crew'].map(type => (
                <div className='block' key={type}>
                    <h3>{type}</h3>
                    <CKEditor
                        editor={ClassicEditor}
                        data={content[type as 'PvP' | 'PvE' | 'Crew']}
                        config={{
                            removePlugins: ['Heading'],
                            toolbar: [
                                'undo',
                                'redo',
                                '|',
                                'bold',
                                'italic',
                                'numberedList',
                                'bulletedList',
                                '|',
                                'link',
                            ],
                        }}
                        onBlur={(
                            _: unknown,
                            editor: {
                                getData: () => string;
                            }
                        ): void => {
                            content[
                                type as 'PvP' | 'PvE' | 'Crew'
                            ] = editor.getData();
                            setContent({
                                ...content,
                            });
                        }}
                    />
                </div>
            ))}
            <button
                type='button'
                className='submit'
                onClick={(): void => {
                    dispatch({
                        type: OPEN_POPUP,
                        payload: 'confirm-submit',
                    });
                }}
            >
                <FontAwesomeIcon icon={faCheck} />
            </button>
        </Dashboard>
    );
}
