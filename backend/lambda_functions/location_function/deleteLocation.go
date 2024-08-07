package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

type DeleteLocationRequestBody struct {
	Id int `json:"id"`
}

func DeleteLocation(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	var body DeleteLocationRequestBody
	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}

	deleteLocationQuery := `
	DELETE FROM public.location
	WHERE id=$1`
	_, err := database.Exec(deleteLocationQuery, body.Id)
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
			Body:       "Location Deleted Successfully",
		}
	}
}
