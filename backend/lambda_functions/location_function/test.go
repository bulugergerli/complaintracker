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
		HTTPMethod: "POST",
		Headers: map[string]string{
			"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZvbGthbm96dG9rbHVAZ21haWwuY29tIiwiZXhwIjoxNzE3NzczMTMzLCJyb2xlX2lkIjoxfQ.cOWCotAzPz_Pfwn7-2JcxZTmA0-W45SLkiIdmN5ZzGY",
		},
		MultiValueHeaders:               map[string][]string{},
		QueryStringParameters:           map[string]string{},
		MultiValueQueryStringParameters: map[string][]string{},
		PathParameters:                  map[string]string{},
		StageVariables:                  map[string]string{},
		RequestContext:                  events.APIGatewayProxyRequestContext{},
		Body: `{
			"location": "class-55" 
		}`,
		IsBase64Encoded: false,
	}

	ret, _ := handler(context.TODO(), request)
	fmt.Printf("%+v\n", ret)
}
