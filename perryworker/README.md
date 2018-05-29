# Perryworker

This is a Worker that fetches data from the Github API and replicates them into a Mongo Database. It takes all the recently updated repositories from an organization, and replicates their issues and pull requests.

### Running

1. Insert your Github API Token into the .env file

		GITHUB_API_TOKEN=???
		MONGO_HOST=???
		MONGO_USER=???
		MONGO_PASSWORD=???
		
2. Run it

		npm start

