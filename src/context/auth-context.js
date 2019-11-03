import React, {useState} from 'react'


export const AuthContext = React.createContext({
   isAuthenticated:false,
   login: ()=>{}
});



export const AuthContextProvider = (props) => {
    const [isAuthenticated,setAuthenticated] = useState(false);
    const loginFn = ()=>{
        setAuthenticated(true);
    };
    return <AuthContext.Provider value={{login:loginFn, isAuthenticated: isAuthenticated }}>
        {props.children}
    </AuthContext.Provider>
};
