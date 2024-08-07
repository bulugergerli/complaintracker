package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

type UpdateRoleRequestBody struct {
	Id       int    `json:"id"`
	RoleName string `json:"role_name"`
}

func UpdateRole(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	var body UpdateRoleRequestBody
	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}

	updateRoleQuery := `
	UPDATE public.role
	SET "role_name"=$2
	WHERE id=$1`
	id := body.Id
	role_name := body.RoleName

	_, err := database.Exec(updateRoleQuery, id, role_name)
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
			Body:       "Role Updated Successfully",
		}
	}
}
