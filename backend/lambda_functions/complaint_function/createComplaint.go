package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

type CreateComplaintRequestBody struct {
	LocationId int      `json:"location_id"`
	UserId     int      `json:"user_id"`
	Complaint  string   `json:"complaint"`
	PhotoUrl   []string `json:"photo_url"`
	StatusId   int      `json:"status_id"`
}

func CreateComplaint(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	var body CreateComplaintRequestBody
	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}

	insertComplaintQuery := `
	INSERT INTO public.complaints
	(location_id, user_id, complaint, photo_url, assigned_user_id, status_id)
	VALUES($1, $2, $3, $4, $5, $6);`
	location_id := body.LocationId
	user_id := body.UserId
	complaint := body.Complaint

	photos := fmt.Sprintf("%v", body.PhotoUrl)
	photos = strings.ReplaceAll(photos, "[", "{'")
	photos = strings.ReplaceAll(photos, "]", "'}")
	photos = strings.ReplaceAll(photos, " ", "', '")
	photo_url := photos

	status_id := body.StatusId

	_, err := database.Exec(insertComplaintQuery, location_id, user_id, complaint, photo_url, nil, status_id)
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
			Body:       "Complaint Created Successfully",
		}
	}
}
