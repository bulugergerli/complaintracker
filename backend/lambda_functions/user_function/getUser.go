package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

func GetUser(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	list := []utils.GetUserResponseBody{}
	getUserQuery := `
		SELECT id, "name", surname, user_name, email, role_id
		FROM public.users ORDER BY id;`
	rows, err := database.Query(getUserQuery)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	for rows.Next() {
		var responseBody utils.GetUserResponseBody
		rows.Scan(&responseBody.Id, &responseBody.Name, &responseBody.Surname, &responseBody.UserName, &responseBody.Email, &responseBody.RoleID)
		list = append(list, responseBody)
	}
	// Convert responseBody struct to JSON string
	responseBodyJSON, err := json.Marshal(list)
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
