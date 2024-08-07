package main

import (
	"database/sql"
	"encoding/json"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

type UpdateComplaintRequestBody struct {
	Id             int    `json:"id"`
	LocationId     int    `json:"location_id"`
	UserId         int    `json:"user_id"`
	Complaint      string `json:"complaint"`
	AssignedUserId int    `json:"assigned_user_id"`
	StatusId       int    `json:"status_id"`
}

func UpdateComplaint(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	var body UpdateComplaintRequestBody
	// Unmarshal the JSON request body into the struct
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}

	updateComplaintQuery := `
	UPDATE public.complaints
	SET location_id=$2, user_id=$3, complaint=$4, assigned_user_id=$5, status_id=$6
	WHERE id=$1;`
	id := body.Id
	location_id := body.LocationId
	user_id := body.UserId
	complaint := body.Complaint

	assigned_user_id := body.AssignedUserId
	status_id := body.StatusId
	_, err := database.Exec(updateComplaintQuery, id, location_id, user_id, complaint, assigned_user_id, status_id)
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
			Body:       "Complaint Updated Successfully",
		}
	}
}
