package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

type UpdateLocationRequestBody struct {
	Id       int    `json:"id"`
	Location string `json:"location"`
}

func UpdateLocation(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	var body UpdateLocationRequestBody
	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}

	updateLocationQuery := `
	UPDATE public.location
	SET "location"=$2
	WHERE id=$1`
	id := body.Id
	location := body.Location

	_, err := database.Exec(updateLocationQuery, id, location)
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
			Body:       "Location Updated Successfully",
		}
	}
}
