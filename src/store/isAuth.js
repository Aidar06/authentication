import { createSlice } from '@reduxjs/toolkit'


const userIsAuth = {
    isRegister: false,
    email: '',
    password: ''
}

const user = JSON.parse(localStorage.getItem('isAuth123')) || userIsAuth

const isAuth = createSlice({
    name: 'isAuth123',
    initialState: {
        item: user,
    },
    reducers: {
        GetRegister: (state, action) => {
            state.item = JSON.parse(localStorage.getItem('isAuth123'))
        },
        Register: (state, action) => {
            localStorage.setItem('isAuth123', JSON.stringify(action.payload))
        },
        RemoveRegister: () => {
            localStorage.setItem('isAuth123', JSON.stringify(userIsAuth))
        }
    },
})

export const { Register, RemoveRegister, GetRegister} = isAuth.actions
export default isAuth.reducer