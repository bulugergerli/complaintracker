package utils

type QueryParams struct {
	Id    string `json:"id"`
	Login string `json:"login"`
}
type HeaderParams struct {
	Authorization string `json:"Authorization"`
}

type LoginRequestBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Remember bool   `json:"remember"`
}
type LoginResponseBody struct {
	Token  string `json:"token"`
	Status bool   `json:"status"`
	Role   string `json:"role"`
}
type GetUserRequestBody struct {
	Id int `json:"id"`
}
type GetUserResponseBody struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	UserName string `json:"user_name"`
	Email    string `json:"email"`
	RoleID   int    `json:"role_id"`
}
type CreateUserRequestBody struct {
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	UserName string `json:"user_name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	RoleID   int    `json:"role_id"`
}
type UpdateUserRequestBody struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	UserName string `json:"user_name"`
	Email    string `json:"email"`
	RoleID   int    `json:"role_id"`
}
type DeleteUserRequestBody struct {
	Id int `json:"id"`
}

var Headers = map[string]string{"Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"}
