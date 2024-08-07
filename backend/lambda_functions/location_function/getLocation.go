package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

type GetLocationRequestBody struct {
	Id int `json:"id"`
}
type GetLocationResponseBody struct {
	Id       int    `json:"id"`
	Location string `json:"location"`
	QR       string `json:"qr"`
}

func GetAllLocation(database *sql.DB) events.APIGatewayProxyResponse {
	getLocationQuery := `
        SELECT id, location, qr
        FROM public.location ORDER BY id`
	rows, err := database.Query(getLocationQuery)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	defer rows.Close()

	Locations := []GetLocationResponseBody{}
	for rows.Next() {
		var Location GetLocationResponseBody
		if err := rows.Scan(&Location.Id, &Location.Location, &Location.QR); err != nil {
			return events.APIGatewayProxyResponse{
				Headers:    utils.Headers,
				StatusCode: 500,
				Body:       err.Error(),
			}
		}
		Locations = append(Locations, Location)
	}
	if err := rows.Err(); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}

	// Convert Locations slice to JSON string
	LocationsJSON, err := json.Marshal(Locations)
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
		Body:       string(LocationsJSON),
	}
}
