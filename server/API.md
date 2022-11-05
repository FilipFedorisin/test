// TODO : API endpoints

// User data - konzultacia
- Osobné dáta používatela - Osobitný endpoint


# Global

* Content-Type of request body must be always `application/json` (or `multipart/form-data` for Media API).
* Content-Type of response body will be always `application/json`.
* Each API response will contain following properties:
* 
| Name       | Type        | Description                                       | Tags       |
| ---------- | ----------- | ------------------------------------------------- | ---------- |
| `status`   | RESULT_CODE | Specifies request state of the request.           |            |
| `message`  | string      | Error message. May contain an actual error.       | `optional` |
| `redirect` | string      | Relative URL where the user should be redirected. | `optional` |
| _any_      | any         | Any data returned from the API.                   | `optional` |

* Each API request will be validated against predefined schema, in case of validation error, the server will respond with the following response:

| Name      | Type   | Description                                                                                                      | Tags                     |
| --------- | ------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `status`  | string | Allways will be `"INVALID_PARAMETERS"`.                                                                          |                          |
| `message` | string | Generic error name. If using `development` server environment, this field will contain validation error message. | `environment`            |
| `path`    | string | JSON path to invalid value. Only present if using `development` server environment.                              | `optional` `environment` |

Example response:
```json
{
  "status": "INVALID_PARAMETERS",
  "message": "Invalid type of element in array! Invalid property type! Expected 'string', instead got 'number'!",
  "path": "people.[3].lastname"
}
```

## Tags explanation

| Tag name      | Description                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| `optional`    | Property is not required to be present in data payload.                                                        |
| `environment` | Property is dependant on server environment. Content or presence may differ when using different environments. |


## Type `RESULT_CODE`
General result codes. Specific results codes are specified for each API endpoint.

| Name                 | Value                  | Description                                                                                                                   |
| -------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `SUCCESS`            | `"OK"`                 | Returned when the request was successful.                                                                                     |
| `INTERNAL_ERROR`     | `"INTERNAL_ERROR"`     | Returned when the request failed. Response may also contain an error message.                                                 |
| `NOT_FOUND`          | `"NOT_FOUND"`          | Returned when the requested content is not found.                                                                             |
| `INVALID_PARAMETERS` | `"INVALID_PARAMETERS"` | Returned when the request url/query/body does not match the pre-defined schema.                                               |
| `ERROR_UNAUTHORIZED` | `"ERROR_UNAUTHORIZED"` | Returned when the request needs the authorized user, but current user is not logged in or their seession is expired/invalid.  |
| `ERROR_FORBIDDEN`    | `"ERROR_FORBIDDEN"`    | Returned when the request needs the authorized user, but current user has no required permission to perform requested action. |



---


# User API




## `POST /api/v1/user/signup`
Signs up a new user.

### URL Parameters
_No url parameters_

### Query Parameters
_No query parameters_

### Body Parameters
| Name        | Type    | Description                                                                           | Tags |
| ----------- | ------- | ------------------------------------------------------------------------------------- | ---- |
| `firstname` | string  | Firstname of the user.                                                                |      |
| `lastname`  | string  | Lastname of the user.                                                                 |      |
| `email`     | string  | Email addess of the user.                                                             |      |
| `mobile`    | string  | Mobile number of the user.                                                            |      |
| `password`  | string  | Password of the user.                                                                 |      |
| `privacy`   | boolean | Indicates whether the accepted privacy policy. Must be `true` to process the request. |      |

### Permissions required
_No permissions required_


### Successful Response
```json
{
	"status": "OK",
	"user": {
		"firstname": "John",
		"lastname": "Doe",
		"email": "email1@example.com",
		"mobile": "123456789",
		"role": 1,
		"type": 0,
		"created": 1654812055584,
		"_id": "62a26d97846b6366cb649948"
	}
}
```

### Possible status codes
| Name             | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `ALREADY_EXISTS` | Responds if the user with provided `email` field already exists. |







## `POST /api/v1/user/login`
Logs in a user with provided credentials.

### URL Parameters
_No url parameters_

### Query Parameters
_No query parameters_

### Body Parameters
| Name       | Type   | Description               | Tags |
| ---------- | ------ | ------------------------- | ---- |
| `email`    | string | Email addess of the user. |      |
| `password` | string | Password of the user.     |      |

### Permissions required
_No permissions required_


### Successful Response
```json
{
	"status": "OK",
	"user": {
		"firstname": "John",
		"lastname": "Doe",
		"email": "email1@example.com",
		"mobile": "123456789",
		"role": 1,
		"type": 0,
		"created": 1654812055584,
		"_id": "62a26d97846b6366cb649948"
	}
}
```

### Possible status codes
| Name                       | Description                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `ERROR_USER_NOT_FOUND`     | Responds if the user with provided `email` field does not exists.                        |
| `ERROR_INCORRECT_PASSWORD` | Responds if the provided `password` field does not match with the user defined password. |







## `POST /api/v1/user/logout`
Logs out a currently logged in user.

### URL Parameters
_No url parameters_

### Query Parameters
_No query parameters_

### Body Parameters
_No body parameters_

### Permissions required
_No permissions required_

### Successful Response
```json
{
	"status": "OK",
	"user": {
		"firstname": "John",
		"lastname": "Doe",
		"email": "email1@example.com",
		"mobile": "123456789",
		"role": 1,
		"type": 0,
		"created": 1654812055584,
		"_id": "62a26d97846b6366cb649948"
	}
}
```

### Unsuccessful Response
Responded if the user is not logged in, has no session, or the session is expired or invalid.

```json
{
	"status": "OK",
	"user": null
}
```

### Possible status codes
_No special status codes_








## `GET /api/v1/user/info`
Responds with information about the currently logged in user.

### URL Parameters
_No url parameters_

### Query Parameters
_No query parameters_

### Permissions required
* `CUSTOMER` or higher


### Successful Response
```json
{
	"status": "OK",
	"user": {
		"firstname": "John",
		"lastname": "Doe",
		"email": "email1@example.com",
		"mobile": "123456789",
		"role": 1,
		"type": 0,
		"created": 1654812055584,
		"_id": "62a26d97846b6366cb649948"
	}
}
```

### Unsuccessful Response
Responded if the user is not logged in, has no session, or the session is expired or invalid.

```json
{
	"status": "OK",
	"user": null
}
```

### Possible status codes
_No special status codes_








## `POST /api/v1/user/edit`
Edits the currently logged in user.

### URL Parameters
_No url parameters_

### Query Parameters
_No query parameters_

### Body Parameters
| Name        | Type   | Description                      | Tags |
| ----------- | ------ | -------------------------------- | ---- |
| `firstname` | string | A new firstname of the user.     |      |
| `lastname`  | string | A new lastname of the user.      |      |
| `email`     | string | A new email addess of the user.  |      |
| `mobile`    | string | A new mobile number of the user. |      |

### Permissions required
* `CUSTOMER` or higher


### Successful Response
```json
{
	"status": "OK",
	"user": {
		"firstname": "John",
		"lastname": "Doe",
		"email": "email1@example.com",
		"mobile": "123456789",
		"role": 1,
		"type": 0,
		"created": 1654812055584,
		"_id": "62a26d97846b6366cb649948"
	}
}
```

### Possible status codes
| Name                 | Description                            |
| -------------------- | -------------------------------------- |
| `ERROR_UNAUTHORIZED` | Responds if the user is not logged in. |








## `GET /api/v1/user/{user_id}/info`
Responds with information about the user with provided id.

### URL Parameters
| Name      | Type   | Description            | Tags |
| --------- | ------ | ---------------------- | ---- |
| `user_id` | string | Id of the target user. |      |

### Query Parameters
_No query parameters_

### Body Parameters
| Name        | Type   | Description                             | Tags |
| ----------- | ------ | --------------------------------------- | ---- |
| `firstname` | string | A new firstname of the target user.     |      |
| `lastname`  | string | A new lastname of the target user.      |      |
| `email`     | string | A new email addess of the target user.  |      |
| `mobile`    | string | A new mobile number of the target user. |      |

### Permissions required
* `ADMIN` or higher


### Successful Response
```json
{
	"status": "OK",
	"user": {
		"firstname": "John",
		"lastname": "Doe",
		"email": "email1@example.com",
		"mobile": "123456789",
		"role": 1,
		"type": 0,
		"created": 1654812055584,
		"_id": "62a26d97846b6366cb649948"
	}
}
```

### Possible status codes
| Name                   | Description                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `ERROR_UNAUTHORIZED`   | Responds if the user is not logged in.                                                 |
| `ERROR_FORBIDDEN`      | Responds if the user has no required permissions.                                      |
| `ERROR_USER_NOT_FOUND` | Responds if the provided `user_id` does not correspond to any of the registered users. |








## `POST /api/v1/user/{user_id}/edit`
Edits the user with provided id.

### URL Parameters
| Name      | Type   | Description            | Tags |
| --------- | ------ | ---------------------- | ---- |
| `user_id` | string | Id of the target user. |      |

### Query Parameters
_No query parameters_

### Body Parameters
_No body parameters_

### Permissions required
* `ADMIN` or higher


### Successful Response
```json
{
	"status": "OK",
	"user": {
		"firstname": "John",
		"lastname": "Doe",
		"email": "email1@example.com",
		"mobile": "123456789",
		"role": 1,
		"type": 0,
		"created": 1654812055584,
		"_id": "62a26d97846b6366cb649948"
	}
}
```

### Possible status codes
| Name                   | Description                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `ERROR_UNAUTHORIZED`   | Responds if the user is not logged in.                                                 |
| `ERROR_FORBIDDEN`      | Responds if the user has no required permissions.                                      |
| `ERROR_USER_NOT_FOUND` | Responds if the provided `user_id` does not correspond to any of the registered users. |






---




# Media API

## `POST /api/v1/media/upload`
Uploads the files to the server. Request body size is limited to 50MB.

**Warning:** This endpoint is accepting request with body content type of `multipart/form-data` only.

### URL Parameters
_No URL parameters_

### Query Parameters
_No query parameters_

### Body Parameters
| Name    | Type            | Description               | Tags |
| ------- | --------------- | ------------------------- | ---- |
| `files` | MultipartFile[] | Array of files to upload. |      |

### Permissions required
* `ADMIN` or higher


### Successful Response
Response contains each file and state if it was uploaded successfully.

```json
{
	"status": "OK",
	"files": [
		{
			"filename": "sample.jpg",
			"uploaded": true,
			"media": {
				"_id": "62a9c98b9d7bcc0909f898e1",
				"mimetype": "image/jpeg",
				"url": "/media/62a9c98b9d7bcc0909f898e1.jpg"
			}
		}
	]
}
```

### Unsuccessful Response
Responded if some of the files were not uploaded.

```json
{
	"status": "OK",
	"files": [
		{
			"filename": "sample.jpg",
			"uploaded": false,
			"error": {
				"message": "INTERNAL_ERROR",
				"code": "INTERNAL_ERROR"
			}
		}
	]
}
```

Responded if the request body is too large.
```json
{
	"status": "PAYLOAD_TOO_LARGE",
	"message": "Payload is too large."
}
```

### Possible status codes
| Name                 | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `ERROR_UNAUTHORIZED` | Responds if the user is not logged in.               |
| `ERROR_FORBIDDEN`    | Responds if the user has no required permissions.    |
| `PAYLOAD_TOO_LARGE`  | Responds if the request body size exceeds the limit. |








## `GET /media/{media_url}`
Responds with the file with provided url.


### URL Parameters
| Name        | Type   | Description                                                                                | Tags |
| ----------- | ------ | ------------------------------------------------------------------------------------------ | ---- |
| `media_url` | string | Combination of media id and it's file extension. Example: `"62a34d2723bb56603f360ca5.jpg"` |      |

### Query Parameters
_No query parameters_

### Permissions required
* `GUEST` or higher


### Successful Response
Requested file.

### Unsuccessful Response
404 Error.

### Possible status codes
_No special status codes_



