import React, {useEffect, useCallback, useReducer, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

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

const httpReducer = (currentHttpReducer, action) => {
    switch (action.type) {
        case 'GET':
        case 'POST':
            return {isLoading:true, error:null};
        case 'RESPONSE':
            return {isLoading: false, error: null};
        case 'ERROR':
            return {isLoading: false, error: action.error};
        default:
            throw new Error("Invalid action type for httpReducer");

    }

};

const Ingredients = () => {
    const [ingredients, dispatch] = useReducer(ingredientReducer,[]);
    const [httpState, httpDispatch] = useReducer(httpReducer,{isLoading:false, error:null});

    // const [ingredients, updateIngredients] = useState([]);
    // const [isLoading, updateIsLoading] = useState(false);
    // const [error, updateErrorMessage] = useState(null);


    useEffect(() => {
        httpDispatch({type:'GET'});
        setTimeout(()=>{
            fetch("https://react-hooks-update-5d22d.firebaseio.com/ingredients.json").then(response => response.json()).then(responseData => {
                httpDispatch({type:'RESPONSE'});
                const ingredientsList = [];
                for(const key in responseData){
                    ingredientsList.push({
                        id: key,
                        title: responseData[key].title,
                        amount: responseData[key].amount
                    })
                }

                dispatch({type:'SET',ingredients:ingredientsList});


            }).catch(error=>{
                httpDispatch({type:'ERROR',error:"An IO Error occurred"});
                // updateErrorMessage("An IO Error occurred");
                // updateIsLoading(false);

            })
        },1000);

    }, []);

    const addIngredientsHandler = useCallback((ingredient) => {
        // updateIsLoading(true);
        console.log('Calling ADD Ingredient Handler');
        httpDispatch({type:'POST'});

        fetch("https://react-hooks-update-5d22d.firebaseio.com/ingredients.json",{
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            // updateIsLoading(false);
            httpDispatch({type:'RESPONSE'})
            return response.json();
        }).then(responseData => {
            dispatch({type:'ADD',ingredient:{id:responseData.name,...ingredient}});
            // (prevIngredients)=>{
            //     const newIngredients = [...prevIngredients, {id:responseData.name,...ingredient}];
            //     return newIngredients;
            // })
        }).catch(error=>{
            // updateErrorMessage();
            // updateIsLoading(false);
            httpDispatch({type:'ERROR',error:error.message});


        });
    },[]);

    const removeIngredientHandler = useCallback((ingredientId) => {
        fetch(`https://react-hooks-update-5d22d.firebaseio.com/ingredients/${ingredientId}.json`,{
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            dispatch({type:'DELETE', id:ingredientId});
            // updateIngredients((currentIngredients) => {
            //     const newIngredients = currentIngredients.filter(item=>{
            //         return item.id !== ingredientId;
            //     });
            //
            //     return newIngredients;
            // })
        });


    },[]);

    const filterIngredientsHandler = useCallback((updatedIngredientList) => {
        dispatch({type:'SET',ingredients:updatedIngredientList});

    },[]);

    const closeErrorModal = useCallback(() => {
        // updateErrorMessage(null);
        httpDispatch({type:'ERROR', error:null});
    },[]);

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
