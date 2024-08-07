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
		Resource:                        "",
		Path:                            "",
		HTTPMethod:                      "DELETE",
		Headers:                         map[string]string{},
		MultiValueHeaders:               map[string][]string{},
		QueryStringParameters:           map[string]string{},
		MultiValueQueryStringParameters: map[string][]string{},
		PathParameters:                  map[string]string{},
		StageVariables:                  map[string]string{},
		RequestContext:                  events.APIGatewayProxyRequestContext{},
		Body: `{
			"id": 3
        }`,
		IsBase64Encoded: false,
	}

	ret := handler(context.TODO(), request)
	fmt.Printf("%+v\n", ret)
}
