## Usergroup Permissions

0x1: Create new posts
0x2: Reply to posts
0x4: Edit posts/replies
0x8: Edit profile
0x10: Default community access

## API Routes

All API routes are followed by `/api/v1`
Example: `https://api.k9r.tld/api/v1/user/count`

All API Routes are configured in `./api/lib.rs`

### Users
- `/user/discord` - OAuth2 Endpoint for Discord login

- `/user/github` - OAuth2 Endpoint for GitHub login

- `/user/{id}` - Get a user by ID

- `/user/{id}/usergroups` - Get all usergroups of a user

- `/user/count` - Get the number of all registered users

- `/user` - Get personal user:
```
Headers: {
    Authorization: TOKEN
}
```

### Usergroups
No routes setup

### Community
- `/community/details` - Get the basic community details


### Forum
- `/forum/section` - Get all forum sections

- `/forum/section/{id}/topics` - Get all topics within a section

- `/forum/topic/{id}/threads?page=` - Get 20 threads by page in a topic:
```
Query: {
    page: int
}
```

- `/forum/thread` - Create a new thread:
```
Method: POST,
Headers: {
    Authorization: TOKEN
},
Data: {
    new_thread: NewForumThread
    new_post: NewForumPost
}
```

- `/forum/post` - Create a new post (posts are replies to threads):
```
Method: POST,
Headers: {
    Authorization: TOKEN
},
Data: NewForumPost

```

- `/forum/admin/section` - Create a new forum section:
```
Method: POST, PUT,
Headers: {
    Authorization: TOKEN
},
Data: NewForumSection
```

- `/forum/admin/topic` - Create/update a new forum section:
```
Method: POST, PUT,
Headers: {
    Authorization: TOKEN
},
Data: NewForumTopic
```
