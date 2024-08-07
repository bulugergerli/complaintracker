package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"utils"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/joho/godotenv"
)

func handler(ctx context.Context, request events.APIGatewayProxyRequest) events.APIGatewayProxyResponse {
	//  connect to db
	database, err := utils.ConnectDB()
	if err != nil {
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 500,
			Body:       err.Error(),
		}
	}
	defer database.Close()
	// Check the HTTP request method
	method := request.HTTPMethod

	// Handle different HTTP methods
	switch method {
	case "GET":
		return GetAllRoles(database)
	case "POST":
		return CreateRole(request, database)
	case "PUT":
		return UpdateRole(request, database)
	case "DELETE":
		return DeleteRole(request, database)
	default:
		// Handle other HTTP methods
		return events.APIGatewayProxyResponse{
			Headers:    utils.Headers,
			StatusCode: 400,
			Body:       fmt.Sprintf("Unsupported HTTP method: %s", method),
		}
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	if os.Getenv("ENV") == "test" {
		testHandler()
	} else {
		lambda.Start(handler)
	}
}
