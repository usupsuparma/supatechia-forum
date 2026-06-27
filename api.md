# Dicoding Forum APIDicoding Forum API

Ini merupakan dummy API untuk Dicoding Forum. API ini dibuat untuk pengerjaan submission kelas.

## Base URL
```
https://forum-api.dicoding.dev/v1
```

## Endpoints

### Users

#### Register User
- URL
    - /register
- Method
    - POST
- Request Body
    - name as string
    - email as string
    - password as string, mus be at least 6 characters
- Response
```json
{
    "status": "success",
    "message": "User created",
    "data": {
        "user": {
            "id": "user-123",
            "name": "John Doe",
            "email": "john@example.com",
            "avatar": "https://generated-image-url.jpg"
        }
    }
}
```

#### Login

- URL
    - /login
- Method
    - POST
- Request Body
    - email as string
    - password as string, mus be at least 6 characters
- Response
```json
{
    "status": "success",
    "message": "ok",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRpbWFzMiIsIm5hbWUiOiJEaW1hcyBTYXB1dHJhIiwicGhvdG8iOiJodHRwczovL3VpLWF2YXRhcnMuY29tL2FwaS8_bmFtZT1EaW1hcyBTYXB1dHJhJmJhY2tncm91bmQ9cmFuZG9tIiwiaXNfcGVybWFuZW50IjpmYWxzZSwiaWF0IjoxNjYzODQwNzY0fQ._HrzpinFYX_m9WfvM-lGCdVrnhnaGHhzt1e6eATE1Iw"
    }
 }
```
#### See all users

- URL
    - /users
- Method
    - GET
- Headers
    - Authorization: Bearer token
- Response
```json
{
    "status": "success",
    "message": "ok",
    "data": {
        "users": [
            {
                "id": "john_doe",
                "name": "John Doe",
                "email": "john@example.com",
                "avatar": "https://generated-image-url.jpg"
            },
            {
                "id": "jane_doe",
                "name": "Jane Doe",
                "email": "jane@example.com",
                "avatar": "https://generated-image-url.jpg"
            },
            {
                "id": "fulan",
                "name": "Si Fulan",
                "email": "fulan@example.com",
                "avatar": "https://generated-image-url.jpg"
            }
        ]
    }
}
```

#### See own profile

- URL
    - /users/me
- Method
    - GET
- Request Body
    - email as string
    - password as string, mus be at least 6 characters
- Response
```json
{
    "status": "success",
    "message": "ok",
    "data": {
        "users": [
            {
                "id": "john_doe",
                "name": "John Doe",
                "email": "john@example.com",
                "avatar": "https://generated-image-url.jpg"
            },
            {
                "id": "jane_doe",
                "name": "Jane Doe",
                "email": "jane@example.com",
                "avatar": "https://generated-image-url.jpg"
            },
            {
                "id": "fulan",
                "name": "Si Fulan",
                "email": "fulan@example.com",
                "avatar": "https://generated-image-url.jpg"
            }
        ]
    }
}
```

### Threads

#### Create Thread
- URL
    - /threads
- Method
    - POST
- Headers
    - Authorization: Bearer 'token'
- Request Body
    - title  as string
    - body  as string
    - category  as string (optional)
- Response
```json
{
    "status": "success",
    "message": "Thread created",
    "data": {
        "thread": {
            "id": "thread-1",
            "title": "Thread Pertama",
            "body": "Ini adalah thread pertama",
            "category": "General",
            "createdAt": "2021-06-21T07:00:00.000Z",
            "ownerId": "users-1",
            "upVotesBy": [],
            "downVotesBy": [],
            "totalComments": 0
        }
    }
}
```

#### See All Threads
- URL
    - /threads
- Method
    - GET
- Response
```json
{
    "status": "success",
    "message": "ok",
    "data": {
        "threads": [
            {
                "id": "thread-1",
                "title": "Thread Pertama",
                "body": "Ini adalah thread pertama",
                "category": "General",
                "createdAt": "2021-06-21T07:00:00.000Z",
                "ownerId": "users-1",
                "upVotesBy": [],
                "downVotesBy": [],
                "totalComments": 0
            },
            {
                "id": "thread-2",
                "title": "Thread Kedua",
                "body": "Ini adalah thread kedua",
                "category": "General",
                "createdAt": "2021-06-21T07:00:00.000Z",
                "ownerId": "users-2",
                "upVotesBy": [],
                "downVotesBy": [],
                "totalComments": 0
            }
        ]
    }
}
```

#### See Detail Thread
- URL
    - /threads/<threadId>
- Method
    - GET
- Response
```json
{
    "status": "success",
    "message": "ok",
    "data": {
        "detailThread": {
            "id": "thread-1",
            "title": "Thread Pertama",
            "body": "Ini adalah thread pertama",
            "category": "General",
            "createdAt": "2021-06-21T07:00:00.000Z",
            "owner": {
              "id": "users-1",
              "name": "John Doe",
              "avatar": "https://generated-image-url.jpg"
            },
            "upVotesBy": [],
            "downVotesBy": [],
            "comments": [
              {
                "id": "comment-1",
                "content": "Ini adalah komentar pertama",
                "createdAt": "2021-06-21T07:00:00.000Z",
                "owner": {
                  "id": "users-1",
                  "name": "John Doe",
                  "avatar": "https://generated-image-url.jpg"
                },
                "upVotesBy": [],
                "downVotesBy": []
              }   
            ]   
        }
    }
}
```

### Comments

#### Create Comment
- URL
    - /threads/<threadId>/comments
- Method
    - POST
- Headers
    - Authorization: Bearer '<token>'
- Request Body
    - content   as string
- Response
```json
{
    "status": "success",
    "message": "Comment created",
    "data": {
        "comment": {
            "id": "comment-1",
            "content": "Ini adalah komentar pertama",
            "createdAt": "2021-06-21T07:00:00.000Z",
            "upVotesBy": [],
            "downVotesBy": [],
            "owner": {
                "id": "users-1",
                "name": "John Doe",
                "email": "john@example.com"
            }
        }
    }
}
```

### Votes
Votes are used to upvote or downvote a thread or comment

Notes:
    - voteType value can be 1 (up-vote), 0 (neutral), or -1 (down-vote)

#### Up-vote Thread

- URL
    - /threads/<threadId>/up-vote
- Method
    - POST
- Headers
    - Authorization: Bearer '<token>'
- Response
```json
{
    "status": "success",
    "message": "Thread upvoted",
    "data": {
        "vote": {
            "id": "vote-1",
            "userId": "users-1",
            "threadId": "thread-1",
            "voteType": 1
        }
    }
}
```


#### Down-vote Thread


- URL
    - /threads/<threadId>/down-vote
- Method
    - POST
- Headers
    - Authorization: Bearer '<token>'
- Response
```json
{
    "status": "success",
    "message": "Thread upvoted",
    "data": {
        "vote": {
            "id": "vote-1",
            "userId": "users-1",
            "threadId": "thread-1",
            "voteType": 1
        }
    }
}
```

#### Neutralize Thread vote


- URL
    - /threads/<threadId>/neutral-vote
- Method
    - POST
- Headers
    - Authorization: Bearer '<token>'
- Response
```json
{
    "status": "success",
    "message": "Thread vote neutralized",
    "data": {
        "vote": {
            "id": "vote-1",
            "userId": "users-1",
            "threadId": "thread-1",
            "voteType": 0
        }
    }
}
```


#### Up-vote Comment


- URL
    - /threads/<threadId>/comments/<commentId>/up-vote
- Method
    - POST
- Headers
    - Authorization: Bearer '<token>'
- Response
```json
{
    "status": "success",
    "message": "Comment upvoted",
    "data": {
        "vote": {
            "id": "vote-1",
            "userId": "users-1",
            "commentId": "comment-1",
            "voteType": 1
        }
    }
}
```

#### Down-vote Comment


- URL
    - /threads/<threadId>/comments/<commentId>/down-vote
- Method
    - POST
- Headers
    - Authorization: Bearer '<token>'
- Response
```json
{
    "status": "success",
    "message": "Comment downvoted",
    "data": {
        "vote": {
            "id": "vote-1",
            "userId": "users-1",
            "commentId": "comment-1",
            "voteType": -1
        }
    }
}
```

#### Neutralize Comment vote


- URL
    - /threads/<threadId>/comments/<commentId>/neutral-vote
- Method
    - POST
- Headers
    - Authorization: Bearer '<token>'
- Response
```json
{
    "status": "success",
    "message": "Comment vote neutralized",
    "data": {
        "vote": {
            "id": "vote-1",
            "userId": "users-1",
            "commentId": "comment-1",
            "voteType": 0
        }
    }
}
```

### Leaderboards
Leaderboard is used to see the top users with the highest score.

#### See Leaderboards

- URL
    - /leaderboards
- Method
    - GET
- Response
```json
{
"status": "success",
"message": "ok",
"data": {
    "leaderboards": [
        {
          "user": {
            "id": "users-1",
            "name": "John Doe",
            "email": "john@example.com",
            "avatar": "https://generated-image-url.jpg"
          },
          "score": 10
        },
        {
          "user": {
            "id": "users-2",
            "name": "Jane Doe",
            "email": "jane@example.com",
            "avatar": "https://generated-image-url.jpg"
          },
          "score": 5
        }
    ]
}
}
```