package utils

import (
	"database/sql"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/golang-jwt/jwt/v4"
	"os"
	"time"
)

func GenerateJWT(email string, roleId int, rememberMe bool, database *sql.DB) (string, error) {
	expiration := time.Now().Add(time.Hour).Unix()
	if rememberMe {
		expiration = time.Now().Add(time.Hour * 72).Unix()
	}

	getUserId := `
		SELECT id
		FROM public.users
		 where email = $1`
	var userId int
	database.QueryRow(getUserId, email).Scan(&userId)

	// Create a new token object, specifying signing method and claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":   email,
		"role_id": roleId,
		"user_id": userId,
		"exp":     expiration,
	})
	// Get JWT secret key from .env
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		return "", fmt.Errorf("JWT secret key not found in environment variables")
	}

	// Sign and get the complete encoded token as a string
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func verifyJWT(tokenString string) (jwt.MapClaims, bool, error) {
	// Get JWT secret key from .env
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		return nil, false, fmt.Errorf("JWT secret key not found in environment variables")
	}
	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate the alg is what you expect
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secretKey), nil // Convert the secret key to a byte slice
	})

	if err != nil {
		return nil, false, err
	}

	// Verify token validity
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println("Token is valid")
		fmt.Println("Email:", claims["email"])
		fmt.Println("Role id:", claims["role_id"])
		fmt.Println("Expires at:", time.Unix(int64(claims["exp"].(float64)), 0))
		return claims, true, nil
	}

	return nil, false, fmt.Errorf("invalid token")
}

func CheckToken(request events.APIGatewayProxyRequest) (jwt.MapClaims, events.APIGatewayProxyResponse, error) {
	header, response, err := ConvertHeader(request)
	if err != nil {
		return nil, response, err
	}
	// Check token is valid
	claim, verifyToken, err := verifyJWT(header.Authorization)
	if !verifyToken {
		return nil, events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Invalid token",
		}, err
	}
	return claim, events.APIGatewayProxyResponse{}, nil
}
