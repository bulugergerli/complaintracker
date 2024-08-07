package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

type DeleteRoleRequestBody struct {
	Id int `json:"id"`
}

func DeleteRole(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	var body DeleteRoleRequestBody
	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}

	deleteRoleQuery := `
	DELETE FROM public.role
	WHERE id=$1`
	_, err := database.Exec(deleteRoleQuery, body.Id)
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
			Body:       "Role Deleted Successfully",
		}
	}
}
