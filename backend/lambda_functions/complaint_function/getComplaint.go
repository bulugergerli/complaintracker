package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"utils"

	"github.com/aws/aws-lambda-go/events"
)

// Location type
type Location struct {
	ID       int    `json:"id"`
	Location string `json:"location"`
	QR       string `json:"qr"`
}

// User type
type User struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
}

// Status type
type Status struct {
	ID         int    `json:"id"`
	StatusName string `json:"status_name"`
}

// Complaint type
type GetComplaintResponseBody struct {
	ID           int      `json:"id"`
	Location     Location `json:"location"`
	User         User     `json:"user"`
	Complaint    string   `json:"complaint"`
	PhotoURL     string   `json:"photo_url"`
	AssignedUser User     `json:"assigned_user"`
	Status       Status   `json:"status"`
	CreatedAt    string   `json:"created_at"`
	FinishedAt   *string  `json:"finished_at"`
}

func GetComplaint(request events.APIGatewayProxyRequest, database *sql.DB) events.APIGatewayProxyResponse {
	query, response, err := utils.ConvertQuery(request)
	if err != nil {
		return response
	}
	// check user role
	claim, response, err := utils.CheckToken(request)
	if err != nil {
		return response
	}
	fmt.Println(claim)
	// Extract role_id from the claims
	role_id_interface, ok := claim["role_id"]
	if !ok {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 400,
			Body:       "role_id not found in token claims",
		}
	}
	role_id_float64, ok := role_id_interface.(float64) // JWT claims typically encode numbers as float64
	if !ok {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 400,
			Body:       "Invalid role_id type",
		}
	}
	role_id := int(role_id_float64)

	println("Role id is this: ", role_id)
	output := []GetComplaintResponseBody{}
	var getUserQuery string
	if role_id == 3 { // staff
		getUserQuery = `
		SELECT c.id , location_id, l."location", l.qr, user_id, u.email, c.complaint, c.photo_url, c.assigned_user_id, u2.email, c.status_id, cs.status_name, c.created_at, c.finished_at
		FROM public.complaints c
		join "location" l on l.id = c.location_id 
		join users u on u.id = c.user_id 
		left join users u2 on u2.id = c.assigned_user_id 
		join complaint_status cs on cs.id = c.status_id 
		WHERE assigned_user_id = $1 ORDER BY c.id;`
	} else if role_id == 2 { // user
		getUserQuery = `
		SELECT c.id , location_id, l."location", l.qr, user_id, u.email, c.complaint, c.photo_url, c.assigned_user_id, u2.email, c.status_id, cs.status_name, c.created_at, c.finished_at
		FROM public.complaints c
		join "location" l on l.id = c.location_id 
		join users u on u.id = c.user_id 
		left join users u2 on u2.id = c.assigned_user_id 
		join complaint_status cs on cs.id = c.status_id 
		 WHERE user_id = $1 ORDER BY c.id;`
	} else if role_id == 1 { // admin
		getUserQuery = `
		SELECT c.id , location_id, l."location", l.qr, user_id, u.email, c.complaint, c.photo_url, c.assigned_user_id, u2.email, c.status_id, cs.status_name, c.created_at, c.finished_at
		FROM public.complaints c
		join "location" l on l.id = c.location_id 
		join users u on u.id = c.user_id 
		left join users u2 on u2.id = c.assigned_user_id 
		join complaint_status cs on cs.id = c.status_id ORDER BY c.id;
			`
	} else if role_id == 4 { // router
		getUserQuery = ` 
		SELECT c.id , location_id, l."location", l.qr, user_id, u.email, c.complaint, c.photo_url, c.assigned_user_id, u2.email, c.status_id, cs.status_name, c.created_at, c.finished_at
		FROM public.complaints c
		join "location" l on l.id = c.location_id 
		join users u on u.id = c.user_id 
		left join users u2 on u2.id = c.assigned_user_id 
		join complaint_status cs on cs.id = c.status_id ORDER BY c.id;	
		`
	} else {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 400,
			Body:       "Invalid role_id",
		}
	}
	id := query.Id
	println("ID is this: ", id)
	if role_id == 1 || role_id == 4 {
		rows, err := database.Query(getUserQuery)
		if err != nil {
			return events.APIGatewayProxyResponse{
				Headers:    utils.Headers,
				StatusCode: 500,
				Body:       err.Error(),
			}
		}
		for rows.Next() {
			var responseBody GetComplaintResponseBody
			var assignedUserID *int
			var assignedUserEmail *string
			rows.Scan(&responseBody.ID, &responseBody.Location.ID, &responseBody.Location.Location, &responseBody.Location.QR, &responseBody.User.ID, &responseBody.User.Email, &responseBody.Complaint, &responseBody.PhotoURL, &assignedUserID, &assignedUserEmail, &responseBody.Status.ID, &responseBody.Status.StatusName, &responseBody.CreatedAt, &responseBody.FinishedAt)
			if assignedUserID != nil && assignedUserEmail != nil {
				responseBody.AssignedUser.ID = *assignedUserID
				responseBody.AssignedUser.Email = *assignedUserEmail
			}
			output = append(output, responseBody)
		}
	} else {
		rows, err := database.Query(getUserQuery, id)
		if err != nil {
			return events.APIGatewayProxyResponse{
				Headers:    utils.Headers,
				StatusCode: 500,
				Body:       err.Error(),
			}
		}
		for rows.Next() {
			var responseBody GetComplaintResponseBody
			var assignedUserID *int
			var assignedUserEmail *string
			rows.Scan(&responseBody.ID, &responseBody.Location.ID, &responseBody.Location.Location, &responseBody.Location.QR, &responseBody.User.ID, &responseBody.User.Email, &responseBody.Complaint, &responseBody.PhotoURL, &assignedUserID, &assignedUserEmail, &responseBody.Status.ID, &responseBody.Status.StatusName, &responseBody.CreatedAt, &responseBody.FinishedAt)
			if assignedUserID != nil && assignedUserEmail != nil {
				responseBody.AssignedUser.ID = *assignedUserID
				responseBody.AssignedUser.Email = *assignedUserEmail
			}
			output = append(output, responseBody)
		}
	}
	// Convert responseBody struct to JSON string
	responseBodyJSON, err := json.Marshal(output)
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
