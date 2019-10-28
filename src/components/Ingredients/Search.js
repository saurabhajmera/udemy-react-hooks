import React, {useEffect, useRef, useState} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
    const {filterIngredientsHandler} = props;
    const [filterValue, updateFilter] = useState('');
    const inputRef = useRef('');

    useEffect(() => {
        const timeoutRef = setTimeout(() => {
            if (filterValue === inputRef.current.value) {
                const query = (filterValue.length > 0) ? `?orderBy="title"&equalTo="${filterValue}"` : '';
                fetch(`https://react-hooks-update-5d22d.firebaseio.com/ingredients.json${query}`).then(response => response.json()).then(responseData => {
                    const ingredientsList = [];
                    for (const key in responseData) {
                        ingredientsList.push({
                            id: key,
                            title: responseData[key].title,
                            amount: responseData[key].amount
                        })
                    }

                    if (ingredientsList.length > 0) {
                        filterIngredientsHandler(ingredientsList);

                    }


                });
            }
        }, 500);
        return () => {
            clearTimeout(timeoutRef);
        };

    }, [filterValue, filterIngredientsHandler, inputRef]);


    const filterIngredients = (event) => {
        const newFilterValue = event.target.value;
        updateFilter(newFilterValue);
    };


    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input ref={inputRef} type="text" value={filterValue} onChange={event => filterIngredients(event)}/>
                </div>
            </Card>
        </section>
    );
});

export default Search;
