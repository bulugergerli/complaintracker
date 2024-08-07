package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

type GetRoleRequestBody struct {
	Id int `json:"id"`
}
type GetRoleResponseBody struct {
	Id       int    `json:"id"`
	RoleName string `json:"role_name"`
}

func GetAllRoles(database *sql.DB) events.APIGatewayProxyResponse {
	getRolesQuery := `
        SELECT id, role_name
        FROM public.role`
	rows, err := database.Query(getRolesQuery)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	defer rows.Close()

	var roles []GetRoleResponseBody
	for rows.Next() {
		var role GetRoleResponseBody
		if err := rows.Scan(&role.Id, &role.RoleName); err != nil {
			return events.APIGatewayProxyResponse{
				Headers:    utils.Headers,
				StatusCode: 500,
				Body:       err.Error(),
			}
		}
		roles = append(roles, role)
	}
	if err := rows.Err(); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}

	// Convert roles slice to JSON string
	rolesJSON, err := json.Marshal(roles)
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
		Body:       string(rolesJSON),
	}
}
