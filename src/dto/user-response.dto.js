/* "payload": {
    "_id": "66742a86f9f4f2dac9d6861a",
    "first_name": "Arya",
    "last_name": "Grondona",
    "email": "ag@gmail.com",
    "password": "$2b$10$4GQvY0vl.d.0cwQwVxuZmeqNORbew1eMtw8rjUoFAB/GMMWNz5NoO",
    "age": 4,
    "role": "user",
    "__v": 0
},
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Njc0MmE4NmY5ZjRmMmRhYzlkNjg2MWEiLCJlbWFpbCI6ImFnQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIxMzk3NDY5LCJleHAiOjE3MjEzOTc1Mjl9.hd8NMXev39ZuNCUgt8_FgQqi1CSuRn7v0BzjHDl8_b0" */


// Formatea la data que queremos retornar: 

export const userResponseDto = (user) => {
    return {
        first_name: user.first_name,
        email: user.email,
        role: user.role
    }
}