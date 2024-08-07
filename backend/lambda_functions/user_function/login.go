package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

func Login(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	var body utils.LoginRequestBody
	var responseBody utils.LoginResponseBody

	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	var checkPassword bool
	var userRoleId int
	var userRoleName string
	checkLoginQuery := `SELECT ("password" = crypt($2, "password")) 
						AS password_match, u.role_id ,r.role_name
						FROM users u
						join role r on u.role_id = r.id
						WHERE u.email = $1 ;`
	email := body.Email
	password := body.Password
	row := database.QueryRow(checkLoginQuery, email, password)
	err := row.Scan(&checkPassword, &userRoleId, &userRoleName)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	if checkPassword {
		// Create token
		jwtToken, err := utils.GenerateJWT(email, userRoleId, body.Remember, database)
		if err != nil {
			return events.APIGatewayProxyResponse{
				Headers:    utils.Headers,
				StatusCode: 500,
				Body:       err.Error(),
			}
		}
		responseBody.Token = jwtToken
		responseBody.Status = true
		responseBody.Role = userRoleName
	} else {
		responseBody.Token = ""
		responseBody.Status = false
		responseBody.Role = ""
	}
	// Convert responseBody struct to JSON string
	responseBodyJSON, err := json.Marshal(responseBody)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	return events.APIGatewayProxyResponse{
		Headers:    utils.Headers,
		StatusCode: 200,
		Body:       string(responseBodyJSON),
	}
}
