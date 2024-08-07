package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

func UpdateUser(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	var body utils.UpdateUserRequestBody
	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}

	updateUserQuery := `
	UPDATE public.users
	SET "name"=$2, surname=$3, user_name=$4, email=$5, role_id=$6
	WHERE id=$1`
	id := body.Id
	name := body.Name
	surname := body.Surname
	userName := body.UserName
	email := body.Email
	roleId := body.RoleID

	_, err := database.Exec(updateUserQuery, id, name, surname, userName, email, roleId)
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
			Body:       "User Updated Successfully",
		}
	}
}
