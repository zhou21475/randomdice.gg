import React, { useState, useEffect, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';
import './header-footer.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faTimes,
    faUserCircle,
    faSignOutAlt,
    faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faPatreon } from '@fortawesome/free-brands-svg-icons';
import Menu from '../../Components/Menu/menu';
import LoadingGif from '../../Components/Loading/loading.gif';
import * as auth from '../../Misc/Firebase/auth';
import { menu } from '../../Misc/menuConfig';
import { RootState } from '../../Misc/Redux Storage/store';

export default function Header(): JSX.Element {
    const dispatch = useDispatch();
    const history = useHistory();
    const { user, error } = useSelector(
        (state: RootState) => state.authReducer
    );
    const [scrolled, setScrolled] = useState(true);
    const [menuToggle, setMenuToggle] = useState(false);
    const [overlayOpen, setOverlayOpen] = useState<string | false>(false);
    const [accountLinked, setAccountLinked] = useState(['']);
    const overlayRef = useRef(null as HTMLDivElement | null);
    history.listen(() => setMenuToggle(false));
    useEffect(() => {
        function handler(): void {
            if (
                document.body.clientHeight -
                    window.innerHeight -
                    window.scrollY >
                    120 &&
                window.scrollY > 0
            ) {
                setScrolled(true);
            } else if (window.scrollY === 0) setScrolled(false);
        }
        handler();
        window.addEventListener('scroll', handler);
        return (): void => window.removeEventListener('scroll', handler);
    }, []);

    useEffect(() => {
        if (overlayOpen) {
            document.body.classList.add('popup-opened');
            // eslint-disable-next-line no-unused-expressions
            overlayRef.current?.focus();
        } else {
            document.body.classList.remove('popup-opened');
        }
    }, [overlayOpen]);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (user) {
            setOverlayOpen(false);
            const userData = firebase.database().ref(`users/${user.uid}`);
            const listener = userData.on('value', snapshot => {
                const data = snapshot.val();
                if (data) {
                    setAccountLinked(Object.keys(data['linked-account']));
                }
            });
            return (): void => userData.off('value', listener);
        }
    }, [user]);

    return (
        <header className={scrolled ? 'scroll' : ''}>
            <div
                className={`popup-overlay ${
                    overlayOpen === 'login' ? 'active' : ''
                }`}
                role='button'
                tabIndex={0}
                onClick={(evt): void => {
                    const target = evt.target as HTMLDivElement;
                    if (target.classList.contains('popup-overlay')) {
                        setOverlayOpen(false);
                    }
                }}
                onKeyUp={(evt): void => {
                    if (evt.key === 'Escape') {
                        setOverlayOpen(false);
                    }
                }}
            >
                <div className='popup'>
                    <div
                        className='container'
                        ref={overlayRef}
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                        tabIndex={0}
                    >
                        <h3>Login</h3>
                        <span>
                            Only Discord Login and Patreon Login are supported
                            at the current moment. You may not need to login to
                            use this website. Logging in is only for content
                            managers to manage content or patreon supporters to
                            enjoy ad free browsing.
                        </span>
                        <span>
                            By sining up, you agree to our{' '}
                            <Link to='/about/terms' target='_blank'>
                                Terms and Condition
                            </Link>{' '}
                            and{' '}
                            <Link to='/about/privacy' target='_blank'>
                                Privacy Policy
                            </Link>
                            .
                        </span>
                        <div className='oauth'>
                            <button
                                className='discord'
                                type='button'
                                onClick={(): void => auth.discord(dispatch)}
                            >
                                <FontAwesomeIcon icon={faDiscord} />
                            </button>
                            <button
                                className='patreon'
                                type='button'
                                onClick={(): Promise<void> =>
                                    auth.patreon(dispatch)
                                }
                            >
                                <FontAwesomeIcon icon={faPatreon} />
                            </button>
                        </div>
                        {error === 'Loading' ? (
                            <img
                                src={LoadingGif}
                                alt='loading'
                                className='loading'
                            />
                        ) : (
                            <span className='error'>{error}</span>
                        )}
                        <button
                            type='button'
                            className='close'
                            onClick={(): void => setOverlayOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={`popup-overlay ${
                    overlayOpen === 'profile' ? 'active' : ''
                }`}
                role='button'
                tabIndex={0}
                onClick={(evt): void => {
                    const target = evt.target as HTMLDivElement;
                    if (target.classList.contains('popup-overlay')) {
                        setOverlayOpen(false);
                    }
                }}
                onKeyUp={(evt): void => {
                    if (evt.key === 'Escape') {
                        setOverlayOpen(false);
                    }
                }}
            >
                <div className='popup'>
                    <div
                        className='container'
                        ref={overlayRef}
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                        tabIndex={0}
                    >
                        <h3>Profile</h3>
                        <span>
                            You can update your Displayed Name and link other
                            account to your profile here. Keep in mind that the
                            accounts should be associated with the same email
                            address in this account.
                        </span>
                        <div className='profile-and-name'>
                            <div className='img-container'>
                                <img
                                    src={user?.photoURL || ''}
                                    alt='Profile pic'
                                />
                            </div>
                            <label htmlFor='display-name'>
                                <span>Update your display name:</span>
                                <input
                                    defaultValue={user?.displayName || ''}
                                    onBlur={(evt): Promise<void> | undefined =>
                                        user?.updateProfile({
                                            displayName: evt.target.value,
                                        })
                                    }
                                />
                            </label>
                        </div>
                        <div className='divisor' />
                        {accountLinked.length ? (
                            <>
                                <h3>Account Linked</h3>
                                <div className='oauth'>
                                    {accountLinked.includes('discord') ? (
                                        <span className='discord'>
                                            <FontAwesomeIcon icon={faDiscord} />
                                        </span>
                                    ) : null}
                                    {accountLinked.includes('patreon') ? (
                                        <span className='patreon'>
                                            <FontAwesomeIcon icon={faPatreon} />
                                        </span>
                                    ) : null}
                                </div>
                            </>
                        ) : null}
                        <div className='divisor' />
                        <h3>Linkable Accounts</h3>
                        <div className='oauth'>
                            {!accountLinked.includes('discord') ? (
                                <button
                                    className='discord'
                                    type='button'
                                    onClick={(): void =>
                                        auth.discord(dispatch, true)
                                    }
                                >
                                    <FontAwesomeIcon icon={faDiscord} />
                                </button>
                            ) : null}
                            {!accountLinked.includes('patreon') ? (
                                <button
                                    className='patreon'
                                    type='button'
                                    onClick={(): Promise<void> =>
                                        auth.patreon(dispatch, true)
                                    }
                                >
                                    <FontAwesomeIcon icon={faPatreon} />
                                </button>
                            ) : null}
                        </div>
                        {error === 'Loading' ? (
                            <img
                                src={LoadingGif}
                                alt='loading'
                                className='loading'
                            />
                        ) : (
                            <span className='error'>{error}</span>
                        )}
                        <button
                            type='button'
                            className='close'
                            onClick={(): void => setOverlayOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='topHeaderBar headerBar'>
                    <div className='container'>
                        {user ? (
                            <>
                                {user.photoURL ? (
                                    <div className='img-container'>
                                        <img
                                            src={user.photoURL}
                                            alt='profile pic'
                                        />
                                    </div>
                                ) : null}
                                <span className='user'>
                                    Welcome, {user.displayName}!
                                </span>
                                <button
                                    type='button'
                                    className='update'
                                    onClick={(): void =>
                                        setOverlayOpen('profile')
                                    }
                                >
                                    <FontAwesomeIcon icon={faUserEdit} />
                                    <span>Edit Profile</span>
                                </button>
                                <button
                                    type='button'
                                    className='logout'
                                    onClick={auth.logout}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} />{' '}
                                    <span>LOGOUT</span>
                                </button>
                            </>
                        ) : (
                            <button
                                type='button'
                                className='login'
                                onClick={(): void => setOverlayOpen('login')}
                            >
                                <FontAwesomeIcon icon={faUserCircle} /> LOGIN
                            </button>
                        )}
                    </div>
                </div>
                <div className='lowHeaderBar headerBar'>
                    <div className='container'>
                        <Menu
                            menuList={menu}
                            className={menuToggle ? 'open' : ''}
                        />
                        <button
                            type='button'
                            className='toggleMenu'
                            onClick={(): void => setMenuToggle(!menuToggle)}
                        >
                            <FontAwesomeIcon
                                icon={menuToggle ? faTimes : faBars}
                            />
                        </button>
                    </div>
                </div>
            </div>
            <div className='header-placeholder' />
        </header>
    );
}
