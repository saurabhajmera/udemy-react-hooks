import React, {useCallback, useEffect, useMemo, useReducer} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import {useHttp} from "../../hooks/useHttp"

const ingredientReducer = (currentIngredients, action) => {

    switch (action.type) {
        case 'SET':
            return [...action.ingredients];
        case 'ADD':
            return [...currentIngredients,action.ingredient];
        case 'DELETE':
            return currentIngredients.filter(item=>(item.id !== action.id));
        default:
            throw new Error('Invalid action type');

    }

};

const Ingredients = () => {
    const [ingredients, dispatchIngredientActions] = useReducer(ingredientReducer,[]);
    const {httpState, sendRequest, httpDispatch} = useHttp();


    useEffect(() => {
        const getUrl = "https://react-hooks-update-5d22d.firebaseio.com/ingredients.json";
        const getMethod = 'GET';
        const body = null;
        const getResponseHandler = (responseData) => {
            const ingredientsList = [];
            for (const key in responseData) {
                ingredientsList.push({
                    id: key,
                    title: responseData[key].title,
                    amount: responseData[key].amount
                })
            }

            dispatchIngredientActions({type: 'SET', ingredients: ingredientsList});

        };
        sendRequest(getUrl,getMethod,body,getResponseHandler);
    }, [sendRequest]);

    const addIngredientsHandler = useCallback((ingredient) => {
        console.log('Calling ADD Ingredient Handler');
        // httpDispatch({type:'POST'});
        const url = "https://react-hooks-update-5d22d.firebaseio.com/ingredients.json";
        const method = "POST";
        const body = JSON.stringify(ingredient);
        const addResponseHandler = (responseData) => {
                dispatchIngredientActions({type:'ADD',ingredient:{id:responseData.name,...ingredient}});
        };
        sendRequest(url, method, body, addResponseHandler);

    },[sendRequest]);

    const removeIngredientHandler = useCallback((ingredientId) => {
        const deleteUrl = `https://react-hooks-update-5d22d.firebaseio.com/ingredients/${ingredientId}.json`;
        const deleteMethod = 'DELETE';
        const deleteBody = null;
        const deleteResponseHandler = () => {
            dispatchIngredientActions({type:'DELETE', id:ingredientId});

        };
        sendRequest(deleteUrl, deleteMethod, deleteBody, deleteResponseHandler);


    },[sendRequest]);

    const filterIngredientsHandler = useCallback((updatedIngredientList) => {
        dispatchIngredientActions({type:'SET',ingredients:updatedIngredientList});

    },[]);

    const closeErrorModal = useCallback(() => {
        // updateErrorMessage(null);
        httpDispatch({type:'ERROR', error:null});
    },[httpDispatch]);

    const ingredientList = useMemo(() => (
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
    ),[ingredients, removeIngredientHandler]);

  return (
    <div className="App">
        {httpState.error && <ErrorModal onClose={closeErrorModal}>{httpState.error}</ErrorModal>}
      <IngredientForm addIngredientsEventHandler={addIngredientsHandler} isLoading={httpState.isLoading}/>

      <section>
        <Search filterIngredientsHandler={filterIngredientsHandler}/>
          {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
