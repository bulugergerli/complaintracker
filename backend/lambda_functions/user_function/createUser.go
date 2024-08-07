package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

func CreateUser(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {

	var body utils.CreateUserRequestBody
	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {

		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	//TODO: Check email is exist
	checkUserQuery := `SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM public.users 
            WHERE email = $1
        ) THEN true
        ELSE false
    END AS email_exists;`
	email := body.Email
	var userExist bool
	row := database.QueryRow(checkUserQuery, email)
	err := row.Scan(&userExist)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	if userExist {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       "email already exist",
		}
	}

	insertUserQuery := `
	INSERT INTO public.users
	("name", surname, user_name, email, "password", role_id)
	VALUES($1, $2, $3, $4, crypt($5, gen_salt('xdes')), $6)`
	name := body.Name
	surname := body.Surname
	userName := body.UserName
	password := body.Password
	roleId := body.RoleID

	_, err = database.Exec(insertUserQuery, name, surname, userName, email, password, roleId)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	} else {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 200,
			Body:       "User Created Successfully",
		}
	}
}
