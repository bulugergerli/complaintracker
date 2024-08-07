package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

func testHandler() {
	//
	// Edit your test case here:
	//
	request := events.APIGatewayProxyRequest{
		Resource:   "",
		Path:       "",
		HTTPMethod: "GET",
		Headers: map[string]string{
			"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZvbGthbm96dG9rbHVAZ21haWwuY29tIiwiZXhwIjoxNzE3ODMzNzc1LCJyb2xlX2lkIjoxfQ.LW4m-qSkgBsdJs8RtPN5EZPyv61KXftz6Oms-uhOg5A",
		}, MultiValueHeaders: map[string][]string{},
		QueryStringParameters:           map[string]string{"id": "3", "login": "false"},
		MultiValueQueryStringParameters: map[string][]string{},
		PathParameters:                  map[string]string{},
		StageVariables:                  map[string]string{},
		RequestContext:                  events.APIGatewayProxyRequestContext{},
		Body: `{
			"location_id": 7,
			"user_id": 4,
			"complaint": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.333334",
			"photo_url": []
		}`,
		IsBase64Encoded: false,
	}

	ret, _ := handler(context.TODO(), request)
	fmt.Printf("%+v\n", ret)
}
