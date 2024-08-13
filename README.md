## Complain Tracker

ComplainTracker is a user-friendly system designed to help manage and resolve issues in a building quickly and efficiently. It allows customers to easily report problems, track their progress, and ensure that issues are addressed promptly. The system also helps administrators, routers, and workers to efficiently handle complaints and keep the building running smoothly. The project is built on cloud in Amazon Web Services, using React for frontend, Go for backend, and Postgres as database.


<img width="760" alt="figure" src="https://github.com/user-attachments/assets/775a7b0d-78ec-4d20-a4ac-93cf3f2c045f">

The project is developed on Amazon Web Services (AWS) and utilizes a cloud-based architecture, as illustrated in Figure. Users can access the project’s website, hosted on Amazon S3, from either desktop or mobile devices. S3 not only facilitates object storage but also supports static website hosting, where the React code for the frontend is deployed. All frontend requests are routed through the API Gateway, which directs them to specific AWS Lambda functions based on the endpoint URL. The API Gateway manages three primary endpoints: /user, /complaint, and /location, each supporting GET, POST, PUT, and DELETE operations. The backend services are entirely serverless, leveraging Lambda functions to process requests and return responses to the frontend. Additionally, the project utilizes a relational database hosted in Amazon RDS within a private subnet, ensuring that only Lambda functions have access to the database, thereby enhancing security and adhering to best practices.


## Setup
To run this project, install it locally using npm:

```
$ git clone https://github.com/bulugergerli/complaintracker.git
$ cd ../frontend
$ npm install
$ npm start  / npm run build
```
