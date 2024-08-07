package utils

import (
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

func ConvertQuery(request events.APIGatewayProxyRequest) (QueryParams, events.APIGatewayProxyResponse, error) {
	query := QueryParams{}
	// Convert the QueryStringParameters map to JSON
	queryParamsJSON, err := json.Marshal(request.QueryStringParameters)
	if err != nil {
		return query,
			events.APIGatewayProxyResponse{
				StatusCode: 500,
				Body:       fmt.Sprintf("Error marshaling query parameters: %v", err),
			},
			err
	}
	// Unmarshal the JSON into the query struct
	if err := json.Unmarshal(queryParamsJSON, &query); err != nil {
		return query,
			events.APIGatewayProxyResponse{
				StatusCode: 500,
				Body:       fmt.Sprintf("Error unmarshaling query parameters: %v", err),
			},
			err
	}
	return query, events.APIGatewayProxyResponse{}, nil
}

func ConvertHeader(request events.APIGatewayProxyRequest) (HeaderParams, events.APIGatewayProxyResponse, error) {
	header := HeaderParams{}
	// Convert the Headers map to JSON
	headerParamsJSON, err := json.Marshal(request.Headers)
	if err != nil {
		return header,
			events.APIGatewayProxyResponse{
				StatusCode: 500,
				Body:       fmt.Sprintf("Error marshaling header: %v", err),
			}, err
	}
	// Unmarshal the JSON into the Header struct
	if err := json.Unmarshal(headerParamsJSON, &header); err != nil {
		return header,
			events.APIGatewayProxyResponse{
				StatusCode: 500,
				Body:       fmt.Sprintf("Error unmarshaling query parameters: %v", err),
			}, err
	}
	return header, events.APIGatewayProxyResponse{}, nil
}
