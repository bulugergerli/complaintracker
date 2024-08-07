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
		QueryStringParameters:           map[string]string{"id": "3", "login": "true"},
		MultiValueQueryStringParameters: map[string][]string{},
		PathParameters:                  map[string]string{},
		StageVariables:                  map[string]string{},
		RequestContext:                  events.APIGatewayProxyRequestContext{},
		Body: `{ 
			"name": "batu",
			"surname": "bat",
			"user_name": "batu",
            "email": "volkanoztoklu@gmail.com",
            "password": "deneme",
			"role_id": 1,
			"remember": true
        }`,
		IsBase64Encoded: false,
	}

	ret, _ := handler(context.TODO(), request)
	fmt.Printf("%+v\n", ret)
}
