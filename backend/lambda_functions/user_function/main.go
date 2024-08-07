package main

import (
	"context"
	"fmt"
	"os"
	"utils"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if request.HTTPMethod != "POST" {
		// check token is valid
		_, response, err := utils.CheckToken(request)
		if err != nil {
			return response, nil
		}
	}
	// set query
	query, response, err := utils.ConvertQuery(request)
	if err != nil {
		return response, nil
	}
	//  connect to db
	database, err := utils.ConnectDB()
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}, nil
	}
	defer database.Close()
	// Check the HTTP request method
	method := request.HTTPMethod
	// Handle different HTTP methods
	switch method {
	case "GET":
		return GetUser(request, database), nil
	case "POST":
		if query.Login == "true" {
			return Login(request, database), nil
		} else {
			return CreateUser(request, database), nil
		}
	case "PUT":
		return UpdateUser(request, database), nil
	case "DELETE":
		return DeleteUser(request, database), nil
	default:
		// Handle other HTTP methods
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 400,
			Body:       fmt.Sprintf("Unsupported HTTP method: %s", method),
		}, nil
	}
}

func main() {
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }
	if os.Getenv("ENV") == "test" {
		testHandler()
	} else {
		lambda.Start(handler)
	}
}
