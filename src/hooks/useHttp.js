import {useReducer, useCallback} from "react";

const httpReducer = (currentHttpReducer, action) => {
    switch (action.type) {
        case 'GET':
        case 'POST':
        case 'DELETE':
            return {isLoading:true, error:null,data:null};
        case 'RESPONSE':
            return {isLoading: false, error: null, data:action.responseData};
        case 'ERROR':
            return {isLoading: false, error: action.error, data:null};
        default:
            throw new Error(`Invalid action type ${action.type} for httpReducer`);

    }

};

export const useHttp = () => {

    const [httpState, httpDispatch] = useReducer(httpReducer,{isLoading:false, error:null, data:null});


    const sendRequest = useCallback((url, method, body, responseHandler) => {
        httpDispatch({type:method});

        fetch(url,{
            method: method,
            body: body && JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            // updateIsLoading(false);
            return response.json();
        }).then(responseData => {
            console.log("Data Received");
            httpDispatch({type:'RESPONSE', data:responseData});
            responseHandler(responseData);
        }).catch(error=>{
            httpDispatch({type:'ERROR',error:error.message});
        });

    },[]);

    return {
        httpState:httpState,
        sendRequest:sendRequest,
        httpDispatch: httpDispatch
    };

};
