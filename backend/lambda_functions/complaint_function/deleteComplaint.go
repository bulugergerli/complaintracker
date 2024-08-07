package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

type DeleteComplaintRequestBody struct {
	Id int `json:"id"`
}

func DeleteComplaint(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	var body DeleteComplaintRequestBody
	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}

	deleteUserQuery := `
	DELETE FROM public.complaints
	WHERE id=$1`
	_, err := database.Exec(deleteUserQuery, body.Id)
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
			Body:       "Complaint Deleted Successfully",
		}
	}
}
