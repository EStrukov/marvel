import './comicsList.scss';
import {useEffect, useState} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


import useMarvelService from '../../services/MarvelService';
import { Link } from 'react-router-dom';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(8);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false)

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);

        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(() => [...comicsList, ...newComicsList]);
        setNewItemLoading(() => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            return (
                <li
                    className="comics__item"
                    tabIndex={0}
                    key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price > 0 ? `${item.price}$` : 'NOT AVAILABLE'}</div>
                    </Link>
                </li>
                // <li 
                //     className="char__item"
                //     tabIndex={0}
                //     // ref={el => itemRefs.current[i] = el}
                //     key={item.id}
                //     // onClick={() => {
                //     //     props.onCharSelected(item.id);
                //     //     focusOnItem(i);
                //     // }}
                //     // onKeyDown={(e) => {
                //     //     if (e.key === ' ' || e.key === "Enter") {
                //     //         props.onCharSelected(item.id);
                //     //         focusOnItem(i);
                //     //     }
                //     // }}
                //     >
                //         <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                //         <div className="char__name">{item.name}</div>
                // </li>
            )
        });
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    };

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;