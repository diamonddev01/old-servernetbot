# User Data is stored under the user DB object
A user should look like this
`GET user-{id}`
```json
{
    "id": "999999999999999999",
    "messageCount": 69,
    "badges": {
        "unlocked": [
            {
                "name": "staff",
                "description": "Staff badge",
                "id": "staff"
            },
            {
                "name": "10k",
                "description": "10k badge",
                "id": "10k"
            }
        ],
        "active": [
            {
                "name": "staff",
                "description": "Staff badge",
                "id": "staff",
                "slot": 1
            },
            {
                "name": "10k",
                "description": "10k badge",
                "id": "10k",
                "slot": 4
            }
        ]
    }
}
```