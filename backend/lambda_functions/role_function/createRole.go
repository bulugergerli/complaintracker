package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

type CreateRoleRequestBody struct {
	RoleName string `json:"role_name"`
}

func CreateRole(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	var body CreateRoleRequestBody
	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}

	insertRoleQuery := `
	INSERT INTO public.role
	(role_name)
	VALUES($1)`
	role_name := body.RoleName

	_, err := database.Exec(insertRoleQuery, role_name)
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
			Body:       "Role Created Successfully",
		}
	}
}
