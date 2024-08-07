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
		return GetAllLocation(database), nil
	case "POST":
		return CreateLocation(request, database), nil
	case "PUT":
		return UpdateLocation(request, database), nil
	case "DELETE":
		return DeleteLocation(request, database), nil
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
	//err := godotenv.Load()
	//if err != nil {
	//	log.Fatal("Error loading .env file")
	//}
	if os.Getenv("ENV") == "test" {
		testHandler()
	} else {
		lambda.Start(handler)
	}
}
