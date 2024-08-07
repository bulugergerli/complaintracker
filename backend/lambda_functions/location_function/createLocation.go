package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"utils"

	"github.com/aws/aws-lambda-go/events"
	"github.com/skip2/go-qrcode"
)

type CreateLocationRequestBody struct {
	Location string `json:"location"`
}

func CreateLocation(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	var body CreateLocationRequestBody
	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	insertLocationQuery := `
    INSERT INTO public.location
    (location)
    VALUES($1)
    RETURNING id
`
	var locationID int
	location := body.Location
	err := database.QueryRow(insertLocationQuery, location).Scan(&locationID)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	content := fmt.Sprintf("https://api.qrserver.com/v1/create-qr-code/?location=%d", locationID)
	png, err := qrcode.Encode(content, qrcode.Medium, 256)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	updateLocationQuery := `
	UPDATE public.location
	SET "qr"=$2
	WHERE id=$1`
	_, err = database.Exec(updateLocationQuery, locationID, base64.StdEncoding.EncodeToString(png))
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
		Body:       "Location Created Successfully",
	}

}
